#!/usr/bin/env python3
"""
Nemi Explains Reel #8 — "ChatGPT Has Never Seen a Single Letter of This Word."
Tokenization: BPE chunking, token IDs, and why AI miscounts letters (the strawberry problem).

Everyday-AI pillar entry (playbook 70/20 doctrine). Doctrine applied:
- Frame-0 money shot (word splits into token tiles at frame 0, contradiction overlay)
- Payoff lands ~57-62% (x-ray reveal: the R's were buried inside chunks)
- Loop seam
- Duration target 19-22s
"""

import os
import sys
import json
import asyncio
import subprocess
import shutil
from pathlib import Path
from faster_whisper import WhisperModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PUBLIC_REELS = BASE_DIR / "public" / "reels" / "tokenize_08"
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
import edge_tts

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
# TOKENIZATION SCRIPT — payoff ~57-62%, loop seam
# ═══════════════════════════════════════════════════════════════
SPEAKER_EVENTS = [
    # 1. Beat 1: FRAME-0 HOOK — the word is already splitting on screen
    {
        "id": "tk01_hook",
        "speaker": "narrator",
        "text": "ChatGPT has never seen a single letter of this word.",
        "emotion": "dramatic",
        "exaggeration": 0.62,
        "gap_after_ms": 110,
        "semantic_phrases": [
            {"phrase": "never seen", "cue": "word_split", "rel_pct": 0.45},
            {"phrase": "letter", "cue": "token_ids", "rel_pct": 0.82}
        ]
    },
    # 2. Beat 2: The Secret — the tokenizer chops text first
    {
        "id": "tk02_secret",
        "speaker": "narrator",
        "text": "Before any thinking, the tokenizer chops your text into chunks called tokens.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "chops", "cue": "chop_text", "rel_pct": 0.48},
            {"phrase": "tokens", "cue": "tokens_labeled", "rel_pct": 0.85}
        ]
    },
    # 3. Beat 3: Nemi's Wrong Guess
    {
        "id": "tk03_nemi_guess",
        "speaker": "nemi",
        "text": "Whole words though?! 🤯",
        "emotion": "shocked",
        "exaggeration": 0.70,
        "gap_after_ms": 90,
        "semantic_phrases": [
            {"phrase": "Whole words", "cue": "buzzer_shock", "rel_pct": 0.50}
        ]
    },
    # 4. Beat 4: The Reversal — a giant chunk dictionary
    {
        "id": "tk04_reversal",
        "speaker": "narrator",
        "text": "Nope! Every common chunk just gets an ID number from a hundred-thousand-entry dictionary.",
        "emotion": "dramatic",
        "exaggeration": 0.60,
        "gap_after_ms": 100,
        "semantic_phrases": [
            {"phrase": "ID number", "cue": "ids_populate", "rel_pct": 0.42},
            {"phrase": "dictionary", "cue": "dict_counter", "rel_pct": 0.80}
        ]
    },
    # 5. Beat 5: THE PAYOFF — x-ray reveal (~58%)
    {
        "id": "tk05_payoff",
        "speaker": "narrator",
        "text": "So strawberry becomes three pieces... and the R's vanish inside them.",
        "emotion": "dramatic",
        "exaggeration": 0.62,
        "gap_after_ms": 110,
        "semantic_phrases": [
            {"phrase": "three pieces", "cue": "pieces_split", "rel_pct": 0.38},
            {"phrase": "vanish", "cue": "rs_highlight", "rel_pct": 0.75}
        ]
    },
    # 6. Beat 6: Nemi Smug Stamp
    {
        "id": "tk06_nemi_payoff",
        "speaker": "nemi",
        "text": "Blame the chunks! 😎",
        "emotion": "smug",
        "exaggeration": 0.75,
        "gap_after_ms": 140,
        "semantic_phrases": [
            {"phrase": "Blame the chunks", "cue": "smug_stamp", "rel_pct": 0.40}
        ]
    },
    # 7. Beat 7: LOOP SEAM
    {
        "id": "tk07_loop",
        "speaker": "narrator",
        "text": "Misspellings, weird math, lost letters — always ask what the AI actually sees.",
        "emotion": "normal",
        "exaggeration": 0.55,
        "gap_after_ms": 120,
        "semantic_phrases": [
            {"phrase": "lost letters", "cue": "loop_wave", "rel_pct": 0.35},
            {"phrase": "actually sees", "cue": "loop_check", "rel_pct": 0.78}
        ]
    }
]

