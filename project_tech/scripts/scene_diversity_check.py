#!/usr/bin/env python3
"""
Scene Diversity QA Check — validates that the V6 cue data meets the
minimum creative standards for scene variety, Nemi reactions, and
participation moments.
"""

import json
import sys
from pathlib import Path
from collections import Counter

CUE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "nemi_v6_cues.json"

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

    # Scene type variety
    scene_types = [s["scene_type"] for s in segments]
    unique_scenes = set(scene_types)
    type_counts = Counter(scene_types)

    # Beat variety
    beats = [s["beat"] for s in segments]
    unique_beats = set(beats)

    # Nemi reactions
    nemi_segments = [s for s in segments if s["speaker"] == "nemi"]

    # Participation moments (challenge, freeze)
    participation = [s for s in segments if s["beat"] in ("challenge", "freeze")]

    # Surprise moments
    surprise = [s for s in segments if s["beat"] == "freeze"]

    # Check for same scene type used > 4 continuous seconds
    max_continuous = 0
    current_type = None
    current_start = 0
    for s in segments:
        if s["scene_type"] != current_type:
            if current_type:
                dur = (s["start_time_ms"] - current_start) / 1000
                max_continuous = max(max_continuous, dur)
            current_type = s["scene_type"]
            current_start = s["start_time_ms"]
    # Check last group
    if current_type:
        last_dur = (segments[-1]["end_time_ms"] - current_start) / 1000
        max_continuous = max(max_continuous, last_dur)

    print("═" * 60)
    print("🎬  SCENE DIVERSITY QA CHECK — NEMI EXPLAINS V6")
    print("═" * 60)
    print(f"   Total Duration: {total_s:.1f}s ({total_frames} frames)")
    print(f"   Total Segments: {len(segments)}")
    print()

    checks = []

    # 1. ≥ 5 unique scene types
    ok = len(unique_scenes) >= 5
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Scene Types ≥ 5: {len(unique_scenes)} unique ({', '.join(sorted(unique_scenes))})")

    # 2. ≥ 3 Nemi reactions
    ok = len(nemi_segments) >= 3
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Nemi Reactions ≥ 3: {len(nemi_segments)} ({', '.join(s['text'] for s in nemi_segments)})")

    # 3. ≥ 1 participation moment
    ok = len(participation) >= 1
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Participation Moments ≥ 1: {len(participation)}")

    # 4. ≥ 1 surprise moment
    ok = len(surprise) >= 1
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Surprise Moments ≥ 1: {len(surprise)}")

    # 5. Max continuous same scene type ≤ 5s
    ok = max_continuous <= 5.0
    checks.append(ok)
    print(f"{'✅' if ok else '⚠️ '} Max Continuous Same Scene ≤ 5s: {max_continuous:.1f}s")

    # 6. ≥ 6 unique beats
    ok = len(unique_beats) >= 6
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Unique Beats ≥ 6: {len(unique_beats)} ({', '.join(sorted(unique_beats))})")

    # 7. Duration 18-28s
    ok = 18 <= total_s <= 28
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Duration in [18s, 28s]: {total_s:.1f}s")

    print()
    print("── Scene Type Distribution ──")
    for st, cnt in sorted(type_counts.items()):
        segs = [s for s in segments if s["scene_type"] == st]
        dur = sum(s["duration_s"] for s in segs)
        print(f"   {st}: {cnt} segments, {dur:.1f}s")

    print()
    passed = sum(checks)
    total = len(checks)
    if all(checks):
        print(f"🎉 ALL {total} CHECKS PASSED!")
    else:
        print(f"⚠️  {passed}/{total} checks passed. Review warnings above.")

    sys.exit(0 if all(checks) else 1)

if __name__ == "__main__":
    main()
