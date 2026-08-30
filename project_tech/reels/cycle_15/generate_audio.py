#!/usr/bin/env python3
"""
Nemi Explains Reel #15 — "How to Detect an Infinite Loop in O(1) Memory 🐢🐇 (Floyd's Algorithm)"
LeetCode #141: Linked List Cycle Detection (Tortoise and Hare)
"""

import os
import sys
import json
import asyncio
import subprocess
import shutil
from pathlib import Path
import numpy as np
import edge_tts
from faster_whisper import WhisperModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PUBLIC_REELS = BASE_DIR / "public" / "reels" / "cycle_15"
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)

BLOCKS_DIR = Path(__file__).resolve().parent / "audio" / "blocks"
BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

# ══════════════════════════════════════════════════════════════════════════════
# REEL #15 SCRIPT: FLOYD'S TORTOISE & HARE CYCLE DETECTION
# ══════════════════════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    {
        "id": "c01_hook",
        "speaker": "narrator",
        "voice": "en-US-ChristopherNeural",
        "text": "How do you detect an infinite loop in a linked list without using any extra memory?",
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "infinite loop", "cue": "cycle_spawn", "rel_pct": 0.35},
            {"phrase": "extra memory", "cue": "zero_memory", "rel_pct": 0.85},
        ]
    },
    {
        "id": "c02_nemi",
        "speaker": "nemi",
        "voice": "en-US-AnaNeural",
        "text": "Can't we just store visited nodes in a Hash Set?",
        "pitch": "+12Hz",
        "rate": "+18%",
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "Hash Set", "cue": "hashset_spawn", "rel_pct": 0.65},
        ]
    },
    {
        "id": "c03_memory_trap",
        "speaker": "narrator",
        "voice": "en-US-ChristopherNeural",
        "text": "That costs O(N) RAM. In a billion nodes, your memory explodes.",
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "costs O(N) RAM", "cue": "ram_warning", "rel_pct": 0.25},
            {"phrase": "memory explodes", "cue": "ram_explode", "rel_pct": 0.75},
        ]
    },
    {
        "id": "c04_two_pointers",
        "speaker": "narrator",
        "voice": "en-US-ChristopherNeural",
        "text": "Use Floyd's trick: two pointers starting together.",
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "Floyd's trick", "cue": "floyd_title", "rel_pct": 0.30},
            {"phrase": "two pointers", "cue": "spawn_pointers", "rel_pct": 0.75},
        ]
    },
    {
        "id": "c05_tortoise_hare",
        "speaker": "narrator",
        "voice": "en-US-ChristopherNeural",
        "text": "The slow tortoise moves 1 step. The fast hare moves 2 steps.",
        "gap_after": 90,
        "semantic_phrases": [
            {"phrase": "slow tortoise", "cue": "tortoise_one", "rel_pct": 0.25},
            {"phrase": "fast hare", "cue": "hare_two", "rel_pct": 0.75},
        ]
    },
    {
        "id": "c06_chase_collision",
        "speaker": "narrator",
        "voice": "en-US-ChristopherNeural",
        "text": "Inside the loop, the hare gains 1 node every turn until BAM! They collide.",
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "gains 1 node", "cue": "relative_speed", "rel_pct": 0.30},
            {"phrase": "They collide", "cue": "collision_slam", "rel_pct": 0.85},
        ]
    },
    {
        "id": "c07_payoff",
        "speaker": "narrator",
        "voice": "en-US-ChristopherNeural",
        "text": "If they meet, cycle confirmed. Zero extra memory, O(N) time!",
        "gap_after": 120,
        "semantic_phrases": [
            {"phrase": "cycle confirmed", "cue": "cycle_verified", "rel_pct": 0.35},
            {"phrase": "O(N) time", "cue": "complexity_badge", "rel_pct": 0.80},
        ]
    }
]

async def generate_speech_block(event: dict, out_wav: Path):
    temp_mp3 = out_wav.with_suffix(".temp.mp3")
    voice = event.get("voice", "en-US-ChristopherNeural")
    pitch = event.get("pitch", "+0Hz")
    rate = event.get("rate", "+8%")
    
    comm = edge_tts.Communicate(event["text"], voice, pitch=pitch, rate=rate)
    await comm.save(str(temp_mp3))
    
    cmd = ["ffmpeg", "-y", "-i", str(temp_mp3), "-ar", "24000", "-ac", "1", str(out_wav)]
    subprocess.run(cmd, check=True, capture_output=True)
    if temp_mp3.exists():
        temp_mp3.unlink()

