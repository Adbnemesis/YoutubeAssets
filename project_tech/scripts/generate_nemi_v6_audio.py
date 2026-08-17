#!/usr/bin/env python3
"""
Nemi Explains V6 — Creative Re-Architecture Audio Pipeline
Re-generates Chatterbox narration from a completely rewritten curiosity-driven script,
trims silence, normalizes to -16 LUFS, mixes with audible BGM via sidechain ducking,
and exports frame-accurate JSON cues with scene-type annotations.
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
V6_SEGMENTS_DIR = PUBLIC_SOUNDS / "v6_chatterbox_segments"
V6_SEGMENTS_DIR.mkdir(parents=True, exist_ok=True)

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
# V6 NARRATION SCRIPT — Curiosity-driven, short, conversational
# ═══════════════════════════════════════════════════════════════
SCRIPT_SEGMENTS = [
    # BEAT 1 — HOOK
    {"id": "v6_001_hook", "speaker": "narrator", "text": "Your JavaScript keeps making stuff.",
     "emotion": "normal", "exaggeration": 0.45, "pause_after_ms": 80, "beat": "hook", "scene_type": "HookScene"},
    {"id": "v6_002_alot", "speaker": "narrator", "text": "A LOT of stuff.",
     "emotion": "dramatic", "exaggeration": 0.75, "pause_after_ms": 150, "beat": "hook", "scene_type": "HookScene"},

    # BEAT 2 — CURIOSITY
    {"id": "v6_003_question", "speaker": "narrator", "text": "So who cleans all this up?",
     "emotion": "dramatic", "exaggeration": 0.70, "pause_after_ms": 200, "beat": "curiosity", "scene_type": "QuestionScene"},
    {"id": "v6_004_nemi_nope", "speaker": "nemi", "text": "Because I'm not doing it.",
     "emotion": "cheerful", "exaggeration": 0.80, "pause_after_ms": 200, "beat": "curiosity", "scene_type": "QuestionScene"},

    # BEAT 3 — CHALLENGE
    {"id": "v6_005_challenge", "speaker": "narrator", "text": "Which of these can be deleted?",
     "emotion": "dramatic", "exaggeration": 0.65, "pause_after_ms": 300, "beat": "challenge", "scene_type": "ChallengeScene"},
    {"id": "v6_006_nemi_point", "speaker": "nemi", "text": "That one.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 150, "beat": "challenge", "scene_type": "ChallengeScene"},

    # BEAT 4 — FREEZE / SURPRISE
    {"id": "v6_007_butwait", "speaker": "narrator", "text": "But wait.",
     "emotion": "whisper", "exaggeration": 0.35, "pause_after_ms": 400, "beat": "freeze", "scene_type": "FreezeRevealScene"},
    {"id": "v6_008_connected", "speaker": "narrator", "text": "It's still connected.",
     "emotion": "dramatic", "exaggeration": 0.70, "pause_after_ms": 100, "beat": "freeze", "scene_type": "FreezeRevealScene"},
    {"id": "v6_009_nemi_oh", "speaker": "nemi", "text": "Oh.",
     "emotion": "excited", "exaggeration": 0.85, "pause_after_ms": 200, "beat": "freeze", "scene_type": "FreezeRevealScene"},

    # BEAT 5 — INVESTIGATION
    {"id": "v6_010_v8starts", "speaker": "narrator", "text": "V8 starts here.",
     "emotion": "normal", "exaggeration": 0.45, "pause_after_ms": 100, "beat": "investigate", "scene_type": "GraphTraversalScene"},
    {"id": "v6_011_follows", "speaker": "narrator", "text": "Then follows every connection.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 150, "beat": "investigate", "scene_type": "GraphTraversalScene"},

    # BEAT 6 — RULE
    {"id": "v6_012_stays", "speaker": "narrator", "text": "Anything it can reach stays.",
     "emotion": "cheerful", "exaggeration": 0.75, "pause_after_ms": 100, "beat": "rule", "scene_type": "GraphTraversalScene"},
    {"id": "v6_013_cant", "speaker": "narrator", "text": "If it can't...",
     "emotion": "dramatic", "exaggeration": 0.60, "pause_after_ms": 350, "beat": "rule", "scene_type": "GraphTraversalScene"},
    {"id": "v6_014_goes", "speaker": "narrator", "text": "...it goes.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 100, "beat": "rule", "scene_type": "GraphTraversalScene"},

    # BEAT 7 — CLIMAX
    {"id": "v6_015_nemi_bye", "speaker": "nemi", "text": "Bye.",
     "emotion": "cheerful", "exaggeration": 0.80, "pause_after_ms": 200, "beat": "climax", "scene_type": "RapidCleanupScene"},

    # BEAT 8 — COMPACTION
    {"id": "v6_016_packed", "speaker": "narrator", "text": "And then everything gets packed together.",
     "emotion": "cheerful", "exaggeration": 0.75, "pause_after_ms": 200, "beat": "compact", "scene_type": "CompactionScene"},

    # BEAT 9 — PAYOFF
    {"id": "v6_017_notmagic", "speaker": "narrator", "text": "Garbage collection isn't magic.",
     "emotion": "normal", "exaggeration": 0.45, "pause_after_ms": 150, "beat": "payoff", "scene_type": "PayoffScene"},
    {"id": "v6_018_clears", "speaker": "narrator", "text": "It finds what's alive and clears the rest.",
     "emotion": "normal", "exaggeration": 0.50, "pause_after_ms": 100, "beat": "payoff", "scene_type": "PayoffScene"},
    {"id": "v6_019_nemi_better", "speaker": "nemi", "text": "Much better.",
     "emotion": "happy", "exaggeration": 0.80, "pause_after_ms": 600, "beat": "payoff", "scene_type": "EndScene"},
]

TARGET_LUFS = -16.0

def get_duration(audio_path):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration",
           "-of", "default=noprint_wrappers=1:nokey=1", str(audio_path)]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def trim_silence(y, sr, top_db=35):
    """Trim leading/trailing silence."""
    if HAS_LIBROSA:
        y_trimmed, _ = librosa.effects.trim(y, top_db=top_db)
        return y_trimmed
    # Fallback: simple amplitude threshold
    threshold = 10 ** (-top_db / 20) * np.max(np.abs(y))
    above = np.where(np.abs(y) > threshold)[0]
    if len(above) == 0:
        return y
    return y[above[0]:above[-1]+1]

def normalize_lufs(y, sr, target):
    """Normalize to target LUFS."""
    if HAS_PYLN:
        meter = pyln.Meter(sr)
        lufs = meter.integrated_loudness(y)
        if lufs > -90:
            return pyln.normalize.loudness(y, lufs, target)
    return y

def main():
    print("═" * 65)
    print("🎬  NEMI EXPLAINS V6 — CREATIVE RE-ARCHITECTURE AUDIO PIPELINE")
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
        pause_after = seg.get("pause_after_ms", 150)

        out_wav = V6_SEGMENTS_DIR / f"{seg_id}.wav"

        print(f"[{i}/{len(SCRIPT_SEGMENTS)}] Generating '{seg_id}' ({seg['speaker']}) [{seg['emotion']}]: \"{text}\"")
        wav_tensor = model.generate(text=text, exaggeration=exag)
        if wav_tensor.ndim > 1:
            wav_tensor = wav_tensor.squeeze()

        y = wav_tensor.cpu().numpy()

        # Trim silence
        y = trim_silence(y, sr, top_db=35)

        # Normalize to target LUFS
        y = normalize_lufs(y, sr, TARGET_LUFS)

        # Clip to prevent distortion
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
            "scene_type": seg["scene_type"],
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

    # ── Merge voice segments (normalize=0 to prevent volume scaling) ──
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    fc = f"{';'.join(filter_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0:normalize=0[voiceout]"

    voice_track = PUBLIC_SOUNDS / "nemi_v6_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", fc, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Voice Track: {voice_track.name}")

    # ── Mix with BGM using sidechain compression ──
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v6_master_audio.mp3"

    if bgm_file.exists():
        mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(voice_track),
            "-ss", "45", "-i", str(bgm_file),
            "-filter_complex",
            # BGM pre-gain 0.22 (more audible than V5's 0.15)
            # Sidechain: threshold=0.06, ratio=10, attack=15ms, release=300ms
            # Final loudnorm to -14 LUFS (platform standard)
            "[1:a]volume=0.22[bgm_pre];"
            "[bgm_pre][0:a]sidechaincompress=threshold=0.06:ratio=10:attack=15:release=300[bgm_ducked];"
            "[0:a][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=0[master_raw];"
            "[master_raw]loudnorm=I=-14:TP=-1.5[master]",
            "-map", "[master]",
            "-b:a", "192k",
            str(final_master)
        ]
        subprocess.run(mix_cmd, check=True, capture_output=True)
        print(f"✅ Master Audio (Voice + Sidechain-Ducked BGM): {final_master.name}")
    else:
        import shutil
        shutil.copy(voice_track, final_master)

    # ── Save structured cue metadata ──
    metadata = {
        "engine": "chatterbox-tts",
        "version": "v6",
        "sample_rate": sr,
        "target_voice_lufs": TARGET_LUFS,
        "total_duration_s": round(total_dur, 3),
        "total_frames": total_frames,
        "fps": 30,
        "segments": generated_cues,
    }

    cue_path = BASE_DIR / "src" / "data" / "nemi_v6_cues.json"
    cue_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cue_path, "w") as f:
        json.dump(metadata, f, indent=2)
    with open(PUBLIC_SOUNDS / "nemi_v6_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"📄 Saved V6 cues to {cue_path}")
    print(f"\n🎉 V6 AUDIO GENERATION COMPLETE!")

if __name__ == "__main__":
    main()
