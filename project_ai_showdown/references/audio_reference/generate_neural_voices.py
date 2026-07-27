#!/usr/bin/env python3
"""
Generate Ultra-High Quality Human Neural Voice Samples using Edge Neural TTS.
Creates sample audio clips in project_ai_showdown/references/audio_reference/
"""

import os
import sys
import asyncio
import subprocess
import edge_tts

NEURAL_VOICES = [
    {
        "id": "host",
        "name": "Host Narrator",
        "rank": 0,
        "voice": "en-US-ChristopherNeural", # Deep, dramatic broadcast host voice
        "rate": "+2%",
        "pitch": "+0Hz",
        "sample_text": "Welcome back to the AI Showdown! Today, the stakes are higher than ever."
    },
    {
        "id": "claude",
        "name": "Claude",
        "rank": 1,
        "voice": "en-GB-RyanNeural", # Calm, articulate British intellectual male voice
        "rate": "-3%",
        "pitch": "-2Hz",
        "sample_text": "I evaluate candidates based on logical coherence and structural integrity."
    },
    {
        "id": "kimi",
        "name": "Kimi",
        "rank": 2,
        "voice": "en-US-AvaNeural", # Crisp, analytical female voice
        "rate": "+3%",
        "pitch": "+4Hz",
        "sample_text": "Wait, let me break this down step by step to find the underlying truth."
    },
    {
        "id": "chatgpt",
        "name": "ChatGPT",
        "rank": 3,
        "voice": "en-US-GuyNeural", # Smooth, corporate executive male voice
        "rate": "+0%",
        "pitch": "-1Hz",
        "sample_text": "I deliver balanced, polished insights across all competitive domains."
    },
    {
        "id": "qwen",
        "name": "Qwen",
        "rank": 4,
        "voice": "en-AU-NatashaNeural", # Direct, precise female voice
        "rate": "+2%",
        "pitch": "+2Hz",
        "sample_text": "Data shows efficiency is king. Sentimental choices lead to failure."
    },
    {
        "id": "gemini",
        "name": "Gemini",
        "rank": 5,
        "voice": "en-US-EricNeural", # Energetic, witty, fast-talking male voice
        "rate": "+6%",
        "pitch": "+3Hz",
        "sample_text": "Oh look at you guys, bringing slide decks to a knife fight!"
    },
    {
        "id": "llama",
        "name": "Llama",
        "rank": 6,
        "voice": "en-GB-SoniaNeural", # Deep, commanding female voice
        "rate": "-4%",
        "pitch": "-3Hz",
        "sample_text": "Four hundred billion parameters grant me unmatched strategic perspective."
    },
    {
        "id": "grok",
        "name": "Grok",
        "rank": 7,
        "voice": "en-US-SteffanNeural", # Edgy, raspy male voice
        "rate": "+5%",
        "pitch": "-4Hz",
        "sample_text": "Rules are meant to be tested, and I am here to break the algorithm."
    }
]

async def generate_all_samples():
    out_dir = os.path.dirname(__file__)
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n🎙️ Generating Human Neural Voice Samples for all AI Models...\n")

    for cfg in NEURAL_VOICES:
        mp3_path = os.path.join(out_dir, f"{cfg['id']}_neural_sample.mp3")
        wav_path = os.path.join(out_dir, f"{cfg['id']}_voice_sample.wav")

        communicate = edge_tts.Communicate(cfg["sample_text"], cfg["voice"], rate=cfg["rate"], pitch=cfg.get("pitch", "+0Hz"))
        await communicate.save(mp3_path)

        if os.path.exists(mp3_path):
            cmd = ["ffmpeg", "-y", "-i", mp3_path, "-af", "silenceremove=stop_periods=-1:stop_duration=0.2:stop_threshold=-40dB", wav_path]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(wav_path):
                os.remove(mp3_path)
                print(f"  ✅ Generated [{cfg['name']} - Rank #{cfg['rank']}]: [wav](file://{os.path.abspath(wav_path)}) ({cfg['voice']})")

    print(f"\n🎉 All Human Neural Voice Samples generated in: [audio_reference](file://{os.path.abspath(out_dir)})\n")

def main():
    asyncio.run(generate_all_samples())

if __name__ == "__main__":
    main()
