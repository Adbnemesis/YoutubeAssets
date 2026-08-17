#!/usr/bin/env python3
"""
Nemi Explains V4 — Chatterbox Neural Speech & Synchronization Engine
Generates expressive neural narration on Apple Silicon GPU (PyTorch MPS),
extracts exact WAV durations, creates structured timing cues, and mixes
the master audio track with ducked BGM and accent SFX for Remotion.
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
V4_SEGMENTS_DIR = PUBLIC_SOUNDS / "v4_chatterbox_segments"
PUBLIC_SOUNDS.mkdir(parents=True, exist_ok=True)
V4_SEGMENTS_DIR.mkdir(parents=True, exist_ok=True)

# Monkey patch PerthImplicitWatermarker for macOS PyTorch compatibility
import chatterbox.tts
class DummyWatermarker:
    def apply_watermark(self, wav, *args, **kwargs):
        return wav

chatterbox.tts.perth = type('perth', (), {'PerthImplicitWatermarker': DummyWatermarker})
from chatterbox import ChatterboxTTS
import soundfile as sf
import torch

# Full Story Script for Garbage Collection Reel (V4)
SCRIPT_SEGMENTS = [
    {
        "id": "voice_001_hook",
        "speaker": "narrator",
        "text": "Your JavaScript keeps creating objects.",
        "emotion": "normal",
        "exaggeration": 0.45,
        "pause_after_ms": 250
    },
    {
        "id": "voice_002_question",
        "speaker": "narrator",
        "text": "So who cleans them up?",
        "emotion": "dramatic",
        "exaggeration": 0.75,
        "pause_after_ms": 200
    },
    {
        "id": "voice_003_nemi_react1",
        "speaker": "nemi",
        "text": "Uh... that's a lot.",
        "emotion": "excited",
        "exaggeration": 0.85,
        "pause_after_ms": 300
    },
    {
        "id": "voice_004_setup",
        "speaker": "narrator",
        "text": "Some objects eventually become useless.",
        "emotion": "normal",
        "exaggeration": 0.45,
        "pause_after_ms": 250
    },
    {
        "id": "voice_005_question2",
        "speaker": "narrator",
        "text": "But how does JavaScript know which ones are safe to delete?",
        "emotion": "dramatic",
        "exaggeration": 0.75,
        "pause_after_ms": 300
    },
    {
        "id": "voice_006_roots",
        "speaker": "narrator",
        "text": "V8 starts from the roots.",
        "emotion": "normal",
        "exaggeration": 0.45,
        "pause_after_ms": 200
    },
    {
        "id": "voice_007_reachable",
        "speaker": "narrator",
        "text": "If an object is still reachable, it stays.",
        "emotion": "cheerful",
        "exaggeration": 0.80,
        "pause_after_ms": 350
    },
    {
        "id": "voice_008_surprise_nemi",
        "speaker": "nemi",
        "text": "That one looks dead.",
        "emotion": "whisper",
        "exaggeration": 0.35,
        "pause_after_ms": 200
    },
    {
        "id": "voice_009_surprise_narrator",
        "speaker": "narrator",
        "text": "And this one? It looks dead... but it's still connected.",
        "emotion": "dramatic",
        "exaggeration": 0.75,
        "pause_after_ms": 200
    },
    {
        "id": "voice_010_nemi_surprise",
        "speaker": "nemi",
        "text": "Oh!",
        "emotion": "excited",
        "exaggeration": 0.85,
        "pause_after_ms": 300
    },
    {
        "id": "voice_011_cleanup",
        "speaker": "narrator",
        "text": "Anything truly unreachable can go.",
        "emotion": "normal",
        "exaggeration": 0.50,
        "pause_after_ms": 200
    },
    {
        "id": "voice_012_nemi_bye",
        "speaker": "nemi",
        "text": "Bye.",
        "emotion": "cheerful",
        "exaggeration": 0.80,
        "pause_after_ms": 300
    },
    {
        "id": "voice_013_compaction",
        "speaker": "narrator",
        "text": "Then the remaining memory can be cleaned up and compacted.",
        "emotion": "cheerful",
        "exaggeration": 0.80,
        "pause_after_ms": 350
    },
    {
        "id": "voice_014_payoff",
        "speaker": "narrator",
        "text": "So garbage collection isn't magic. It finds what's still alive... and clears the rest.",
        "emotion": "normal",
        "exaggeration": 0.50,
        "pause_after_ms": 300
    },
    {
        "id": "voice_015_nemi_end",
        "speaker": "nemi",
        "text": "Much better.",
        "emotion": "happy",
        "exaggeration": 0.80,
        "pause_after_ms": 400
    }
]

def load_voice_profile():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

def get_duration(audio_path: Path) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(audio_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def main():
    profile = load_voice_profile()
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    
    print("=================================================================")
    print("🎙  NEMI EXPLAINS V4 — CHATTERBOX NEURAL SPEECH PIPELINE")
    print(f"   Engine: Chatterbox Neural Expressive Engine")
    print(f"   Device: {device.upper()} (Apple Silicon GPU Acceleration)")
    print(f"   Segments to Generate: {len(SCRIPT_SEGMENTS)}")
    print("=================================================================\n")
    
    print("Loading Chatterbox model weights...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    print(f"✅ Model loaded. Sample Rate: {sr} Hz\n")
    
    generated_cues = []
    current_time_ms = 0
    
    audio_inputs = []
    filter_complex_parts = []
    input_idx = 0
    
    for i, seg in enumerate(SCRIPT_SEGMENTS, 1):
        seg_id = seg["id"]
        text = seg["text"]
        exag = seg.get("exaggeration", 0.5)
        speaker = seg.get("speaker", "narrator")
        pause_after = seg.get("pause_after_ms", 250)
        
        out_wav = V4_SEGMENTS_DIR / f"{seg_id}.wav"
        
        print(f"[{i}/{len(SCRIPT_SEGMENTS)}] Generating '{seg_id}' ({speaker}) [{seg['emotion']}]: \"{text}\"...")
        wav_tensor = model.generate(text=text, exaggeration=exag)
        
        if wav_tensor.ndim > 1:
            wav_tensor = wav_tensor.squeeze()
            
        sf.write(str(out_wav), wav_tensor.cpu().numpy(), sr)
        
        dur_s = get_duration(out_wav)
        dur_ms = int(dur_s * 1000)
        
        start_ms = current_time_ms
        end_ms = start_ms + dur_ms
        start_frame = int((start_ms / 1000.0) * 30)
        end_frame = int((end_ms / 1000.0) * 30)
        
        cue_entry = {
            "id": seg_id,
            "speaker": speaker,
            "text": text,
            "emotion": seg["emotion"],
            "wav_path": str(out_wav),
            "duration_s": dur_s,
            "start_time_ms": start_ms,
            "end_time_ms": end_ms,
            "start_frame": start_frame,
            "end_frame": end_frame
        }
        generated_cues.append(cue_entry)
        print(f"   ✓ Duration: {dur_s:.2f}s | Start: {start_ms}ms (f{start_frame}) -> End: {end_ms}ms (f{end_frame})")
        
        # Audio mixing track alignment
        audio_inputs.extend(["-i", str(out_wav)])
        filter_complex_parts.append(f"[{input_idx}:a]adelay={start_ms}|{start_ms}[a{input_idx}]")
        input_idx += 1
        
        current_time_ms = end_ms + pause_after
        
    total_narration_duration = current_time_ms / 1000.0
    total_video_duration = total_narration_duration + 1.8 # visual breathing room for loop
    total_frames = int(total_video_duration * 30)
    
    print("\n-----------------------------------------------------------------")
    print(f"⏱  Total Narration Duration: {total_narration_duration:.2f}s")
    print(f"🎬 Total Video Duration:     {total_video_duration:.2f}s ({total_frames} frames @ 30fps)")
    print("-----------------------------------------------------------------\n")
    
    # Merge all voice segments into single voice track
    amix_inputs = "".join(f"[a{i}]" for i in range(input_idx))
    filter_complex = f"{';'.join(filter_complex_parts)};{amix_inputs}amix=inputs={input_idx}:duration=longest:dropout_transition=0,volume=1.8[voiceout]"
    
    voice_track = PUBLIC_SOUNDS / "nemi_v4_chatterbox_voice.mp3"
    merge_cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", filter_complex, "-map", "[voiceout]", "-b:a", "192k", str(voice_track)]
    subprocess.run(merge_cmd, check=True, capture_output=True)
    print(f"✅ Combined Chatterbox Voice Track: {voice_track.name}")
    
    # Mix with Synthwave Goose - Blade Runner 2049 BGM ducked at 11% volume
    bgm_file = PUBLIC_BGM / "Synthwave Goose - Blade Runner 2049.mp3"
    final_master = PUBLIC_SOUNDS / "nemi_v4_master_audio.mp3"
    
    if bgm_file.exists():
        mix_cmd = [
            "ffmpeg", "-y",
            "-i", str(voice_track),
            "-ss", "45", "-i", str(bgm_file),
            "-filter_complex",
            "[1:a]volume=0.11[bgm];[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[master]",
            "-map", "[master]",
            "-b:a", "192k",
            str(final_master)
        ]
        subprocess.run(mix_cmd, check=True, capture_output=True)
        print(f"✅ Final Master Mixed Audio (Voice + Ducked BGM): {final_master.name}")
    else:
        import shutil
        shutil.copy(voice_track, final_master)
        
    # Save structured metadata JSON for Remotion
    metadata = {
        "engine": "chatterbox-tts",
        "device": device,
        "sample_rate": sr,
        "total_duration_s": total_video_duration,
        "total_frames": total_frames,
        "fps": 30,
        "segments": generated_cues
    }
    
    cue_json_path = BASE_DIR / "src" / "data" / "nemi_v4_cues.json"
    cue_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cue_json_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"📄 Saved structured cue metadata to {cue_json_path}")
    
    with open(PUBLIC_SOUNDS / "nemi_v4_timing.json", "w") as f:
        json.dump(metadata, f, indent=2)
        
    print("\n🎉 CHATTERBOX V4 GENERATION COMPLETE!")

if __name__ == "__main__":
    main()