def extract_subtitles_whisper(audio_path: Path, fps: int = 30):
    print("🔍 Extracting Millisecond-Accurate Word Timestamps (faster_whisper)...")
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(str(audio_path), word_timestamps=True, language="en")
    
    words_all = []
    subtitles = []
    
    for segment in segments:
        words = segment.words
        if not words:
            continue
        
        chunk_size = 4
        for i in range(0, len(words), chunk_size):
            chunk = words[i:i + chunk_size]
            c_start = chunk[0].start
            c_end = chunk[-1].end
            c_text = " ".join([w.word.strip() for w in chunk])
            
            c_start_frame = int(round(c_start * fps))
            c_end_frame = int(round(c_end * fps))
            
            chunk_words = []
            for w in chunk:
                w_start_f = int(round(w.start * fps))
                w_end_f = int(round(w.end * fps))
                chunk_words.append({
                    "word": w.word.strip(),
                    "start_s": round(w.start, 2),
                    "end_s": round(w.end, 2),
                    "start_frame": w_start_f,
                    "end_frame": w_end_f
                })
                words_all.append(chunk_words[-1])
            
            subtitles.append({
                "start_frame": c_start_frame,
                "end_frame": c_end_frame,
                "text": c_text,
                "words": chunk_words
            })
            
    return subtitles, words_all

async def main_async():
    print("🎙️ GENERATING AUDIO FOR REEL #15: FLOYD'S TORTOISE AND HARE")
    
    timeline_events = []
    current_time_ms = 0
    fps = 30
    
    wav_files = []
    
    for idx, ev in enumerate(SPEAKER_EVENTS):
        block_wav = BLOCKS_DIR / f"{ev['id']}.wav"
        print(f"[{idx+1}/{len(SPEAKER_EVENTS)}] Generating {ev['id']} ({ev['speaker']})...")
        await generate_speech_block(ev, block_wav)
        
        # Get duration
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(block_wav)]
        dur_s = float(subprocess.check_output(cmd).decode().strip())
        dur_ms = int(round(dur_s * 1000))
        
        start_ms = current_time_ms
        end_ms = start_ms + dur_ms
        start_frame = int(round(start_ms / 1000 * fps))
        end_frame = int(round(end_ms / 1000 * fps))
        
        # Compute semantic phrase cue frame offsets
        cues = []
        for sp in ev.get("semantic_phrases", []):
            rel_pct = sp.get("rel_pct", 0.5)
            cue_frame = start_frame + int(round((end_frame - start_frame) * rel_pct))
            cues.append({
                "phrase": sp["phrase"],
                "cue": sp["cue"],
                "frame": cue_frame
            })
            
        timeline_events.append({
            "id": ev["id"],
            "speaker": ev["speaker"],
            "text": ev["text"],
            "start_ms": start_ms,
            "end_ms": end_ms,
            "duration_ms": dur_ms,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "cues": cues,
            "wav_path": str(block_wav)
        })
        
        wav_files.append((block_wav, ev.get("gap_after", 100)))
        current_time_ms = end_ms + ev.get("gap_after", 100)
        
    # Concat all wav files with precise gaps
    print("\n📦 Concatenating audio blocks with silence gaps...")
    full_wav = BLOCKS_DIR / "full_voiceover.wav"
    
    filter_complex = []
    inputs = []
    
    for i, (wav, gap_ms) in enumerate(wav_files):
        inputs.extend(["-i", str(wav)])
        filter_complex.append(f"[{i}:a]apad=pad_dur={gap_ms/1000.0}[a{i}];")
        
    concat_inputs = "".join([f"[a{i}]" for i in range(len(wav_files))])
    filter_complex.append(f"{concat_inputs}concat=n={len(wav_files)}:v=0:a=1[out]")
    
    cmd_concat = ["ffmpeg", "-y"] + inputs + ["-filter_complex", "".join(filter_complex), "-map", "[out]", "-ar", "48000", str(full_wav)]
    subprocess.run(cmd_concat, check=True, capture_output=True)
    
    # Extract Whisper word timestamps
    subtitles, words_all = extract_subtitles_whisper(full_wav, fps=fps)
    
    # Get total video duration
    total_dur_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(full_wav)]
    total_dur_s = float(subprocess.check_output(total_dur_cmd).decode().strip())
    total_frames = int(round(total_dur_s * fps))
    
    # Copy full voiceover to public folder
    dest_wav = PUBLIC_REELS / "voiceover.wav"
    dest_mp3 = PUBLIC_REELS / "voiceover.mp3"
    shutil.copy(full_wav, dest_wav)
    
    cmd_mp3 = ["ffmpeg", "-y", "-i", str(dest_wav), "-b:a", "192k", str(dest_mp3)]
    subprocess.run(cmd_mp3, check=True, capture_output=True)
    
    # Save timeline metadata
    timeline_data = {
        "composition": "NemiExplainsCycle",
        "fps": fps,
        "total_duration_s": round(total_dur_s, 2),
        "total_frames": total_frames,
        "events": timeline_events,
        "subtitles": subtitles,
        "words": words_all
    }
    
    timeline_json = Path(__file__).resolve().parent / "timeline.json"
    with open(timeline_json, "w") as f:
        json.dump(timeline_data, f, indent=2)
        
    print(f"\n🎉 Audio Generation Complete!")
    print(f"📊 Total Duration: {total_dur_s:.2f}s ({total_frames} frames @ {fps}fps)")
    print(f"📁 Timeline Saved: {timeline_json}")
    print(f"🔊 Audio Public: {dest_mp3}")

if __name__ == "__main__":
    asyncio.run(main_async())
