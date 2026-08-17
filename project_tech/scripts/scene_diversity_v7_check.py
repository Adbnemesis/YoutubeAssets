#!/usr/bin/env python3
"""
Scene Diversity & Pacing QA Checker for Nemi Explains V07
Validates duration, scene count, max continuous scene duration,
viewer participation, surprise moments, and Nemi character reactions.
"""

import json
import sys
from pathlib import Path
from collections import Counter

CUE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "nemi_v7_cues.json"

def main():
    if not CUE_PATH.exists():
        print(f"❌ Cue file not found: {CUE_PATH}")
        sys.exit(1)

    with open(CUE_PATH) as f:
        data = json.load(f)

    segments = data["segments"]
    total_frames = data["total_frames"]
    fps = data["fps"]
    total_s = total_frames / fps

    # Beat variety
    beats = [s["beat"] for s in segments]
    unique_beats = set(beats)
    beat_counts = Counter(beats)

    # Nemi reactions
    nemi_segments = [s for s in segments if s["speaker"] == "nemi"]

    # Participation moments
    participation = [s for s in segments if s["beat"] in ("challenge", "nemi_guess", "freeze")]

    # Surprise / Reversal moments
    surprise = [s for s in segments if s["beat"] in ("freeze", "reveal")]

    # Max continuous same beat duration
    max_continuous = 0
    current_beat = None
    current_start = 0
    for s in segments:
        if s["beat"] != current_beat:
            if current_beat:
                dur = (s["start_time_ms"] - current_start) / 1000
                max_continuous = max(max_continuous, dur)
            current_beat = s["beat"]
            current_start = s["start_time_ms"]
    if current_beat:
        last_dur = (segments[-1]["end_time_ms"] - current_start) / 1000
        max_continuous = max(max_continuous, last_dur)

    print("═" * 60)
    print("🎬  SCENE DIVERSITY & PACING QA CHECK — NEMI EXPLAINS V07")
    print("═" * 60)
    print(f"   Total Duration: {total_s:.2f}s ({total_frames} frames @ {fps}fps)")
    print(f"   Total Dialogue Segments: {len(segments)}")
    print()

    checks = []

    # 1. ≥ 7 unique story beats
    ok = len(unique_beats) >= 7
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Unique Story Beats ≥ 7: {len(unique_beats)} unique ({', '.join(sorted(unique_beats))})")

    # 2. ≥ 4 Nemi reactions
    ok = len(nemi_segments) >= 4
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Nemi Character Reactions ≥ 4: {len(nemi_segments)} ({', '.join(s['text'] for s in nemi_segments)})")

    # 3. ≥ 1 participation moment
    ok = len(participation) >= 1
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Viewer Participation Moments ≥ 1: {len(participation)}")

    # 4. ≥ 1 surprise / reversal moment
    ok = len(surprise) >= 1
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Surprise / Reversal Moments ≥ 1: {len(surprise)}")

    # 5. Max continuous same beat ≤ 3.5s
    ok = max_continuous <= 3.5
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Max Continuous Same Scene ≤ 3.5s: {max_continuous:.2f}s")

    # 6. Target duration strictly within [20.0s, 25.0s]
    ok = 20.0 <= total_s <= 25.0
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Duration in [20.0s, 25.0s]: {total_s:.2f}s (Golden Sweet Spot)")

    print()
    print("── Beat Distribution ──")
    for b, cnt in sorted(beat_counts.items()):
        segs = [s for s in segments if s["beat"] == b]
        dur = sum(s["duration_s"] for s in segs)
        print(f"   {b:12s}: {cnt} segments, {dur:.2f}s")

    print()
    passed = sum(checks)
    total = len(checks)
    if all(checks):
        print(f"🎉 ALL {total} QA CHECKS PASSED!")
    else:
        print(f"⚠️  {passed}/{total} checks passed.")

    sys.exit(0 if all(checks) else 1)

if __name__ == "__main__":
    main()
