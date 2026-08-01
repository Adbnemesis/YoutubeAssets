#!/usr/bin/env python3
"""
Generate Human Neural Voice Audio Clips with Automatic Pause Trimming!
Trims long silence gaps after sentence ends so speech is fast-paced and natural!
"""

import os
import sys
import json
import asyncio
import argparse
import subprocess
import edge_tts

NEURAL_VOICE_CONFIGS = {
    "host": {"voice": "en-US-ChristopherNeural", "rate": "+2%", "pitch": "+0Hz"},
    "narrator": {"voice": "en-US-ChristopherNeural", "rate": "+2%", "pitch": "+0Hz"},
    "police": {"voice": "en-US-AndrewNeural", "rate": "+3%", "pitch": "-2Hz"},
    "police detective": {"voice": "en-US-AndrewNeural", "rate": "+3%", "pitch": "-2Hz"},
    "claude": {"voice": "en-GB-RyanNeural", "rate": "-3%", "pitch": "-2Hz"},
    "kimi": {"voice": "en-US-AvaNeural", "rate": "+3%", "pitch": "+4Hz"},
    "chatgpt": {"voice": "en-US-GuyNeural", "rate": "+0%", "pitch": "-1Hz"},
    "qwen": {"voice": "en-AU-NatashaNeural", "rate": "+2%", "pitch": "+2Hz"},
    "gemini": {"voice": "en-US-EricNeural", "rate": "+6%", "pitch": "+3Hz"},
    "llama": {"voice": "en-GB-SoniaNeural", "rate": "-4%", "pitch": "-3Hz"},
    "grok": {"voice": "en-US-SteffanNeural", "rate": "+5%", "pitch": "-4Hz"}
}

def trim_audio_silence(mp3_path: str, wav_path: str):
    """
    Trims long silence gaps between sentences down to a crisp 0.2s pause using FFmpeg!
    """
    cmd = [
        "ffmpeg", "-y", "-i", mp3_path,
        "-af", "silenceremove=stop_periods=-1:stop_duration=0.2:stop_threshold=-40dB",
        wav_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

async def generate_audio_async(ep_dir: str):
    script_json_path = os.path.join(ep_dir, "script.json")
    if not os.path.exists(script_json_path):
        print(f"❌ Error: script.json not found in {ep_dir}")
        sys.exit(1)

    with open(script_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    audio_dir = os.path.join(ep_dir, "audio")
    os.makedirs(audio_dir, exist_ok=True)

    transcript = data.get("transcript", [])

    print(f"\n🎙️ Rendering & Pause-Trimming Neural Audio Clips...\n")

    # 1. Generate Character Speech Clips
    for turn in transcript:
        turn_num = turn["turn"]
        speaker = turn["speaker"]
        speaker_id = speaker.lower()
        speech = turn["text"]

        v_cfg = NEURAL_VOICE_CONFIGS.get(speaker_id, NEURAL_VOICE_CONFIGS["claude"])

        file_basename = f"turn_{turn_num:02d}_{speaker_id}"
        mp3_path = os.path.join(audio_dir, f"{file_basename}.mp3")
        wav_path = os.path.join(audio_dir, f"{file_basename}.wav")

        comm = edge_tts.Communicate(speech, v_cfg["voice"], rate=v_cfg["rate"], pitch=v_cfg.get("pitch", "+0Hz"))
        await comm.save(mp3_path)

        if os.path.exists(mp3_path):
            trim_audio_silence(mp3_path, wav_path)
            if os.path.exists(wav_path):
                os.remove(mp3_path)
                print(f"  ✅ Turn {turn_num:02d} [{speaker}]: [wav](file://{os.path.abspath(wav_path)}) (Trimmed)")

    print(f"\n🎉 Pause-trimmed Neural Audio generation completed for Episode!\n")

def main():
    parser = argparse.ArgumentParser(description="Generate human neural voice clips with pause trimming.")
    parser.add_argument("--ep-dir", type=str, default="project_ai_showdown/episodes/ep01_can_ai_achieve_agi", help="Path to episode folder")
    args = parser.parse_args()

    asyncio.run(generate_audio_async(args.ep_dir))

if __name__ == "__main__":
    main()
