#!/usr/bin/env python3
"""
Batch Renderer for Project Tech (Remotion + Mac M4 Pro optimization)
Iterates through all ready-to-render JSON data files and invokes Remotion CLI.
"""
import os
import sys
import json
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUT_DIR = BASE_DIR / "out"

def render_reel(json_path: Path):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(json_path, "r") as f:
        props = json.load(f)

    reel_id = props.get("id", json_path.stem)
    comp_id = props.get("compositionId", "OutputPredictor")
    output_mp4 = OUT_DIR / f"{reel_id}.mp4"

    print(f"🎬 Rendering [{comp_id}] -> {output_mp4.name} ...")
    
    # Save temp props
    temp_props_path = BASE_DIR / f"temp_{reel_id}.json"
    with open(temp_props_path, "w") as tf:
        json.dump(props, tf)

    cmd = [
        "npx", "remotion", "render",
        "src/index.ts",
        comp_id,
        str(output_mp4),
        f"--props={str(temp_props_path)}",
        "--gl=angle",
        "--concurrency=4" # Tuned for Apple Silicon M4 Pro
    ]

    try:
        res = subprocess.run(cmd, cwd=str(BASE_DIR), capture_output=True, text=True)
        if res.returncode == 0:
            print(f"✅ Rendered successfully: {output_mp4.name}")
        else:
            print(f"❌ Failed rendering {reel_id}: {res.stderr}")
    finally:
        if temp_props_path.exists():
            temp_props_path.unlink()

def main():
    json_files = sorted(list(DATA_DIR.glob("*.json")))
    if not json_files:
        print("No JSON files found in data/ directory.")
        return

    print(f"Found {len(json_files)} Reels to render. Starting batch process on Apple Silicon M4 Pro...")
    for jf in json_files:
        render_reel(jf)

if __name__ == "__main__":
    main()
