#!/usr/bin/env python3
"""
Nemi Explains V10 — Master Speaker Orchestration Audio Pipeline
Final Garbage Collection standard (~20.5s @ 30fps)
Guarantees 0ms accidental speaker overlap with strict deterministic state machine.
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
V10_BLOCKS_DIR = PUBLIC_SOUNDS / "v10_chatterbox_blocks"
V10_BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

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
# V10 MASTER SPEAKER TIMELINE (Strict Non-Overlapping Order)
# ═══════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    # 1. Beat 1 & 2: Hook & Problem Question
    {
        "id": "v10_narrator_01_hook",
        "speaker": "narrator",
        "text": "Your JavaScript keeps creating objects. A LOT of them. So who cleans this up?",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "keeps creating objects", "cue": "spawn_objects", "rel_pct": 0.15},
            {"phrase": "A LOT of them", "cue": "ram_surge", "rel_pct": 0.45},
            {"phrase": "who cleans this up", "cue": "question_pause", "rel_pct": 0.78},
        ]
    },
    # 2. Beat 3: Viewer Challenge Prompt
    {
        "id": "v10_narrator_02_challenge",
        "speaker": "narrator",
        "text": "Which one gets deleted?",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 750, # Deliberate 750ms viewer inspection pause before Nemi's guess!
        "semantic_phrases": [
            {"phrase": "Which one gets deleted", "cue": "challenge_grid", "rel_pct": 0.35},
        ]
    },
    # 3. Beat 4: Nemi's Wrong Guess (Spoken only after inspection gap)
    {
        "id": "v10_nemi_01_guess",
        "speaker": "nemi",
        "text": "That one.",
        "emotion": "normal",
        "exaggeration": 0.50,
        "gap_after_ms": 80,
        "semantic_phrases": [{"phrase": "That one", "cue": "nemi_point_wrong", "rel_pct": 0.5}]
    },
    # 4. Beat 5: Narrator Interruption & Freeze
    {
        "id": "v10_narrator_02b_wait",
        "speaker": "narrator",
        "text": "Wait. It's still reachable.",
        "emotion": "whisper",
        "exaggeration": 0.45,
        "gap_after_ms": 80,
        "semantic_phrases": [
            {"phrase": "Wait", "cue": "freeze_frame", "rel_pct": 0.15},
            {"phrase": "still reachable", "cue": "laser_reveal", "rel_pct": 0.55},
        ]
    },
    # 5. Beat 5b: Nemi's Surprise Reaction
    {
        "id": "v10_nemi_02_oh",
        "speaker": "nemi",
        "text": "Oh.",
        "emotion": "happy",
        "exaggeration": 0.60,
        "gap_after_ms": 90,
        "semantic_phrases": [{"phrase": "Oh", "cue": "nemi_shocked", "rel_pct": 0.5}]
    },
    # 6. Beat 6: Continuous Root Traversal (Camera Journey)
    {
        "id": "v10_narrator_03_discovery",
        "speaker": "narrator",
        "text": "V8 starts from the roots, then follows the connections.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 80,
        "semantic_phrases": [
            {"phrase": "starts from the roots", "cue": "camera_zoom_root", "rel_pct": 0.25},
            {"phrase": "follows the connections", "cue": "camera_follow_edge", "rel_pct": 0.65},
        ]
    },
    # 7. Beat 7: Show The Rule
    {
        "id": "v10_narrator_04_rule",
        "speaker": "narrator",
        "text": "If it can reach it, it stays. If it can't... it's garbage.",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 90,
        "semantic_phrases": [
            {"phrase": "it stays", "cue": "green_reachable_glow", "rel_pct": 0.35},
            {"phrase": "it's garbage", "cue": "coral_garbage_highlight", "rel_pct": 0.80},
        ]
    },
    # 8. Beat 8: Nemi Cleanup Action
    {
        "id": "v10_nemi_03_bye",
        "speaker": "nemi",
        "text": "Bye.",
        "emotion": "cheerful",
        "exaggeration": 0.80,
        "gap_after_ms": 90,
        "semantic_phrases": [{"phrase": "Bye", "cue": "rapid_vaporize", "rel_pct": 0.5}]
    },
    # 9. Beat 9 & 10: Compaction & Master Summary
    {
        "id": "v10_narrator_05_payoff",
        "speaker": "narrator",
        "text": "It finds what's still alive... and clears the rest.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 80,
        "semantic_phrases": [
            {"phrase": "still alive", "cue": "compaction_snap", "rel_pct": 0.30},
            {"phrase": "clears the rest", "cue": "master_takeaway", "rel_pct": 0.75},
        ]
    },
    # 10. Beat 10: Nemi Final Payoff
    {
        "id": "v10_nemi_04_better",
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
    max_val = np.max(np.abs(y)) if len(y) > 0 else 0
    if max_val > 0:
        return y * (0.8 / max_val)
    return y

def main():
    print("═" * 70)
    print("🎙️  NEMI EXPLAINS V10 — MASTER SPEAKER ORCHESTRATION ENGINE")
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

        out_wav = V10_BLOCKS_DIR / f"{event_id}.wav"

        if out_wav.exists():
            print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Using cached '{event_id}' ({speaker})")
            y, sr = sf.read(str(out_wav))
        else:
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

    voice_track = PUBLIC_SOUNDS / "nemi_v10_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", fc, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {voice_track.name}")

    # Mix with BGM using dynamic sidechain ducking
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v10_master_audio.mp3"

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
        "version": "v10",
        "sample_rate": sr,
        "target_voice_lufs": TARGET_LUFS,
        "total_duration_s": round(total_dur, 3),
        "total_frames": total_frames,
        "fps": 30,
        "timeline_events": timeline_events,
    }

    cue_path = BASE_DIR / "src" / "data" / "nemi_v10_cues.json"
    cue_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cue_path, "w") as f:
        json.dump(metadata, f, indent=2)
    with open(PUBLIC_SOUNDS / "nemi_v10_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"📄 Saved V10 speaker timeline to {cue_path}")
    print(f"\n🎉 V10 SPEAKER ORCHESTRATION PIPELINE COMPLETE!")

if __name__ == "__main__":
    main()
