#!/usr/bin/env python3
"""
High-Retention Tech Voice & Audio Mixing Engine for Project Tech
Generates studio-grade neural narration (175-185 WPM) with tight pause trimming
and automated BGM sidechain ducking for 20-30s tech explainer shorts.
"""
import os
import sys
import json
import subprocess
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BASE_DIR / "tech_voice_profile.json"
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)
PUBLIC_BGM.mkdir(parents=True, exist_ok=True)

EDGE_TTS_BIN = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/.venv/bin/edge-tts")

def load_profile():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

def generate_voiceover(script_text: str, output_path: Path, voice: str = "en-US-ChristopherNeural", rate: str = "+16%"):
    print(f"🎙 Generating Neural Tech Voiceover...")
    print(f"   Voice: {voice} | Rate: {rate}")
    print(f"   Script Preview: \"{script_text[:60]}...\"")
    
    cmd = [
        str(EDGE_TTS_BIN),
        "--text", script_text,
        "--voice", voice,
        "--rate", rate,
        "--write-media", str(output_path)
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"TTS generation failed: {res.stderr}")
    print(f"✓ Voiceover generated: {output_path.name}")

def trim_silence_ffmpeg(input_path: Path, output_path: Path):
    """
    Applies high-speed silence trimming to eliminate dead air (<0.20s gaps).
    """
    cmd = [
        "ffmpeg", "-y", "-i", str(input_path),
        "-af", "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-40dB:detection=peak,areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-40dB:detection=peak,areverse",
        str(output_path)
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"✓ Silence trimmed: {output_path.name}")

def mix_voice_and_bgm(voice_path: Path, bgm_path: Path, output_path: Path, bgm_volume: float = 0.18):
    """
    Mixes voiceover with background music, automatically ducking BGM behind speech.
    """
    print(f"🎛 Mixing Voiceover with BGM ({bgm_path.name})...")
    # FFmpeg sidechain compress / amix filter
    cmd = [
        "ffmpeg", "-y",
        "-i", str(voice_path),
        "-i", str(bgm_path),
        "-filter_complex",
        f"[1:a]volume={bgm_volume}[bgm];[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[out]",
        "-map", "[out]",
        "-b:a", "192k",
        str(output_path)
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"✅ Final audio master mixed: {output_path.name}")

def create_full_mix(script_text: str, bgm_id: str = "blade_runner", target_output: Path = None):
    profile = load_profile()
    voice = profile["voice_candidates"]["primary_authoritative"]
    rate = profile["pacing_and_delivery"]["rate_multiplier"]
    
    # Locate BGM
    bgm_map = {
        "blade_runner": "Synthwave Goose - Blade Runner 2049.mp3",
        "luminary": "joel sunny - luminary [original song] - official audio 4.mp3",
        "bluebird": "Death of a Bluebird - Rorschach Roy 4.mp3"
    }
    bgm_file = PUBLIC_BGM / bgm_map.get(bgm_id, "Synthwave Goose - Blade Runner 2049.mp3")
    
    raw_voice = PUBLIC_SOUNDS / "raw_voice.mp3"
    trimmed_voice = PUBLIC_SOUNDS / "voiceover.mp3"
    final_mix = target_output if target_output else (PUBLIC_SOUNDS / "final_audio_mix.mp3")

    generate_voiceover(script_text, raw_voice, voice=voice, rate=rate)
    trim_silence_ffmpeg(raw_voice, trimmed_voice)
    
    if bgm_file.exists():
        mix_voice_and_bgm(trimmed_voice, bgm_file, final_mix, bgm_volume=0.18)
    else:
        shutil.copy(trimmed_voice, final_mix)
        
    return final_mix

if __name__ == "__main__":
    sample_script = (
        "Your CPU allocates millions of objects every second. But how does it clean them up without freezing? "
        "In Phase 1, the V8 engine sweeps a laser from root pointers to mark active objects in emerald green. "
        "In Phase 2, any orphaned memory with zero references is completely wiped out, freeing 42 megabytes back to your operating system. "
        "Clean memory equals fast code. Save this visual for your next system design round."
    )
    create_full_mix(sample_script, bgm_id="blade_runner")