TARGET_VOICE_LUFS = -16.0
TARGET_MASTER_LUFS = -15.0

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

def extract_subtitles_whisper(audio_path, fps=30):
    print("\n🔍 Extracting Millisecond-Accurate Word Timestamps (faster_whisper)...")
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(str(audio_path), word_timestamps=True)

    words_raw = []
    for segment in segments:
        for w in segment.words:
            clean_w = w.word.strip()
            if clean_w:
                words_raw.append({
                    "word": clean_w,
                    "start_s": round(w.start, 3),
                    "end_s": round(w.end, 3),
                    "start_frame": int(round(w.start * fps)),
                    "end_frame": int(round(w.end * fps))
                })

    phrase_chunks = []
    chunk_size = 4
    for i in range(0, len(words_raw), chunk_size):
        group = words_raw[i:i+chunk_size]
        if not group:
            continue
        start_f = group[0]["start_frame"]
        end_f = group[-1]["end_frame"] + 4
        phrase_text = " ".join([item["word"] for item in group])
        phrase_chunks.append({
            "start_frame": start_f,
            "end_frame": end_f,
            "text": phrase_text,
            "words": group
        })

    print(f"✅ Extracted {len(words_raw)} words across {len(phrase_chunks)} caption phrase chunks.")
    return phrase_chunks, words_raw

