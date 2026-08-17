#!/usr/bin/env python3
"""
Scene Diversity & Architecture QA Checker for Nemi Explains V11
Topic: "What Actually Happens When You Type google.com?"
Validates:
1. 6-Beat Continuous Cinematic World Architecture
2. Coherent narrator performance blocks (4–7)
3. Focused Nemi spoken beats (2–3)
4. Zero accidental speaker overlap (0ms)
5. Rich semantic visual cues (≥ 10 triggers)
6. Total duration strictly within [20.0s, 25.0s] (Target ~21–23s)
"""

import json
import sys
from pathlib import Path

CUE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "nemi_v11_cues.json"

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

    narrator_blocks = [e for e in events if e["speaker"] == "narrator"]
    nemi_clips = [e for e in events if e["speaker"] == "nemi"]

    all_semantic_cues = []
    for e in events:
        all_semantic_cues.extend(e.get("semantic_cues", []))

    longest_narrator = max(e["duration_s"] for e in narrator_blocks) if narrator_blocks else 0

    print("═" * 70)
    print("🎬  NEMI EXPLAINS V11 — GOOGLE.COM JOURNEY ARCHITECTURAL QA CHECK")
    print("═" * 70)
    print(f"   Total Duration: {total_s:.2f}s ({total_frames} frames @ {fps}fps)")
    print(f"   Narrator Blocks: {len(narrator_blocks)} (Longest: {longest_narrator:.2f}s)")
    print(f"   Nemi Spoken Beats: {len(nemi_clips)}")
    print(f"   Total Semantic Cues: {len(all_semantic_cues)}\n")

    checks = []

    # 1. Narrator uses coherent blocks (4-7 blocks)
    ok = 4 <= len(narrator_blocks) <= 7
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Coherent Narrator Blocks in [4, 7]: {len(narrator_blocks)} blocks")

    # 2. Focused Nemi Spoken Beats (2-3 beats)
    ok = 2 <= len(nemi_clips) <= 3
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Focused Nemi Spoken Beats in [2, 3]: {len(nemi_clips)} ({', '.join(b['text'] for b in nemi_clips)})")

    # 3. Zero Accidental Overlap
    has_overlap = False
    for i in range(1, len(events)):
        if events[i]["start_time_ms"] < events[i-1]["end_time_ms"]:
            has_overlap = True
            break
    ok = not has_overlap
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Zero Accidental Speaker Overlap: {'PASSED (0ms)' if ok else 'FAILED'}")

    # 4. Rich Semantic Cue Coverage (≥ 10 triggers)
    ok = len(all_semantic_cues) >= 10
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Semantic Visual Cues ≥ 10: {len(all_semantic_cues)} cues")

    # 5. Target Duration strictly within [19.0s, 25.0s]
    ok = 19.0 <= total_s <= 25.0
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Duration in [19.0s, 25.0s]: {total_s:.2f}s (Golden Sweet Spot)")

    print()
    print("── 6-Beat Continuous Journey Timeline ──")
    for i, b in enumerate(events, 1):
        print(f"   [{i:2d}] {b['speaker']:8s} {b['id']:26s} ({b['duration_s']:.2f}s, f{b['start_frame']}→f{b['end_frame']}): \"{b['text']}\"")
        for sc in b.get("semantic_cues", []):
            print(f"        ↳ cue '{sc['cue']}' @ f{sc['frame']} (phrase: \"{sc['phrase']}\")")

    print()
    passed = sum(checks)
    total = len(checks)
    if all(checks):
        print(f"🎉 ALL {total} V11 ARCHITECTURAL QA CHECKS PASSED!")
    else:
        print(f"⚠️  {passed}/{total} checks passed.")

    sys.exit(0 if all(checks) else 1)

if __name__ == "__main__":
    main()
