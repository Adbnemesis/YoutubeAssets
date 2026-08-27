#!/usr/bin/env python3
"""Render Supercell effect exports to aligned frame PNGs using the official
sc-editor Java renderer (github.com/danila-schelkov/sc-editor).

The sc5/sc6 Python decoder in this directory decodes the flatbuffer data
identically to sc-editor (verified by dumping color/matrix banks), but its
software rasterizer renders colors/geometry differently from the game's
OpenGL pipeline. For ground-truth frames, this script drives sc-editor's own
renderer instead.

Prerequisites (one-time setup on macOS):
    brew install openjdk@17 flatbuffers
    (KTX-Software tools ktx + ktx2ktx2 must be on PATH; extracted from
     https://github.com/KhronosGroup/KTX-Software/releases -Darwin-arm64.pkg)
    JDK17 must be active (JAVA_HOME=/opt/homebrew/opt/openjdk@17)

Build sc-editor + its deps (dev.donutquine:sc-file/supercell-swf/
supercell-texture) from source into ~/.m2 and target/, then set SC_EDITOR_JAR
and SC_EDITOR_LIBS to the jar + libs dir. See README.md in this folder.

Usage:
    render_frames.py <input.sc> <out_dir> <pixel_scale> <export> [<export>...]
"""
from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from pathlib import Path

JAVA = os.environ.get("JAVA_HOME", "")
JAVA_BIN = str(Path(JAVA) / "bin" / "java") if JAVA else "java"

_HERE = Path(__file__).resolve().parent
SC_EDITOR_JAR = os.environ.get(
    "SC_EDITOR_JAR",
    str(_HERE / "jars" / "sc-editor-1.0.0.jar"),
)
SC_EDITOR_LIBS = os.environ.get(
    "SC_EDITOR_LIBS",
    str(_HERE / "jars" / "*"),
)
BATCH_SRC = _HERE / "BatchRender.java"


def main() -> int:
    if len(sys.argv) < 5:
        print(__doc__)
        return 2
    sc_path, out_dir, pixel_scale = sys.argv[1], sys.argv[2], sys.argv[3]
    exports = sys.argv[4:]

    cls_dir = Path(tempfile.mkdtemp(prefix="sc_batch_"))
    cp = f"{SC_EDITOR_JAR}:{SC_EDITOR_LIBS}"
    subprocess.run(
        ["javac", "-cp", cp, "-d", str(cls_dir), str(BATCH_SRC)],
        check=True,
    )

    cmd = [
        JAVA_BIN,
        "--enable-native-access=ALL-UNNAMED",
        "--add-exports", "java.base/java.lang=ALL-UNNAMED",
        "--add-exports", "java.desktop/sun.awt=ALL-UNNAMED",
        "--add-exports", "java.desktop/sun.java2d=ALL-UNNAMED",
        "-Dorg.slf4j.simpleLogger.defaultLogLevel=WARN",
        "-cp", f"{cls_dir}:{cp}",
        "BatchRender", sc_path, out_dir, pixel_scale, *exports,
    ]
    subprocess.run(cmd, check=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
