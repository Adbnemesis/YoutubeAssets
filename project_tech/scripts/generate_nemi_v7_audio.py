#!/usr/bin/env python3
"""
Nemi Explains V07 — Micro-Story Audio Pipeline
Implements cohesive 5-block narration with natural conversational pacing,
voice normalization to -16 LUFS, and dynamic BGM sidechain ducking.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
CONFIG_PATH = BASE_DIR / "tech_voice_profile.json"
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"
V7_SEGMENTS_DIR = PUBLIC_SOUNDS / "v7_chatterbox_segments"
V7_SEGMENTS_DIR.mkdir(parents=True, exist_ok=True)

# Monkey-patch watermarker for macOS compatibility
import chatterbox.tts
class DummyWatermarker:
    def apply_watermark(self, wav, *args, **kwargs):
        return wav
chatterbox.tts.perth = type('perth', (), {'PerthImplicitWatermarker': DummyWatermarker})

from chatterbox import ChatterboxTTS
import soundfile as sf
import torch
import numpy as np

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

# ═══════════════════════════════════════════════════════════════
# V7 NARRATION SCRIPT — Micro-Story with Psychological Rhythm
# ═══════════════════════════════════════════════════════════════
SCRIPT_SEGMENTS = [
    # 1. HOOK & QUESTION
    {"id": "v7_001_hook_stuff", "speaker": "narrator", "text": "Your JavaScript keeps making stuff.",
     "emotion": "normal", "exaggeration": 0.45, "pause_after_ms": 60, "beat": "hook"},
    {"id": "v7_002_hook_alot", "speaker": "narrator", "text": "A LOT of stuff.",
     "emotion": "dramatic", "exaggeration": 0.75, "pause_after_ms": 120, "beat": "hook"},
    {"id": "v7_003_question", "speaker": "narrator", "text": "So who cleans it up?",
     "emotion": "dramatic", "exaggeration": 0.70, "pause_after_ms": 150, "beat": "question"},
    {"id": "v7_004_nemi_nope", "speaker": "nemi", "text": "Because I'm not doing it.",
     "emotion": "cheerful", "exaggeration": 0.80, "pause_after_ms": 180, "beat": "question"},

    # 2. VIEWER CHALLENGE & WRONG ASSUMPTION
    {"id": "v7_005_challenge", "speaker": "narrator", "text": "Which one gets deleted?",
     "emotion": "dramatic", "exaggeration": 0.65, "pause_after_ms": 400, "beat": "challenge"}, # 400ms pause for viewer thinking
    {"id": "v7_006_nemi_point", "speaker": "nemi", "text": "That one.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 150, "beat": "nemi_guess"},

    # 3. FREEZE & SURPRISE REVEAL
    {"id": "v7_007_wait", "speaker": "narrator", "text": "Wait.",
     "emotion": "whisper", "exaggeration": 0.35, "pause_after_ms": 300, "beat": "freeze"},
    {"id": "v7_008_nemi_oh", "speaker": "nemi", "text": "Oh.",
     "emotion": "excited", "exaggeration": 0.85, "pause_after_ms": 100, "beat": "reveal"},
    {"id": "v7_009_reachable", "speaker": "narrator", "text": "It's still reachable.",
     "emotion": "dramatic", "exaggeration": 0.70, "pause_after_ms": 140, "beat": "reveal"},

    # 4. ROOT TRACE & THE RULE
    {"id": "v7_010_root_start", "speaker": "narrator", "text": "V8 starts from the roots.",
     "emotion": "normal", "exaggeration": 0.45, "pause_after_ms": 80, "beat": "trace"},
    {"id": "v7_011_follows", "speaker": "narrator", "text": "Then it follows the connections.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 120, "beat": "trace"},
    {"id": "v7_012_stays", "speaker": "narrator", "text": "If it can reach it, it stays.",
     "emotion": "cheerful", "exaggeration": 0.75, "pause_after_ms": 100, "beat": "rule"},
    {"id": "v7_013_cant", "speaker": "narrator", "text": "If it can't...",
     "emotion": "dramatic", "exaggeration": 0.60, "pause_after_ms": 300, "beat": "rule"},
    {"id": "v7_014_goes", "speaker": "narrator", "text": "...it goes.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 120, "beat": "rule"},

    # 5. CLEANUP & PAYOFF
    {"id": "v7_015_nemi_bye", "speaker": "nemi", "text": "Bye.",
     "emotion": "cheerful", "exaggeration": 0.80, "pause_after_ms": 250, "beat": "climax"},
    {"id": "v7_016_payoff_alive", "speaker": "narrator", "text": "It finds what's still alive...",
     "emotion": "normal", "exaggeration": 0.45, "pause_after_ms": 80, "beat": "payoff"},
    {"id": "v7_017_payoff_clears", "speaker": "narrator", "text": "...and clears the rest.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 120, "beat": "payoff"},
    {"id": "v7_018_nemi_better", "speaker": "nemi", "text": "Much better.",
     "emotion": "happy", "exaggeration": 0.80, "pause_after_ms": 500, "beat": "outro"},
]

TARGET_LUFS = -16.0

def trim_silence(y, sr, top_db=35):
    if HAS_LIBROSA:
        y_trimmed, _ = librosa.effects.trim(y, top_db=top_db)
        return y_trimmed
    threshold = 10 ** (-top_db / 20) * np.max(np.abs(y))
    above = np.where(np.abs(y) > threshold)[0]
    if len(above) == 0:
        return y
    return y[above[0]:above[-1]+1]

def normalize_lufs(y, sr, target):
    if HAS_PYLN:
        meter = pyln.Meter(sr)
        lufs = meter.integrated_loudness(y)
        if lufs > -90:
            return pyln.normalize.loudness(y, lufs, target)
    return y

def main():
    print("═" * 65)
    print("🎬  NEMI EXPLAINS V07 — MICRO-STORY AUDIO PIPELINE")
    print("═" * 65)

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"   Engine: Chatterbox Neural Expressive TTS")
    print(f"   Device: {device.upper()}")
    print(f"   Segments: {len(SCRIPT_SEGMENTS)}")
    print(f"   Target Voice LUFS: {TARGET_LUFS}")
    print()

    print("Loading Chatterbox model weights...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    print(f"✅ Model loaded. Sample Rate: {sr} Hz\n")

    generated_cues = []
    current_time_ms = 0
    audio_inputs = []
    filter_parts = []
    input_idx = 0

    for i, seg in enumerate(SCRIPT_SEGMENTS, 1):
        seg_id = seg["id"]
        text = seg["text"]
        exag = seg.get("exaggeration", 0.5)
        pause_after = seg.get("pause_after_ms", 120)

        out_wav = V7_SEGMENTS_DIR / f"{seg_id}.wav"

        print(f"[{i}/{len(SCRIPT_SEGMENTS)}] Generating '{seg_id}' ({seg['speaker']}) [{seg['emotion']}]: \"{text}\"")
        wav_tensor = model.generate(text=text, exaggeration=exag)
        if wav_tensor.ndim > 1:
            wav_tensor = wav_tensor.squeeze()

        y = wav_tensor.cpu().numpy()
        y = trim_silence(y, sr, top_db=35)
        y = normalize_lufs(y, sr, TARGET_LUFS)
        y = np.clip(y, -1.0, 1.0)

        sf.write(str(out_wav), y, sr)

        dur_s = len(y) / sr
        dur_ms = int(dur_s * 1000)
        start_ms = current_time_ms
        end_ms = start_ms + dur_ms
        start_frame = int((start_ms / 1000.0) * 30)
        end_frame = int((end_ms / 1000.0) * 30)

        cue = {
            "id": seg_id,
            "speaker": seg["speaker"],
            "text": text,
            "emotion": seg["emotion"],
            "beat": seg["beat"],
            "duration_s": round(dur_s, 3),
            "start_time_ms": start_ms,
            "end_time_ms": end_ms,
            "start_frame": start_frame,
            "end_frame": end_frame,
        }
        generated_cues.append(cue)
        print(f"   ✓ {dur_s:.2f}s | {start_ms}ms (f{start_frame}) → {end_ms}ms (f{end_frame})")

        audio_inputs.extend(["-i", str(out_wav)])
        filter_parts.append(f"[{input_idx}:a]adelay={start_ms}|{start_ms}[a{input_idx}]")
        input_idx += 1

        current_time_ms = end_ms + pause_after

    total_dur = current_time_ms / 1000.0
    total_frames = int(total_dur * 30)

    print(f"\n{'─' * 65}")
    print(f"⏱  Total Duration: {total_dur:.2f}s ({total_frames} frames @ 30fps)")
    print(f"{'─' * 65}\n")

    # Merge voice track
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    fc = f"{';'.join(filter_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0:normalize=0[voiceout]"

    voice_track = PUBLIC_SOUNDS / "nemi_v7_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", fc, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Voice Track: {voice_track.name}")

    # Mix with BGM using sidechain ducking
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v7_master_audio.mp3"

    if bgm_file.exists():
        mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(voice_track),
            "-ss", "45", "-i", str(bgm_file),
            "-filter_complex",
            "[1:a]volume=0.24[bgm_pre];"
            "[bgm_pre][0:a]sidechaincompress=threshold=0.06:ratio=10:attack=15:release=300[bgm_ducked];"
            "[0:a][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=0[master_raw];"
            "[master_raw]loudnorm=I=-14:TP=-1.5[master]",
            "-map", "[master]",
            "-b:a", "192k",
            str(final_master)
        ]
        subprocess.run(mix_cmd, check=True, capture_output=True)
        print(f"✅ Master Audio: {final_master.name}")
    else:
        import shutil
        shutil.copy(voice_track, final_master)

    # Save timing metadata
    metadata = {
        "engine": "chatterbox-tts",
        "version": "v7",
        "sample_rate": sr,
        "target_voice_lufs": TARGET_LUFS,
        "total_duration_s": round(total_dur, 3),
        "total_frames": total_frames,
        "fps": 30,
        "segments": generated_cues,
    }

    cue_path = BASE_DIR / "src" / "data" / "nemi_v7_cues.json"
    cue_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cue_path, "w") as f:
        json.dump(metadata, f, indent=2)
    with open(PUBLIC_SOUNDS / "nemi_v7_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"📄 Saved V7 cues to {cue_path}")
    print(f"\n🎉 V7 AUDIO GENERATION COMPLETE!")

if __name__ == "__main__":
    main()
