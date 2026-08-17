#!/usr/bin/env python3
"""
Nemi Explains — Master BGM & Audio Mixer for Debut Reel #1: CAPTCHA (Sample-Accurate)
Implements automated BGM story arc envelope and sidechain ducking
against the master voice track, outputting a broadcast-normalized MP3.
"""

import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"

VOICE_PATH = PUBLIC_SOUNDS / "captcha_voice_track.mp3"
BGM_PATH = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
OUTPUT_PATH = PUBLIC_SOUNDS / "captcha_master_audio.mp3"

def get_duration(p: Path) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(p)
    ]
    return float(subprocess.check_output(cmd).decode().strip())

def main():
    print("═" * 60)
    print("🎛 MIXING MASTER CAPTCHA AUDIO (SAMPLE-ACCURATE STORY ARC)")
    print("═" * 60)

    duration = get_duration(VOICE_PATH)
    print(f"Voice track duration: {duration:.2f}s")

    # Volume curve across narrative stages:
    # 0.0 - 2.9s: 0.32 (Hook)
    # 2.9 - 8.9s: 0.25 (Bot Speed / Denial)
    # 8.9 - 22.6s: 0.32 (Trajectory & Kinematics)
    # 22.6 - 32.4s: 0.40 (Biometrics & 8-12Hz Jitter Swell)
    # 32.4 - end: 0.28 (Resolution Payoff)
    bgm_volume_expr = (
        "volume='if(between(t,0,2.9), 0.32, "
        "if(between(t,2.9,8.9), 0.25, "
        "if(between(t,8.9,22.6), 0.32, "
        "if(between(t,22.6,32.4), 0.40, 0.28))))':eval=frame"
    )

    filter_complex = (
        f"[1:a]aloop=loop=-1:size=2e+09,{bgm_volume_expr},atrim=0:{duration},afade=t=out:st={duration-1.0}:d=1.0[bgm];"
        f"[bgm][0:a]sidechaincompress=threshold=0.08:ratio=8:attack=15:release=200[ducked_bgm];"
        f"[ducked_bgm][0:a]amix=inputs=2:duration=first:dropout_transition=0,"
        f"loudnorm=I=-16.0:TP=-1.5:LRA=7.0[out]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-i", str(VOICE_PATH),
        "-i", str(BGM_PATH),
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        str(OUTPUT_PATH)
    ]

    print("Running ffmpeg mix & loudnorm broadcast normalization...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"❌ Error mixing audio: {res.stderr}")
        sys.exit(1)

    print(f"✅ Master mixed audio exported to: {OUTPUT_PATH}")

    # Inspect loudness
    verify_cmd = [
        "ffmpeg", "-i", str(OUTPUT_PATH),
        "-af", "loudnorm=print_format=json",
        "-f", "null", "-"
    ]
    res_v = subprocess.run(verify_cmd, capture_output=True, text=True)
    print("\n📊 Broadcast Loudness Metrics:")
    for line in res_v.stderr.splitlines()[-12:]:
        print(line)

if __name__ == "__main__":
    main()
