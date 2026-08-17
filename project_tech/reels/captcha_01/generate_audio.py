#!/usr/bin/env python3
"""
Nemi Explains — Chatterbox Neural Audio Pipeline for Debut Reel #1: CAPTCHA
Topic: "How CAPTCHA Knows You're Human (It's Not The Checkbox)"
- Distinct voices: Deep authoritative Narrator vs Animated pitched Nemi (+2.8 semitones).
- Tight, natural 220-280ms sentence pacing.
- Direct export to public/reels/captcha_01/captcha_master_audio.mp3.
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path

REEL_DIR = Path(__file__).resolve().parent                 # .../project_tech/reels/captcha_01
PROJECT_DIR = REEL_DIR.parent.parent                       # .../project_tech
PUBLIC_REEL_DIR = PROJECT_DIR / "public" / "reels" / "captcha_01"
PUBLIC_SOUNDS = PROJECT_DIR / "public" / "sounds"
PUBLIC_BGM = PROJECT_DIR / "public" / "bgm"
DATA_DIR = PROJECT_DIR / "src" / "data"
REEL_AUDIO_DIR = REEL_DIR / "audio"
BLOCKS_DIR = REEL_AUDIO_DIR / "blocks"

BLOCKS_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_REEL_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

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

DATE_STR = datetime.now().strftime("%Y%m%d")
FPS = 30
TARGET_LUFS = -16.0

# ═══════════════════════════════════════════════════════════════
# PRECISE 220-280ms SENTENCE PACING (Punchy, Natural & Tight)
# ═══════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    # 1. Beat 1: The Hook
    {
        "id": "c01_hook",
        "speaker": "narrator",
        "text": "You didn't pass the CAPTCHA by clicking the box.",
        "emotion": "dramatic",
        "exaggeration": 0.55,
        "pitch_shift": 0.0,
        "gap_after_ms": 220,
        "semantic_phrases": [
            {"phrase": "clicking the box", "cue": "checkbox_click", "rel_pct": 0.60}
        ]
    },
    # 2. Beat 1b: Nemi Shock (Distinct Pitch Shift +2.8 semitones)
    {
        "id": "c02_nemi_what",
        "speaker": "nemi",
        "text": "Wait, what?!",
        "emotion": "puzzled",
        "exaggeration": 0.85,
        "pitch_shift": 2.8,
        "gap_after_ms": 250,
        "semantic_phrases": [
            {"phrase": "Wait, what", "cue": "nemi_shocked", "rel_pct": 0.50}
        ]
    },
    # 3. Beat 2a: Bot Speed
    {
        "id": "c03_bot_speed",
        "speaker": "narrator",
        "text": "A bot can click in one millisecond.",
        "emotion": "dramatic",
        "exaggeration": 0.55,
        "pitch_shift": 0.0,
        "gap_after_ms": 250,
        "semantic_phrases": [
            {"phrase": "one millisecond", "cue": "bot_timer", "rel_pct": 0.50}
        ]
    },
    # 4. Beat 2b: Bot Blocked
    {
        "id": "c04_bot_block",
        "speaker": "narrator",
        "text": "And instant zero-latency clicks get blocked immediately.",
        "emotion": "dramatic",
        "exaggeration": 0.55,
        "pitch_shift": 0.0,
        "gap_after_ms": 280,
        "semantic_phrases": [
            {"phrase": "blocked immediately", "cue": "access_denied", "rel_pct": 0.70}
        ]
    },
    # 5. Beat 3: The Kinematic Trajectory
    {
        "id": "c05_trajectory",
        "speaker": "narrator",
        "text": "Google profiles the kinematic trajectory of your mouse on its way to the target.",
        "emotion": "normal",
        "exaggeration": 0.50,
        "pitch_shift": 0.0,
        "gap_after_ms": 280,
        "semantic_phrases": [
            {"phrase": "kinematic trajectory", "cue": "trajectory_arena", "rel_pct": 0.40},
            {"phrase": "on its way", "cue": "curves_split", "rel_pct": 0.80}
        ]
    },
    # 6. Beat 4a: Straight Line Bots
    {
        "id": "c06_linear_bots",
        "speaker": "narrator",
        "text": "Bots move in straight, linear vectors.",
        "emotion": "dramatic",
        "exaggeration": 0.55,
        "pitch_shift": 0.0,
        "gap_after_ms": 250,
        "semantic_phrases": [
            {"phrase": "straight, linear", "cue": "bot_line", "rel_pct": 0.50}
        ]
    },
    # 7. Beat 4b: Human Jitters
    {
        "id": "c07_human_tremors",
        "speaker": "narrator",
        "text": "Humans have curved Bezier paths and involuntary muscle tremors.",
        "emotion": "dramatic",
        "exaggeration": 0.55,
        "pitch_shift": 0.0,
        "gap_after_ms": 260,
        "semantic_phrases": [
            {"phrase": "muscle tremors", "cue": "jitter_zoom", "rel_pct": 0.70}
        ]
    },
    # 8. Beat 5a: Nemi Realization (Fast, snappy mascot delivery)
    {
        "id": "c08_nemi_aha",
        "speaker": "nemi",
        "text": "Aha, my shaky hands are a feature!",
        "emotion": "happy",
        "exaggeration": 0.80,
        "gap_after_ms": 250,
        "semantic_phrases": [
            {"phrase": "shaky hands", "cue": "nemi_aha", "rel_pct": 0.50}
        ]
    },
    # 9. Beat 5b: Payoff
    {
        "id": "c09_payoff",
        "speaker": "narrator",
        "text": "You proved you're human before the click even happened.",
        "emotion": "happy",
        "exaggeration": 0.55,
        "gap_after_ms": 300,
        "semantic_phrases": [
            {"phrase": "even happened", "cue": "takeaway_console", "rel_pct": 0.50}
        ]
    }
]

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
    print("🎙️ NEMI EXPLAINS — CHATTERBOX DUAL-VOICE ENGINE (SNAPPY MASCOT DELIVERY)")
    print("═" * 70)

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"   Engine: Chatterbox Neural Expressive TTS + Edge-TTS AnaNeural")
    print(f"   Device: {device.upper()}")
    print(f"   Voices: Narrator (Deep Authority) + Nemi Mascot (Snappy +18% rate)")
    print(f"   Gaps: 220–280ms (Tight, energetic documentary flow)")
    print(f"   Target Voice LUFS: {TARGET_LUFS}\n")

    print("Loading Chatterbox model weights for Narrator...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    print(f"✅ Model loaded. Sample Rate: {sr} Hz\n")

    import asyncio
    import edge_tts

    timeline_events = []
    current_time_ms = 0
    audio_inputs = []
    filter_parts = []
    input_idx = 0

    for i, event in enumerate(SPEAKER_EVENTS, 1):
        event_id = event["id"]
        speaker = event["speaker"]
        text = event["text"]
        exag = event.get("exaggeration", 0.55)
        gap_after = event.get("gap_after_ms", 250)

        out_wav = BLOCKS_DIR / f"{event_id}.wav"

        print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' ({speaker.upper()}): \"{text}\"")

        if speaker == "nemi":
            # Generate snappy, playful mascot voice via Edge-TTS AnaNeural with rate=+18%
            temp_mp3 = BLOCKS_DIR / f"{event_id}_temp.mp3"
            async def gen_nemi():
                comm = edge_tts.Communicate(text, "en-US-AnaNeural", pitch="+12Hz", rate="+18%")
                await comm.save(str(temp_mp3))
            asyncio.run(gen_nemi())

            # Convert to target sample rate and load as numpy
            conv_cmd = ["ffmpeg", "-y", "-i", str(temp_mp3), "-ar", str(sr), "-ac", "1", str(out_wav)]
            subprocess.run(conv_cmd, check=True, capture_output=True)
            y, _ = sf.read(str(out_wav))
            if temp_mp3.exists():
                temp_mp3.unlink()
        else:
            # Generate deep, authoritative tech narrator via Chatterbox Neural TTS
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
        start_frame = int((start_ms / 1000.0) * FPS)
        end_frame = int((end_ms / 1000.0) * FPS)

        semantic_cues = []
        for sem in event.get("semantic_phrases", []):
            cue_rel_ms = int(dur_ms * sem["rel_pct"])
            cue_time_ms = start_ms + cue_rel_ms
            cue_frame = int((cue_time_ms / 1000.0) * FPS)
            semantic_cues.append({
                "phrase": sem["phrase"],
                "cue": sem["cue"],
                "time_ms": cue_time_ms,
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
            "semantic_cues": semantic_cues
        }
        timeline_events.append(event_meta)
        print(f"   ✓ {dur_s:.2f}s | {start_ms}ms (f{start_frame}) → {end_ms}ms (f{end_frame}) [gap: {gap_after}ms]")

        audio_inputs.extend(["-i", str(out_wav)])
        filter_parts.append(f"[{input_idx}:a]adelay={start_ms}|{start_ms}[a{input_idx}]")
        input_idx += 1

        # Advance timeline by duration + gap (GUARANTEES 0ms overlap!)
        current_time_ms = end_ms + gap_after

    total_dur = (current_time_ms + 100) / 1000.0
    total_frames = int(total_dur * FPS)

    print(f"\n{'─' * 70}")
    print(f"⏱ Total Master Duration: {total_dur:.2f}s ({total_frames} frames @ {FPS}fps)")
    print(f"{'─' * 70}\n")

    # Merge unified voice track
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    fc = f"{';'.join(filter_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0:normalize=0[voiceout]"

    voice_track = REEL_AUDIO_DIR / "captcha_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", fc, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {voice_track.name}")

    # Output JSON cues for Remotion
    cues_payload = {
        "topic": "How CAPTCHA Knows You're Human (It's Not The Checkbox)",
        "slug": "captcha_01",
        "date": DATE_STR,
        "fps": FPS,
        "total_duration_s": round(total_dur, 2),
        "total_frames": total_frames,
        "events": timeline_events
    }

    cues_path = DATA_DIR / "captcha_cues.json"
    with open(cues_path, "w") as f:
        json.dump(cues_payload, f, indent=2)
    print(f"✅ Timeline cues written to: {cues_path}")

    # Mix with BGM using dynamic sidechain ducking & story arc curve
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master_reel = REEL_AUDIO_DIR / "captcha_master_audio.mp3"
    final_master_public = PUBLIC_REEL_DIR / "captcha_master_audio.mp3"
    final_master_sounds = PUBLIC_SOUNDS / "captcha_master_audio.mp3"

    if bgm_file.exists():
        vol_expr = (
            "if(lt(t,3.5), 0.32, "
            "if(lt(t,8.0), 0.25, "
            "if(lt(t,13.5), 0.32, "
            "if(lt(t,18.0), 0.40, 0.28))))"
        )
        filter_complex = (
            f"[1:a]volume=eval=frame:volume='{vol_expr}'[bgm_curved];"
            "[bgm_curved][0:a]sidechaincompress=threshold=0.07:ratio=8:attack=15:release=250[bgm_ducked];"
            "[0:a][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=0[master_raw];"
            "[master_raw]loudnorm=I=-15.0:TP=-2.0:LRA=3.0[master]"
        )
        mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(voice_track),
            "-ss", "45", "-i", str(bgm_file),
            "-filter_complex", filter_complex,
            "-map", "[master]",
            "-b:a", "192k",
            str(final_master_reel)
        ]
        subprocess.run(mix_cmd, check=True, capture_output=True)
        
        # Copy to public directories for Remotion
        subprocess.run(["cp", str(final_master_reel), str(final_master_public)], check=True)
        subprocess.run(["cp", str(final_master_reel), str(final_master_sounds)], check=True)
        subprocess.run(["cp", str(voice_track), str(PUBLIC_REEL_DIR / "captcha_voice_track.mp3")], check=True)
        print(f"✅ Dynamic Master Audio Mix copied to: {final_master_public}")

    print("\n🔍 Validating Speaker Separation:")
    for i in range(len(timeline_events) - 1):
        curr = timeline_events[i]
        nxt = timeline_events[i+1]
        gap_actual = nxt["start_time_ms"] - curr["end_time_ms"]
        print(f"   ✓ {curr['id']} ({curr['speaker']}) → {nxt['id']} ({nxt['speaker']}) | Gap: {gap_actual}ms")

    print("\n🎉 CHATTERBOX DUAL-VOICE AUDIO PIPELINE COMPLETE")

if __name__ == "__main__":
    main()
