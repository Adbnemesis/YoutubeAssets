import argparse
import os
import sys
import time
import numpy as np
import librosa

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from project_video_analyze.src.utils.system_check import check_system_dependencies
from project_video_analyze.src.core.metadata import MetadataExtractor
from project_video_analyze.src.core.scene_detector import MultiEngineSceneDetector
from project_video_analyze.src.core.audio_analyzer import LibrosaAudioAnalyzer
from project_video_analyze.src.core.sfx_matcher import SFXMatcher
from project_video_analyze.src.core.speech_aligner import FasterWhisperSpeechAligner
from project_video_analyze.src.core.visual_analyzer import OpenCVVisualAnalyzer
from project_video_analyze.src.core.ocr_detector import LocalOCRDetector
from project_video_analyze.src.core.vlm_annotator import LocalVLMAnnotator
from project_video_analyze.src.pipeline.adaptive_sampler import AdaptiveFrameSampler
from project_video_analyze.src.pipeline.pattern_detector import PatternDetector
from project_video_analyze.src.pipeline.edit_dna import EditDNAGenerator
from project_video_analyze.src.pipeline.event_correlator import EventCorrelator
from project_video_analyze.src.pipeline.master_builder import MasterTimelineBuilder
from project_video_analyze.src.report.contact_sheet import ContactSheetGenerator
from project_video_analyze.src.report.preview_generator import EventPreviewGenerator
from project_video_analyze.src.report.report_generator import EditReportGenerator
from project_video_analyze.src.report.html_visualizer import InteractiveHTMLVisualizer
from project_video_analyze.src.report.remotion_exporter import RemotionExporter
from project_video_analyze.src.report.instruction_generator import InstructionGenerator

