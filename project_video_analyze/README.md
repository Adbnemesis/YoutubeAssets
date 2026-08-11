# Professional Local Video Edit Analyzer (`project_video_analyze`)

A serious, professional-grade local video analysis system designed to reverse-engineer any `.mp4` reference video frame-by-frame for exact recreation in **Remotion**.

---

## 🚀 Core Objective

The analyzer solves the synchronization problem between:
- Music beats & energy spikes
- Dialogue & word-level timing
- Shot cuts & transitions
- Text pops & OCR bounding boxes
- Camera movement, zooms, shakes, and flashes
- On-screen artwork & visual layer changes

---

## 🔒 Non-Negotiable Requirement: 100% Free & Local

**NO paid APIs, NO cloud SaaS, NO API keys.**
- **FFmpeg / FFprobe**: Video decoding, frame/audio extraction, metadata
- **PySceneDetect + Shot Boundary Classifier**: Multi-engine transition detection
- **Librosa**: Beat tracking, BPM, onsets, energy, silence
- **Faster-Whisper**: Local speech alignment for word timestamps
- **OpenCV & Optical Flow**: Motion tracking, zooms, camera shake, brightness flashes
- **EasyOCR / PyTesseract**: Text detection with bounding boxes
- **Local VLM Adapter**: Ollama / local PyTorch VLM for semantic keyframe descriptions

---

## 🛠 Installation & Diagnostic

### 1. Requirements
Ensure Python 3.10+ and FFmpeg are installed on your system.

```bash
pip install -r project_video_analyze/requirements.txt
```

### 2. Verify Tool Setup
Run the diagnostic checker:

```bash
python project_video_analyze/cli.py check
```

Expected Output:
```text
VIDEO ANALYZER
────────────────────────

FFmpeg        ✓
FFprobe       ✓
PySceneDetect ✓
TransNetV2    ✓
librosa       ✓
OpenCV        ✓
WhisperX      ✓
Tesseract / EasyOCR ✓
Local VLM     ✓

Ready.
```

---

## 📖 CLI Commands & Usage

### 1. Analyze Reference Video

Run the complete 9-stage analysis pipeline on any `.mp4` file:

```bash
python project_video_analyze/cli.py analyze path/to/reference.mp4
```

Custom output folder:
```bash
python project_video_analyze/cli.py analyze path/to/reference.mp4 --output-dir analysis/custom_folder
```

### 2. Reference vs Output Comparator

Compare frame timing differences between reference video and rendered Remotion output:

```bash
python project_video_analyze/compare.py path/to/reference.mp4 path/to/rendered.mp4
```

Example Output:
```text
------------------------------------------
 CUT TIMING COMPARISON
------------------------------------------
 Cut #1: MATCH (frame 0)
 Cut #2: ERROR: -4 frames (Ref: frame 129, Output: frame 125)

------------------------------------------
 ZOOM TIMING COMPARISON
------------------------------------------
 Zoom #1 (Ref: 12 → 24 | Output: 15 → 27)
   START ERROR: +3 frames | END ERROR: +3 frames
```

---

## 📂 Output Artifacts (`analysis/<video_name>/`)

| File | Description |
| :--- | :--- |
| `edit_analysis.json` | Master unified edit blueprint containing all metadata and streams. |
| `master_timeline.json` | Chronological array of frame events with correlated editing patterns. |
| `scenes.json` | Shot boundaries and scene durations. |
| `transitions.json` | Reconciled cuts, fades, dissolves, and flashes. |
| `audio_analysis.json` | Beats, strong beats, BPM, onsets, and silence intervals. |
| `transcript.json` | Full speech transcript with word start/end frames. |
| `visual_events.json` | Frame diffs, optical flow zooms, camera shakes, and flashes. |
| `text.json` | Detected text strings, bounding boxes, and visible frame ranges. |
| `contact_sheet.jpg` | Grid thumbnail sheet with burnt-in timestamps (`00:03.216 \| F193`). |
| `EDIT_REPORT.md` | Human-readable breakdown of the edit. |
| `timeline.html` | Interactive dashboard with track lanes and click-to-inspect modals. |

---

## 🎨 Remotion Integration Guide

Use `project_video_analyze/remotion/editAnalysisLoader.ts` in your Remotion components to synchronize animations to analyzed frame numbers without timing guessing:

```tsx
import React from "react";
import { Sequence, useCurrentFrame, interpolate } from "remotion";
import editAnalysis from "../../../analysis/trio_edit/edit_analysis.json";
import {
  getBeatFrame,
  getNearestBeat,
  getEventsAtFrame
} from "../remotion/editAnalysisLoader";

export const MyRemotionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const firstBeatFrame = getBeatFrame(editAnalysis, 0);

  // Zoom punch synchronized exactly to beat frame
  const scale = interpolate(
    frame,
    [firstBeatFrame, firstBeatFrame + 5, firstBeatFrame + 15],
    [1.0, 1.2, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Sequence from={firstBeatFrame}>
      <div style={{ transform: `scale(${scale})` }}>
        <h1>SYNCHRONIZED EDIT</h1>
      </div>
    </Sequence>
  );
};
```

---

## ⚡ Source of Truth Rule

> **THE VIDEO ANALYSIS DATA IS THE SOURCE OF TRUTH.**
>
> Never guess timing (`"around 3 seconds"`, `"roughly on beat"`). Always use exact analyzed frame numbers from `edit_analysis.json`.
