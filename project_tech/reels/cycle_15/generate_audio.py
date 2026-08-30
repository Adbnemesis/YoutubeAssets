#!/usr/bin/env python3
"""
Nemi Explains Reel #15 — "Detect Infinite Loops in O(1) Memory! 🐢🐇 (Floyd's Algorithm)"
LeetCode #141: Linked List Cycle Detection
Standard ChatterboxTTS + Edge-TTS Dual Voice System with Librosa Silence Trimming & Master Ducking.
"""

import os
import sys
import json
import shutil
import asyncio
import subprocess
from pathlib import Path

# Ensure project paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))

# Monkey-patch watermarker for macOS compatibility before chatterbox import
import chatterbox.tts
class DummyWatermarker:
    def apply_watermark(self, wav, *args, **kwargs):
        return wav
chatterbox.tts.perth = type('perth', (), {'PerthImplicitWatermarker': DummyWatermarker})

from chatterbox import ChatterboxTTS
import soundfile as sf
import torch
import numpy as np
import edge_tts
from faster_whisper import WhisperModel

try:
    import pyloudnorm as pyln
    HAS_PYLN = True
except ImportError:
    HAS_PYLN = False

try:
    import librosa
    HAS_LIBROSA = True
except ImportError:
    HAS_LIBROSA = False

# Target Loudness Specs (from Law 4 & 20_CURRENT_BEST_PRACTICES.md)
TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.0

PUBLIC_REELS = BASE_DIR / "public" / "reels" / "cycle_15"
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)

BLOCKS_DIR = Path(__file__).resolve().parent / "audio" / "blocks"
BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

# Remove old block wavs to generate fresh Chatterbox voice
for f in BLOCKS_DIR.glob("*.wav"):
    f.unlink()

SPEAKER_EVENTS = [
    {
        "id": "cy01_hook",
        "speaker": "narrator",
        "text": "How do you detect an infinite loop in a linked list with zero extra memory?",
        "exaggeration": 0.70,
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "infinite loop", "cue": "cycle_spawn", "rel_pct": 0.40},
            {"phrase": "zero extra memory", "cue": "zero_memory", "rel_pct": 0.85},
        ]
    },
    {
        "id": "cy02_nemi",
        "speaker": "nemi",
        "text": "Can't we just save visited nodes in a Hash Set? 🤔",
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "Hash Set", "cue": "hashset_spawn", "rel_pct": 0.70},
        ]
    },
    {
        "id": "cy03_memory_trap",
        "speaker": "narrator",
        "text": "That costs O(N) RAM. In a billion nodes, memory crashes!",
        "exaggeration": 0.75,
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "costs O(N) RAM", "cue": "ram_warning", "rel_pct": 0.30},
            {"phrase": "memory crashes", "cue": "ram_crash", "rel_pct": 0.75},
        ]
    },
    {
        "id": "cy04_two_pointers",
        "speaker": "narrator",
        "text": "Use Floyd's algorithm! The slow tortoise takes 1 step, the fast hare takes 2 steps.",
        "exaggeration": 0.70,
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "slow tortoise", "cue": "tortoise_spawn", "rel_pct": 0.45},
            {"phrase": "fast hare", "cue": "hare_spawn", "rel_pct": 0.80},
        ]
    },
    {
        "id": "cy05_chase",
        "speaker": "narrator",
        "text": "Inside the loop, the hare gains 1 node every turn until BAM! They collide.",
        "exaggeration": 0.75,
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "gains 1 node", "cue": "relative_speed", "rel_pct": 0.35},
            {"phrase": "They collide", "cue": "collision_slam", "rel_pct": 0.85},
        ]
    },
    {
        "id": "cy06_nemi",
        "speaker": "nemi",
        "text": "Zero extra RAM and O(N) time! 😎⚡",
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "O(N) time", "cue": "nemi_smug", "rel_pct": 0.70},
        ]
    },
    {
        "id": "cy07_loop",
        "speaker": "narrator",
        "text": "That's how two pointers solve cycle detection in constant space.",
        "exaggeration": 0.65,
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "constant space", "cue": "loop_seam", "rel_pct": 0.75},
        ]
    }
]

