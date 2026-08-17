# NEMI EXPLAINS — CONTENT TIMELINE SCHEMA & METADATA

## 1. JSON Cue Schema Specification
Every Reel generates a structured timing cue file (`src/data/nemi_v{N}_cues.json`) that acts as the single source of truth for Remotion rendering:

```json
{
  "engine": "chatterbox-tts",
  "version": "v7",
  "sample_rate": 24000,
  "target_voice_lufs": -16.0,
  "total_duration_s": 22.08,
  "total_frames": 662,
  "fps": 30,
  "segments": [
    {
      "id": "v7_001_hook_stuff",
      "speaker": "narrator",
      "text": "Your JavaScript keeps making stuff.",
      "emotion": "normal",
      "beat": "hook",
      "duration_s": 1.92,
      "start_time_ms": 0,
      "end_time_ms": 1920,
      "start_frame": 0,
      "end_frame": 57
    }
  ]
}
```

---

## 2. Segment Fields Reference
* `id` *(string)*: Unique identifier formatted as `{version}_{index}_{descriptor}`.
* `speaker` *(string)*: `"narrator"` | `"nemi"`.
* `text` *(string)*: Spoken dialogue script.
* `emotion` *(string)*: Chatterbox emotion tag (`normal`, `dramatic`, `whisper`, `cheerful`, `excited`, `happy`).
* `beat` *(string)*: Story phase (`hook`, `question`, `challenge`, `nemi_guess`, `freeze`, `reveal`, `trace`, `rule`, `climax`, `payoff`, `outro`).
* `start_frame` / `end_frame` *(integer)*: Frame-accurate start and end points in Remotion @ 30fps.
