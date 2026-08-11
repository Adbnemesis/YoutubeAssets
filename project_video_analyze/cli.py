import argparse
import os
import sys
import time

# Ensure project directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from project_video_analyze.src.utils.system_check import check_system_dependencies
from project_video_analyze.src.core.metadata import MetadataExtractor
from project_video_analyze.src.core.scene_detector import MultiEngineSceneDetector
from project_video_analyze.src.core.audio_analyzer import LibrosaAudioAnalyzer
from project_video_analyze.src.core.speech_aligner import FasterWhisperSpeechAligner
from project_video_analyze.src.core.visual_analyzer import OpenCVVisualAnalyzer
from project_video_analyze.src.core.ocr_detector import LocalOCRDetector
from project_video_analyze.src.core.vlm_annotator import LocalVLMAnnotator
from project_video_analyze.src.pipeline.adaptive_sampler import AdaptiveFrameSampler
from project_video_analyze.src.pipeline.event_correlator import EventCorrelator
from project_video_analyze.src.pipeline.master_builder import MasterTimelineBuilder
from project_video_analyze.src.report.contact_sheet import ContactSheetGenerator
from project_video_analyze.src.report.report_generator import EditReportGenerator
from project_video_analyze.src.report.html_visualizer import HTMLTimelineVisualizer

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
    print(f" STARTING LOCAL VIDEO EDIT ANALYSIS")
    print(f" Target: {video_path}")
    print(f" Output: {output_dir}")
    print(f"==========================================\n")

    # 1. Metadata
    print("[1/9] Extracting FFprobe / FFmpeg metadata...")
    meta_extractor = MetadataExtractor(video_path)
    metadata = meta_extractor.extract()
    fps = metadata["fps"]
    total_frames = metadata["totalFrames"]
    print(f"      Resolution: {metadata['width']}x{metadata['height']} | FPS: {fps} | Duration: {metadata['durationSeconds']}s | Frames: {total_frames}")

    # 2. Shot Boundaries (PySceneDetect + Optical Classifier)
    print("[2/9] Running multi-engine shot boundary detection (PySceneDetect + Optical)...")
    scene_detector = MultiEngineSceneDetector(video_path, fps, total_frames)
    scene_data = scene_detector.run()
    print(f"      Detected {len(scene_data['scenes'])} scenes and {len(scene_data['cuts'])} hard cuts.")

    # 3. Librosa Audio
    print("[3/9] Running Librosa audio beat, onset & energy breakdown...")
    audio_analyzer = LibrosaAudioAnalyzer(video_path, fps, temp_dir)
    audio_data = audio_analyzer.run()
    print(f"      Estimated BPM: {audio_data['bpm']} | Beats: {len(audio_data['beats'])} | Strong Beats: {len(audio_data['strongBeats'])}")

    # 4. Speech Alignment (Faster-Whisper)
    print("[4/9] Running Faster-Whisper word-level speech alignment...")
    speech_aligner = FasterWhisperSpeechAligner(video_path, fps, temp_dir)
    speech_data = speech_aligner.run()
    print(f"      Transcript: \"{speech_data['transcript']}\" ({len(speech_data['words'])} words timestamped)")

    # 5. Visual Analysis (OpenCV Diff + Optical Flow)
    print("[5/9] Running OpenCV visual diffs & optical flow motion analysis...")
    visual_analyzer = OpenCVVisualAnalyzer(video_path, fps, total_frames)
    visual_data = visual_analyzer.run()
    print(f"      Zooms: {len(visual_data['zooms'])} | Shakes: {len(visual_data['shakes'])} | Flashes: {len(visual_data['flashes'])}")

    # 6. OCR Text Detection
    print("[6/9] Running Local OCR (EasyOCR / PyTesseract) text detection...")
    ocr_detector = LocalOCRDetector(video_path, fps, total_frames)
    ocr_data = ocr_detector.run()
    print(f"      Text Elements Detected: {len(ocr_data)}")

    # 7. Adaptive Frame Sampler & Local VLM Annotator
    print("[7/9] Performing adaptive frame sampling & local VLM semantic keyframe annotation...")
    sampler = AdaptiveFrameSampler(fps, total_frames)
    sample_frames = sampler.get_sample_frames(scene_data["cuts"], audio_data["strongBeats"], visual_data["visualEvents"])
    vlm_annotator = LocalVLMAnnotator(video_path, fps, temp_dir)
    vlm_data = vlm_annotator.annotate_keyframes(sample_frames)
    print(f"      Annotated {len(vlm_data)} adaptive keyframes.")

    # 8. Event Correlation
    print("[8/9] Correlating events & detecting macro editing patterns...")
    correlator = EventCorrelator(fps)
    master_timeline = correlator.correlate(
        scene_data["cuts"], audio_data["beats"], visual_data["visualEvents"],
        visual_data["zooms"], visual_data["shakes"], visual_data["flashes"],
        ocr_data, speech_data["words"]
    )

    # 9. Assembly & Output Generation
    print("[9/9] Generating Master Timeline, EDIT_REPORT.md, Contact Sheets, and timeline.html...")
    master_builder = MasterTimelineBuilder(output_dir)
    edit_analysis = master_builder.build_and_save(
        metadata, scene_data, audio_data, speech_data, visual_data, ocr_data, vlm_data, master_timeline
    )

    contact_gen = ContactSheetGenerator(video_path, fps, total_frames, output_dir)
    contact_sheet_path = contact_gen.generate()

    report_gen = EditReportGenerator(edit_analysis, output_dir)
    report_path = report_gen.generate()

    html_vis = HTMLTimelineVisualizer(edit_analysis, output_dir)
    html_path = html_vis.generate()

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
    print(f" Master JSON:  {os.path.join(output_dir, 'edit_analysis.json')}")
    print(f" Edit Report:  {report_path}")
    print(f" Interactive:  {html_path}")
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
        # Default run check
        check_system_dependencies()

if __name__ == "__main__":
    main()
