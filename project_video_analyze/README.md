# Professional Local Video Edit-Reverse-Engineering System (`project_video_analyze`)

A serious, professional-grade local video edit analysis engine designed to reverse-engineer any `.mp4` reference video frame-by-frame for exact recreation in **Remotion**.

---

## 🚀 Core Objective

The system converts raw reference MP4 videos into strongly-typed **Remotion event files**, **macro editing recipes**, **Edit DNA style metrics**, and **interactive HTML inspectors**, solving synchronization between:
- Music beats & multi-engine transient detection (Librosa + Aubio)
- Dialogue & word-level timing (Faster-Whisper)
- Shot cuts & transitions (PySceneDetect + Optical Flow)
- Text pops, OCR bounding boxes, and animation styles
- Camera movement, zoom punches, camera shake, and brightness flashes
- On-screen artwork & visual layer changes
- Local SFX fingerprint matching against sound effect libraries

---

## 🔒 Non-Negotiable Constraint: 100% Free & Local

**NO paid APIs, NO cloud SaaS, NO API keys.**
- **FFmpeg / FFprobe**: Video decoding, frame/audio extraction, metadata
- **PySceneDetect + Shot Boundary Classifier**: Multi-engine transition detection
- **Librosa + Aubio**: Multi-engine beat tracking, BPM, onsets, transients, energy flux, silence
- **Faster-Whisper**: Local speech alignment for word timestamps
- **OpenCV & Optical Flow**: Zoom punches, camera shake breakdown (horizontal, vertical, rotation), brightness flashes, pans
- **EasyOCR / PyTesseract**: Text detection with bounding boxes and entrance animation tracking
- **Local SFX Matcher**: MFCC & spectral feature matching against local sound effect libraries
- **Local VLM Adapter**: Ollama / local PyTorch VLM for keyframe descriptions

---

## 🛠 Installation & Setup

Ensure Python 3.10+ and FFmpeg are installed on your system.

```bash
pip install -r project_video_analyze/requirements.txt
```

Verify setup:
```bash
python project_video_analyze/cli.py check
```

---

## 📖 CLI Commands & Usage

### 1. Run Complete 13-Stage Edit Reverse-Engineering Analysis

```bash
python project_video_analyze/cli.py analyze path/to/reference.mp4
```

Custom output folder:
```bash
python project_video_analyze/cli.py analyze path/to/reference.mp4 --output-dir analysis/custom_folder
```

### 2. Reference vs Output QA Comparator

Compare frame timing differences and compute overall Remotion recreation accuracy:

```bash
python project_video_analyze/compare.py path/to/reference.mp4 path/to/rendered.mp4
```

Output includes:
- **TIMING ACCURACY %**
- **VISUAL EVENT ACCURACY %**
- **AUDIO SYNC %**

---

## 📂 Structured Output Hierarchy (`analysis/<video_name>/`)

```text
analysis/<video_name>/
├── edit_analysis.json              # Unified master edit blueprint
├── master_timeline.json            # Frame-correlated master timeline
├── EDIT_REPORT.md                  # Detailed Markdown report
├── ANTIGRAVITY_EDIT_INSTRUCTIONS.md # AI implementation instructions
├── EDIT_RECIPE.json                # Step-by-step macro editing recipe
├── edit_dna.json                   # Pacing, cuts, shake, zoom DNA metrics
├── remotion_events.ts              # Strongly-typed Remotion TypeScript timeline & helpers
├── audio/                          # Reconciled beats, onsets, audio events, SFX matches
├── video/                          # Shot cuts, zooms, zoom punches, camera shake, flashes
├── speech/                         # Speech transcript & timestamped word array
├── visual/                         # OCR text bounding boxes, VLM keyframe descriptions
├── patterns/                       # Classified macro editing patterns
├── frames/                         # Extracted frame images
├── previews/                       # Short 1.5s MP4 preview clips (cut_01, zoom_01, shake_01)
├── contact_sheet.jpg               # High-density master thumbnail grid
├── event_contact_sheet.jpg         # Event-focused cluster frame sheet
├── beat_map.html                   # Dedicated audio beat alignment matrix
└── timeline.html                   # Multi-track interactive timeline inspector
```

---

## 🎨 Remotion Integration Guide

Use the generated `remotion_events.ts` in your Remotion components:

```tsx
import React from "react";
import { Sequence, useCurrentFrame, interpolate } from "remotion";
import { editEvents, getNearestBeat, getEditingPattern } from "./remotion_events";

export const RemotionEditScene: React.FC = () => {
  const frame = useCurrentFrame();
  const nearestBeat = getNearestBeat(frame);
  const pattern = getEditingPattern(frame);

  // Zoom punch synchronized exactly to beat frame
  const scale = interpolate(
    frame,
    [nearestBeat?.frame || 0, (nearestBeat?.frame || 0) + 5, (nearestBeat?.frame || 0) + 15],
    [1.0, 1.15, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Sequence from={nearestBeat?.frame || 0}>
      <div style={{ transform: `scale(${scale})` }}>
        <h1>{pattern}</h1>
      </div>
    </Sequence>
  );
};
```

---

## ⚡ Source of Truth Rule

> **THE VIDEO ANALYSIS DATA IS THE TEMPORAL SOURCE OF TRUTH.**
>
> Never guess timing (`"around 3 seconds"`, `"roughly on beat"`). Always use exact analyzed frame numbers from `edit_analysis.json` and `remotion_events.ts`.
