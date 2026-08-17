#!/usr/bin/env python3
"""
Zero-dependency procedural SFX generator for Project Tech Remotion Engine.
Generates sub-bass impact, mechanical typing clicks, clock ticks, and victory chime.
"""
import wave
import struct
import math
import os
from pathlib import Path

SOUNDS_DIR = Path(__file__).resolve().parent.parent / "public" / "sounds"
SOUNDS_DIR.mkdir(parents=True, exist_ok=True)

SAMPLE_RATE = 44100

def write_wav(filename: Path, samples: list):
    with wave.open(str(filename), 'w') as wav_file:
        wav_file.setnchannels(1) # Mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        for s in samples:
            val = max(-32767, min(32767, int(s * 32767)))
            wav_file.writeframes(struct.pack('<h', val))
    print(f"Generated audio asset: {filename.name}")

def generate_sub_impact():
    duration = 0.8 # seconds
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Pitch drops from 90Hz to 35Hz
        freq = 90.0 * math.exp(-t * 3.5)
        phase = 2 * math.pi * freq * t
        envelope = math.exp(-t * 4.0)
        sample = math.sin(phase) * envelope * 0.9
        samples.append(sample)
    write_wav(SOUNDS_DIR / "sub_impact.wav", samples)

def generate_clock_tick():
    duration = 0.08
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        freq = 1200.0 + 800.0 * (1 - t/duration)
        envelope = math.exp(-t * 80.0)
        sample = math.sin(2 * math.pi * freq * t) * envelope * 0.7
        samples.append(sample)
    write_wav(SOUNDS_DIR / "clock_tick.wav", samples)

def generate_correct_chime():
    duration = 1.2
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    # Major chord frequencies (C6, E6, G6, C7)
    freqs = [1046.50, 1318.51, 1567.98, 2093.00]
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        envelope = math.exp(-t * 3.0)
        sample = sum(math.sin(2 * math.pi * f * t) for f in freqs) / len(freqs) * envelope * 0.75
        samples.append(sample)
    write_wav(SOUNDS_DIR / "correct_chime.wav", samples)

def generate_switch_clack():
    duration = 0.04
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    import random
    random.seed(42)
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        noise = (random.random() * 2 - 1) * 0.4
        tone = math.sin(2 * math.pi * 3200 * t) * 0.6
        envelope = math.exp(-t * 120.0)
        samples.append((noise + tone) * envelope * 0.8)
    write_wav(SOUNDS_DIR / "switch_clack.wav", samples)

if __name__ == "__main__":
    generate_sub_impact()
    generate_clock_tick()
    generate_correct_chime()
    generate_switch_clack()
