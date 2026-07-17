#!/usr/bin/env python3
"""Fix image file naming: from [02-03] onwards, each file is one position
ahead of where it should be. Rename each to the PREVIOUS timestamp in the
prompt sequence."""

import os, re

IMG_DIR = os.path.join(os.path.dirname(__file__), "images")
PROMPTS = os.path.join(os.path.dirname(__file__), "image_prompts_fifa_90th_minute.txt")
SUFFIX = "_Hand-drawn_2D_doo.jpg"

# 1. Extract ordered timestamps from prompts file
with open(PROMPTS) as f:
    prompt_timestamps = []
    for line in f:
        m = re.match(r'\[(\d{2}):(\d{2})\]', line.strip())
        if m:
            prompt_timestamps.append(f"{m.group(1)}-{m.group(2)}")

print(f"Found {len(prompt_timestamps)} prompt timestamps")

# 2. Build a lookup: timestamp → index in prompt sequence
ts_index = {ts: i for i, ts in enumerate(prompt_timestamps)}

# 3. Get all image files from [02-03] onwards, sorted
all_files = sorted(os.listdir(IMG_DIR))
files_to_fix = []
for f in all_files:
    m = re.match(r'\[(\d{2}-\d{2})\]', f)
    if m:
        ts = m.group(1)
        mm, ss = ts.split('-')
        total_seconds = int(mm) * 60 + int(ss)
        # [02-03] = 123 seconds
        if total_seconds >= 123:
            files_to_fix.append((ts, f))

print(f"\nFiles to rename ({len(files_to_fix)}):")

# 4. Build rename mapping
renames = []
for ts, filename in files_to_fix:
    idx = ts_index.get(ts)
    if idx is None:
        print(f"  WARNING: {ts} not found in prompt timestamps!")
        continue
    if idx == 0:
        print(f"  WARNING: {ts} is the first prompt, can't go back!")
        continue
    new_ts = prompt_timestamps[idx - 1]
    old_name = f"[{ts}]{SUFFIX}"
    new_name = f"[{new_ts}]{SUFFIX}"
    if old_name != new_name:
        renames.append((old_name, new_name))
        print(f"  {old_name}  →  {new_name}")

# 5. Execute renames in order (safe because each target was already moved)
print(f"\nExecuting {len(renames)} renames...")
for old_name, new_name in renames:
    old_path = os.path.join(IMG_DIR, old_name)
    new_path = os.path.join(IMG_DIR, new_name)
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"  ✓ {old_name} → {new_name}")
    else:
        print(f"  ✗ {old_name} not found!")

print("\nDone!")
