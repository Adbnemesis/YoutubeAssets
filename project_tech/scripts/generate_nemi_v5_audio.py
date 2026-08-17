#!/usr/bin/env python3
"""
Nemi Explains V5 — Audio Mix & Timing Synchronization Pipeline
Trims silence, normalizes voice segments, generates cue timeline data,
and mixes a high-retention audio master with dynamic sidechain music ducking.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
import soundfile as sf
import librosa
import pyloudnorm as pyln

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BASE_DIR / "tech_voice_profile.json"
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"
V4_SEGMENTS_DIR = PUBLIC_SOUNDS / "v4_chatterbox_segments"
V5_SEGMENTS_DIR = PUBLIC_SOUNDS / "v5_segments"

V5_SEGMENTS_DIR.mkdir(parents=True, exist_ok=True)

# Define script segments (skipping voice_004_setup to tighten the story)
SCRIPT_SEGMENTS = [
    {"id": "voice_001_hook", "speaker": "narrator", "text": "Your JavaScript keeps creating objects.", "pause_after_ms": 150},
    {"id": "voice_002_question", "speaker": "narrator", "text": "So who cleans them up?", "pause_after_ms": 100},
    {"id": "voice_003_nemi_react1", "speaker": "nemi", "text": "Uh... that's a lot.", "pause_after_ms": 200},
    # voice_004_setup is deleted
    {"id": "voice_005_question2", "speaker": "narrator", "text": "But how does JavaScript know which ones are safe to delete?", "pause_after_ms": 150},
    {"id": "voice_006_roots", "speaker": "narrator", "text": "V8 starts from the roots.", "pause_after_ms": 100},
    {"id": "voice_007_reachable", "speaker": "narrator", "text": "If an object is still reachable, it stays.", "pause_after_ms": 200},
    {"id": "voice_008_surprise_nemi", "speaker": "nemi", "text": "That one looks dead.", "pause_after_ms": 100},
    {"id": "voice_009_surprise_narrator", "speaker": "narrator", "text": "And this one? It looks dead... but it's still connected.", "pause_after_ms": 150},
    {"id": "voice_010_nemi_surprise", "speaker": "nemi", "text": "Oh!", "pause_after_ms": 200},
    {"id": "voice_011_cleanup", "speaker": "narrator", "text": "Anything truly unreachable can go.", "pause_after_ms": 100},
    {"id": "voice_012_nemi_bye", "speaker": "nemi", "text": "Bye.", "pause_after_ms": 150},
    {"id": "voice_013_compaction", "speaker": "narrator", "text": "Then the remaining memory can be cleaned up and compacted.", "pause_after_ms": 200},
    {"id": "voice_014_payoff", "speaker": "narrator", "text": "So garbage collection isn't magic. It finds what's still alive... and clears the rest.", "pause_after_ms": 150},
    {"id": "voice_015_nemi_end", "speaker": "nemi", "text": "Much better.", "pause_after_ms": 500} # end frame buffer
]

def main():
    print("=========================================================")
    print("🎙  NEMI EXPLAINS V5 — AUDIO PROCESSING & SYNC PIPELINE")
    print("=========================================================")

    # Initialize loudness meter
    meter = pyln.Meter(24000) # Target sample rate is 24000
    target_lufs = -14.0

    generated_cues = []
    current_time_ms = 0
    audio_inputs = []
    filter_complex_parts = []
    input_idx = 0

    for i, seg in enumerate(SCRIPT_SEGMENTS):
        seg_id = seg["id"]
        v4_wav = V4_SEGMENTS_DIR / f"{seg_id}.wav"
        v5_wav = V5_SEGMENTS_DIR / f"{seg_id}.wav"

        if not v4_wav.exists():
            print(f"❌ Source segment not found: {v4_wav}")
            sys.exit(1)

        # 1. Load and trim leading/trailing silence using librosa
        y, sr = librosa.load(str(v4_wav), sr=24000)
        y_trimmed, index = librosa.effects.trim(y, top_db=35)

        # 2. Normalize voice segment to -14.0 LUFS
        # Prevent zero division if silent
        lufs = meter.integrated_loudness(y_trimmed)
        if lufs > -90:
            y_normalized = pyln.normalize.loudness(y_trimmed, lufs, target_lufs)
        else:
            y_normalized = y_trimmed

        # Save trimmed & normalized WAV
        sf.write(str(v5_wav), y_normalized, sr)

        # Calculate actual duration of trimmed segment
        dur_s = len(y_normalized) / sr
        dur_ms = int(dur_s * 1000)

        start_ms = current_time_ms
        end_ms = start_ms + dur_ms
        start_frame = int((start_ms / 1000.0) * 30)
        end_frame = int((end_ms / 1000.0) * 30)

        cue_entry = {
            "id": seg_id,
            "speaker": seg["speaker"],
            "text": seg["text"],
            "wav_path": str(v5_wav),
            "duration_s": dur_s,
            "start_time_ms": start_ms,
            "end_time_ms": end_ms,
            "start_frame": start_frame,
            "end_frame": end_frame
        }
        generated_cues.append(cue_entry)
        print(f"[{i+1}/{len(SCRIPT_SEGMENTS)}] '{seg_id}' ({seg['speaker']}): {dur_s:.2f}s | {start_ms}ms (f{start_frame}) -> {end_ms}ms (f{end_frame})")

        audio_inputs.extend(["-i", str(v5_wav)])
        filter_complex_parts.append(f"[{input_idx}:a]adelay={start_ms}|{start_ms}[a{input_idx}]")
        input_idx += 1

        current_time_ms = end_ms + seg["pause_after_ms"]

    total_narration_duration = current_time_ms / 1000.0
    total_video_duration = total_narration_duration # No extra duration, it is tightly defined by cues
    total_frames = int(total_video_duration * 30)

    print("\n---------------------------------------------------------")
    print(f"⏱  Total Narration Duration: {total_narration_duration:.2f}s")
    print(f"🎬 Total Video Duration:     {total_video_duration:.2f}s ({total_frames} frames @ 30fps)")
    print("---------------------------------------------------------\n")

    # Merge all voice segments with adelay and sum using amix with normalize=0 to avoid scaling down
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    filter_complex = f"{';'.join(filter_complex_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0:normalize=0[voiceout]"

    voice_track = PUBLIC_SOUNDS / "nemi_v5_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", filter_complex, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Combined & Normalized Voice Track: {voice_track.name}")

    # Sidechain Ducking Setup with BGM
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v5_master_audio.mp3"

    if bgm_file.exists():
        # Duck the BGM using sidechaincompress filter triggered by voice track.
        # [1:a] gets pre-volume scale of 0.15 (to avoid overloading).
        # sidechaincompress uses threshold=0.08, ratio=12, attack=15ms, release=250ms.
        # Inputs are mixed using amix with normalize=0 to preserve voice gain.
        mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(voice_track),
            "-ss", "45", "-i", str(bgm_file),
            "-filter_complex",
            "[1:a]volume=0.15[bgm_pre];"
            "[bgm_pre][0:a]sidechaincompress=threshold=0.08:ratio=12:attack=15:release=250[bgm_ducked];"
            "[0:a][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=0[master_raw];"
            "[master_raw]loudnorm=I=-14:TP=-1.5[master]",
            "-map", "[master]",
            "-b:a", "192k",
            str(final_master)
        ]
        subprocess.run(mix_cmd, check=True, capture_output=True)
        print(f"✅ Final Master Mixed Audio (Voice + Sidechain Ducked BGM): {final_master.name}")
    else:
        # Fallback if BGM is missing
        import shutil
        shutil.copy(voice_track, final_master)

    # Save structured metadata JSON for Remotion V5
    metadata = {
        "engine": "chatterbox-tts",
        "sample_rate": 24000,
        "total_duration_s": total_video_duration,
        "total_frames": total_frames,
        "fps": 30,
        "segments": generated_cues
    }

    cue_json_path = BASE_DIR / "src" / "data" / "nemi_v5_cues.json"
    cue_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cue_json_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"📄 Saved structured V5 cues metadata to {cue_json_path}")

    with open(PUBLIC_SOUNDS / "nemi_v5_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print("\n🎉 AUDIO GENERATION COMPLETE!")

if __name__ == "__main__":
    main()
