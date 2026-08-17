#!/usr/bin/env python3
"""
Nemi Explains V14 — Dynamic BGM Story Arc & Master Audio Mixer
Applies narrative volume envelope automation to BGM:
- 0-4s (Hook): Energetic intro (vol: 0.32)
- 4-7.8s (Question): Subtle dip for question clarity (vol: 0.25)
- 7.8-13s (Binary): Steady build (vol: 0.32)
- 13-17.8s (Collision & Spark): High-energy swell (vol: 0.40)
- 17.8-22.2s (Payoff): Warm resolution (vol: 0.28)
Blended with dynamic sidechain ducking against master voice track.
"""

import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"

VOICE_TRACK = PUBLIC_SOUNDS / "nemi_v12_voice_track.mp3"
BGM_TRACK = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
OUTPUT_MASTER = PUBLIC_SOUNDS / "nemi_v14_master_audio.mp3"

def main():
    print("═" * 70)
    print("🎵  NEMI EXPLAINS V14 — DYNAMIC BGM STORY ARC AUDIO MIXER")
    print("═" * 70)

    if not VOICE_TRACK.exists():
        print(f"❌ Voice track not found: {VOICE_TRACK}")
        return False

    if not BGM_TRACK.exists():
        print(f"❌ BGM track not found: {BGM_TRACK}")
        return False

    # FFmpeg volume automation curve using volume filter expression:
    # t < 4.0: 0.32
    # 4.0 <= t < 7.8: 0.25
    # 7.8 <= t < 13.0: 0.32
    # 13.0 <= t < 17.8: 0.40
    # t >= 17.8: 0.28
    vol_expr = (
        "if(lt(t,4.0), 0.32, "
        "if(lt(t,7.8), 0.25, "
        "if(lt(t,13.0), 0.32, "
        "if(lt(t,17.8), 0.40, 0.28))))"
    )

    filter_complex = (
        f"[1:a]volume=eval=frame:volume='{vol_expr}'[bgm_curved];"
        "[bgm_curved][0:a]sidechaincompress=threshold=0.07:ratio=6:attack=20:release=250[bgm_ducked];"
        "[0:a][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=0[master_raw];"
        "[master_raw]loudnorm=I=-15.0:TP=-2.0:LRA=3.0[master]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-i", str(VOICE_TRACK),
        "-ss", "45", "-i", str(BGM_TRACK),
        "-filter_complex", filter_complex,
        "-map", "[master]",
        "-b:a", "192k",
        str(OUTPUT_MASTER)
    ]

    print("Mixing dynamic BGM envelope and voice track...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("❌ Error during mixing:")
        print(res.stderr)
        return False

    print(f"✅ V14 Master Audio created: {OUTPUT_MASTER}")
    return True

if __name__ == "__main__":
    main()