def normalize_lufs(y: np.ndarray, sr: int, target_lufs: float) -> np.ndarray:
    if not HAS_PYLN:
        return y
    meter = pyln.Meter(sr)
    current_lufs = meter.integrated_loudness(y)
    if np.isinf(current_lufs) or np.isnan(current_lufs):
        return y
    gain = target_lufs - current_lufs
    y_norm = y * (10.0 ** (gain / 20.0))
    max_val = np.max(np.abs(y_norm))
    if max_val > 0.98:
        y_norm = y_norm * (0.98 / max_val)
    return y_norm

def trim_silence(y: np.ndarray, sr: int, top_db: int = 32) -> np.ndarray:
    if not HAS_LIBROSA:
        return y
    trimmed, _ = librosa.effects.trim(y, top_db=top_db)
    return trimmed

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
                w_clean = w.word.strip()
                if w_clean.lower() == "hair":
                    w_clean = "hare"
                chunk_words.append({
                    "word": w_clean,
                    "start_s": round(w.start, 2),
                    "end_s": round(w.end, 2),
                    "start_frame": w_start_f,
                    "end_frame": w_end_f
                })
                words_all.append(chunk_words[-1])
            
            subtitles.append({
                "start_frame": c_start_frame,
                "end_frame": c_end_frame,
                "text": c_text.replace("hair", "hare").replace("Hair", "Hare"),
                "words": chunk_words
            })
            
    return subtitles, words_all