def main():
    print("═" * 70)
    print("🎙️ NEMI EXPLAINS REEL #8 — TOKENIZATION & THE STRAWBERRY PROBLEM")
    print("═" * 70)

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"   Engine: Chatterbox Neural Expressive TTS + Edge-TTS AnaNeural")

    print("Loading Chatterbox model weights for Narrator...")
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    print(f"✅ Model loaded. Sample Rate: {sr} Hz\n")

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
        gap_after = event.get("gap_after_ms", 100)

        out_wav = BLOCKS_DIR / f"{event_id}.wav"

        print(f"[{i:2d}/{len(SPEAKER_EVENTS)}] Generating '{event_id}' ({speaker.upper()}): \"{text}\"")

        if speaker == "nemi":
            temp_mp3 = BLOCKS_DIR / f"{event_id}_temp.mp3"
            clean_text = text.replace("😎", "").replace("⚡", "").replace("🤯", "").replace("🤔", "").replace("❄️", "").replace("💀", "").strip()
            async def gen_nemi():
                comm = edge_tts.Communicate(clean_text, "en-US-AnaNeural", pitch="+12Hz", rate="+20%")
                await comm.save(str(temp_mp3))
            asyncio.run(gen_nemi())

            conv_cmd = ["ffmpeg", "-y", "-i", str(temp_mp3), "-ar", str(sr), "-ac", "1", str(out_wav)]
            subprocess.run(conv_cmd, check=True, capture_output=True)
            y, _ = sf.read(str(out_wav))
            if temp_mp3.exists():
                temp_mp3.unlink()
        else:
            wav_tensor = model.generate(text=text, exaggeration=exag)
            if wav_tensor.ndim > 1:
                wav_tensor = wav_tensor.squeeze()
            y = wav_tensor.cpu().numpy()

        y = trim_silence(y, sr, top_db=35)
        y = normalize_lufs(y, sr, TARGET_VOICE_LUFS)
        sf.write(str(out_wav), y, sr)

        dur_s = len(y) / sr
        dur_ms = int(dur_s * 1000)

        start_time_ms = current_time_ms
        end_time_ms = start_time_ms + dur_ms
        start_frame = int(round((start_time_ms / 1000.0) * 30))
        end_frame = int(round((end_time_ms / 1000.0) * 30))

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

    raw_voice_wav = BLOCKS_DIR / "token_voice_raw.wav"
    cmd = ["ffmpeg", "-y"] + audio_inputs + ["-filter_complex", filter_complex, "-map", "[voice_out]", "-ar", "48000", str(raw_voice_wav)]
    subprocess.run(cmd, check=True, capture_output=True)

    # 2. Master Voice Loudness Target
    final_voice_mp3 = Path(__file__).resolve().parent / "audio" / "token_voice_track.mp3"
    norm_cmd = [
        "ffmpeg", "-y", "-i", str(raw_voice_wav),
        "-af", f"loudnorm=I={TARGET_VOICE_LUFS}:TP=-1.5:LRA=7",
        "-b:a", "320k",
        str(final_voice_mp3)
    ]
    subprocess.run(norm_cmd, check=True, capture_output=True)
    print(f"✅ Master Voice Track: {final_voice_mp3.name}")

    # 3. Dynamic BGM Story Arc + Sidechain Ducking + final limiter
    bgm_path = BASE_DIR / "assets" / "background_music" / "joel sunny - luminary [original song] - official audio 4.mp3"
    if not bgm_path.exists():
        bgm_path = BASE_DIR / "public" / "bgm" / "joel sunny - luminary [original song] - official audio 4.mp3"

    master_audio_mp3 = PUBLIC_REELS / "token_master_audio.mp3"

    if bgm_path.exists():
        print(f"🎵 Mixing BGM with Dynamic Story Arc: {bgm_path.name}")
        t_hook_end = min(4.0, total_duration_s * 0.22)
        t_secret_end = min(8.0, total_duration_s * 0.40)
        t_build_end = min(13.0, total_duration_s * 0.62)
        t_climax_end = min(17.5, total_duration_s * 0.84)
        vol_expr = (
            f"if(lt(t,{t_hook_end}),0.34,"
            f"if(lt(t,{t_secret_end}),0.26,"
            f"if(lt(t,{t_build_end}),0.32,"
            f"if(lt(t,{t_climax_end}),0.42,0.28))))"
        )
        sidechain_filter = (
            f"[1:a]aloop=loop=-1:size=2e+09,atrim=0:{total_duration_s},volume='{vol_expr}':eval=frame,afade=t=in:st=0:d=0.25,afade=t=out:st={total_duration_s - 0.7}:d=0.7[bgm];"
            f"[0:a]asplit=2[voice_main][voice_sc];"
            f"[bgm][voice_sc]sidechaincompress=threshold=0.08:ratio=2.5:attack=35:release=160[ducked_bgm];"
            f"[voice_main][ducked_bgm]amix=inputs=2:normalize=0[mix];"
            f"[mix]loudnorm=I={TARGET_MASTER_LUFS}:TP=-1.5:LRA=7[ln];"
            f"[ln]alimiter=limit=0.8:level=false[out]"
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
        print(f"✅ Dynamic Master Audio Mix (limiter last): {master_audio_mp3.name}")
    else:
        shutil.copy(final_voice_mp3, master_audio_mp3)

    shutil.copy(master_audio_mp3, PUBLIC_SOUNDS / "token_master_audio.mp3")

    # 4. Extract word-level subtitles using faster_whisper
    subtitles, words_all = extract_subtitles_whisper(final_voice_mp3, fps=30)

    # 5. Export JSON cues for Remotion
    cues_json_path = BASE_DIR / "src" / "data" / "tokenize_08_cues.json"
    cues_data = {
        "reel_id": "tokenize_08",
        "title": "ChatGPT Has Never Seen a Single Letter of This Word.",
        "total_duration_s": total_duration_s,
        "total_frames": total_frames,
        "fps": 30,
        "timeline_events": timeline_events,
        "subtitles": subtitles,
        "words": words_all
    }
    with open(cues_json_path, "w") as f:
        json.dump(cues_data, f, indent=2)
    print(f"✅ Timeline cues and word-level subtitles written to: {cues_json_path}")

    # 6. Validate Speaker Separation & Overlap
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
        print("\n🎉 DUAL-VOICE AUDIO & SUBTITLE PIPELINE COMPLETE — 0.00ms OVERLAP GUARANTEED\n")

if __name__ == "__main__":
    main()
