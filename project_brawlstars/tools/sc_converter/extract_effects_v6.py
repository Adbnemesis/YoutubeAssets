#!/usr/bin/env python3
"""Extract Supercell .sc effect parts to aligned PNG sequences (SC6 support).

This script uses the patched SC6File parser (sc6_parser.py) which handles
SC version 6 files (newer Brawl Stars) by:
  1. Decompressing with sc-compression
  2. Parsing the FlatBuffer structure
  3. Decoding embedded KTX/ASTC textures

Outputs:
    commonassets/brawler_effects/<brawler>/<export>/frame_%04d.png
    commonassets/brawler_effects/<brawler>/<export>/manifest.json

Usage:
    /opt/homebrew/bin/python3.11 tools/sc_converter/extract_effects_v6.py --brawler gale
    /opt/homebrew/bin/python3.11 tools/sc_converter/extract_effects_v6.py --brawler gale --exports gale_006_atk_projectile gale_006_atk_hit
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from PIL import Image


def load_sc6_parser():
    """Import SC6File from the local sc6_parser module."""
    sys.path.insert(0, str(Path(__file__).parent))
    from sc6_parser import SC6File
    return SC6File


def render_export_frames(sc, name: str, textures: list, scale: int):
    """Render every frame of *name* onto a shared union canvas.

    Returns (frames, manifest) where frames is a list of RGBA PIL Images all
    the same size, and manifest holds canvas + anchor + per-frame bounds.
    """
    info = sc.get_export_frame_info(name)
    if info is None:
        return None, None
    count = info["frame_count"]

    rendered = []
    for fi in range(count):
        try:
            result = sc.extract_sprite_with_offset(
                name, textures, frame_index=fi
            )
        except Exception as e:
            print(f"  frame {fi} error: {e}", file=sys.stderr)
            rendered.append(None)
            continue
        if result is None:
            rendered.append(None)
            continue
        img, ox, oy = result
        if img is None:
            rendered.append(None)
            continue
        rendered.append((img.convert("RGBA"), float(ox), float(oy)))

    live = [r for r in rendered if r is not None]
    if not live:
        return None, None

    # Find union bounds across all live frames
    min_x = min(r[1] for r in live)
    min_y = min(r[2] for r in live)
    max_x = max(r[1] + r[0].width for r in live)
    max_y = max(r[2] + r[0].height for r in live)
    cw = int(max_x - min_x)
    ch = int(max_y - min_y)
    if cw <= 0 or ch <= 0:
        return None, None

    anchor_x = -min_x
    anchor_y = -min_y

    frames = []
    bounds = []
    for r in rendered:
        if r is None:
            frames.append(None)
            bounds.append(None)
            continue
        img, ox, oy = r
        canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        canvas.paste(img, (int(ox - min_x), int(oy - min_y)), img)
        if scale != 1:
            canvas = canvas.resize((cw * scale, ch * scale), Image.NEAREST)
        frames.append(canvas)
        bounds.append(
            {
                "x": int(ox - min_x) * scale,
                "y": int(oy - min_y) * scale,
                "w": img.width * scale,
                "h": img.height * scale,
            }
        )

    manifest = {
        "name": name,
        "frameCount": len(frames),
        "canvas": {"width": cw * scale, "height": ch * scale},
        "anchor": {"x": int(anchor_x * scale), "y": int(anchor_y * scale)},
        "scale": scale,
        "frames": bounds,
    }
    return frames, manifest


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--brawler", required=True, help="brawler id, e.g. gale")
    ap.add_argument(
        "--exports",
        nargs="*",
        help="effect export names to extract (default: attack/ulti VFX parts)",
    )
    ap.add_argument(
        "--scale",
        type=int,
        default=4,
        help="integer upscale factor for the small game sprites (default 4)",
    )
    args = ap.parse_args()

    repo = Path(__file__).resolve().parents[2]
    src = repo / "commonassets" / "brawler_effects" / f"effects_brawler_{args.brawler}.sc"
    if not src.exists():
        print(f"ERROR: {src} not found", file=sys.stderr)
        return 1

    SC6File = load_sc6_parser()

    out_root = repo / "commonassets" / "brawler_effects" / args.brawler
    out_root.mkdir(parents=True, exist_ok=True)

    # Link to Remotion public dir
    try:
        public_link = (
            repo.parent
            / "remotion-composer"
            / "public"
            / "brawl"
            / "effects"
        )
        if public_link.is_symlink() or public_link.exists():
            pass
        elif public_link.parent.exists():
            import os
            rel = os.path.relpath(repo / "commonassets" / "brawler_effects", public_link.parent)
            public_link.symlink_to(rel, target_is_directory=True)
            print(f"Linked {public_link} -> {rel}")
    except Exception as e:
        print(f"Note: could not link Remotion public dir: {e}", file=sys.stderr)

    # Load SC6 file
    print(f"Loading {src}...")
    sc = SC6File(str(src))
    print(f"  Exports: {len(sc.exports)}")
    print(f"  Textures: {len(sc.textures)}")
    for i, tex in enumerate(sc.textures):
        print(f"    {i}: {tex.get('width')}x{tex.get('height')} "
              f"pixel_type={tex.get('pixel_type')}")

    textures = sc.decode_textures()
    print(f"  Decoded textures: {sum(1 for t in textures if t is not None)}/{len(textures)}")

    # Determine exports to extract
    if args.exports:
        exports = list(args.exports)
    else:
        # Default: extract the key attack/ultimate VFX parts
        exports = []
        for name in sorted(sc.exports.keys()):
            if any(skip in name for skip in ("_red", "_liquid", "_smoke", "_glass",
                                               "_trail", "_bullet")):
                continue
            # Only extract main effect parts
            if any(want in name for want in (
                "_atk_hit", "_atk_muzzle", "_atk_projectile", "_atk_reached",
                "_ulti_projectile", "_ulti_reached",
            )):
                exports.append(name)

    all_manifests = {}
    for name in exports:
        print(f"Rendering {name}...")
        frames, manifest = render_export_frames(sc, name, textures, args.scale)
        if frames is None or manifest is None:
            print(f"  skip: not an animated movie clip or render failed")
            continue
        part_dir = out_root / name
        part_dir.mkdir(parents=True, exist_ok=True)
        for i, frame in enumerate(frames):
            if frame is not None:
                frame.save(part_dir / f"frame_{i:04d}.png")
            else:
                # Empty frame - save a blank transparent canvas
                blank = Image.new("RGBA", (manifest["canvas"]["width"], manifest["canvas"]["height"]), (0, 0, 0, 0))
                blank.save(part_dir / f"frame_{i:04d}.png")
        (part_dir / "manifest.json").write_text(
            json.dumps(manifest, indent=2)
        )
        all_manifests[name] = manifest
        print(
            f"  -> {manifest['frameCount']} frames "
            f"{manifest['canvas']['width']}x{manifest['canvas']['height']}"
        )

    (out_root / "index.json").write_text(json.dumps(all_manifests, indent=2))
    print(f"\nDone. Output: {out_root}")
    print(f"Extracted {len(all_manifests)} effects")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())