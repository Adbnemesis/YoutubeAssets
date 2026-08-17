#!/usr/bin/env python3
"""
Nemi Explains V3 Voice & Audio Synthesis Pipeline (Optimized 28s Pace)
Generates high-retention neural narration, pauses for Nemi dialogue beats,
stitches master audio, and exports JSON cue timestamps for Remotion synchronization.
"""

import json
import subprocess
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)

EDGE_TTS_BIN = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/.venv/bin/edge-tts")

VOICE = "en-US-ChristopherNeural"
RATE = "+18%"

SEGMENTS = [
    {
        "id": "act1_mess",
        "text": "Your JavaScript keeps creating objects... and some of them become useless.",
        "pre_delay_ms": 100,
        "nemi_reaction": "...that's a lot",
        "nemi_pose": "shocked"
    },
    {
        "id": "act2_question",
        "text": "So why doesn't your memory just fill up? Who cleans this mess?",
        "pre_delay_ms": 250,
        "nemi_reaction": "who gets deleted?",
        "nemi_pose": "puzzled"
    },
    {
        "id": "act3_predict",
        "text": "Which ones do you think survive?",
        "pre_delay_ms": 200,
        "nemi_reaction": "",
        "nemi_pose": "thinking"
    },
    {
        "id": "act4_investigate",
        "text": "V8 starts from the roots. Reachable objects stay. Unreachable?",
        "pre_delay_ms": 700, # pause for viewer prediction
        "nemi_reaction": "",
        "nemi_pose": "thinking"
    },
    {
        "id": "act5_surprise",
        "text": "Not so fast.",
        "pre_delay_ms": 500, # Nemi says "That one's dead!"
        "nemi_reaction": "that one's dead!",
        "nemi_reaction_after": "Oh! It's alive!",
        "nemi_pose": "aha"
    },
    {
        "id": "act6_delete",
        "text": "Anything unreachable can go.",
        "pre_delay_ms": 400,
        "nemi_reaction": "bye!",
        "nemi_pose": "aha"
    },
    {
        "id": "act7_compact",
        "text": "Then remaining memory is compacted.",
        "pre_delay_ms": 350,
        "nemi_reaction": "",
        "nemi_pose": "smug"
    },
    {
        "id": "act8_payoff",
        "text": "Garbage collection isn't magic. It finds what's alive... and clears the rest.",
        "pre_delay_ms": 400,
        "nemi_reaction": "much better.",
        "nemi_pose": "smug"
    }
]

def get_duration(audio_path: Path) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(audio_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def generate_segment_audio(seg, temp_dir: Path):
    out_file = temp_dir / f"{seg['id']}.mp3"
    cmd = [
        str(EDGE_TTS_BIN),
        "--text", seg["text"],
        "--voice", VOICE,
        "--rate", RATE,
        "--write-media", str(out_file)
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    return out_file

def main():
    print("🎙 Generating V3 Story Narration Segments...")
    temp_dir = PUBLIC_SOUNDS / "v3_segments"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    timing_data = []
    current_time_ms = 0
    
    audio_inputs = []
    filter_complex_parts = []
    
    input_idx = 0
    for seg in SEGMENTS:
        seg_file = generate_segment_audio(seg, temp_dir)
        dur = get_duration(seg_file)
        
        pre_delay = seg["pre_delay_ms"]
        start_time_ms = current_time_ms + pre_delay
        end_time_ms = start_time_ms + int(dur * 1000)
        
        start_frame = int((start_time_ms / 1000.0) * 30)
        end_frame = int((end_time_ms / 1000.0) * 30)
        
        timing_data.append({
            "id": seg["id"],
            "text": seg["text"],
            "start_time_ms": start_time_ms,
            "end_time_ms": end_time_ms,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "duration_s": dur,
            "nemi_reaction": seg.get("nemi_reaction", ""),
            "nemi_reaction_after": seg.get("nemi_reaction_after", ""),
            "nemi_pose": seg.get("nemi_pose", "thinking")
        })
        
        audio_inputs.extend(["-i", str(seg_file)])
        filter_complex_parts.append(f"[{input_idx}:a]adelay={start_time_ms}|{start_time_ms}[a{input_idx}]")
        input_idx += 1
        
        current_time_ms = end_time_ms
    
    total_voice_duration = current_time_ms / 1000.0
    total_video_duration = total_voice_duration + 2.0 # brand outro + loop hook
    total_frames = int(total_video_duration * 30)
    
    print(f"⏱ Total Voice Duration: {total_voice_duration:.2f}s ({total_frames} frames @ 30fps)")
    
    # Merge voice segments into single aligned voice track
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    filter_complex = f"{';'.join(filter_complex_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0[voiceout]"
    
    voice_track = PUBLIC_SOUNDS / "nemi_v3_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", filter_complex, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✓ Voice track merged: {voice_track.name}")
    
    # Mix with Blade Runner 2049 BGM ducked at 14% volume
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v3_master_audio.mp3"
    
    if bgm_file.exists():
        mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(voice_track),
            "-ss", "45", "-i", str(bgm_file),
            "-filter_complex",
            "[1:a]volume=0.14[bgm];[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[master]",
            "-map", "[master]",
            "-b:a", "192k",
            str(final_master)
        ]
        subprocess.run(mix_cmd, check=True, capture_output=True)
        print(f"✅ Master audio mixed with BGM: {final_master.name}")
    else:
        import shutil
        shutil.copy(voice_track, final_master)
    
    # Save timing metadata for Remotion
    metadata = {
        "total_duration_s": total_video_duration,
        "total_frames": total_frames,
        "fps": 30,
        "segments": timing_data
    }
    timing_json_path = BASE_DIR / "src" / "data" / "nemi_v3_cues.json"
    timing_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(timing_json_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"📄 Saved cue timing data to {timing_json_path}")
    
    with open(PUBLIC_SOUNDS / "nemi_v3_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

if __name__ == "__main__":
    main()
