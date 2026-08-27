#!/usr/bin/env python3
"""
Automated Carousel Slide Renderer for project_tech.
Renders all frames of any Remotion carousel composition into high-res PNG slides.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech")
OUT_DIR = BASE_DIR / "out" / "carousels"

def render_carousel(composition_id: str, total_slides: int = 6, output_folder_name: str = None):
    folder_name = output_folder_name or composition_id.lower().replace("carousel", "").replace("comp", "")
    target_dir = OUT_DIR / folder_name
    target_dir.mkdir(parents=True, exist_ok=True)

    print("=" * 65)
    print(f"🎨 RENDERING INSTAGRAM CAROUSEL: {composition_id}")
    print(f"📁 Output Directory: {target_dir}")
    print(f"📊 Total Slides: {total_slides} (Frames 0 to {total_slides - 1})")
    print("=" * 65)

    rendered_files = []

    for frame_idx in range(total_slides):
        slide_num = frame_idx + 1
        output_file = target_dir / f"slide_{slide_num:02d}.png"
        cmd = [
            "npx", "remotion", "still",
            "src/index.ts",
            composition_id,
            str(output_file),
            f"--frame={frame_idx}"
        ]

        print(f"\n⚡ Rendering Slide {slide_num}/{total_slides} (frame {frame_idx})...")
        res = subprocess.run(cmd, cwd=str(BASE_DIR), capture_output=True, text=True)

        if res.returncode == 0 and output_file.exists():
            size_kb = output_file.stat().st_size / 1024
            print(f"✅ Slide {slide_num} Rendered: {output_file.name} ({size_kb:.1f} KB)")
            rendered_files.append(output_file)
        else:
            print(f"❌ Error rendering slide {slide_num}:")
            print(res.stderr or res.stdout)
            sys.exit(1)

    print("\n" + "=" * 65)
    print(f"🎉 SUCCESS! All {len(rendered_files)} carousel slides rendered successfully!")
    print(f"📂 Location: {target_dir}")
    print("=" * 65)
    return rendered_files

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Render Remotion Carousel Slides")
    parser.add_argument("--comp", default="BinarySearchCarousel", help="Composition ID in Root.tsx")
    parser.add_argument("--slides", type=int, default=6, help="Number of slides")
    parser.add_argument("--name", default="binary_search", help="Output folder name")

    args = parser.parse_args()
    render_carousel(args.comp, args.slides, args.name)
