#!/usr/bin/env python3
"""
Audio Pipeline for Reel #16: Trapping Rain Water (LeetCode 42)
Engine: ChatterboxTTS (Narrator) + Edge-TTS (Nemi AnaNeural)
Features:
- Zero-pause silence trimming (librosa top_db=30)
- Loudness normalization (pyloudnorm -16.0 LUFS)
- Accurate word timestamp generation (faster_whisper)
- BGM sidechain ducking & normalization to -15.0 LUFS
"""

import os
import json
import shutil
import asyncio
import subprocess
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
REEL_DIR = BASE_DIR / "project_tech" / "reels" / "rainwater_16"
AUDIO_DIR = REEL_DIR / "audio"
BLOCKS_DIR = AUDIO_DIR / "blocks"
PUBLIC_REELS = BASE_DIR / "project_tech" / "public" / "reels" / "rainwater_16"
BGM_PATH = BASE_DIR / "project_tech" / "assets" / "background_music" / "Death of a Bluebird - Rorschach Roy 4.mp3"

BLOCKS_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)

TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.0

VOICE_SCRIPT = [
    {
        "id": "rw01_hook",
        "speaker": "narrator",
        "text": "How much rain water can an elevation map trap without checking every single block?",
        "exag": 0.72,
        "gap_after": 80,
        "cues": [
            {"phrase": "elevation map", "cue": "terrain_spawn", "rel_pct": 0.35},
            {"phrase": "rain water", "cue": "water_spawn", "rel_pct": 0.75}
        ]
    },
    {
        "id": "rw02_nemi",
        "speaker": "nemi",
        "text": "Can't we just create two arrays for Left-Max and Right-Max? 🤔",
        "gap_after": 80,
        "cues": [
            {"phrase": "two arrays", "cue": "array_spawn", "rel_pct": 0.50}
        ]
    },
    {
        "id": "rw03_trap",
        "speaker": "narrator",
        "text": "That wastes O(N) extra RAM! Two pointers solve it in constant O(1) space.",
        "exag": 0.75,
        "gap_after": 80,
        "cues": [
            {"phrase": "extra RAM", "cue": "ram_warning", "rel_pct": 0.40},
            {"phrase": "constant O(1) space", "cue": "two_pointers_reveal", "rel_pct": 0.80}
        ]
    },
    {
        "id": "rw04_bottleneck",
        "speaker": "narrator",
        "text": "Water height is always trapped by the shorter wall. So we only advance the smaller pointer!",
        "exag": 0.72,
        "gap_after": 80,
        "cues": [
            {"phrase": "shorter wall", "cue": "shorter_wall_focus", "rel_pct": 0.45},
            {"phrase": "smaller pointer", "cue": "pointer_step", "rel_pct": 0.85}
        ]
    },
    {
        "id": "rw05_simulation",
        "speaker": "narrator",
        "text": "Both sides march inward, filling every valley until BAM! They meet at the peak.",
        "exag": 0.75,
        "gap_after": 80,
        "cues": [
            {"phrase": "filling every valley", "cue": "water_fill_wave", "rel_pct": 0.45},
            {"phrase": "They meet", "cue": "peak_collision", "rel_pct": 0.85}
        ]
    },
    {
        "id": "rw06_nemi",
        "speaker": "nemi",
        "text": "Zero extra memory and 6 lines of code! 😎⚡",
        "gap_after": 80,
        "cues": [
            {"phrase": "Zero extra memory", "cue": "nemi_smug", "rel_pct": 0.60}
        ]
    },
    {
        "id": "rw07_loop",
        "speaker": "narrator",
        "text": "That's how two pointers trap rain water in linear time.",
        "exag": 0.70,
        "gap_after": 100,
        "cues": [
            {"phrase": "linear time", "cue": "loop_seam", "rel_pct": 0.75}
        ]
    }
]

def normalize_lufs(y: np.ndarray, sr: int, target_lufs: float) -> np.ndarray:
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

def trim_silence(y: np.ndarray, sr: int, top_db: int = 30) -> np.ndarray:
    trimmed, _ = librosa.effects.trim(y, top_db=top_db)
    return trimmed