def main():
    print("🎙️ NEMI EXPLAINS REEL #15 — FLOYD'S TORTOISE & HARE AUDIO PIPELINE")
    
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Loading Chatterbox model on {device}...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    print(f"✅ Chatterbox loaded. Sample rate: {sr} Hz")
    
    current_time_ms = 0
    timeline_events = []
    audio_inputs = []
    filter_parts = []
    input_idx = 0
    
    for i, event in enumerate(SPEAKER_EVENTS, 1):
        event_id = event["id"]
        speaker = event["speaker"]
        text = event["text"]
        exag = event.get("exaggeration", 0.70)
        gap_after = event.get("gap_after", 80)
        
        out_wav = BLOCKS_DIR / f"{event_id}.wav"
        
        if speaker == "nemi":
            print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' (NEMI): \"{text}\"")
            clean_text = text.replace("😎", "").replace("⚡", "").replace("🤔", "").strip()
            temp_mp3 = BLOCKS_DIR / f"{event_id}_temp.mp3"
            async def gen_nemi():
                comm = edge_tts.Communicate(clean_text, "en-US-AnaNeural", pitch="+12Hz", rate="+20%")
                await comm.save(str(temp_mp3))
            asyncio.run(gen_nemi())
            
            conv_cmd = ["ffmpeg", "-y", "-i", str(temp_mp3), "-ar", str(sr), "-ac", "1", str(out_wav)]
            subprocess.run(conv_cmd, check=True, capture_output=True)
            y, _ = sf.read(str(out_wav))
            if temp_mp3.exists():
                temp_mp3.unlink()
        else:
            print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' (NARRATOR): \"{text}\"")
            wav_tensor = model.generate(text=text, exaggeration=exag)
            if wav_tensor.ndim > 1:
                wav_tensor = wav_tensor.squeeze()
            y = wav_tensor.cpu().numpy()
            
        # Trim leading/trailing silence to eliminate awkward pauses
        y_trimmed = trim_silence(y, sr, top_db=30)
        y_norm = normalize_lufs(y_trimmed, sr, TARGET_VOICE_LUFS)
        sf.write(str(out_wav), y_norm, sr)
        
        dur_s = len(y_norm) / sr
        dur_ms = int(round(dur_s * 1000))
        
        start_ms = current_time_ms
        end_ms = start_ms + dur_ms
        start_frame = int(round(start_ms / 1000 * 30))
        end_frame = int(round(end_ms / 1000 * 30))
        
        cues = []
        for sp in event.get("semantic_phrases", []):
            rel_pct = sp.get("rel_pct", 0.5)
            cue_frame = start_frame + int(round((end_frame - start_frame) * rel_pct))
            cues.append({
                "phrase": sp["phrase"],
                "cue": sp["cue"],
                "frame": cue_frame
            })
            
        timeline_events.append({
            "id": event_id,
            "speaker": speaker,
            "text": text,
            "start_ms": start_ms,
            "end_ms": end_ms,
            "duration_ms": dur_ms,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "cues": cues,
            "wav_path": str(out_wav)
        })
        
        audio_inputs.extend(["-i", str(out_wav)])
        pad_dur_s = gap_after / 1000.0
        filter_parts.append(f"[{input_idx}:a]apad=pad_dur={pad_dur_s:.3f}[a{input_idx}];")
        input_idx += 1
        
        current_time_ms = end_ms + gap_after
        
    # Stitch voice track
    concat_clause = "".join([f"[a{k}]" for k in range(input_idx)]) + f"concat=n={input_idx}:v=0:a=1[v_raw]"
    filter_complex = "".join(filter_parts) + concat_clause
    
    voice_raw_wav = BLOCKS_DIR / "voice_raw.wav"
    cmd_voice = [
        "ffmpeg", "-y",
        *audio_inputs,
        "-filter_complex", filter_complex,
        "-map", "[v_raw]",
        "-ar", str(sr),
        str(voice_raw_wav)
    ]
    subprocess.run(cmd_voice, check=True, capture_output=True)
    
    # Normalize concatenated voice
    voice_master_wav = BLOCKS_DIR / "voice_master.wav"
    y_voice, _ = sf.read(str(voice_raw_wav))
    y_voice_norm = normalize_lufs(y_voice, sr, TARGET_VOICE_LUFS)
    sf.write(str(voice_master_wav), y_voice_norm, sr)
    
    total_voice_dur_s = len(y_voice_norm) / sr
    total_frames = int(round(total_voice_dur_s * 30))
    print(f"✅ Voice track assembled: {total_voice_dur_s:.2f}s ({total_frames} frames)")
    
    # ─── MASTER BGM SIDECHAIN DUCKING ───
    bgm_path = BASE_DIR / "project_tech" / "assets" / "background_music" / "Death of a Bluebird.mp3"
    if not bgm_path.exists():
        bgm_path = BASE_DIR / "public" / "bgm" / "Synthwave Goose - Blade Runner 2049.mp3"
    
    master_audio_mp3 = PUBLIC_REELS / "voiceover.mp3"
    master_audio_wav = PUBLIC_REELS / "voiceover.wav"
    
    cmd_master = [
        "ffmpeg", "-y",
        "-i", str(voice_master_wav),
        "-i", str(bgm_path),
        "-filter_complex",
        f"[1:a]aloop=loop=-1:size=2e+09,atrim=0:{total_voice_dur_s + 0.5:.2f},volume=0.38,afade=t=in:st=0:d=0.2,afade=t=out:st={total_voice_dur_s - 0.5:.2f}:d=0.8[bgm]; "
        f"[0:a]asplit=2[v_main][v_sc]; "
        f"[bgm][v_sc]sidechaincompress=threshold=0.08:ratio=2.5:attack=35:release=160[ducked_bgm]; "
        f"[v_main][ducked_bgm]amix=inputs=2:normalize=0[mix]; "
        f"[mix]loudnorm=I={TARGET_MASTER_LUFS}:TP=-1.5:LRA=7[out]",
        "-map", "[out]",
        "-b:a", "320k",
        str(master_audio_mp3)
    ]
    subprocess.run(cmd_master, check=True, capture_output=True)
    shutil.copy(master_audio_mp3, master_audio_wav)
    
    # Extract subtitles
    subtitles, words_all = extract_subtitles_whisper(voice_master_wav, fps=30)
    
    timeline_data = {
        "composition": "NemiExplainsCycle",
        "fps": 30,
        "total_duration_s": round(total_voice_dur_s, 2),
        "total_frames": total_frames,
        "timeline_events": timeline_events,
        "subtitles": subtitles,
        "words": words_all
    }
    
    timeline_json = Path(__file__).resolve().parent / "timeline.json"
    with open(timeline_json, "w") as f:
        json.dump(timeline_data, f, indent=2)
        
    print(f"🎉 Pipeline Complete! Duration: {total_voice_dur_s:.2f}s ({total_frames} frames)")

if __name__ == "__main__":
    main()
