#!/usr/bin/env python3
"""
Audio Pipeline for Reel #19: LeetCode #200 Number of Islands (Sink the Island)
Engine: ChatterboxTTS (Narrator) + Edge-TTS (Nemi AnaNeural)
Target Duration: ~23.0s (690 frames @ 30fps) — 22-25s Golden Short Format
"""

import os
import json
import shutil
import asyncio
from pathlib import Path
import torch
import torchaudio
import librosa
import soundfile as sf
import numpy as np
import edge_tts
import pyloudnorm as pyln
from faster_whisper import WhisperModel

# macOS Perth Watermarker Monkeypatch
import chatterbox.tts
class DummyWatermarker:
    def apply_watermark(self, wav, *args, **kwargs):
        return wav
chatterbox.tts.perth = type('perth', (), {'PerthImplicitWatermarker': DummyWatermarker})
from chatterbox import ChatterboxTTS

BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")
REEL_DIR = BASE_DIR / "project_tech" / "reels" / "islands_19"
AUDIO_DIR = REEL_DIR / "audio"
BLOCKS_DIR = AUDIO_DIR / "blocks"
PUBLIC_REELS = BASE_DIR / "project_tech" / "public" / "reels" / "islands_19"
BGM_PATH = BASE_DIR / "project_tech" / "assets" / "background_music" / "Death of a Bluebird - Rorschach Roy 4.mp3"

BLOCKS_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)

TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.0

VOICE_SCRIPT = [
    {
        "id": "island01_hook",
        "speaker": "narrator",
        "text": "You are given a 2D grid of ones and zeros. How do you count every isolated island in just one pass?",
        "exag": 0.74,
        "gap_after": 40,
        "cues": [
            {"phrase": "2D grid", "cue": "grid_spawn", "rel_pct": 0.30},
            {"phrase": "isolated island", "cue": "islands_glow", "rel_pct": 0.70}
        ]
    },
    {
        "id": "island02_nemi",
        "speaker": "nemi",
        "text": "Won't we count the same island ten times? 🤔",
        "gap_after": 40,
        "cues": [
            {"phrase": "same island", "cue": "double_count_trap", "rel_pct": 0.50}
        ]
    },
    {
        "id": "island03_sink",
        "speaker": "narrator",
        "text": "Not if you sink it! When your scanner hits a one, count one island, then trigger a flood wave.",
        "exag": 0.76,
        "gap_after": 40,
        "cues": [
            {"phrase": "sink it", "cue": "sink_title_stamp", "rel_pct": 0.25},
            {"phrase": "count one island", "cue": "counter_pop_1", "rel_pct": 0.65},
            {"phrase": "flood wave", "cue": "flood_wave_expand", "rel_pct": 0.85}
        ]
    },
    {
        "id": "island04_dfs",
        "speaker": "narrator",
        "text": "A quick depth-first search turns all connected land tiles into water instantly.",
        "exag": 0.75,
        "gap_after": 40,
        "cues": [
            {"phrase": "depth-first search", "cue": "dfs_laser_ripple", "rel_pct": 0.40},
            {"phrase": "into water", "cue": "tiles_morph_zero", "rel_pct": 0.80}
        ]
    },
    {
        "id": "island05_nemi",
        "speaker": "nemi",
        "text": "So the island vanishes, and we never double-count it! 😎⚡",
        "gap_after": 40,
        "cues": [
            {"phrase": "island vanishes", "cue": "island_submerged_splash", "rel_pct": 0.40},
            {"phrase": "never double-count", "cue": "clean_sweep_speed", "rel_pct": 0.80}
        ]
    },
    {
        "id": "island06_loop",
        "speaker": "narrator",
        "text": "That's how LeetCode 200 solves the entire matrix in pure linear O of M times N time.",
        "exag": 0.73,
        "gap_after": 60,
        "cues": [
            {"phrase": "LeetCode 200", "cue": "victory_badge_bloom", "rel_pct": 0.30},
            {"phrase": "O of M times N", "cue": "complexity_lock", "rel_pct": 0.75}
        ]
    }
]

