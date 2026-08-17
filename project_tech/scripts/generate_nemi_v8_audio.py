#!/usr/bin/env python3
"""
Nemi Explains V08 — Coherent Voice Performance Audio Pipeline
Assembles the 5 coherent narrator performance blocks + 5 Nemi reaction clips
into a 22.8s master timeline with dynamic sidechain-ducked BGM.
"""

import json
import subprocess
from pathlib import Path
import soundfile as sf
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

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_SOUNDS = BASE_DIR / "public" / "sounds"
PUBLIC_BGM = BASE_DIR / "public" / "bgm"
V8_BLOCKS_DIR = PUBLIC_SOUNDS / "v8_chatterbox_blocks"

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

# ═══════════════════════════════════════════════════════════════
# V8 MASTER TIMELINE & TIMING OFFSETS (Target: 22.8s)
# ═══════════════════════════════════════════════════════════════
BLOCK_DEFINITIONS = [
    # 1. Hook & Problem
    {
        "id": "v8_narrator_01_hook",
        "speaker": "narrator",
        "text": "Your JavaScript keeps creating objects. A lot of them. So who cleans all of this up?",
        "emotion": "dramatic",
        "start_offset_ms": 0,
        "semantic_phrases": [
            {"phrase": "keeps creating objects", "cue": "spawn_objects", "rel_pct": 0.15},
            {"phrase": "A lot of them", "cue": "ram_surge", "rel_pct": 0.45},
            {"phrase": "who cleans all of this up", "cue": "question_mark", "rel_pct": 0.75},
        ]
    },
    # 2. Nemi Refusal
    {
        "id": "v8_nemi_01_nope",
        "speaker": "nemi",
        "text": "Because I'm not doing it.",
        "emotion": "cheerful",
        "start_offset_ms": 3400, # Starts naturally as question finishes
        "semantic_phrases": [{"phrase": "not doing it", "cue": "nemi_refusal", "rel_pct": 0.5}]
    },
    # 3. Challenge
    {
        "id": "v8_narrator_02_challenge",
        "speaker": "narrator",
        "text": "Okay, which one gets deleted? You might pick this one...",
        "emotion": "dramatic",
        "start_offset_ms": 4650,
        "semantic_phrases": [
            {"phrase": "which one gets deleted", "cue": "challenge_grid", "rel_pct": 0.25},
            {"phrase": "pick this one", "cue": "viewer_prompt", "rel_pct": 0.70},
        ]
    },
    # 4. Nemi Guess (after 700ms viewer pause)
    {
        "id": "v8_nemi_02_point",
        "speaker": "nemi",
        "text": "That one.",
        "emotion": "normal",
        "start_offset_ms": 7500,
        "semantic_phrases": [{"phrase": "That one", "cue": "nemi_point_wrong", "rel_pct": 0.5}]
    },
    # 5. Freeze & Interruption
    {
        "id": "v8_narrator_02b_wait",
        "speaker": "narrator",
        "text": "Wait. It's still reachable.",
        "emotion": "whisper",
        "start_offset_ms": 8200,
        "semantic_phrases": [
            {"phrase": "Wait", "cue": "freeze_frame", "rel_pct": 0.15},
            {"phrase": "still reachable", "cue": "laser_reveal", "rel_pct": 0.55},
        ]
    },
    # 6. Nemi Realization
    {
        "id": "v8_nemi_03_oh",
        "speaker": "nemi",
        "text": "Oh.",
        "emotion": "excited",
        "start_offset_ms": 9700,
        "semantic_phrases": [{"phrase": "Oh", "cue": "nemi_shocked", "rel_pct": 0.5}]
    },
    # 7. Discovery / Root Traversal
    {
        "id": "v8_narrator_03_discovery",
        "speaker": "narrator",
        "text": "V8 starts from the roots, then follows every connection. Anything it can still reach stays alive.",
        "emotion": "normal",
        "start_offset_ms": 10350,
        "semantic_phrases": [
            {"phrase": "starts from the roots", "cue": "root_pulse", "rel_pct": 0.20},
            {"phrase": "follows every connection", "cue": "tree_traversal", "rel_pct": 0.50},
            {"phrase": "stays alive", "cue": "green_retained", "rel_pct": 0.85},
        ]
    },
    # 8. The Rule & Cleanup
    {
        "id": "v8_narrator_04_cleanup",
        "speaker": "narrator",
        "text": "Anything it can't reach is garbage. And garbage gets removed.",
        "emotion": "dramatic",
        "start_offset_ms": 15200,
        "semantic_phrases": [
            {"phrase": "can't reach is garbage", "cue": "red_orphan_highlight", "rel_pct": 0.40},
            {"phrase": "gets removed", "cue": "garbage_tag", "rel_pct": 0.80},
        ]
    },
    # 9. Nemi Sweep
    {
        "id": "v8_nemi_04_bye",
        "speaker": "nemi",
        "text": "Bye.",
        "emotion": "cheerful",
        "start_offset_ms": 18350,
        "semantic_phrases": [{"phrase": "Bye", "cue": "rapid_vaporize", "rel_pct": 0.5}]
    },
    # 10. Payoff & Compaction
    {
        "id": "v8_narrator_05_payoff",
        "speaker": "narrator",
        "text": "Then the remaining memory can be compacted. It finds what's still alive... and clears the rest.",
        "emotion": "normal",
        "start_offset_ms": 18950,
        "semantic_phrases": [
            {"phrase": "memory can be compacted", "cue": "compaction_slide", "rel_pct": 0.25},
            {"phrase": "finds what's still alive", "cue": "final_summary", "rel_pct": 0.60},
            {"phrase": "clears the rest", "cue": "master_takeaway", "rel_pct": 0.85},
        ]
    },
    # 11. Nemi Celebration
    {
        "id": "v8_nemi_05_better",
        "speaker": "nemi",
        "text": "Much better.",
        "emotion": "happy",
        "start_offset_ms": 22200,
        "semantic_phrases": [{"phrase": "Much better", "cue": "nemi_celebration", "rel_pct": 0.5}]
    },
]

