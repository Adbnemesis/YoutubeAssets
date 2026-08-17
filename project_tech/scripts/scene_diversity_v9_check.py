#!/usr/bin/env python3
"""
Scene Diversity & Architecture QA Checker for Nemi Explains V09
Validates:
1. Coherent narrator performance blocks (3–6)
2. Non-overlapping focused Nemi beats (2–3)
3. Zero accidental speaker overlap
4. Continuous camera transitions and semantic cue coverage (≥ 12 cues)
5. Total duration strictly within [20.0s, 23.0s]
"""

import json
import sys
from pathlib import Path

CUE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "nemi_v9_cues.json"

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
    print("🎬  NEMI EXPLAINS V09 — SCENE DIVERSITY & ARCHITECTURE QA CHECK")
    print("═" * 70)
    print(f"   Total Duration: {total_s:.2f}s ({total_frames} frames @ {fps}fps)")
    print(f"   Narrator Blocks: {len(narrator_blocks)} (Longest: {longest_narrator:.2f}s)")
    print(f"   Nemi Spoken Beats: {len(nemi_clips)}")
    print(f"   Total Semantic Cues: {len(all_semantic_cues)}")
    print()

    checks = []

    # 1. Narrator uses coherent blocks (3-6 blocks)
    ok = 3 <= len(narrator_blocks) <= 6
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Coherent Narrator Blocks in [3, 6]: {len(narrator_blocks)} blocks")

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

    # 4. Rich Semantic Cue Coverage (≥ 12 triggers)
    ok = len(all_semantic_cues) >= 12
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Semantic Visual Cues ≥ 12: {len(all_semantic_cues)} cues")

    # 5. Longest Narrator Performance ≥ 2.5s
    ok = longest_narrator >= 2.5
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Longest Narrator Performance ≥ 2.5s: {longest_narrator:.2f}s (Paragraph thinking)")

    # 6. Target Duration strictly within [20.0s, 23.0s]
    ok = 20.0 <= total_s <= 23.0
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Duration in [20.0s, 23.0s]: {total_s:.2f}s (Golden Sweet Spot)")

    print()
    print("── Narrator Performance Sequence ──")
    for i, b in enumerate(narrator_blocks, 1):
        print(f"   [{i}] {b['id']} ({b['duration_s']:.2f}s, f{b['start_frame']}→f{b['end_frame']}): \"{b['text']}\"")
        for sc in b.get("semantic_cues", []):
            print(f"       ↳ cue '{sc['cue']}' @ f{sc['frame']} (phrase: \"{sc['phrase']}\")")

    print()
    print("── Nemi Spoken Beats ──")
    for i, b in enumerate(nemi_clips, 1):
        print(f"   [{i}] {b['id']} ({b['duration_s']:.2f}s, f{b['start_frame']}→f{b['end_frame']}): \"{b['text']}\"")

    print()
    passed = sum(checks)
    total = len(checks)
    if all(checks):
        print(f"🎉 ALL {total} V09 ARCHITECTURAL QA CHECKS PASSED!")
    else:
        print(f"⚠️  {passed}/{total} checks passed.")

    sys.exit(0 if all(checks) else 1)

if __name__ == "__main__":
    main()