def run_analysis(video_path: str, output_dir: str = None) -> str:
    start_time = time.time()
    video_path = os.path.abspath(video_path)
    
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    video_name = os.path.splitext(os.path.basename(video_path))[0]
    if not output_dir:
        output_dir = os.path.join(parent_dir, "analysis", video_name)
        
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)
    temp_dir = os.path.join(output_dir, ".temp")
    os.makedirs(temp_dir, exist_ok=True)

    print(f"\n==========================================")
    print(f" STARTING PROFESSIONAL LOCAL VIDEO EDIT ANALYSIS")
    print(f" Target: {video_path}")
    print(f" Output: {output_dir}")
    print(f"==========================================\n")

    # 1. Metadata
    print("[1/13] Extracting FFprobe / FFmpeg metadata...")
    meta_extractor = MetadataExtractor(video_path)
    metadata = meta_extractor.extract()
    fps = metadata["fps"]
    total_frames = metadata["totalFrames"]
    print(f"       Resolution: {metadata['width']}x{metadata['height']} | FPS: {fps} | Duration: {metadata['durationSeconds']}s | Frames: {total_frames}")

    # 2. Shot Boundaries
    print("[2/13] Running multi-engine shot boundary detection (PySceneDetect + Optical)...")
    scene_detector = MultiEngineSceneDetector(video_path, fps, total_frames)
    scene_data = scene_detector.run()
    print(f"       Detected {len(scene_data['scenes'])} scenes and {len(scene_data['cuts'])} hard cuts.")

    # 3. Audio Analysis (Librosa + Aubio Engine)
    print("[3/13] Running Librosa + Aubio audio beat, onset & transient breakdown...")
    audio_analyzer = LibrosaAudioAnalyzer(video_path, fps, temp_dir)
    audio_data = audio_analyzer.run()
    print(f"       Reconciled BPM: {audio_data['bpm']} | Unified Audio Events: {len(audio_data['audioEvents'])}")

    # 4. Local SFX Fingerprinting & Matching
    print("[4/13] Running local SFX audio library feature matching...")
    sfx_matcher = SFXMatcher()
    sfx_events = []
    wav_path = os.path.join(temp_dir, "extracted_audio.wav")
    y_audio = None
    sr_audio = 22050
    if os.path.exists(wav_path):
        try:
            y_audio, sr_audio = librosa.load(wav_path, sr=22050, mono=True)
        except Exception:
            y_audio = None

    for ev in audio_data["audioEvents"]:
        if ev["type"] in ["strong_onset", "transient"]:
            t_start = ev["time"]
            if y_audio is not None:
                start_samp = int(t_start * sr_audio)
                end_samp = min(len(y_audio), start_samp + int(0.4 * sr_audio))
                seg = y_audio[start_samp:end_samp]
            else:
                seg = np.zeros(512)
            res = sfx_matcher.match_transient(seg, sr_audio)
            res["frame"] = ev["frame"]
            res["time"] = ev["time"]
            sfx_events.append(res)
    print(f"       Matched {len(sfx_events)} SFX transient candidates.")

    # 5. Speech Alignment (Faster-Whisper)
    print("[5/13] Running Faster-Whisper word-level speech alignment...")
    speech_aligner = FasterWhisperSpeechAligner(video_path, fps, temp_dir)
    speech_data = speech_aligner.run()
    print(f"       Transcript: \"{speech_data['transcript']}\" ({len(speech_data['words'])} words timestamped)")

    # 6. Visual Forensics (Zooms, Zoom Punches, Camera Shake, Flashes, Pans)
    print("[6/13] Running OpenCV visual diffs & optical flow motion analysis...")
    visual_analyzer = OpenCVVisualAnalyzer(video_path, fps, total_frames)
    visual_data = visual_analyzer.run()
    print(f"       Zooms: {len(visual_data['zooms'])} | Zoom Punches: {len(visual_data['zoomPunches'])} | Shakes: {len(visual_data['shakes'])} | Flashes: {len(visual_data['flashes'])}")

    # 7. Local OCR Text Detection
    print("[7/13] Running Local OCR (EasyOCR / PyTesseract) text detection...")
    ocr_detector = LocalOCRDetector(video_path, fps, total_frames)
    ocr_data = ocr_detector.run()
    print(f"       Text Elements Detected: {len(ocr_data)}")

    # 8. Adaptive Frame Sampling & Local VLM Annotation
    print("[8/13] Performing adaptive frame sampling & local VLM keyframe annotation...")
    sampler = AdaptiveFrameSampler(fps, total_frames)
    sample_frames = sampler.get_sample_frames(scene_data["cuts"], audio_data["beats"], visual_data["visualEvents"])
    vlm_annotator = LocalVLMAnnotator(video_path, fps, temp_dir)
    vlm_data = vlm_annotator.annotate_keyframes(sample_frames)
    print(f"       Annotated {len(vlm_data)} adaptive keyframes.")

    # 9. Event Correlation & Causality
    print("[9/13] Correlating events & building causality triggers...")
    correlator = EventCorrelator(fps)
    master_timeline = correlator.correlate(
        scene_data["cuts"], audio_data["beats"], visual_data["visualEvents"],
        visual_data["zooms"], visual_data["zoomPunches"], visual_data["shakes"], visual_data["flashes"],
        ocr_data, speech_data["words"], sfx_events
    )

    # 10. Editing Pattern Recognition
    print("[10/13] Detecting macro editing patterns...")
    pattern_detector = PatternDetector(fps)
    patterns = pattern_detector.detect(
        scene_data["cuts"], audio_data["beats"], visual_data["zooms"], visual_data["zoomPunches"],
        visual_data["shakes"], visual_data["flashes"], ocr_data, sfx_events, master_timeline
    )
    print(f"        Identified {len(patterns)} macro editing patterns.")

    # 11. Edit DNA Metrics
    print("[11/13] Computing Edit DNA style metrics...")
    dna_gen = EditDNAGenerator(fps)
    edit_dna = dna_gen.generate(
        scene_data["cuts"], audio_data["beats"], visual_data["zooms"], visual_data["zoomPunches"],
        visual_data["shakes"], visual_data["flashes"], ocr_data, patterns
    )

    # 12. Master Timeline Builder & Subfolder Organization
    print("[12/13] Saving Master Timeline, Edit DNA, and subfolder JSON hierarchy...")
    master_builder = MasterTimelineBuilder(output_dir)
    edit_analysis = master_builder.build_and_save(
        metadata, scene_data["scenes"], audio_data["beats"], audio_data["strongBeats"],
        audio_data["onsets"], audio_data["audioEvents"], sfx_events, speech_data["transcript"],
        speech_data["words"], visual_data["visualEvents"], visual_data["zooms"],
        visual_data["zoomPunches"], visual_data["shakes"], visual_data["flashes"],
        visual_data["pans"], ocr_data, vlm_data, master_timeline, patterns, edit_dna
    )

    # 13. Reports, Previews, Remotion TS & Interactive Timeline HTML
    print("[13/13] Generating Contact Sheets, Previews, Remotion TS, and Interactive Inspector...")
    contact_gen = ContactSheetGenerator(video_path, fps, total_frames, output_dir)
    contact_gen.generate()
    key_frames = [c["startFrame"] for c in scene_data["cuts"][:8]]
    contact_gen.generate_event_contact_sheet(key_frames)

    preview_gen = EventPreviewGenerator(video_path, fps, output_dir)
    preview_gen.generate_previews(scene_data["cuts"], visual_data["zooms"], visual_data["shakes"])

    report_gen = EditReportGenerator(edit_analysis, output_dir)
    report_gen.generate()

    html_vis = InteractiveHTMLVisualizer(output_dir)
    html_paths = html_vis.generate(edit_analysis)

    remotion_exp = RemotionExporter(output_dir)
    remotion_exp.export(edit_analysis)

    instr_gen = InstructionGenerator(output_dir)
    instr_gen.generate(edit_analysis)

    # Clean temporary workspace
    if os.path.exists(temp_dir):
        import shutil
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass

    elapsed = round(time.time() - start_time, 2)
    print(f"\n==========================================")
    print(f" EDIT ANALYSIS COMPLETE in {elapsed}s")
    print(f" Artifacts saved to: {output_dir}")
    print(f" Master JSON:      {os.path.join(output_dir, 'edit_analysis.json')}")
    print(f" Remotion TS:      {os.path.join(output_dir, 'remotion_events.ts')}")
    print(f" Edit Recipe:      {os.path.join(output_dir, 'EDIT_RECIPE.json')}")
    print(f" Instructions:     {os.path.join(output_dir, 'ANTIGRAVITY_EDIT_INSTRUCTIONS.md')}")
    print(f" Interactive HTML: {html_paths['timeline']}")
    print(f" Beat Map HTML:    {html_paths['beatmap']}")
    print(f"==========================================\n")

    return output_dir

def main():
    parser = argparse.ArgumentParser(description="Professional Local Video Edit Analyzer")
    subparsers = parser.add_subparsers(dest="command")

    check_parser = subparsers.add_parser("check", help="Check system dependencies & tools")

    analyze_parser = subparsers.add_parser("analyze", help="Analyze an MP4 video file")
    analyze_parser.add_argument("video_path", type=str, help="Path to input .mp4 video")
    analyze_parser.add_argument("--output-dir", type=str, default=None, help="Custom output analysis folder")

    args = parser.parse_args()

    if args.command == "check":
        check_system_dependencies()
    elif args.command == "analyze":
        run_analysis(args.video_path, args.output_dir)
    else:
        check_system_dependencies()

if __name__ == "__main__":
    main()