async def generate_nemi_block(text: str, out_wav: Path, sr: int = 24000):
    clean_text = text.replace("🤔", "").replace("😎", "").replace("⚡", "").strip()
    communicate = edge_tts.Communicate(
        clean_text,
        voice="en-US-AnaNeural",
        pitch="+12Hz",
        rate="+20%"
    )
    temp_mp3 = out_wav.with_suffix(".temp.mp3")
    await communicate.save(str(temp_mp3))
    subprocess.run([
        "ffmpeg", "-y", "-i", str(temp_mp3),
        "-ar", str(sr), "-ac", "1", str(out_wav)
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if temp_mp3.exists():
        temp_mp3.unlink()

def extract_subtitles_whisper(audio_path: Path, fps: int = 30):
    print("🔍 Extracting Millisecond-Accurate Word Timestamps (faster_whisper)...")
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(str(audio_path), word_timestamps=True, language="en")
    
    words_all = []
    subtitles = []
    
    current_chunk = []
    for segment in segments:
        for w in segment.words:
            word_clean = w.word.strip()
            if not word_clean:
                continue
            start_f = int(round(w.start * fps))
            end_f = int(round(w.end * fps))
            word_obj = {
                "word": word_clean,
                "start_ms": int(round(w.start * 1000)),
                "end_ms": int(round(w.end * 1000)),
                "start_frame": start_f,
                "end_frame": max(start_f + 2, end_f)
            }
            words_all.append(word_obj)
            current_chunk.append(word_obj)
            
            # Form 3-4 word punchy subtitle chunks
            if len(current_chunk) >= 4 or word_clean.endswith((".", "!", "?", "—")):
                chunk_text = " ".join([cw["word"] for cw in current_chunk])
                subtitles.append({
                    "id": f"sub_{len(subtitles)+1:03d}",
                    "text": chunk_text,
                    "start_frame": current_chunk[0]["start_frame"],
                    "end_frame": current_chunk[-1]["end_frame"] + 4,
                    "words": current_chunk
                })
                current_chunk = []
                
    if current_chunk:
        chunk_text = " ".join([cw["word"] for cw in current_chunk])
        subtitles.append({
            "id": f"sub_{len(subtitles)+1:03d}",
            "text": chunk_text,
            "start_frame": current_chunk[0]["start_frame"],
            "end_frame": current_chunk[-1]["end_frame"] + 4,
            "words": current_chunk
        })
        
    return subtitles, words_all

def main():
    print("🚀 Initializing Chatterbox TTS for Reel #16 (Trapping Rain Water)...")
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model = None

    sr = 24000
    timeline_events = []
    current_time_ms = 0
    audio_inputs = []
    filter_parts = []
    input_idx = 0

    for i, event in enumerate(VOICE_SCRIPT, 1):
        event_id = event["id"]
        speaker = event["speaker"]
        text = event["text"]
        exag = event.get("exag", 0.72)
        gap_after = event.get("gap_after", 80)
        out_wav = BLOCKS_DIR / f"{event_id}.wav"

        if not out_wav.exists():
            if speaker == "nemi":
                print(f"[{i:2d}/{len(VOICE_SCRIPT)}] Generating '{event_id}' (NEMI): \"{text}\"")
                asyncio.run(generate_nemi_block(text, out_wav, sr=sr))
                y, _ = sf.read(str(out_wav))
            else:
                if model is None:
                    model = ChatterboxTTS.from_pretrained(device=device)
                print(f"[{i:2d}/{len(VOICE_SCRIPT)}] Generating '{event_id}' (NARRATOR): \"{text}\"")
                wav_tensor = model.generate(text=text, exaggeration=exag)
                if wav_tensor.ndim > 1:
                    wav_tensor = wav_tensor.squeeze()
                y = wav_tensor.cpu().numpy()

            y_trimmed = trim_silence(y, sr, top_db=30)
            y_norm = normalize_lufs(y_trimmed, sr, TARGET_VOICE_LUFS)
            sf.write(str(out_wav), y_norm, sr)
        else:
            y_norm, _ = sf.read(str(out_wav))

        dur_s = len(y_norm) / sr
        dur_ms = int(round(dur_s * 1000))

        start_ms = current_time_ms
        end_ms = start_ms + dur_ms
        start_frame = int(round(start_ms / 1000 * 30))
        end_frame = int(round(end_ms / 1000 * 30))

        cues = []
        for sp in event.get("cues", []):
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

    # Master BGM Sidechain Ducking
    master_audio_mp3 = PUBLIC_REELS / "voiceover.mp3"
    reel_audio_mp3 = REEL_DIR / "voiceover.mp3"

    cmd_master = [
        "ffmpeg", "-y",
        "-i", str(voice_master_wav),
        "-i", str(BGM_PATH),
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
    shutil.copy(master_audio_mp3, reel_audio_mp3)

    # Extract subtitles
    subtitles, words_all = extract_subtitles_whisper(voice_master_wav, fps=30)

    timeline_data = {
        "composition": "NemiExplainsRainWater",
        "fps": 30,
        "total_duration_s": round(total_voice_dur_s, 2),
        "total_frames": total_frames,
        "timeline_events": timeline_events,
        "subtitles": subtitles,
        "words": words_all
    }

    timeline_json = REEL_DIR / "timeline.json"
    with open(timeline_json, "w") as f:
        json.dump(timeline_data, f, indent=2)

    print(f"🎉 Pipeline Complete! Duration: {total_voice_dur_s:.2f}s ({total_frames} frames)")
    print(f"📁 Timeline saved to: {timeline_json}")

if __name__ == "__main__":
    main()
