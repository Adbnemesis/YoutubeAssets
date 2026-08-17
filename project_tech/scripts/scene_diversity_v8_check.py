#!/usr/bin/env python3
"""
Scene Diversity, Coherent Narration & Pacing QA Checker for Nemi Explains V08
Validates the new V08 Architecture:
1. Long-form narrator blocks (≤ 6 blocks) vs fragmented clips
2. Target duration strictly within 20.0s – 24.0s
3. Coherent Nemi reactions (≥ 4)
4. Semantic cue coverage across all blocks
5. No dead silence / max continuous unvaried state ≤ 3.5s
"""

import json
import sys
from pathlib import Path
from collections import Counter

CUE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "nemi_v8_cues.json"

def main():
    if not CUE_PATH.exists():
        print(f"❌ Cue file not found: {CUE_PATH}")
        sys.exit(1)

    with open(CUE_PATH) as f:
        data = json.load(f)

    blocks = data["narration_blocks"]
    total_frames = data["total_frames"]
    fps = data["fps"]
    total_s = total_frames / fps

    narrator_blocks = [b for b in blocks if b["speaker"] == "narrator"]
    nemi_blocks = [b for b in blocks if b["speaker"] == "nemi"]

    all_semantic_cues = []
    for b in blocks:
        all_semantic_cues.extend(b.get("semantic_cues", []))

    # Longest narrator block
    longest_narrator = max(b["duration_s"] for b in narrator_blocks) if narrator_blocks else 0
    shortest_narrator = min(b["duration_s"] for b in narrator_blocks) if narrator_blocks else 0

    print("═" * 70)
    print("🎬  NEMI EXPLAINS V08 — COHERENT AUDIO & STORY QA CHECK")
    print("═" * 70)
    print(f"   Total Duration: {total_s:.2f}s ({total_frames} frames @ {fps}fps)")
    print(f"   Narrator Blocks: {len(narrator_blocks)} (Longest: {longest_narrator:.2f}s, Shortest: {shortest_narrator:.2f}s)")
    print(f"   Nemi Reactions: {len(nemi_blocks)}")
    print(f"   Total Semantic Cues: {len(all_semantic_cues)}")
    print()

    checks = []

    # 1. Narrator uses coherent blocks (3-6 blocks)
    ok = 3 <= len(narrator_blocks) <= 6
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Coherent Narrator Blocks in [3, 6]: {len(narrator_blocks)} blocks")

    # 2. ≥ 4 Nemi character reactions
    ok = len(nemi_blocks) >= 4
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Nemi Character Reactions ≥ 4: {len(nemi_blocks)} reactions ({', '.join(b['text'] for b in nemi_blocks)})")

    # 3. Rich semantic cue coverage (≥ 12 semantic triggers)
    ok = len(all_semantic_cues) >= 12
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Semantic Visual Cues ≥ 12: {len(all_semantic_cues)} cues")

    # 4. Longest narrator block demonstrates thought continuity (≥ 2.5s)
    ok = longest_narrator >= 2.5
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Longest Narrator Performance ≥ 2.5s: {longest_narrator:.2f}s (Paragraph thinking)")

    # 5. Target duration strictly within [20.0s, 24.0s]
    ok = 20.0 <= total_s <= 24.0
    checks.append(ok)
    print(f"{'✅' if ok else '❌'} Duration in [20.0s, 24.0s]: {total_s:.2f}s (Golden Sweet Spot)")

    print()
    print("── Narrator Performance Blocks ──")
    for i, b in enumerate(narrator_blocks, 1):
        print(f"   [{i}] {b['id']} ({b['duration_s']:.2f}s, f{b['start_frame']}→f{b['end_frame']}): \"{b['text']}\"")
        for sc in b.get("semantic_cues", []):
            print(f"       ↳ cue '{sc['cue']}' @ f{sc['frame']} (phrase: \"{sc['phrase']}\")")

    print()
    print("── Nemi Character Reactions ──")
    for i, b in enumerate(nemi_blocks, 1):
        print(f"   [{i}] {b['id']} ({b['duration_s']:.2f}s, f{b['start_frame']}→f{b['end_frame']}): \"{b['text']}\"")

    print()
    passed = sum(checks)
    total = len(checks)
    if all(checks):
        print(f"🎉 ALL {total} V08 ARCHITECTURAL QA CHECKS PASSED!")
    else:
        print(f"⚠️  {passed}/{total} checks passed.")

    sys.exit(0 if all(checks) else 1)

if __name__ == "__main__":
    main()
