import os
import sys
import json
import shutil
import asyncio
import subprocess
import edge_tts
import torch
import soundfile as sf
import numpy as np
from pathlib import Path
from typing import List, Dict, Any

# Ensure project paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))

# Chatterbox voice import
from chatterbox.tts import ChatterboxTTS

# Target Loudness Specs (from Law 4 & 20_CURRENT_BEST_PRACTICES.md)
TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.0

PUBLIC_REELS = BASE_DIR / "public" / "reels" / "binary_13"
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)

BLOCKS_DIR = Path(__file__).resolve().parent / "audio" / "blocks"
BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

# ══════════════════════════════════════════════════════════════════════════════
# REEL #13 SCRIPT: CRYSTAL-CLEAR BINARY SEARCH NUMBER GUESSING DEMO
# ══════════════════════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    {
        "id": "bn01_hook",
        "speaker": "narrator",
        "text": "How do you find a number from 1 to 100 in just 7 guesses?",
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "1 to 100", "cue": "range_spawn", "rel_pct": 0.45},
            {"phrase": "7 guesses", "cue": "seven_slam", "rel_pct": 0.85},
        ]
    },
    {
        "id": "bn02_linear",
        "speaker": "narrator",
        "text": "Don't guess one by one. Always pick 50 — the exact middle.",
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "one by one", "cue": "linear_cross", "rel_pct": 0.25},
            {"phrase": "pick 50", "cue": "mid_fifty", "rel_pct": 0.70},
        ]
    },
    {
        "id": "bn03_nemi",
        "speaker": "nemi",
        "text": "What if the secret number is 73?",
        "gap_after": 90,
        "semantic_phrases": [
            {"phrase": "73", "cue": "target_73", "rel_pct": 0.70},
        ]
    },
    {
        "id": "bn04_halve",
        "speaker": "narrator",
        "text": "73 is higher! So you instantly throw away 1 to 50 in one step.",
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "73 is higher", "cue": "higher_verdict", "rel_pct": 0.25},
            {"phrase": "throw away 1 to 50", "cue": "purge_left", "rel_pct": 0.75},
        ]
    },
    {
        "id": "bn05_step2",
        "speaker": "narrator",
        "text": "Next, check 75. Too high? Discard 76 to 100.",
        "gap_after": 100,
        "semantic_phrases": [
            {"phrase": "check 75", "cue": "mid_75", "rel_pct": 0.30},
            {"phrase": "Discard 76 to 100", "cue": "purge_right", "rel_pct": 0.75},
        ]
    },
    {
        "id": "bn06_scale",
        "speaker": "narrator",
        "text": "Every cut eliminates half. Even in 1 billion items, it takes just 30 steps.",
        "gap_after": 110,
        "semantic_phrases": [
            {"phrase": "eliminates half", "cue": "half_cascade", "rel_pct": 0.35},
            {"phrase": "just 30 steps", "cue": "billion_payoff", "rel_pct": 0.85},
        ]
    },
    {
        "id": "bn07_nemi",
        "speaker": "nemi",
        "text": "That's why computers are so fast!",
        "gap_after": 120,
        "semantic_phrases": [
            {"phrase": "so fast", "cue": "nemi_smug", "rel_pct": 0.65},
        ]
    },
    {
        "id": "bn08_loop",
        "speaker": "narrator",
        "text": "Next time you search anything, this trick just ran.",
        "gap_after": 120,
        "semantic_phrases": [
            {"phrase": "this trick just ran", "cue": "loop_seam", "rel_pct": 0.75},
        ]
    }
]

async def generate_nemi_clip(text: str, out_wav: Path):
    temp_mp3 = out_wav.with_suffix(".temp.mp3")
    comm = edge_tts.Communicate(text, "en-US-AnaNeural", pitch="+12Hz", rate="+18%")
    await comm.save(str(temp_mp3))
    cmd = ["ffmpeg", "-y", "-i", str(temp_mp3), "-ar", "24000", "-ac", "1", str(out_wav)]
    subprocess.run(cmd, check=True, capture_output=True)
    if temp_mp3.exists():
        temp_mp3.unlink()

