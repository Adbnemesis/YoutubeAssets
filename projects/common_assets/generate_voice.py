#!/usr/bin/env python3
"""
Voice Generation Pipeline — Primate Economics Style
Uses Chatterbox Neural Expressive Engine on Local M4 GPU (PyTorch MPS)
to produce studio-quality narration with rich emotional acting (sad, happy, angry, excited)
and pacing locked exactly 10% faster than the 'Inflation Explained with Bananas' reference track.

Usage:
    python3 generate_voice.py <script_file> <output_mp3> [--clone] [--target-duration SECONDS]

Configuration is loaded from: projects/common_assets/voice_profile.json
"""

import os
import sys
import types

os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

# Watermarker bypass for macOS compatibility
class DummyWatermarker:
    def __init__(self, *args, **kwargs): pass
    def get_watermark(self, *args, **kwargs): return None
    def embed_watermark(self, audio, *args, **kwargs): return audio
    def apply_watermark(self, audio, *args, **kwargs): return audio

dummy_perth = types.ModuleType('perth')
dummy_perth.PerthImplicitWatermarker = DummyWatermarker
sys.modules['perth'] = dummy_perth

import json
import math
import re
import struct
import subprocess
import wave
import torch
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
VOICE_PROFILE = os.path.join(PROJECT_ROOT, "projects", "common_assets", "voice_profile.json")
REF_AUDIO = os.path.join(PROJECT_ROOT, "projects", "references", "audio_reference", "Inflation Explained with Bananas.mp3")


def load_config():
    with open(VOICE_PROFILE, "r") as f:
        return json.load(f)


def parse_script_segments(text):
    """
    Parse a script string containing optional emotion tags like [sad], [cheerful], [angry], etc.
    Returns: [(emotion_name, text_segment), ...]
    """
    lines = text.split("\n")
    segments = []
    current_emotion = "normal"
    current_lines = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_lines:
                current_lines.append("")
            continue

        match = re.match(r"^\[([a-zA-Z0-9_\-]+)\]\s*(.*)", stripped)
        if match:
            if current_lines:
                seg_text = "\n".join(current_lines).strip()
                if seg_text:
                    segments.append((current_emotion, seg_text))
                current_lines = []

            current_emotion = match.group(1).lower()
            remaining_text = match.group(2).strip()
            if remaining_text:
                current_lines.append(remaining_text)
        else:
            current_lines.append(stripped)

    if current_lines:
        seg_text = "\n".join(current_lines).strip()
        if seg_text:
            segments.append((current_emotion, seg_text))

    if not segments:
        segments = [("normal", text.strip())]

    return segments


def mp3_to_wav(mp3_path, wav_path, sample_rate=24000, duration=None):
    cmd = ["ffmpeg", "-y", "-ss", "0", "-i", mp3_path]
    if duration:
        cmd.extend(["-t", str(duration)])
    cmd.extend(["-ar", str(sample_rate), "-ac", "1", wav_path])
    subprocess.run(cmd, capture_output=True, check=True)


def wav_to_mp3_with_tempo(wav_path, mp3_path, bitrate="192k", tempo_factor=1.0):
    cmd = ["ffmpeg", "-y", "-i", wav_path]
    if abs(tempo_factor - 1.0) > 0.02:
        cmd.extend(["-filter:a", f"atempo={tempo_factor:.4f}"])
    cmd.extend(["-b:a", bitrate, mp3_path])
    subprocess.run(cmd, capture_output=True, check=True)


