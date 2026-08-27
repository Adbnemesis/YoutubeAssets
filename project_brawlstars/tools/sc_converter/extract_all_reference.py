#!/usr/bin/env python3
"""Re-extract ALL brawler effects using the sc-editor reference renderer.

The Python software rasterizer produces wrong colors (grey/red instead of
mint/teal) because it doesn't match the game's OpenGL compositing pipeline.
This script uses the Java sc-editor renderer (which renders via JOGL/OpenGL)
to produce game-accurate frame PNGs.

Usage:
    python extract_all_reference.py --brawler gale
    python extract_all_reference.py --brawler gale ash kit
    python extract_all_reference.py --brawler gale --scale 4
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def get_java_home() -> str | None:
    """Find JDK 17 via brew."""
    try:
        result = subprocess.run(
            ["brew", "--prefix", "openjdk@17"],
            capture_output=True, text=True, check=True,
        )
        prefix = result.stdout.strip()
        jh = Path(prefix) / "libexec" / "openjdk.jdk" / "Contents" / "Home"
        if (jh / "bin" / "java").exists():
            return str(jh)
    except Exception:
        pass
    # Try /usr/libexec/java_home
    try:
        result = subprocess.run(
            ["/usr/libexec/java_home", "-v", "17"],
            capture_output=True, text=True, check=True,
        )
        return result.stdout.strip()
    except Exception:
        pass
    return os.environ.get("JAVA_HOME")


def list_exports(sc_path: Path) -> list[str]:
    """Get all export names from an .sc file using our Python parser."""
    sys.path.insert(0, str(Path(__file__).parent))
    from sc6_parser import SC6File
    sc = SC6File(str(sc_path))
    return sorted(sc.exports.keys())


def render_with_reference(
    java_home: str,
    sc_path: Path,
    out_dir: Path,
    scale: int,
    exports: list[str],
) -> dict[str, bool]:
    """Render exports using the Java sc-editor reference renderer.
    
    Returns dict of export_name -> success bool.
    """
    here = Path(__file__).resolve().parent
    ref_dir = here / "reference_renderer"
    jars_dir = ref_dir / "jars"
    batch_src = ref_dir / "BatchRender.java"
    
    if not jars_dir.exists() or not batch_src.exists():
        raise FileNotFoundError(f"Reference renderer not found at {ref_dir}")
    
    java_bin = str(Path(java_home) / "bin" / "java")
    javac_bin = str(Path(java_home) / "bin" / "javac")
    
    # Compile BatchRender.java
    cls_dir = Path(tempfile.mkdtemp(prefix="sc_batch_"))
    cp = f"{jars_dir / '*'}"
    
    print(f"Compiling BatchRender.java...")
    subprocess.run(
        [javac_bin, "-cp", cp, "-d", str(cls_dir), str(batch_src)],
        check=True,
        capture_output=True,
    )
    
    # Run BatchRender with all exports at once
    tmp_out = Path(tempfile.mkdtemp(prefix="sc_ref_out_"))
    
    # Build environment with KTX tools on PATH
    # sc-editor's KhronosToolTextureLoader calls ktx2ktx2 and ktx via
    # SystemUtils.runProcess(), which looks them up on PATH.
    ktx_bin = ref_dir / "vendor" / "ktx" / "bin"
    env = os.environ.copy()
    env["JAVA_HOME"] = java_home
    if ktx_bin.exists():
        env["PATH"] = f"{ktx_bin}:{env.get('PATH', '')}"
        env["DYLD_LIBRARY_PATH"] = f"{ktx_bin}:{env.get('DYLD_LIBRARY_PATH', '')}"
        print(f"KTX tools dir: {ktx_bin}")
    
    cmd = [
        java_bin,
        "--enable-native-access=ALL-UNNAMED",
        "--add-exports", "java.base/java.lang=ALL-UNNAMED",
        "--add-exports", "java.desktop/sun.awt=ALL-UNNAMED",
        "--add-exports", "java.desktop/sun.java2d=ALL-UNNAMED",
        "-Dorg.slf4j.simpleLogger.defaultLogLevel=WARN",
        "-cp", f"{cls_dir}:{cp}",
        "BatchRender",
        str(sc_path),
        str(tmp_out),
        str(scale),
        *exports,
    ]
    
    print(f"Running reference renderer for {len(exports)} exports...")
    result = subprocess.run(cmd, capture_output=True, text=True, env=env)
    print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    
    # Check which exports succeeded
    results: dict[str, bool] = {}
    for export_name in exports:
        export_dir = tmp_out / export_name
        frames = sorted(export_dir.glob("frame_*.png")) if export_dir.exists() else []
        
        if frames:
            # Move frames to the final output directory
            final_dir = out_dir / export_name
            final_dir.mkdir(parents=True, exist_ok=True)
            
            # Clear existing frames
            for old in final_dir.glob("frame_*.png"):
                old.unlink()
            
            for f in frames:
                shutil.copy2(f, final_dir / f.name)
            
            # Generate manifest from the rendered frames
            generate_manifest(final_dir, export_name, scale)
            results[export_name] = True
            print(f"  ✓ {export_name}: {len(frames)} frames")
        else:
            results[export_name] = False
            print(f"  ✗ {export_name}: no frames rendered")
    
    # Cleanup
    shutil.rmtree(cls_dir, ignore_errors=True)
    shutil.rmtree(tmp_out, ignore_errors=True)
    
    return results


def generate_manifest(frame_dir: Path, export_name: str, scale: int) -> None:
    """Generate manifest.json from rendered frame PNGs."""
    from PIL import Image
    
    frames = sorted(frame_dir.glob("frame_*.png"))
    if not frames:
        return
    
    # Find union bounds across all frames
    frame_data = []
    max_w = 0
    max_h = 0
    
    for f in frames:
        img = Image.open(f)
        w, h = img.size
        max_w = max(max_w, w)
        max_h = max(max_h, h)
        
        # Find non-transparent bounding box
        bbox = img.getbbox()
        if bbox:
            frame_data.append({
                "x": bbox[0],
                "y": bbox[1],
                "w": bbox[2] - bbox[0],
                "h": bbox[3] - bbox[1],
            })
        else:
            frame_data.append({
                "x": 0, "y": 0,
                "w": w, "h": h,
            })
    
    # All reference-rendered frames should have the same canvas size
    # (BatchRender uses calculateBoundsForAllFrames)
    manifest = {
        "name": export_name,
        "frameCount": len(frames),
        "canvas": {"width": max_w, "height": max_h},
        "anchor": {"x": max_w // 2, "y": max_h // 2},
        "scale": scale,
        "frames": frame_data,
    }
    
    (frame_dir / "manifest.json").write_text(json.dumps(manifest, indent=2))


def fallback_python_render(
    sc_path: Path,
    out_dir: Path,
    scale: int,
    exports: list[str],
) -> dict[str, bool]:
    """Render exports using the Python extractor (fallback)."""
    sys.path.insert(0, str(Path(__file__).parent))
    from sc6_parser import SC6File
    
    sc = SC6File(str(sc_path))
    textures = sc.decode_textures()
    
    # Import the render function from extract_effects_v6
    from extract_effects_v6 import render_export_frames
    from PIL import Image
    
    results: dict[str, bool] = {}
    for name in exports:
        frames, manifest = render_export_frames(sc, name, textures, scale)
        if frames is None or manifest is None:
            results[name] = False
            print(f"  ✗ {name}: Python render failed")
            continue
        
        part_dir = out_dir / name
        part_dir.mkdir(parents=True, exist_ok=True)
        
        for i, frame in enumerate(frames):
            if frame is not None:
                frame.save(part_dir / f"frame_{i:04d}.png")
            else:
                blank = Image.new("RGBA",
                    (manifest["canvas"]["width"], manifest["canvas"]["height"]),
                    (0, 0, 0, 0))
                blank.save(part_dir / f"frame_{i:04d}.png")
        
        (part_dir / "manifest.json").write_text(json.dumps(manifest, indent=2))
        results[name] = True
        print(f"  ✓ {name}: {manifest['frameCount']} frames (Python)")
    
    return results


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--brawler", nargs="+", required=True,
                    help="brawler id(s), e.g. gale ash kit")
    ap.add_argument("--scale", type=int, default=4,
                    help="pixel scale factor (default 4)")
    ap.add_argument("--skip-red", action="store_true",
                    help="skip _red variants")
    ap.add_argument("--skip-lobby", action="store_true", default=True,
                    help="skip lobby_ exports (default: True)")
    ap.add_argument("--force-python", action="store_true",
                    help="use Python renderer instead of reference")
    args = ap.parse_args()
    
    repo = Path(__file__).resolve().parents[2]
    
    # Find Java
    java_home = None if args.force_python else get_java_home()
    if java_home:
        print(f"Using JDK at: {java_home}")
    else:
        print("WARNING: JDK 17 not found, falling back to Python renderer")
    
    for brawler in args.brawler:
        sc_path = repo / "commonassets" / "brawler_effects" / f"effects_brawler_{brawler}.sc"
        if not sc_path.exists():
            print(f"ERROR: {sc_path} not found", file=sys.stderr)
            continue
        
        out_root = repo / "commonassets" / "brawler_effects" / brawler
        out_root.mkdir(parents=True, exist_ok=True)
        
        # Get all exports
        all_exports = list_exports(sc_path)
        
        # Filter
        exports = []
        for name in all_exports:
            if args.skip_red and name.endswith("_red"):
                continue
            if args.skip_lobby and "lobby_" in name:
                continue
            if name in ("shadow_normal_circle", "shadow_normal_circle_big",
                        "gen_particle_empty", "test"):
                continue
            exports.append(name)
        
        print(f"\n{'='*60}")
        print(f"Extracting {brawler.upper()} — {len(exports)} exports at {args.scale}x")
        print(f"{'='*60}")
        
        if java_home and not args.force_python:
            results = render_with_reference(
                java_home, sc_path, out_root, args.scale, exports
            )
            
            # Retry failed exports with Python renderer
            failed = [name for name, ok in results.items() if not ok]
            if failed:
                print(f"\nRetrying {len(failed)} failed exports with Python renderer...")
                fallback_python_render(sc_path, out_root, args.scale, failed)
        else:
            fallback_python_render(sc_path, out_root, args.scale, exports)
        
        # Write combined index.json
        all_manifests = {}
        for name in exports:
            manifest_path = out_root / name / "manifest.json"
            if manifest_path.exists():
                all_manifests[name] = json.loads(manifest_path.read_text())
        
        (out_root / "index.json").write_text(json.dumps(all_manifests, indent=2))
        print(f"\n✓ {brawler}: {len(all_manifests)} effects extracted to {out_root}")
    
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
