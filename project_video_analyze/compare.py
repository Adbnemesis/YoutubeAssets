import sys
import os
import argparse
import json
import numpy as np

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from project_video_analyze.cli import run_analysis

def compare_videos(reference_path: str, rendered_path: str):
    print("\n==========================================")
    print(" REFERENCE VS OUTPUT COMPARATOR (QA SYSTEM)")
    print(f" Reference: {reference_path}")
    print(f" Rendered:  {rendered_path}")
    print("==========================================\n")

    # Run or load analysis for reference
    ref_name = os.path.splitext(os.path.basename(reference_path))[0]
    ref_dir = os.path.join(parent_dir, "analysis", ref_name)
    ref_json_path = os.path.join(ref_dir, "edit_analysis.json")
    if not os.path.exists(ref_json_path):
        print("[Comparator] Running analysis on reference video...")
        run_analysis(reference_path, ref_dir)

    with open(ref_json_path, 'r', encoding='utf-8') as f:
        ref_analysis = json.load(f)

    # Run or load analysis for rendered
    rnd_name = os.path.splitext(os.path.basename(rendered_path))[0]
    rnd_dir = os.path.join(parent_dir, "analysis", rnd_name)
    rnd_json_path = os.path.join(rnd_dir, "edit_analysis.json")
    if not os.path.exists(rnd_json_path):
        print("[Comparator] Running analysis on rendered video...")
        run_analysis(rendered_path, rnd_dir)

    with open(rnd_json_path, 'r', encoding='utf-8') as f:
        rnd_analysis = json.load(f)

    ref_meta = ref_analysis.get("metadata", {})
    rnd_meta = rnd_analysis.get("metadata", {})

    print("------------------------------------------")
    print(" 1. METADATA COMPARISON")
    print("------------------------------------------")
    print(f" FPS:         Ref={ref_meta.get('fps')} | Rnd={rnd_meta.get('fps')}")
    print(f" Duration:    Ref={ref_meta.get('durationSeconds')}s | Rnd={rnd_meta.get('durationSeconds')}s")
    dur_diff = round(rnd_meta.get('durationSeconds', 0) - ref_meta.get('durationSeconds', 0), 3)
    print(f" Duration Delta: {dur_diff:+} seconds\n")

    print("------------------------------------------")
    print(" 2. CUT TIMING COMPARISON")
    print("------------------------------------------")
    ref_cuts = ref_analysis.get("scenes", [])
    rnd_cuts = rnd_analysis.get("scenes", [])
    
    print(f" Cuts Count: Ref={len(ref_cuts)} | Rnd={len(rnd_cuts)}")
    cut_errors = []
    for idx, ref_cut in enumerate(ref_cuts):
        ref_f = ref_cut["startFrame"]
        if idx < len(rnd_cuts):
            rnd_f = rnd_cuts[idx]["startFrame"]
            diff = rnd_f - ref_f
            cut_errors.append(abs(diff))
            status = "MATCH ✓" if diff == 0 else f"ERROR: {diff:+} frames ❌"
            print(f" Cut #{idx+1:02d} | Ref F{ref_f:03d} -> Rnd F{rnd_f:03d} | {status}")
        else:
            print(f" Cut #{idx+1:02d}: Missing in output (Ref frame {ref_f})")
            cut_errors.append(30)
    print("")

    print("------------------------------------------")
    print(" 3. BEAT ALIGNMENT COMPARISON")
    print("------------------------------------------")
    ref_beats = ref_analysis.get("strongBeats", [])[:10]
    rnd_beats = rnd_analysis.get("strongBeats", [])[:10]
    beat_errors = []
    for idx, ref_b in enumerate(ref_beats):
        ref_f = ref_b["frame"]
        if idx < len(rnd_beats):
            rnd_f = rnd_beats[idx]["frame"]
            diff = rnd_f - ref_f
            beat_errors.append(abs(diff))
            status = "MATCH ✓" if diff == 0 else f"ERROR: {diff:+} frames ❌"
            print(f" Beat #{idx+1:02d} | Ref F{ref_f:03d} -> Rnd F{rnd_f:03d} | {status}")

    print("\n------------------------------------------")
    print(" 4. OVERALL REMOTION RECREATION QA SCORES")
    print("------------------------------------------")
    
    avg_cut_err = float(np.mean(cut_errors)) if cut_errors else 0.0
    avg_beat_err = float(np.mean(beat_errors)) if beat_errors else 0.0

    timing_accuracy = max(0.0, min(100.0, 100.0 - avg_cut_err * 2.5))
    audio_sync = max(0.0, min(100.0, 100.0 - avg_beat_err * 3.0))
    visual_accuracy = max(0.0, min(100.0, 100.0 - (abs(len(ref_cuts) - len(rnd_cuts))) * 5.0))

    print(f" TIMING ACCURACY:       {timing_accuracy:.1f}%")
    print(f" VISUAL EVENT ACCURACY: {visual_accuracy:.1f}%")
    print(f" AUDIO SYNC:            {audio_sync:.1f}%")
    print("==========================================\n")

def main():
    parser = argparse.ArgumentParser(description="Reference vs Output Video Comparator")
    parser.add_argument("reference_video", type=str, help="Path to reference .mp4")
    parser.add_argument("rendered_video", type=str, help="Path to rendered Remotion .mp4")
    args = parser.parse_args()

    compare_videos(args.reference_video, args.rendered_video)

if __name__ == "__main__":
    main()
