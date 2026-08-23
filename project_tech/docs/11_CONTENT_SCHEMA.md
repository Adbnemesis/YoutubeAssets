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

---

## 3. Social Metadata Standard (Mandatory Format)

All `metadata.txt` files across reels must adhere strictly to these rules:
1. **Never use long dashes / horizontal divider lines:** Do not include `=====` or `-----` divider lines anywhere in metadata files. Use clean capitalized headers.
2. **Explicit Instagram Identification Header:** The file must start with `INSTAGRAM DESCRIPTION:` for immediate unambiguous identification.
3. **One-Liner Description:** The description must open with a single, high-impact punchy sentence summarizing the reel.
4. **5-Dot Line Breaks:** The one-liner description must be followed by exactly 5 lines containing only a single dot `.`:
   ```
   .
   .
   .
   .
   .
   ```
5. **Exactly 5 Tech-Based Hashtags with Fixed Pillars:**
   * **For LeetCode / DSA questions:** Fixed 3 tags `#leetcode #dsa #placement` + 2 specific tags (e.g. `#twosum #nemiexplains`). Total = 5 hashtags.
   * **For Generic Tech / Computer Science concepts:** Fixed 2 tags `#tech #algorithm` + 3 specific tags (e.g. `#shazam #audio #nemiexplains`). Total = 5 hashtags.

### Canonical Example (`metadata.txt`):

```text
INSTAGRAM DESCRIPTION:
Shazam heard one second of noisy audio and named the exact song.
.
.
.
.
.
#tech #algorithm #shazam #audio #nemiexplains

YOUTUBE SHORTS TITLE:
How Shazam Names Any Song From 1 Second of Audio 🎵🤯 #shorts

YOUTUBE SHORTS DESCRIPTION:
Shazam heard one second of noisy audio and named the exact song.
.
.
.
.
.
#tech #algorithm #shazam #audio #nemiexplains

YOUTUBE TAGS:
how shazam works, audio fingerprinting, spectrogram, music recognition, dsp, algorithms, nemi explains, shorts

TECHNICAL SPECS:
- Composition: NemiExplainsShazam
- Duration: 20.27s (608 frames @ 30fps)
- Aspect Ratio: 9:16 (1080x1920)

PUBLISHED LINKS:
- Instagram Reel (@nemi.explains): https://www.instagram.com/reel/...
- Facebook Reel: https://www.facebook.com/reel/...
- YouTube Shorts: https://youtu.be/...
```