def normalize_lufs(y: np.ndarray, sr: int, target_lufs: float) -> np.ndarray:
    import pyloudnorm as pyln
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

def trim_silence(y: np.ndarray, sr: int, top_db: int = 35) -> np.ndarray:
    import librosa
    trimmed, _ = librosa.effects.trim(y, top_db=top_db)
    return trimmed

def extract_subtitles_whisper(audio_path: Path, fps: int = 30):
    from faster_whisper import WhisperModel
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

def main():
    print("🎙️ NEMI EXPLAINS REEL #13 — CRYSTAL-CLEAR BINARY SEARCH PIPELINE")
    
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Loading Chatterbox model on {device}...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    
    current_time_ms = 0
    timeline_events = []
    audio_inputs = []
    filter_parts = []
    input_idx = 0
    
    for i, event in enumerate(SPEAKER_EVENTS, 1):
        event_id = event["id"]
        speaker = event["speaker"]
        text = event["text"]
        gap_after = event.get("gap_after", 100)
        
        out_wav = BLOCKS_DIR / f"{event_id}.wav"
        
        if speaker == "nemi":
            print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' (NEMI): \"{text}\"")
            asyncio.run(generate_nemi_clip(text, out_wav))
            y, _ = sf.read(str(out_wav))
        else:
            print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' (NARRATOR): \"{text}\"")
            wav_tensor = model.generate(text=text, exaggeration=0.75)
            if wav_tensor.ndim > 1:
                wav_tensor = wav_tensor.squeeze()
            y = wav_tensor.cpu().numpy()
            
        y = trim_silence(y, sr, top_db=35)
        y = normalize_lufs(y, sr, TARGET_VOICE_LUFS)
        sf.write(str(out_wav), y, sr)
        
        dur_s = len(y) / sr
        dur_ms = int(dur_s * 1000)
        
        start_time_ms = current_time_ms
        end_time_ms = start_time_ms + dur_ms
        start_frame = int(round((start_time_ms / 1000.0) * 30))
        end_frame = int(round((end_time_ms / 1000.0) * 30))
        
        cues = []
        for sc in event.get("semantic_phrases", []):
            rel_pct = sc.get("rel_pct", 0.5)
            cue_time_ms = int(start_time_ms + dur_ms * rel_pct)
            cue_frame = int(round((cue_time_ms / 1000.0) * 30))
            cues.append({
                "phrase": sc["phrase"],
                "cue": sc["cue"],
                "time_ms": cue_time_ms,
                "frame": cue_frame
            })
            
        timeline_events.append({
            "id": event_id,
            "speaker": speaker,
            "text": text,
            "start_time_ms": start_time_ms,
            "end_time_ms": end_time_ms,
            "duration_s": round(dur_s, 3),
            "start_frame": start_frame,
            "end_frame": end_frame,
            "gap_after_ms": gap_after,
            "semantic_cues": cues
        })
        
        audio_inputs.extend(["-i", str(out_wav)])
        filter_parts.append(f"[{input_idx}:a]adelay={start_time_ms}|{start_time_ms}[a{input_idx}]")
        input_idx += 1
        
        current_time_ms = end_time_ms + gap_after
        print(f"   ✓ {dur_s:.2f}s | {start_time_ms}ms (f{start_frame}) → {end_time_ms}ms (f{end_frame}) [gap: {gap_after}ms]")
        
    total_duration_s = current_time_ms / 1000.0
    total_frames = int(round(total_duration_s * 30))
    
    print("\n" + "─" * 70)
    print(f"⏱ Total Master Duration: {total_duration_s:.2f}s ({total_frames} frames @ 30fps)")
    print("─" * 70 + "\n")
    
    # 1. Stitch clean voice track
    mix_labels = "".join([f"[a{k}]" for k in range(input_idx)])
    filter_complex = f"{';'.join(filter_parts)};{mix_labels}amix=inputs={input_idx}:normalize=0[voice_out]"
    
    raw_voice_wav = BLOCKS_DIR / "binary_voice_raw.wav"
    cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", filter_complex, "-map", "[voice_out]", "-ar", "48000", str(raw_voice_wav)]
    subprocess.run(cmd, check=True, capture_output=True)
    
    # 2. Master Voice Track
    final_voice_mp3 = Path(__file__).resolve().parent / "audio" / "binary_voice_track.mp3"
    norm_cmd = [
        "ffmpeg", "-y", "-i", str(raw_voice_wav),
        "-af", f"loudnorm=I={TARGET_VOICE_LUFS}:TP=-1.5:LRA=7",
        "-b:a", "320k",
        str(final_voice_mp3)
    ]
    subprocess.run(norm_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {final_voice_mp3.name}")
    
    # 3. Mix with BGM with 2.5:1 sidechain ducking
    bgm_path = BASE_DIR / "assets" / "background_music" / "Death of a Bluebird - Rorschach Roy 4.mp3"
    master_audio_mp3 = PUBLIC_REELS / "binary_master_audio.mp3"
    
    mix_cmd = [
        "ffmpeg", "-y",
        "-i", str(final_voice_mp3),
        "-i", str(bgm_path),
        "-filter_complex",
        f"[1:a]aloop=loop=-1:size=2e+09,atrim=0:{total_duration_s + 0.5},volume=0.52,afade=t=in:st=0:d=0.3,afade=t=out:st={total_duration_s - 0.7}:d=0.8[bgm];"
        f"[0:a]asplit=2[v_main][v_sc];"
        f"[bgm][v_sc]sidechaincompress=threshold=0.08:ratio=2.5:attack=35:release=160[ducked_bgm];"
        f"[v_main][ducked_bgm]amix=inputs=2:normalize=0[mix];"
        f"[mix]loudnorm=I={TARGET_MASTER_LUFS}:TP=-1.5:LRA=7[out]",
        "-map", "[out]",
        "-b:a", "320k",
        str(master_audio_mp3)
    ]
    subprocess.run(mix_cmd, check=True, capture_output=True)
    print(f"✅ Ducked Master Audio: {master_audio_mp3.name}")
    shutil.copy(master_audio_mp3, PUBLIC_SOUNDS / "binary_master_audio.mp3")
    
    # 4. Extract word-level subtitles using faster_whisper
    subtitles, words_all = extract_subtitles_whisper(final_voice_mp3, fps=30)
    
    # 5. Export JSON cues for Remotion
    cues_json_path = BASE_DIR / "src" / "data" / "binary_13_cues.json"
    cues_data = {
        "reel_id": "binary_13",
        "title": "A Billion Answers. Thirty Questions.",
        "total_duration_s": total_duration_s,
        "total_frames": total_frames,
        "fps": 30,
        "timeline_events": timeline_events,
        "subtitles": subtitles,
        "words": words_all
    }
    with open(cues_json_path, "w") as f:
        json.dump(cues_data, f, indent=2)
    print(f"✅ Timeline cues and word-level subtitles written to: {cues_json_path}")
    
    # 6. Validate Speaker Separation & Overlap
    print("\n🔍 Validating Speaker Separation:")
    has_overlap = False
    for j in range(len(timeline_events) - 1):
        curr = timeline_events[j]
        nxt = timeline_events[j+1]
        gap = nxt["start_time_ms"] - curr["end_time_ms"]
        print(f"   ✓ {curr['id']} ({curr['speaker']}) → {nxt['id']} ({nxt['speaker']}) | Gap: {gap}ms")
        if gap < 0:
            print(f"   ❌ CRITICAL OVERLAP DETECTED: {abs(gap)}ms between {curr['id']} and {nxt['id']}")
            has_overlap = True
            
    if not has_overlap:
        print("\n🎉 DUAL-VOICE AUDIO & SUBTITLE PIPELINE COMPLETE — 0.00ms OVERLAP GUARANTEED\n")

if __name__ == "__main__":
    main()