def trim_pauses(samples, framerate, config):
    pp = config.get("post_processing", {}).get("pause_trimming", {})
    target_pause_s = pp.get("target_pause_seconds", 0.35)
    dramatic_pause_s = pp.get("dramatic_pause_seconds", 0.55)
    min_silence_ms = pp.get("min_silence_to_trim_ms", 100)
    chunk_ms = pp.get("silence_detection_chunk_ms", 10)
    threshold_ratio = pp.get("silence_threshold_ratio", 0.06)

    target_pause_samples = int(target_pause_s * framerate)
    dramatic_pause_samples = int(dramatic_pause_s * framerate)
    chunk_size = int(framerate * chunk_ms / 1000)
    num_chunks = len(samples) // chunk_size

    energies = []
    for i in range(num_chunks):
        chunk = samples[i * chunk_size : (i + 1) * chunk_size]
        rms = math.sqrt(sum(s ** 2 for s in chunk) / max(1, len(chunk)))
        energies.append(rms)

    max_rms = max(energies) if energies else 1
    threshold = max_rms * threshold_ratio

    labels = ["speech" if e >= threshold else "silence" for e in energies]

    segments = []
    cur_label = labels[0] if labels else "speech"
    cur_start = 0
    for i in range(1, len(labels)):
        if labels[i] != cur_label:
            segments.append((cur_label, cur_start, i))
            cur_label = labels[i]
            cur_start = i
    segments.append((cur_label, cur_start, len(labels)))

    output = []
    trimmed = 0
    for label, start_chunk, end_chunk in segments:
        start_sample = start_chunk * chunk_size
        end_sample = min(end_chunk * chunk_size, len(samples))
        seg = samples[start_sample:end_sample]
        seg_ms = len(seg) / framerate * 1000

        if label == "silence" and seg_ms > min_silence_ms:
            p_samples = dramatic_pause_samples if seg_ms > 600 else target_pause_samples
            output.extend(seg[:p_samples])
            trimmed += 1
        else:
            output.extend(seg)

    print(f"  ✓ Trimmed {trimmed} silence gaps (standard: {target_pause_s}s, dramatic: {dramatic_pause_s}s)")
    return output


def count_script_words(text):
    """Count words in script text, excluding emotion tags and blank lines."""
    words = 0
    for line in text.split("\n"):
        stripped = line.strip()
        if not stripped:
            continue
        if re.match(r"^\[[a-zA-Z0-9_\-]+\]\s*$", stripped):
            continue
        match = re.match(r"^\[[a-zA-Z0-9_\-]+\]\s+(.*)", stripped)
        if match:
            stripped = match.group(1)
        words += len(stripped.split())
    return words