def main():
    print("═" * 70)
    print("🎙️  NEMI EXPLAINS V08 — AUDIO TIMELINE ASSEMBLER (22.8s Golden Zone)")
    print("═" * 70)

    audio_inputs = []
    filter_parts = []
    input_idx = 0
    narration_blocks = []
    sr = 24000
    max_end_ms = 0

    for b in BLOCK_DEFINITIONS:
        wav_file = V8_BLOCKS_DIR / f"{b['id']}.wav"
        if not wav_file.exists():
            print(f"❌ Missing block wav: {wav_file}")
            continue

        y, sr = sf.read(str(wav_file))
        y = trim_silence(y, sr, top_db=35)
        y = normalize_lufs(y, sr, TARGET_LUFS)
        sf.write(str(wav_file), y, sr)

        dur_s = len(y) / sr
        dur_ms = int(dur_s * 1000)
        start_ms = b["start_offset_ms"]
        end_ms = start_ms + dur_ms
        max_end_ms = max(max_end_ms, end_ms)
        start_frame = int((start_ms / 1000.0) * 30)
        end_frame = int((end_ms / 1000.0) * 30)

        # Calculate semantic phrase timings
        semantic_cues = []
        for sp in b.get("semantic_phrases", []):
            cue_ms = start_ms + int(dur_ms * sp["rel_pct"])
            cue_frame = int((cue_ms / 1000.0) * 30)
            semantic_cues.append({
                "phrase": sp["phrase"],
                "cue": sp["cue"],
                "time_ms": cue_ms,
                "frame": cue_frame
            })

        block_data = {
            "id": b["id"],
            "speaker": b["speaker"],
            "text": b["text"],
            "emotion": b["emotion"],
            "duration_s": round(dur_s, 3),
            "start_time_ms": start_ms,
            "end_time_ms": end_ms,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "semantic_cues": semantic_cues
        }
        narration_blocks.append(block_data)

        print(f"[{b['speaker']:8s}] {b['id']:25s} | {dur_s:.2f}s | {start_ms}ms (f{start_frame}) → {end_ms}ms (f{end_frame})")

        audio_inputs.extend(["-i", str(wav_file)])
        filter_parts.append(f"[{input_idx}:a]adelay={start_ms}|{start_ms}[a{input_idx}]")
        input_idx += 1

    total_dur = (max_end_ms + 250) / 1000.0
    total_frames = int(total_dur * 30)

    print(f"\n{'─' * 70}")
    print(f"⏱  Total Master Duration: {total_dur:.2f}s ({total_frames} frames @ 30fps)")
    print(f"{'─' * 70}\n")

    # Merge unified voice track
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    fc = f"{';'.join(filter_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0:normalize=0[voiceout]"

    voice_track = PUBLIC_SOUNDS / "nemi_v8_voice_track.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", fc, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Voice Track: {voice_track.name}")

    # Dynamic BGM mix
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v8_master_audio.mp3"

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
        print(f"✅ Master Audio Mix: {final_master.name}")

    metadata = {
        "engine": "chatterbox-tts",
        "version": "v8",
        "sample_rate": sr,
        "target_voice_lufs": TARGET_LUFS,
        "total_duration_s": round(total_dur, 3),
        "total_frames": total_frames,
        "fps": 30,
        "narration_blocks": narration_blocks,
    }

    cue_path = BASE_DIR / "src" / "data" / "nemi_v8_cues.json"
    with open(cue_path, "w") as f:
        json.dump(metadata, f, indent=2)
    with open(PUBLIC_SOUNDS / "nemi_v8_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"📄 Saved V8 semantic cue model to {cue_path}")
    print(f"\n🎉 V8 AUDIO PIPELINE COMPLETE!")

if __name__ == "__main__":
    main()
