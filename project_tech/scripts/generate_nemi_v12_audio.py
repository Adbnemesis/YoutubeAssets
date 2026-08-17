#!/usr/bin/env python3
"""
Nemi Explains V12 — Master Speaker Orchestration Audio Pipeline
Topic: "Why Does 0.1 + 0.2 Not Equal 0.3?" (Mystery Archetype ~21.5s @ 30fps)
Guarantees 0.00ms accidental speaker overlap with strict deterministic state machine.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"
V12_BLOCKS_DIR = PUBLIC_SOUNDS / "v12_chatterbox_blocks"
V12_BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

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
# V12 MASTER SPEAKER TIMELINE (Mystery Archetype ~21.5s)
# ═══════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    # 1. Beat 1: The Impossible Result
    {
        "id": "v12_narrator_01_hook",
        "speaker": "narrator",
        "text": "Your computer just calculated 0.1 plus 0.2. And got this.",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "0.1 plus 0.2", "cue": "code_eval", "rel_pct": 0.40},
            {"phrase": "got this", "cue": "error_result_pop", "rel_pct": 0.80},
        ]
    },
    # 2. Beat 1b: Nemi Confusion
    {
        "id": "v12_nemi_01_what",
        "speaker": "nemi",
        "text": "Wait, what?!",
        "emotion": "puzzled",
        "exaggeration": 0.85,
        "gap_after_ms": 120,
        "semantic_phrases": [{"phrase": "Wait, what", "cue": "nemi_shocked", "rel_pct": 0.5}]
    },
    # 3. Beat 2: The Mystery Question
    {
        "id": "v12_narrator_02_question",
        "speaker": "narrator",
        "text": "Why does a supercomputer fail grade-school math?",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "supercomputer fail", "cue": "mystery_question_card", "rel_pct": 0.40},
        ]
    },
    # 4. Beat 3: Binary Repeating Fraction
    {
        "id": "v12_narrator_03_binary",
        "speaker": "narrator",
        "text": "Computers store numbers in binary. And in base-2, 0.1 is an infinite repeating fraction.",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "numbers in binary", "cue": "binary_grid_enter", "rel_pct": 0.30},
            {"phrase": "repeating fraction", "cue": "infinite_fraction_expand", "rel_pct": 0.75},
        ]
    },
    # 5. Beat 4: 53-Bit Approximation & Addition
    {
        "id": "v12_narrator_04_approx",
        "speaker": "narrator",
        "text": "So it rounds to 53 bits. Adding those two approximations leaves that extra 4 at the end.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "53 bits", "cue": "bit_rounding_highlight", "rel_pct": 0.25},
            {"phrase": "extra 4 at the end", "cue": "trailing_four_zoom", "rel_pct": 0.75},
        ]
    },
    # 6. Beat 5: The "Aha!" Discovery
    {
        "id": "v12_narrator_05_aha",
        "speaker": "narrator",
        "text": "Your computer didn't get math wrong. It just ran out of bits.",
        "emotion": "happy",
        "exaggeration": 0.60,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "didn't get math wrong", "cue": "aha_transformation", "rel_pct": 0.35},
            {"phrase": "out of bits", "cue": "master_takeaway", "rel_pct": 0.75},
        ]
    },
    # 7. Beat 6: Nemi Smug Reaction
    {
        "id": "v12_nemi_02_sneaky",
        "speaker": "nemi",
        "text": "Sneaky binary!",
        "emotion": "happy",
        "exaggeration": 0.80,
        "gap_after_ms": 200,
        "semantic_phrases": [{"phrase": "Sneaky binary", "cue": "nemi_celebration", "rel_pct": 0.5}]
    },
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
    if HAS_PYLN and len(y) >= int(0.4 * sr):
        try:
            meter = pyln.Meter(sr)
            lufs = meter.integrated_loudness(y)
            if lufs > -90:
                return pyln.normalize.loudness(y, lufs, target)
        except Exception:
            pass
    max_val = np.max(np.abs(y)) if len(y) > 0 else 0
    if max_val > 0:
        return y * (0.8 / max_val)
    return y

def main():
    print("═" * 70)
    print("🎙️  NEMI EXPLAINS V12 — 0.1 + 0.2 FLOATING POINT MYSTERY AUDIO")
    print("═" * 70)

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"   Engine: Chatterbox Neural Expressive TTS")
    print(f"   Device: {device.upper()}")
    print(f"   Events: {len(SPEAKER_EVENTS)} (Strict Non-Overlapping Sequence)")
    print(f"   Target Voice LUFS: {TARGET_LUFS}\n")

    print("Loading Chatterbox model weights...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    print(f"✅ Model loaded. Sample Rate: {sr} Hz\n")

    timeline_events = []
    current_time_ms = 0
    audio_inputs = []
    filter_parts = []
    input_idx = 0

    # Strict sequential state machine
    for i, event in enumerate(SPEAKER_EVENTS, 1):
        event_id = event["id"]
        speaker = event["speaker"]
        text = event["text"]
        exag = event.get("exaggeration", 0.55)
        gap_after = event.get("gap_after_ms", 100)

        out_wav = V12_BLOCKS_DIR / f"{event_id}.wav"

        print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' ({speaker}) [{event['emotion']}]: \"{text}\"")
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

        # Calculate semantic phrase timings
        semantic_cues = []
        for sp in event.get("semantic_phrases", []):
            cue_ms = start_ms + int(dur_ms * sp["rel_pct"])
            cue_frame = int((cue_ms / 1000.0) * 30)
            semantic_cues.append({
                "phrase": sp["phrase"],
                "cue": sp["cue"],
                "time_ms": cue_ms,
                "frame": cue_frame
            })

        event_meta = {
            "id": event_id,
            "speaker": speaker,
            "text": text,
            "emotion": event["emotion"],
            "duration_s": round(dur_s, 3),
            "start_time_ms": start_ms,
            "end_time_ms": end_ms,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "gap_after_ms": gap_after,
            "interrupt": False,
            "semantic_cues": semantic_cues
        }
        timeline_events.append(event_meta)
        print(f"   ✓ {dur_s:.2f}s | {start_ms}ms (f{start_frame}) → {end_ms}ms (f{end_frame}) [gap: {gap_after}ms]")

        audio_inputs.extend(["-i", str(out_wav)])
        filter_parts.append(f"[{input_idx}:a]adelay={start_ms}|{start_ms}[a{input_idx}]")
        input_idx += 1

        # Advance timeline by duration + gap (GUARANTEES 0ms overlap!)
        current_time_ms = end_ms + gap_after

    total_dur = (current_time_ms + 50) / 1000.0
    total_frames = int(total_dur * 30)

    print(f"\n{'─' * 70}")
    print(f"⏱  Total Master Duration: {total_dur:.2f}s ({total_frames} frames @ 30fps)")
    print(f"{'─' * 70}\n")

    # Merge unified voice track
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    fc = f"{';'.join(filter_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0:normalize=0[voiceout]"

    voice_track = PUBLIC_SOUNDS / "nemi_v12_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", fc, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {voice_track.name}")

    # Mix with BGM using dynamic sidechain ducking
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v12_master_audio.mp3"

    if bgm_file.exists():
        mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(voice_track),
            "-ss", "45", "-i", str(bgm_file),
            "-filter_complex",
            "[1:a]volume=0.23[bgm_pre];"
            "[bgm_pre][0:a]sidechaincompress=threshold=0.06:ratio=10:attack=15:release=300[bgm_ducked];"
            "[0:a][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=0[master_raw];"
            "[master_raw]loudnorm=I=-14.0:TP=-1.5:LRA=3.0[master]",
            "-map", "[master]",
            "-b:a", "192k",
            str(final_master)
        ]
        subprocess.run(mix_cmd, check=True, capture_output=True)
        print(f"✅ Dynamic Master Audio Mix: {final_master.name}")
    else:
        import shutil
        shutil.copy(voice_track, final_master)

    # Save timing metadata
    metadata = {
        "engine": "chatterbox-tts",
        "version": "v12",
        "topic": "Why Does 0.1 + 0.2 Not Equal 0.3?",
        "archetype": "mystery",
        "sample_rate": sr,
        "target_voice_lufs": TARGET_LUFS,
        "total_duration_s": round(total_dur, 3),
        "total_frames": total_frames,
        "fps": 30,
        "timeline_events": timeline_events,
    }

    cue_path = BASE_DIR / "src" / "data" / "nemi_v12_cues.json"
    cue_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cue_path, "w") as f:
        json.dump(metadata, f, indent=2)
    with open(PUBLIC_SOUNDS / "nemi_v12_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"📄 Saved V12 speaker timeline to {cue_path}")
    print(f"\n🎉 V12 SPEAKER ORCHESTRATION PIPELINE COMPLETE!")

if __name__ == "__main__":
    main()