def normalize_lufs(y: np.ndarray, sr: int, target_lufs: float) -> np.ndarray:
    meter = pyln.Meter(sr)
    current_lufs = meter.integrated_loudness(y)
    if np.isinf(current_lufs) or np.isnan(current_lufs):
        return y
    gain_db = target_lufs - current_lufs
    gain_linear = 10.0 ** (gain_db / 20.0)
    y_norm = y * gain_linear
    peak = np.max(np.abs(y_norm))
    if peak > 0.98:
        y_norm = y_norm * (0.98 / peak)
    return y_norm

async def generate_nemi_edge(text: str, out_wav: Path):
    clean_text = text.replace("🤔", "").replace("😎⚡", "").strip()
    communicate = edge_tts.Communicate(clean_text, "en-US-AnaNeural", pitch="+14Hz", rate="+30%")
    temp_mp3 = out_wav.with_suffix(".mp3")
    await communicate.save(str(temp_mp3))
    
    y, sr = librosa.load(str(temp_mp3), sr=24000)
    y_trim, _ = librosa.effects.trim(y, top_db=30)
    sf.write(str(out_wav), y_trim, 24000)
    if temp_mp3.exists():
        temp_mp3.unlink()

def generate_voice_blocks():
    print("🎙️ Initializing ChatterboxTTS...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    chatter = ChatterboxTTS.from_pretrained(device=device)

    generated_blocks = []

    for block in VOICE_SCRIPT:
        b_id = block["id"]
        speaker = block["speaker"]
        text = block["text"]
        out_wav = BLOCKS_DIR / f"{b_id}.wav"

        print(f"🔊 Generating [{speaker}] {b_id}: {text}")

        if speaker == "narrator":
            clean_text = (
                text.replace("2D", "two D")
                .replace("200", "two hundred")
                .replace("O of M times N", "O of M times N")
            )
            wav_tensor = chatter.generate(
                text=clean_text,
                exaggeration=block.get("exag", 0.74)
            )
            if wav_tensor.ndim > 1:
                wav_tensor = wav_tensor.squeeze()
            y = wav_tensor.cpu().numpy()
            y_trim, _ = librosa.effects.trim(y, top_db=30)
            sf.write(str(out_wav), y_trim, 24000)
        else:
            asyncio.run(generate_nemi_edge(text, out_wav))

        y, sr = librosa.load(str(out_wav), sr=24000)
        duration_ms = int(len(y) / sr * 1000)
        generated_blocks.append({
            **block,
            "wav_path": str(out_wav),
            "duration_ms": duration_ms
        })

    return generated_blocks

def assemble_master_audio(blocks):
    print("🎛️ Assembling Voice Track & Dynamic BGM Ducking...")
    sample_rate = 24000
    fps = 30
    
    master_samples = []
    timeline_blocks = []
    current_ms = 0
    
    for b in blocks:
        y, sr = librosa.load(b["wav_path"], sr=sample_rate)
        
        start_ms = current_ms
        duration_ms = int(len(y) / sr * 1000)
        end_ms = start_ms + duration_ms
        start_frame = round(start_ms * fps / 1000)
        end_frame = round(end_ms * fps / 1000)
        
        cues_computed = []
        for cue in b.get("cues", []):
            cue_ms = start_ms + int(duration_ms * cue.get("rel_pct", 0.5))
            cues_computed.append({
                "phrase": cue["phrase"],
                "cue": cue["cue"],
                "frame": round(cue_ms * fps / 1000)
            })
            
        timeline_blocks.append({
            "id": b["id"],
            "speaker": b["speaker"],
            "text": b["text"],
            "start_ms": start_ms,
            "end_ms": end_ms,
            "duration_ms": duration_ms,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "cues": cues_computed,
            "wav_path": b["wav_path"]
        })
        
        master_samples.append(y)
        gap_samples = int(sample_rate * (b.get("gap_after", 40) / 1000))
        master_samples.append(np.zeros(gap_samples, dtype=np.float32))
        
        current_ms += duration_ms + b.get("gap_after", 40)

    voice_track = np.concatenate(master_samples)
    voice_track = normalize_lufs(voice_track, sample_rate, TARGET_VOICE_LUFS)
    
    voice_track_path = AUDIO_DIR / "voice_track.wav"
    sf.write(str(voice_track_path), voice_track, sample_rate)
    
    total_voice_ms = current_ms
    total_frames = round(total_voice_ms * fps / 1000)
    print(f"⏱️ Total Voice Duration: {total_voice_ms/1000:.2f}s ({total_frames} frames @ 30fps)")

    # BGM Ducking
    master_wav_path = AUDIO_DIR / "voiceover.mp3"
    public_master_path = PUBLIC_REELS / "voiceover.mp3"
    
    if BGM_PATH.exists():
        bgm_y, bgm_sr = librosa.load(str(BGM_PATH), sr=sample_rate)
        if len(bgm_y) < len(voice_track):
            reps = int(np.ceil(len(voice_track) / len(bgm_y)))
            bgm_y = np.tile(bgm_y, reps)
        bgm_y = bgm_y[:len(voice_track)]
        
        bgm_y = normalize_lufs(bgm_y, sample_rate, -28.0)
        final_mix = voice_track + bgm_y
        final_mix = normalize_lufs(final_mix, sample_rate, TARGET_MASTER_LUFS)
        sf.write(str(master_wav_path), final_mix, sample_rate)
    else:
        sf.write(str(master_wav_path), voice_track, sample_rate)

    shutil.copy(master_wav_path, public_master_path)
    print(f"✅ Voiceover mixed & copied to {public_master_path}")
    
    return timeline_blocks, total_voice_ms, total_frames

def generate_subtitles_whisper(timeline_blocks, total_frames, total_ms):
    print("📝 Running Faster-Whisper for Subtitle Synchronization...")
    whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
    
    voice_track_path = str(AUDIO_DIR / "voice_track.wav")
    segments, _ = whisper_model.transcribe(voice_track_path, word_timestamps=True)
    
    words_list = []
    fps = 30
    
    for seg in segments:
        for w in seg.words:
            w_text = w.word.strip()
            if w_text.lower() == "2d":
                w_text = "2D"
            elif w_text.lower() == "200":
                w_text = "200"
                
            w_start_ms = int(w.start * 1000)
            w_end_ms = int(w.end * 1000)
            w_start_frame = round(w_start_ms * fps / 1000)
            w_end_frame = round(w_end_ms * fps / 1000)
            
            words_list.append({
                "word": w_text,
                "start_ms": w_start_ms,
                "end_ms": w_end_ms,
                "start_frame": w_start_frame,
                "end_frame": w_end_frame
            })

    # Chunk into 3-4 word phrases
    chunks = []
    chunk_size = 4
    for i in range(0, len(words_list), chunk_size):
        chunk_words = words_list[i:i+chunk_size]
        if not chunk_words:
            continue
        c_start_frame = chunk_words[0]["start_frame"]
        c_end_frame = chunk_words[-1]["end_frame"]
        c_text = " ".join(cw["word"] for cw in chunk_words)
        chunks.append({
            "id": f"sub_{i//chunk_size+1:03d}",
            "text": c_text,
            "start_frame": c_start_frame,
            "end_frame": c_end_frame,
            "words": chunk_words
        })

    timeline_data = {
        "reel_id": "islands_19",
        "title": "LeetCode #200: Number of Islands",
        "total_ms": total_ms,
        "total_frames": total_frames,
        "blocks": timeline_blocks,
        "subtitles": chunks,
        "words": words_list
    }

    timeline_path = REEL_DIR / "timeline.json"
    with open(timeline_path, "w", encoding="utf-8") as f:
        json.dump(timeline_data, f, indent=2)

    print(f"✅ Generated {len(chunks)} subtitle chunks in {timeline_path}")

def main():
    blocks = generate_voice_blocks()
    timeline_blocks, total_ms, total_frames = assemble_master_audio(blocks)
    generate_subtitles_whisper(timeline_blocks, total_frames, total_ms)
    print("🎉 LeetCode #200 Audio pipeline complete!")

if __name__ == "__main__":
    main()
