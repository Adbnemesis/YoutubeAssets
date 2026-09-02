#!/usr/bin/env python3
"""
Audio Pipeline for Reel #17: Climbing Stairs (LeetCode 70)
Engine: ChatterboxTTS (Narrator) + Edge-TTS (Nemi AnaNeural)
Target Duration: ~21.5s - 22.8s (Law 8 Golden Retention Zone)
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
REEL_DIR = BASE_DIR / "project_tech" / "reels" / "climbing_stairs_17"
AUDIO_DIR = REEL_DIR / "audio"
BLOCKS_DIR = AUDIO_DIR / "blocks"
PUBLIC_REELS = BASE_DIR / "project_tech" / "public" / "reels" / "climbing_stairs_17"
BGM_PATH = BASE_DIR / "project_tech" / "assets" / "background_music" / "Death of a Bluebird - Rorschach Roy 4.mp3"

BLOCKS_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)

TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.0

VOICE_SCRIPT = [
    {
        "id": "cs01_hook",
        "speaker": "narrator",
        "text": "Can you climb 100 stairs with 1 or 2 steps? Pure recursion freezes your CPU!",
        "exag": 0.72,
        "gap_after": 60,
        "cues": [
            {"phrase": "100 stairs", "cue": "staircase_spawn", "rel_pct": 0.35},
            {"phrase": "freezes your CPU", "cue": "cpu_warning", "rel_pct": 0.80}
        ]
    },
    {
        "id": "cs02_nemi",
        "speaker": "nemi",
        "text": "Can't we just return climb(n-1) plus climb(n-2)? 🤔",
        "gap_after": 60,
        "cues": [
            {"phrase": "climb(n-1)", "cue": "recursion_tree_spawn", "rel_pct": 0.50}
        ]
    },
    {
        "id": "cs03_trap",
        "speaker": "narrator",
        "text": "That recalculates duplicate branches in exponential O(2^N) time!",
        "exag": 0.75,
        "gap_after": 60,
        "cues": [
            {"phrase": "duplicate branches", "cue": "redundant_nodes_highlight", "rel_pct": 0.35},
            {"phrase": "exponential", "cue": "exponential_alert", "rel_pct": 0.75}
        ]
    },
    {
        "id": "cs04_secret",
        "speaker": "narrator",
        "text": "Step N comes from step N-1 or N-2. It's literally Fibonacci!",
        "exag": 0.72,
        "gap_after": 60,
        "cues": [
            {"phrase": "Step N", "cue": "step_n_focus", "rel_pct": 0.30},
            {"phrase": "Fibonacci", "cue": "fibonacci_formula_reveal", "rel_pct": 0.80}
        ]
    },
    {
        "id": "cs05_dp_slider",
        "speaker": "narrator",
        "text": "Just keep the last two numbers. Two variables solve it in O(N) time!",
        "exag": 0.75,
        "gap_after": 60,
        "cues": [
            {"phrase": "last two numbers", "cue": "two_variables_spawn", "rel_pct": 0.35},
            {"phrase": "O(N) time", "cue": "sliding_surge", "rel_pct": 0.75}
        ]
    },
    {
        "id": "cs06_nemi",
        "speaker": "nemi",
        "text": "From exponential meltdown to 4 lines of code! 😎⚡",
        "gap_after": 60,
        "cues": [
            {"phrase": "4 lines of code", "cue": "nemi_smug", "rel_pct": 0.60}
        ]
    },
    {
        "id": "cs07_loop",
        "speaker": "narrator",
        "text": "That's how dynamic programming solves it in O(1) space.",
        "exag": 0.70,
        "gap_after": 80,
        "cues": [
            {"phrase": "O(1) space", "cue": "loop_seam", "rel_pct": 0.75}
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
        rate="+25%"
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
    print("🚀 Initializing Chatterbox TTS for Reel #17 (Climbing Stairs - Golden Zone)...")
    for old_wav in BLOCKS_DIR.glob("*.wav"):
        old_wav.unlink()

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model = ChatterboxTTS.from_pretrained(device=device)

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
        gap_after = event.get("gap_after", 60)
        out_wav = BLOCKS_DIR / f"{event_id}.wav"

        if speaker == "nemi":
            print(f"[{i:2d}/{len(VOICE_SCRIPT)}] Generating '{event_id}' (NEMI): \"{text}\"")
            asyncio.run(generate_nemi_block(text, out_wav, sr=sr))
            y, _ = sf.read(str(out_wav))
        else:
            print(f"[{i:2d}/{len(VOICE_SCRIPT)}] Generating '{event_id}' (NARRATOR): \"{text}\"")
            wav_tensor = model.generate(text=text, exaggeration=exag)
            if wav_tensor.ndim > 1:
                wav_tensor = wav_tensor.squeeze()
            y = wav_tensor.cpu().numpy()

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
        "composition": "NemiExplainsClimbingStairs",
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
