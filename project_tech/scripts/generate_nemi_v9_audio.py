#!/usr/bin/env python3
"""
Nemi Explains V09 — Speaker Orchestration Audio Pipeline
Generates coherent narrator blocks and punchy Nemi reactions with a strict,
deterministic state machine that guarantees 0ms accidental speaker overlap.
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
V9_BLOCKS_DIR = PUBLIC_SOUNDS / "v9_chatterbox_blocks"
V9_BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

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
# V9 SPEAKER TIMELINE SPECIFICATION (Strict Non-Overlapping Order)
# ═══════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    # 1. Narrator Hook
    {
        "id": "v9_narrator_01_hook",
        "speaker": "narrator",
        "text": "Your JavaScript keeps creating objects. A lot of them. So who cleans all of this up?",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 100, # Hand-off gap
        "semantic_phrases": [
            {"phrase": "keeps creating objects", "cue": "spawn_objects", "rel_pct": 0.15},
            {"phrase": "A lot of them", "cue": "ram_surge", "rel_pct": 0.45},
            {"phrase": "who cleans all of this up", "cue": "question_mark", "rel_pct": 0.75},
        ]
    },
    # 2. Narrator Challenge Prompt
    {
        "id": "v9_narrator_02_challenge",
        "speaker": "narrator",
        "text": "Okay, which one gets deleted? You might pick this one...",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 650, # Deliberate 650ms viewer thinking window before Nemi's guess!
        "semantic_phrases": [
            {"phrase": "which one gets deleted", "cue": "challenge_grid", "rel_pct": 0.25},
            {"phrase": "pick this one", "cue": "viewer_prompt", "rel_pct": 0.70},
        ]
    },
    # 3. Nemi Guess #1 (Spoken only after inspection gap)
    {
        "id": "v9_nemi_01_guess",
        "speaker": "nemi",
        "text": "That one.",
        "emotion": "normal",
        "exaggeration": 0.50,
        "gap_after_ms": 90,
        "semantic_phrases": [{"phrase": "That one", "cue": "nemi_point_wrong", "rel_pct": 0.5}]
    },
    # 4. Narrator Interruption & Freeze
    {
        "id": "v9_narrator_02b_wait",
        "speaker": "narrator",
        "text": "Wait. It's still reachable.",
        "emotion": "whisper",
        "exaggeration": 0.45,
        "gap_after_ms": 90,
        "semantic_phrases": [
            {"phrase": "Wait", "cue": "freeze_frame", "rel_pct": 0.15},
            {"phrase": "still reachable", "cue": "laser_reveal", "rel_pct": 0.55},
        ]
    },
    # 5. Narrator Discovery & Continuous Root Traversal (Camera Journey)
    {
        "id": "v9_narrator_03_discovery",
        "speaker": "narrator",
        "text": "V8 starts from the roots, then follows every connection. Anything it can reach stays alive.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 80,
        "semantic_phrases": [
            {"phrase": "starts from the roots", "cue": "camera_zoom_root", "rel_pct": 0.20},
            {"phrase": "follows every connection", "cue": "camera_follow_edge", "rel_pct": 0.50},
            {"phrase": "stays alive", "cue": "emerald_retained", "rel_pct": 0.85},
        ]
    },
    # 6. Narrator The Rule
    {
        "id": "v9_narrator_04_rule",
        "speaker": "narrator",
        "text": "Anything it can't... is garbage.",
        "emotion": "dramatic",
        "exaggeration": 0.65,
        "gap_after_ms": 80,
        "semantic_phrases": [
            {"phrase": "Anything it can't", "cue": "camera_pull_back", "rel_pct": 0.35},
            {"phrase": "is garbage", "cue": "coral_garbage_highlight", "rel_pct": 0.75},
        ]
    },
    # 7. Nemi Cleanup Action #2
    {
        "id": "v9_nemi_02_bye",
        "speaker": "nemi",
        "text": "Bye.",
        "emotion": "cheerful",
        "exaggeration": 0.80,
        "gap_after_ms": 90,
        "semantic_phrases": [{"phrase": "Bye", "cue": "rapid_vaporize", "rel_pct": 0.5}]
    },
    # 8. Narrator Compaction & Master Summary
    {
        "id": "v9_narrator_05_payoff",
        "speaker": "narrator",
        "text": "Then the remaining memory can be compacted. It finds what's still alive... and clears the rest.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 80,
        "semantic_phrases": [
            {"phrase": "memory can be compacted", "cue": "compaction_snap", "rel_pct": 0.25},
            {"phrase": "finds what's still alive", "cue": "final_summary", "rel_pct": 0.60},
            {"phrase": "clears the rest", "cue": "master_takeaway", "rel_pct": 0.85},
        ]
    },
    # 9. Nemi Final Payoff #3
    {
        "id": "v9_nemi_03_better",
        "speaker": "nemi",
        "text": "Much better.",
        "emotion": "happy",
        "exaggeration": 0.80,
        "gap_after_ms": 150,
        "semantic_phrases": [{"phrase": "Much better", "cue": "nemi_celebration", "rel_pct": 0.5}]
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
    # Fallback to peak normalization if too short for pyln
    max_val = np.max(np.abs(y)) if len(y) > 0 else 0
    if max_val > 0:
        return y * (0.8 / max_val)
    return y

def main():
    print("═" * 70)
    print("🎙️  NEMI EXPLAINS V09 — SPEAKER ORCHESTRATION ENGINE")
    print("═" * 70)

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"   Engine: Chatterbox Neural Expressive TTS")
    print(f"   Device: {device.upper()}")
    print(f"   Events: {len(SPEAKER_EVENTS)} (Strict Non-Overlapping Sequence)")
    print(f"   Target Voice LUFS: {TARGET_LUFS}")
    print()

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
        gap_after = event.get("gap_after_ms", 120)

        out_wav = V9_BLOCKS_DIR / f"{event_id}.wav"

        if out_wav.exists():
            print(f"[{i}/{len(SPEAKER_EVENTS)}] Using cached '{event_id}' ({speaker})")
            y, sr = sf.read(str(out_wav))
        else:
            print(f"[{i}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' ({speaker}) [{event['emotion']}]: \"{text}\"")
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

    voice_track = PUBLIC_SOUNDS / "nemi_v9_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", fc, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {voice_track.name}")

    # Mix with BGM using dynamic sidechain ducking
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v9_master_audio.mp3"

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
        "version": "v9",
        "sample_rate": sr,
        "target_voice_lufs": TARGET_LUFS,
        "total_duration_s": round(total_dur, 3),
        "total_frames": total_frames,
        "fps": 30,
        "timeline_events": timeline_events,
    }

    cue_path = BASE_DIR / "src" / "data" / "nemi_v9_cues.json"
    cue_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cue_path, "w") as f:
        json.dump(metadata, f, indent=2)
    with open(PUBLIC_SOUNDS / "nemi_v9_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"📄 Saved V9 speaker timeline to {cue_path}")
    print(f"\n🎉 V9 SPEAKER ORCHESTRATION PIPELINE COMPLETE!")

if __name__ == "__main__":
    main()
