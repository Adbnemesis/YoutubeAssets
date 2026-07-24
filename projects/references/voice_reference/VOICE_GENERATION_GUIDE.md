# Expressive Voice Generation & Pacing Guide

This guide documents the complete technical setup, script syntax, voice properties, and execution steps for producing studio-quality expressive narration matching the **Primate Economics** style.

---

## 1. Executive Summary & Voice Properties

* **TTS Engine**: `Chatterbox TTS` (Local Neural Diffusion Model running on PyTorch MPS Apple Silicon GPU).
* **Reference Track**: `projects/references/audio_reference/Inflation Explained with Bananas.mp3` (Base Duration: `150.25s`).
* **Target Pacing**: **1.21x Speed Factor** (`124.17s` target duration for a full script).
* **Voice Expressions**: Full pitch and dynamic range acting using explicit script emotion tags (`[sad]`, `[cheerful]`, `[happy]`, `[excited]`, `[angry]`, `[whisper]`, `[dramatic]`).

---

## 2. Emotional Exaggeration Map

The exact exaggeration parameters configured in `projects/common_assets/voice_profile.json`:

| Emotion Tag | Exaggeration Value | Delivery Tone & Vocal Character |
| :--- | :--- | :--- |
| `[normal]` | `0.50` | Clear, deadpan baseline narrator. |
| `[sad]` | `0.85` | Melancholic, low-pitch, somber acting (*"monkey poor... monkey sad..."*). |
| `[cheerful]` | `0.85` | High-energy, upbeat intonation (*"Life is good!"*). |
| `[happy]` | `0.85` | Warm, bright, playful tone (*"monkey happy!"*). |
| `[excited]` | `0.95` | Maximum energy, fast peak intonation (*"monkey rich!"* / *"This is getting ridiculous!"*). |
| `[angry]` | `0.85` | Aggressive, emphatic pitch & volume (*"Price of banana goes up!"*). |
| `[whisper]` | `0.30` | Low volume, secretive breathy cadence. |
| `[dramatic]` | `0.85` | Deep, serious pauses (*"Hyper inflation!"* / *"monkey is all of us."*). |

---

## 3. Script Writing Guidelines

Structure your script text files with bracketed emotion tags at the start of emotion blocks or lines:

```text
[normal]
Imagine a monkey sitting in a giant jungle library.
Monkey wants to write a story about bananas.

[dramatic]
Large Language Models!

[cheerful]
Monkey reads one million books! Monkey eat banana. Life is good!

[angry]
Monkey memory full! Monkey drops the bananas!

[excited]
This is getting ridiculous!

[happy]
monkey happy!

[excited]
monkey rich!

[sad]
monkey poor...
monkey sad...

[dramatic]
monkey is all of us.
```

### Punctuation Rules
* **Periods (`.`)**: Natural falling cadence at thought endings.
* **Ellipses (`...`)**: Triggers dramatic anticipation pauses.
* **Exclamation Marks (`!`)**: Triggers high-pitch vocal emphasis.

---

## 4. Pipeline Steps & Execution

To generate voiceover for any new script using the configured voice properties:

```bash
# Run voice generator with script file and output path
/Users/talus/Downloads/youtube_ai/OpenMontage/.venv/bin/python3.11 projects/common_assets/generate_voice.py <script_file.txt> <output_voiceover.mp3>
```

### What the Pipeline Does Automatically:
1. **Parses Emotion Tags**: Extracts `[sad]`, `[excited]`, etc., and matches each block to its exact exaggeration profile.
2. **Local M4 GPU Synthesis**: Generates neural diffusion audio for each segment via PyTorch MPS.
3. **Pause Trimming & Spacing**: Trims standard silence gaps to `0.35s` and dramatic beats to `0.55s`.
4. **Pacing Scaling**: Automatically scales the audio duration so the total voiceover matches **1.21x speed factor** (`124.17s` target duration for full script).
5. **MP3 Export**: Exports a crisp `192kbps` stereo MP3 ready for timeline editing.

---

## 5. File References

* **Main Generator Script**: [generate_voice.py](file:///Users/talus/Downloads/youtube_ai/OpenMontage/projects/common_assets/generate_voice.py)
* **Voice Configuration Profile**: [voice_profile.json](file:///Users/talus/Downloads/youtube_ai/OpenMontage/projects/common_assets/voice_profile.json)
* **Reference Audio Track**: [Inflation Explained with Bananas.mp3](file:///Users/talus/Downloads/youtube_ai/OpenMontage/projects/references/audio_reference/Inflation%20Explained%20with%20Bananas.mp3)
* **Voice Engine Requirements**: [requirements.txt](file:///Users/talus/Downloads/youtube_ai/OpenMontage/projects/common_assets/requirements.txt)

---

## 6. Multi-Device Setup & Hugging Face Portability

The voice generation system is 100% portable across machines (macOS Apple Silicon, Linux GPU, or Windows):

### How Model Weights Work:
* **Automatic Download**: `generate_voice.py` uses `ChatterboxTTS.from_pretrained(device=device)`. On any new computer, running `generate_voice.py` will automatically download the 82M parameter diffusion model weights from Hugging Face (`ResembleAI/chatterbox`) on its first execution.
* **Cache Storage**: Model weights (~2.5 GB) are cached locally at `~/.cache/huggingface/` so they stay out of the Git repository while remaining instantly accessible.

### Setup on a New Device:
```bash
# 1. Install voice engine dependencies
pip install -r projects/common_assets/requirements.txt

# 2. Generate voice (auto-fetches Hugging Face model weights on 1st run)
python3 projects/common_assets/generate_voice.py <script.txt> <output.mp3>
```

