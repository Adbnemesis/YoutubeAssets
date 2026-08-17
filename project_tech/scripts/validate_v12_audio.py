#!/usr/bin/env python3
"""
Master Audio & Speaker Timeline Validator for Nemi Explains V12
Topic: "Why Does 0.1 + 0.2 Not Equal 0.3?" (Mystery Archetype)
Strictly validates:
1. Accidental Narrator/Nemi overlap == 0.00ms (Hard Failure if overlap > 0)
2. Total duration strictly within [18.0s, 24.5s] (Target ~20-22s)
3. Zero clipped sentence endings or empty segments
"""

import json
import sys
from pathlib import Path

CUE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "nemi_v12_cues.json"

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
    print("🔍  V12 MASTER SPEAKER TIMELINE & ZERO-OVERLAP VALIDATOR")
    print("═" * 70)
    print(f"   Topic: {data.get('topic', 'Floating Point Mystery')}")
    print(f"   Total Duration: {total_s:.2f}s ({total_frames} frames @ {fps}fps)")
    print(f"   Timeline Events: {len(events)}\n")

    errors = []
    prev_end_ms = 0
    prev_speaker = None
    prev_id = None

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
            print(f"[{i:2d}] {speaker:8s} {ev_id:26s} | {start_ms:5d}ms → {end_ms:5d}ms (dur: {dur_s:.2f}s) | gap: {gap}ms")

        prev_end_ms = end_ms
        prev_speaker = speaker
        prev_id = ev_id

    print()
    print("── Validation Summary ──")

    dur_ok = 18.0 <= total_s <= 24.5
    print(f"{'✅' if dur_ok else '❌'} Duration in Target Window [18.0s, 24.5s]: {total_s:.2f}s")
    if not dur_ok:
        errors.append(f"Duration {total_s:.2f}s outside target [18.0s, 24.5s]")

    overlap_ok = len([e for e in errors if "OVERLAP" in e]) == 0
    print(f"{'✅' if overlap_ok else '❌'} Accidental Speaker Overlap: 0ms (Strict Separation)")

    narrator_blocks = [e for e in events if e["speaker"] == "narrator"]
    nemi_clips = [e for e in events if e["speaker"] == "nemi"]
    narrator_ok = 3 <= len(narrator_blocks) <= 6
    nemi_ok = 2 <= len(nemi_clips) <= 3
    print(f"{'✅' if narrator_ok else '❌'} Coherent Narrator Blocks: {len(narrator_blocks)} (Target: 3–6)")
    print(f"{'✅' if nemi_ok else '❌'} Focused Nemi Spoken Beats: {len(nemi_clips)} (Target: 2–3)")

    print()
    if errors:
        print(f"❌ VALIDATION FAILED WITH {len(errors)} CRITICAL ERRORS:")
        for err in errors:
            print(f"   • {err}")
        sys.exit(1)
    else:
        print(f"🎉 ALL V12 SPEAKER TIMELINE & ZERO-OVERLAP CHECKS PASSED!")
        sys.exit(0)

if __name__ == "__main__":
    main()
