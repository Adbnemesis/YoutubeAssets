#!/usr/bin/env python3
"""Extract Supercell .sc brawler effect parts to aligned PNG sequences.

For a brawler like ``gale`` it reads ``commonassets/brawler_effects/effects_brawler_gale.sc``
and renders each requested export (projectile, hit, muzzle, ...) frame by frame to
``commonassets/brawler_effects/<brawler>/<export>/frame_%04d.png``.

All frames of one export are composited onto a shared union canvas so they can be
played as an aligned animation, and a ``manifest.json`` records canvas size, the
effect anchor point, and per-frame timing. Reusable for any brawler — just drop
``effects_brawler_<name>.sc`` into ``commonassets/brawler_effects/``.

Usage:
    python tools/sc_converter/extract_effects.py --brawler gale
    python tools/sc_converter/extract_effects.py --brawler gale --exports atk_projectile ulti_projectile --scale 6
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image


def load_parser():
    from sc5_parser.parser import SC5File
    return SC5File


def decode_textures(sc) -> list:
    """Return PIL images for each texture (embedded KTX/ASTC or raw pixel data)."""
    from sc5_parser.sctx import decode_pixel_data, decode_ktx_embedded
    images = []
    for tex in sc.textures:
        data = tex.get("data")
        if not data:
            images.append(None)
            continue
        if data[:4] == b"\xabKTX":
            images.append(decode_ktx_embedded(data, tex["width"], tex["height"]))
        else:
            images.append(
                decode_pixel_data(data, tex["width"], tex["height"], tex["pixel_type"])
            )
    return images


def render_export_frames(sc, name: str, textures: list, scale: int):
    """Render every frame of *name* onto a shared union canvas.

    Returns (frames, manifest) where frames is a list of RGBA PIL Images all the
    same size, and manifest holds canvas + anchor + per-frame bounds.
    """
    info = sc.get_export_frame_info(name)
    if info is None:
        return None, None
    count = info["frame_count"]

    rendered = []
    for fi in range(count):
        result = sc.extract_sprite_with_offset(
            name, textures, frame_index=fi
        )
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
        help="effect export names to extract (default: a sensible set for the tier shorts)",
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

    out_root = repo / "commonassets" / "brawler_effects" / args.brawler
    out_root.mkdir(parents=True, exist_ok=True)

    # Remotion serves static files from remotion-composer/public. Link the whole
    # brawler_effects dir in so `brawl/effects/...` resolves — keeps the source of
    # truth inside project_brawlstars and stays valid for every brawler we add.
    try:
        public_link = (
            repo.parent
            / "remotion-composer"
            / "public"
            / "brawl"
            / "effects"
        )
        if public_link.is_symlink() or public_link.exists():
            if not public_link.is_symlink():
                print(
                    f"WARNING: {public_link} exists but is not a symlink; "
                    "remove it manually if you want auto-link.",
                    file=sys.stderr,
                )
        elif public_link.parent.exists():
            target = repo / "commonassets" / "brawler_effects"
            import os
            rel = os.path.relpath(target, public_link.parent)
            public_link.symlink_to(rel, target_is_directory=True)
            print(f"Linked {public_link} -> {rel}")
    except Exception as e:  # non-fatal
        print(f"Note: could not link Remotion public dir: {e}", file=sys.stderr)

    SC5File = load_parser()
    sc = SC5File(str(src))
    textures = decode_textures(sc)

    if args.exports:
        exports = list(args.exports)
    else:
        exports = sorted(
            name for name in sc.exports
            if not name.endswith("_red")
            and not any(skip in name for skip in (
                "_liquid", "_smoke", "_glass", "_hit_", "muzzle", "trail",
                "_reached", "lobby_", "bullet_", "_red",
            ))
        )

    all_manifests = {}
    for name in exports:
        print(f"Rendering {name}...", flush=True)
        frames, manifest = render_export_frames(sc, name, textures, args.scale)
        if frames is None or manifest is None:
            print(f"  skip: not an animated movie clip")
            continue
        part_dir = out_root / name
        part_dir.mkdir(parents=True, exist_ok=True)
        for i, frame in enumerate(frames):
            if frame is not None:
                frame.save(part_dir / f"frame_{i:04d}.png")
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
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
