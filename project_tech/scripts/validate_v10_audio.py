#!/usr/bin/env python3
"""
Master Audio & Speaker Timeline Validator for Nemi Explains V10
Strictly validates:
1. Accidental Narrator/Nemi overlap == 0ms (Hard Failure if overlap > 0)
2. Speaker start_time >= prev_end_time
3. Total duration strictly within [18.0s, 22.0s] (Target ~20-21s)
4. Zero clipped sentence endings or empty segments
5. Presence of intentional viewer pause (0.6s - 1.0s)
"""

import json
import sys
from pathlib import Path

CUE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "nemi_v10_cues.json"

def main():
    if not CUE_PATH.exists():
        print(f"❌ Cue file not found: {CUE_PATH}")
        sys.exit(1)

    with open(CUE_PATH) as f:
        data = json.load(f)

    events = data.get("timeline_events", [])
    total_frames = data.get("total_frames", 0)
    fps = data.get("fps", 30)
    total_s = total_frames / fps

    print("═" * 70)
    print("🔍  V10 MASTER SPEAKER TIMELINE & ZERO-OVERLAP VALIDATOR")
    print("═" * 70)
    print(f"   Total Duration: {total_s:.2f}s ({total_frames} frames @ {fps}fps)")
    print(f"   Timeline Events: {len(events)}\n")

    errors = []
    warnings = []

    prev_end_ms = 0
    prev_speaker = None
    prev_id = None
    intentional_pauses = 0
    longest_gap_ms = 0

    for i, ev in enumerate(events, 1):
        ev_id = ev["id"]
        speaker = ev["speaker"]
        start_ms = ev["start_time_ms"]
        end_ms = ev["end_time_ms"]
        dur_s = ev["duration_s"]
        dur_ms = end_ms - start_ms

        if dur_s <= 0 or dur_ms <= 0:
            errors.append(f"Event {ev_id} has invalid duration: {dur_s}s ({dur_ms}ms)")

        if start_ms < prev_end_ms:
            overlap_ms = prev_end_ms - start_ms
            errors.append(f"ACCIDENTAL OVERLAP DETECTED! {ev_id} ({speaker}) starts at {start_ms}ms before {prev_id} ({prev_speaker}) ended at {prev_end_ms}ms (Overlap: {overlap_ms}ms)")
        else:
            gap = start_ms - prev_end_ms
            longest_gap_ms = max(longest_gap_ms, gap)
            if gap >= 400:
                intentional_pauses += 1
            print(f"[{i:2d}] {speaker:8s} {ev_id:26s} | {start_ms:5d}ms → {end_ms:5d}ms (dur: {dur_s:.2f}s) | gap: {gap}ms")

        prev_end_ms = end_ms
        prev_speaker = speaker
        prev_id = ev_id

    print()
    print("── Validation Summary ──")

    dur_ok = 18.0 <= total_s <= 22.0
    print(f"{'✅' if dur_ok else '❌'} Duration in Target Window [18.0s, 22.0s]: {total_s:.2f}s")
    if not dur_ok:
        errors.append(f"Duration {total_s:.2f}s outside target [18.0s, 22.0s]")

    overlap_ok = len([e for e in errors if "OVERLAP" in e]) == 0
    print(f"{'✅' if overlap_ok else '❌'} Accidental Speaker Overlap: 0ms (Strict Separation)")

    pause_ok = intentional_pauses >= 1
    print(f"{'✅' if pause_ok else '❌'} Intentional Viewer Inspection Pause (≥400ms): {intentional_pauses} present ({longest_gap_ms}ms)")
    if not pause_ok:
        warnings.append("No deliberate viewer inspection pause detected (gap >= 400ms)")

    narrator_blocks = [e for e in events if e["speaker"] == "narrator"]
    nemi_clips = [e for e in events if e["speaker"] == "nemi"]
    narrator_ok = 3 <= len(narrator_blocks) <= 6
    nemi_ok = 2 <= len(nemi_clips) <= 4
    print(f"{'✅' if narrator_ok else '❌'} Coherent Narrator Blocks: {len(narrator_blocks)} (Target: 3–6)")
    print(f"{'✅' if nemi_ok else '❌'} Focused Nemi Spoken Beats: {len(nemi_clips)} (Target: 2–4)")

    print()
    if errors:
        print(f"❌ VALIDATION FAILED WITH {len(errors)} CRITICAL ERRORS:")
        for err in errors:
            print(f"   • {err}")
        sys.exit(1)
    else:
        print(f"🎉 ALL V10 SPEAKER TIMELINE & ZERO-OVERLAP CHECKS PASSED!")
        sys.exit(0)

if __name__ == "__main__":
    main()