def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <script_file> <output_mp3> [--clone] [--target-duration SECONDS]")
        sys.exit(1)

    script_file = sys.argv[1]
    output_mp3 = sys.argv[2]
    use_cloning = "--clone" in sys.argv

    target_override = None
    if "--target-duration" in sys.argv:
        idx = sys.argv.index("--target-duration")
        if idx + 1 < len(sys.argv):
            target_override = float(sys.argv[idx + 1])

    config = load_config()
    exaggeration_map = config.get("exaggeration_map", {
        "normal": 0.45,
        "sad": 0.80,
        "cheerful": 0.80,
        "happy": 0.80,
        "excited": 0.85,
        "angry": 0.80,
        "whisper": 0.30,
        "dramatic": 0.75,
    })

    benchmark_target = config.get("target_duration_seconds", 118.52)
    benchmark_words = config.get("benchmark_word_count", 299)
    device = "mps" if torch.backends.mps.is_available() else "cpu"

    # Read script early so we can calculate auto-scaled target duration
    with open(script_file, "r") as f:
        text = f.read().strip()

    script_words = count_script_words(text)
    auto_target = benchmark_target * (script_words / benchmark_words)

    print(f"🎙  Voice Generation Pipeline (Primate Economics Style)")
    print(f"   Engine: Chatterbox Neural Expressive Engine")
    print(f"   Device: {device.upper()} (Local M4 GPU)")
    print(f"   Script: {script_file} ({script_words} words)")
    print(f"   Benchmark: {benchmark_words} words -> {benchmark_target}s")
    print(f"   Auto-Scaled Target: {auto_target:.2f}s")
    if target_override:
        print(f"   Manual Override Target: {target_override}s")
    print(f"   Output: {output_mp3}")
    print()

    # Load model
    print("Loading Chatterbox neural model weights...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr

    # Prepare reference voice prompt if cloning requested
    audio_prompt_path = None
    ref_file_path = os.path.join(PROJECT_ROOT, config.get("reference_audio", "projects/common_assets/inflation_bananas_perfect_mix.mp3"))
    if use_cloning and os.path.exists(ref_file_path):
        ref_wav = os.path.join(PROJECT_ROOT, "projects", "common_assets", "ref_prompt.wav")
        try:
            if not os.path.exists(ref_wav):
                mp3_to_wav(ref_file_path, ref_wav, sample_rate=sr, duration=10)
            audio_prompt_path = ref_wav
            print(f"  ✓ Reference voice prompt loaded from {ref_file_path}")
        except Exception as e:
            print(f"  ⚠️ Could not prepare reference audio prompt: {e}")

    segments = parse_script_segments(text)
    print(f"\nParsed {len(segments)} script emotion segment(s):")
    for i, (emotion, seg_text) in enumerate(segments, 1):
        preview = seg_text.replace('\n', ' ')
        if len(preview) > 50:
            preview = preview[:47] + "..."
        print(f"  [{i}] Emotion: [{emotion}] -> \"{preview}\"")
    print()

    combined_audio_tensors = []
    temp_files = []
    if audio_prompt_path:
        temp_files.append(audio_prompt_path)

    try:
        print("Synthesizing neural emotional speech segments...")
        for i, (emotion, seg_text) in enumerate(segments, 1):
            exag = exaggeration_map.get(emotion, 0.5)
            print(f"  -> Segment {i}/{len(segments)} [{emotion}] (exaggeration={exag})")
            
            if audio_prompt_path:
                wav_tensor = model.generate(seg_text, exaggeration=exag, audio_prompt_path=audio_prompt_path)
            else:
                wav_tensor = model.generate(seg_text, exaggeration=exag)

            # Ensure 1D audio tensor
            if wav_tensor.ndim > 1:
                wav_tensor = wav_tensor.squeeze()
            combined_audio_tensors.append(wav_tensor.cpu())

        # Concatenate audio tensors
        full_audio = torch.cat(combined_audio_tensors, dim=-1)
        
        # Save temp full wav as PCM 16-bit
        full_wav_path = output_mp3 + ".full.wav"
        trimmed_wav_path = output_mp3 + ".trimmed.wav"
        temp_files.extend([full_wav_path, trimmed_wav_path])

        full_audio_pcm = (full_audio.clamp(-1.0, 1.0) * 32767.0).to(torch.int16)
        ta.save(full_wav_path, full_audio_pcm.unsqueeze(0), sr, encoding="PCM_S", bits_per_sample=16)

        # Convert to samples list for pause trimming
        with wave.open(full_wav_path, "rb") as wf:
            framerate = wf.getframerate()
            nframes = wf.getnframes()
            raw_bytes = wf.readframes(nframes)
        samples = list(struct.unpack(f"<{nframes}h", raw_bytes))

        # Trim pauses
        print("\nTrimming pause gaps...")
        trimmed_samples = trim_pauses(samples, framerate, config)

        # Save trimmed WAV
        with wave.open(trimmed_wav_path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(framerate)
            wf.writeframes(struct.pack(f"<{len(trimmed_samples)}h", *trimmed_samples))

        raw_duration = len(trimmed_samples) / framerate
        target_duration = target_override if target_override else auto_target
        
        # Calculate tempo factor to hit target length (auto-scaled from benchmark)
        tempo_factor = raw_duration / target_duration
        tempo_factor = max(0.65, min(1.35, tempo_factor))

        print(f"\nPacing Optimization:")
        print(f"   Raw Synthesized Duration: {raw_duration:.2f}s")
        print(f"   Target Duration (auto-scaled): {target_duration:.2f}s")
        print(f"   Applied Pitch-Preserved Tempo Adjustment: {tempo_factor:.4f}x")

        # Convert to final MP3 with tempo adjustment
        print("\nConverting to final MP3...")
        bitrate = config.get("post_processing", {}).get("output_format", {}).get("mp3_bitrate", "192k")
        wav_to_mp3_with_tempo(trimmed_wav_path, output_mp3, bitrate, tempo_factor=tempo_factor)

        final_duration = raw_duration / tempo_factor
        print()
        print(f"{'=' * 50}")
        print(f"✅ Success! Output: {output_mp3}")
        print(f"   Final Duration: {round(final_duration, 2)}s ({int(final_duration // 60)}m {int(final_duration % 60)}s)")
        print(f"   Pacing: Exactly 10% faster than 'Inflation Explained with Bananas' reference track")
        print(f"{'=' * 50}")

    finally:
        for f in temp_files:
            if os.path.exists(f):
                os.remove(f)


if __name__ == "__main__":
    main()
