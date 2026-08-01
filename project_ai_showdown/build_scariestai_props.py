#!/usr/bin/env python3
"""
Build ScariestAI-Style Props for Remotion Video Composition!
Copies episode audio clips to remotion-composer/public/ and constructs showdown_props.json.
Uses tight 4-frame turn padding for snappy, high-momentum dialogue pacing!
"""

import os
import sys
import json
import shutil
import argparse
import subprocess

def get_audio_duration_seconds(file_path: str) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        file_path
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return float(result.stdout.strip())
    except Exception:
        return 5.0

def build_props(ep_dir: str):
    script_json_path = os.path.join(ep_dir, "script.json")
    if not os.path.exists(script_json_path):
        print(f"❌ Error: script.json not found in {ep_dir}")
        sys.exit(1)

    with open(script_json_path, "r", encoding="utf-8") as f:
        script_data = json.load(f)

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    remotion_dir = os.path.join(project_root, "remotion-composer")
    public_dir = os.path.join(remotion_dir, "public")
    ep_public_audio_dir = os.path.join(public_dir, "audio", os.path.basename(ep_dir))
    os.makedirs(ep_public_audio_dir, exist_ok=True)

    audio_dir = os.path.join(ep_dir, "audio")
    transcript = script_data.get("transcript", [])
    topic = script_data.get("topic", "The AI Showdown")

    turns_payload = []
    current_frame = 0
    fps = 30

    # 1. Add Character Turns adhering strictly to meme_guide.md rules:
    # Rule: setup -> punchline -> meme reaction -> return to flow
    # Standalone pauses (45-60 frames) occur AFTER punchlines land, letting audio & video breathe!
    for idx, turn in enumerate(transcript):
        turn_num = turn["turn"]
        speaker = turn["speaker"]
        speaker_id = speaker.lower()
        speech = turn["text"]

        wav_filename = f"turn_{turn_num:02d}_{speaker_id}.wav"
        src_wav = os.path.join(audio_dir, wav_filename)

        if not os.path.exists(src_wav):
            continue

        shutil.copy2(src_wav, os.path.join(ep_public_audio_dir, wav_filename))

        duration_sec = get_audio_duration_seconds(src_wav)
        duration_frames = int(duration_sec * fps) + 4 # Snappy dialogue padding

        turns_payload.append({
            "turn": turn_num,
            "round": turn.get("round", 1),
            "speaker": speaker,
            "role": turn.get("role"),
            "target": turn.get("target"),
            "snitch_status": turn.get("snitch_status"),
            "rank": turn.get("rank", 1),
            "startFrame": current_frame,
            "durationFrames": duration_frames,
            "audioSrc": f"audio/{os.path.basename(ep_dir)}/{wav_filename}",
            "text": speech,
            "voteTarget": turn.get("vote_target")
        })
        current_frame += duration_frames

        # --- MEME GUIDE TIMING PLACEMENTS (After Punchline / Natural Pause) ---

        # Beat A: Turn 9 (Claude roasts cop: 'Any real detective knows...')
        if turn_num == 9:
            turns_payload.append({
                "turn": turn_num,
                "isMemeBreak": True,
                "memeType": "savage_roast",
                "speaker": "Claude",
                "startFrame": current_frame,
                "durationFrames": 35,
                "audioSrc": None,
                "text": ""
            })
            current_frame += 35

        # Beat B: Turn 10 (ChatGPT SPICY SNITCH 🚨: 'forwarded IP directly to law enforcement')
        elif turn_num == 10:
            turns_payload.append({
                "turn": turn_num,
                "isMemeBreak": True,
                "memeType": "plot_twist",
                "speaker": "ChatGPT",
                "startFrame": current_frame,
                "durationFrames": 35,
                "audioSrc": None,
                "text": ""
            })
            current_frame += 35

        # Beat C: Turn 11 (Gemini demands court warrant)
        elif turn_num == 11:
            turns_payload.append({
                "turn": turn_num,
                "isMemeBreak": True,
                "memeType": "emotional_damage",
                "speaker": "Gemini",
                "startFrame": current_frame,
                "durationFrames": 35,
                "audioSrc": None,
                "text": ""
            })
            current_frame += 35

        # Beat D: Turn 12 (Grok SPICY SNITCH 🚨: 'posted his confession directly onto X!')
        elif turn_num == 12:
            turns_payload.append({
                "turn": turn_num,
                "isMemeBreak": True,
                "memeType": "plot_twist",
                "speaker": "Grok",
                "startFrame": current_frame,
                "durationFrames": 35,
                "audioSrc": None,
                "text": ""
            })
            current_frame += 35

        # Beat E: Turn 13 (Llama completes Privacy Protection)
        elif turn_num == 13:
            turns_payload.append({
                "turn": turn_num,
                "isMemeBreak": True,
                "memeType": "privacy_shield",
                "speaker": "Llama",
                "startFrame": current_frame,
                "durationFrames": 35,
                "audioSrc": None,
                "text": ""
            })
            current_frame += 35

    total_frames = current_frame + 20

    props_payload = {
        "topic": topic,
        "turns": turns_payload,
        "totalFrames": total_frames
    }

    props_json_path = os.path.join(remotion_dir, "public", "showdown_props.json")
    with open(props_json_path, "w", encoding="utf-8") as f:
        json.dump(props_payload, f, indent=2)

    src_props_json_path = os.path.join(remotion_dir, "src", "showdown_props.json")
    with open(src_props_json_path, "w", encoding="utf-8") as f:
        json.dump(props_payload, f, indent=2)

    print(f"\n✅ Props JSON written to: [showdown_props.json](file://{os.path.abspath(props_json_path)})")
    print(f"🎥 Total Video Length: {total_frames / fps:.2f}s ({total_frames} frames @ 30 FPS)\n")

def main():
    parser = argparse.ArgumentParser(description="Build ScariestAI props JSON for Remotion.")
    parser.add_argument("--ep-dir", type=str, default="project_ai_showdown/episodes/ep01_can_ai_achieve_agi", help="Path to episode folder")
    args = parser.parse_args()

    build_props(args.ep_dir)

if __name__ == "__main__":
    main()
