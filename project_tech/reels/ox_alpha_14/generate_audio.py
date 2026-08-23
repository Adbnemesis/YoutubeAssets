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

TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.0

PUBLIC_REELS = BASE_DIR / "public" / "reels" / "ox_alpha_14"
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)

BLOCKS_DIR = Path(__file__).resolve().parent / "audio" / "blocks"
BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

# ══════════════════════════════════════════════════════════════════════════════
# REEL #14 SCRIPT: 0X-ALPHA MYSTERY AI MODEL (STEALTH FREE 1M TOKEN RELEASE)
# ══════════════════════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    {
        "id": "ox01_hook",
        "speaker": "narrator",
        "text": "A mystery AI model named 0x-alpha just dropped out of nowhere.",
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "0x-alpha", "cue": "model_spawn", "rel_pct": 0.50},
            {"phrase": "out of nowhere", "cue": "mystery_badge", "rel_pct": 0.85},
        ]
    },
    {
        "id": "ox02_specs",
        "speaker": "narrator",
        "text": "It gives you a massive 1 million token context — for exactly zero dollars.",
        "gap_after": 90,
        "semantic_phrases": [
            {"phrase": "1 million token", "cue": "million_context", "rel_pct": 0.40},
            {"phrase": "zero dollars", "cue": "free_zero_dollar", "rel_pct": 0.85},
        ]
    },
    {
        "id": "ox03_nemi",
        "speaker": "nemi",
        "text": "Wait, who secretly built this?",
        "gap_after": 80,
        "semantic_phrases": [
            {"phrase": "secretly built this", "cue": "nemi_curious", "rel_pct": 0.70},
        ]
    },
    {
        "id": "ox04_swe_bench",
        "speaker": "narrator",
        "text": "It scored 80% on coding benchmarks! Tokenizer fingerprints match Zhipu's GLM-5.3.",
        "gap_after": 90,
        "semantic_phrases": [
            {"phrase": "80% on coding", "cue": "swe_80_percent", "rel_pct": 0.30},
            {"phrase": "GLM-5.3", "cue": "dna_match_zhipu", "rel_pct": 0.85},
        ]
    },
    {
        "id": "ox05_warning",
        "speaker": "narrator",
        "text": "It's only free for a week, and all prompts are recorded for training.",
        "gap_after": 90,
        "semantic_phrases": [
            {"phrase": "for a week", "cue": "seven_day_timer", "rel_pct": 0.35},
            {"phrase": "recorded for training", "cue": "vault_warning", "rel_pct": 0.80},
        ]
    },
    {
        "id": "ox06_nemi",
        "speaker": "nemi",
        "text": "Free frontier AI? I'm using this before it disappears!",
        "gap_after": 90,
        "semantic_phrases": [
            {"phrase": "before it disappears", "cue": "nemi_excited", "rel_pct": 0.75},
        ]
    },
    {
        "id": "ox07_loop",
        "speaker": "narrator",
        "text": "Before everyone finds out that...",
        "gap_after": 0,
        "semantic_phrases": [
            {"phrase": "finds out that", "cue": "loop_seam", "rel_pct": 0.50},
        ]
    }
]

async def generate_nemi_clip(text: str, out_wav: Path):
    temp_mp3 = out_wav.with_suffix(".temp.mp3")
    comm = edge_tts.Communicate(text, "en-US-AnaNeural", pitch="+14Hz", rate="+20%")
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
    print("🎙️ NEMI EXPLAINS REEL #14 — 0X-ALPHA MYSTERY AI PIPELINE")
    
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
        gap_after = event.get("gap_after", 80)
        
        out_wav = BLOCKS_DIR / f"{event_id}.wav"
        
        if speaker == "nemi":
            print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' (NEMI): \"{text}\"")
            asyncio.run(generate_nemi_clip(text, out_wav))
            y, _ = sf.read(str(out_wav))
        else:
            print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' (NARRATOR): \"{text}\"")
            wav_tensor = model.generate(text=text, exaggeration=0.72)
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
    
    raw_voice_wav = BLOCKS_DIR / "ox_voice_raw.wav"
    cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", filter_complex, "-map", "[voice_out]", "-ar", "48000", str(raw_voice_wav)]
    subprocess.run(cmd, check=True, capture_output=True)
    
    # 2. Master Voice Track
    final_voice_mp3 = Path(__file__).resolve().parent / "audio" / "ox_voice_track.mp3"
    norm_cmd = [
        "ffmpeg", "-y", "-i", str(raw_voice_wav),
        "-af", f"loudnorm=I={TARGET_VOICE_LUFS}:TP=-1.5:LRA=7",
        "-b:a", "320k",
        str(final_voice_mp3)
    ]
    subprocess.run(norm_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {final_voice_mp3.name}")
    
    # 3. Mix with BGM with 2.5:1 sidechain ducking
    bgm_path = BASE_DIR / "assets" / "background_music" / "Luminary.mp3"
    if not bgm_path.exists():
        bgm_path = BASE_DIR / "assets" / "background_music" / "Death of a Bluebird - Rorschach Roy 4.mp3"
        
    master_audio_mp3 = PUBLIC_REELS / "ox_alpha_master_audio.mp3"
    
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
    shutil.copy(master_audio_mp3, PUBLIC_SOUNDS / "ox_alpha_master_audio.mp3")
    
    # 4. Extract word-level subtitles using faster_whisper
    subtitles, words_all = extract_subtitles_whisper(final_voice_mp3, fps=30)
    
    # 5. Export JSON cues for Remotion
    cues_json_path = BASE_DIR / "src" / "data" / "ox_alpha_14_cues.json"
    cues_data = {
        "reel_id": "ox_alpha_14",
        "title": "A Mystery AI Model Just Dropped (0x-alpha)",
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
