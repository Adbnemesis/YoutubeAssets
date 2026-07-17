"""
Segment-level alignment: match each script line to the best Whisper segment
using SequenceMatcher ratio, then use that segment's start time.
This avoids all word-level pointer tracking bugs.
"""
import json
from pathlib import Path
from difflib import SequenceMatcher
import unicodedata

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")
project_dir = ROOT / "projects" / "fifa_90th_minute_project_8"
transcript_json = project_dir / "voiceover_transcript.json"
script_path = project_dir / "script_fifa_90th_minute.txt"
output_path = project_dir / "project_8_transcript"

def normalize(text: str) -> str:
    """Lowercase, strip accents, keep only alphanumeric + spaces."""
    text = "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )
    return " ".join(text.lower().split())

def fmt(seconds: float) -> str:
    m = int(seconds) // 60
    s = int(seconds) % 60
    return f"[{m:02d}:{s:02d}]"

# ── Load data ──────────────────────────────────────────────────────────
with open(transcript_json, "r", encoding="utf-8") as f:
    data = json.load(f)

segments = data["segments"]                       # list of {start, end, text}
script_lines = [
    l.strip()
    for l in script_path.read_text("utf-8").splitlines()
    if l.strip()
]

# ── Pre-normalise segment texts ────────────────────────────────────────
seg_norms = [normalize(seg["text"]) for seg in segments]

# ── Match each script line to its best segment ─────────────────────────
# Constraint: segments are consumed in order (no going backwards).
seg_ptr = 0                                       # earliest segment we may use

aligned = []
for line in script_lines:
    line_norm = normalize(line)

    best_idx = seg_ptr
    best_ratio = -1.0

    # Look ahead up to 4 segments from current pointer
    for idx in range(seg_ptr, min(seg_ptr + 4, len(segments))):
        # Also try merging this segment with the next one
        # (Whisper sometimes splits one script line into two segments)
        for merge_count in range(1, 3):           # try 1 seg, then 2 merged
            if idx + merge_count > len(segments):
                break
            merged_text = " ".join(seg_norms[idx : idx + merge_count])
            ratio = SequenceMatcher(None, line_norm, merged_text).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_idx = idx

    start_time = segments[best_idx]["start"]
    aligned.append(f"{fmt(start_time)} {line}")

    # Advance pointer past the matched segment(s)
    seg_ptr = best_idx + 1

# ── Write output ───────────────────────────────────────────────────────
output_path.write_text("\n".join(aligned) + "\n", encoding="utf-8")
print(f"✅ Wrote {len(aligned)} aligned lines to {output_path}")

# ── Print for verification ─────────────────────────────────────────────
for a in aligned:
    print(a)
