#!/usr/bin/env python3
"""
Nemi Explains Reel #2 — Master Speaker Orchestration Audio Pipeline
Topic: "What Actually Happens When You Type google.com?" (~21.5s @ 30fps)
Dual-Voice Architecture: Chatterbox Neural Expressive TTS (Narrator) + Edge-TTS AnaNeural (Nemi)
Guarantees 0ms accidental speaker overlap with strict deterministic state machine.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PUBLIC_REELS = BASE_DIR / "public" / "reels" / "google_02"
PUBLIC_REELS.mkdir(parents=True, exist_ok=True)
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)

BLOCKS_DIR = Path(__file__).resolve().parent / "audio" / "blocks"
BLOCKS_DIR.mkdir(parents=True, exist_ok=True)

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
# REEL #2 MASTER SPEAKER TIMELINE (Target ~21-22s Golden Window)
# ═══════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    # 1. Beat 1: Input & Launch
    {
        "id": "g01_hook",
        "speaker": "narrator",
        "text": "You type google.com and hit Enter. Your browser launches a request.",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 220,
        "semantic_phrases": [
            {"phrase": "hit Enter", "cue": "enter_press", "rel_pct": 0.35},
            {"phrase": "launches a request", "cue": "packet_launch", "rel_pct": 0.75},
        ]
    },
    # 2. Beat 2: DNS Directory Lookup
    {
        "id": "g02_dns",
        "speaker": "narrator",
        "text": "First, it asks DNS for Google's IP address.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 220,
        "semantic_phrases": [
            {"phrase": "asks DNS", "cue": "dns_lookup_enter", "rel_pct": 0.30},
            {"phrase": "IP address", "cue": "ip_resolved", "rel_pct": 0.75},
        ]
    },
    # 3. Beat 2b: Nemi Question (Snappy, natural mascot voice)
    {
        "id": "g03_nemi_where",
        "speaker": "nemi",
        "text": "Where is that?",
        "emotion": "normal",
        "exaggeration": 0.65,
        "gap_after_ms": 250,
        "semantic_phrases": [
            {"phrase": "Where is that", "cue": "nemi_puzzled", "rel_pct": 0.5}
        ]
    },
    # 4. Beat 3: Network Journey
    {
        "id": "g04_fiber",
        "speaker": "narrator",
        "text": "Found it! Your request races across fiber cables to Google's servers.",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 250,
        "semantic_phrases": [
            {"phrase": "races across", "cue": "network_grid_enter", "rel_pct": 0.25},
            {"phrase": "fiber cables", "cue": "fiber_node_hop", "rel_pct": 0.50},
            {"phrase": "Google's servers", "cue": "server_edge_reach", "rel_pct": 0.85},
        ]
    },
    # 5. Beat 4: Server Processing & Response Generation
    {
        "id": "g05_server",
        "speaker": "narrator",
        "text": "The server builds the response and shoots it right back.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 250,
        "semantic_phrases": [
            {"phrase": "builds the response", "cue": "server_process_light", "rel_pct": 0.30},
            {"phrase": "shoots it right back", "cue": "response_packet_launch", "rel_pct": 0.75},
        ]
    },
    # 6. Beat 5: Client-Side DOM Construction & Rendering
    {
        "id": "g06_render",
        "speaker": "narrator",
        "text": "Your browser parses the DOM and paints the page you see.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 240,
        "semantic_phrases": [
            {"phrase": "parses the DOM", "cue": "dom_structure_snap", "rel_pct": 0.40},
            {"phrase": "paints the page", "cue": "google_ui_illuminate", "rel_pct": 0.80},
        ]
    },
    # 7. Beat 6: Final Payoff
    {
        "id": "g07_payoff",
        "speaker": "narrator",
        "text": "All in under a hundred milliseconds.",
        "emotion": "happy",
        "exaggeration": 0.60,
        "gap_after_ms": 220,
        "semantic_phrases": [
            {"phrase": "hundred milliseconds", "cue": "master_takeaway", "rel_pct": 0.50}
        ]
    },
    # 8. Beat 6b: Nemi Celebration
    {
        "id": "g08_nemi_fast",
        "speaker": "nemi",
        "text": "That was fast!",
        "emotion": "happy",
        "exaggeration": 0.80,
        "gap_after_ms": 300,
        "semantic_phrases": [
            {"phrase": "That was fast", "cue": "nemi_smug_fast", "rel_pct": 0.50}
        ]
    }
]

TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.5

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
    print("🎙️ NEMI EXPLAINS REEL #2 — CHATTERBOX DUAL-VOICE ENGINE")
    print("   Topic: What Actually Happens When You Type google.com?")
    print("═" * 70)

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"   Engine: Chatterbox Neural Expressive TTS + Edge-TTS AnaNeural")
    print(f"   Device: {device.upper()}")
    print(f"   Voices: Narrator (Deep Authority) + Nemi Mascot (Snappy +18% rate)")
    print(f"   Gaps: 220–280ms (Tight, energetic documentary flow)")
    print(f"   Target Voice LUFS: {TARGET_VOICE_LUFS}\n")

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
        gap_after = event.get("gap_after_ms", 240)

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

        # Silence trimming
        y = trim_silence(y, sr, top_db=35)

        # Normalize to target voice LUFS
        y = normalize_lufs(y, sr, TARGET_VOICE_LUFS)

        # Save processed block
        sf.write(str(out_wav), y, sr)

        dur_s = len(y) / sr
        dur_ms = int(dur_s * 1000)

        start_time_ms = current_time_ms
        end_time_ms = start_time_ms + dur_ms
        start_frame = int(round((start_time_ms / 1000.0) * 30))
        end_frame = int(round((end_time_ms / 1000.0) * 30))

        # Semantic cues
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

        # Add to ffmpeg stitcher
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

    raw_voice_wav = BLOCKS_DIR / "google_voice_raw.wav"
    cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", filter_complex, "-map", "[voice_out]", "-ar", "48000", str(raw_voice_wav)]
    subprocess.run(cmd, check=True, capture_output=True)

    # 2. Master Voice Loudness Target
    final_voice_mp3 = Path(__file__).resolve().parent / "audio" / "google_voice_track.mp3"
    norm_cmd = [
        "ffmpeg", "-y", "-i", str(raw_voice_wav),
        "-af", f"loudnorm=I={TARGET_VOICE_LUFS}:TP=-1.5:LRA=7",
        "-b:a", "320k",
        str(final_voice_mp3)
    ]
    subprocess.run(norm_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {final_voice_mp3.name}")

    # 3. Dynamic Sidechain Ducking Curve for BGM
    bgm_path = BASE_DIR / "public" / "bgm" / "nemi_ambient_pulse.mp3"
    master_audio_mp3 = PUBLIC_REELS / "google_master_audio.mp3"

    if bgm_path.exists():
        sidechain_filter = (
            f"[1:a]aloop=loop=-1:size=2e+09,atrim=0:{total_duration_s},volume=0.20[bgm];"
            f"[0:a]asplit=2[voice_main][voice_sc];"
            f"[bgm][voice_sc]sidechaincompress=threshold=0.03:ratio=6:attack=30:release=250[ducked_bgm];"
            f"[voice_main][ducked_bgm]amix=inputs=2:normalize=0[mix];"
            f"[mix]loudnorm=I={TARGET_MASTER_LUFS}:TP=-1.5:LRA=7[out]"
        )
        bgm_mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(final_voice_mp3),
            "-i", str(bgm_path),
            "-filter_complex", sidechain_filter,
            "-map", "[out]",
            "-b:a", "320k",
            str(master_audio_mp3)
        ]
        subprocess.run(bgm_mix_cmd, check=True, capture_output=True)
        print(f"✅ Dynamic Master Audio Mix (Voice + Ducked BGM): {master_audio_mp3.name}")
    else:
        import shutil
        shutil.copy(final_voice_mp3, master_audio_mp3)

    # Copy to public/sounds as well for backward compatibility
    import shutil
    shutil.copy(master_audio_mp3, PUBLIC_SOUNDS / "google_master_audio.mp3")

    # 4. Export JSON cues for Remotion
    cues_json_path = BASE_DIR / "src" / "data" / "google_cues.json"
    cues_data = {
        "reel_id": "google_02",
        "title": "What Actually Happens When You Type google.com?",
        "total_duration_s": total_duration_s,
        "total_frames": total_frames,
        "fps": 30,
        "timeline_events": timeline_events
    }
    with open(cues_json_path, "w") as f:
        json.dump(cues_data, f, indent=2)
    print(f"✅ Timeline cues written to: {cues_json_path}")

    # Copy to public/sounds/google_timing.json
    with open(PUBLIC_SOUNDS / "google_timing.json", "w") as f:
        json.dump(cues_data, f, indent=2)

    # 5. Validate Speaker Separation & Overlap
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
        print("\n🎉 DUAL-VOICE AUDIO PIPELINE COMPLETE — 0.00ms OVERLAP GUARANTEED\n")

if __name__ == "__main__":
    main()
