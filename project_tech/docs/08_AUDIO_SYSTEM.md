# 🔊 NEMI EXPLAINS — MULTI-LAYERED SOUND DESIGN & AUDIO ENGINEERING

> Sources: OpenMontage `skills/creative/sound-design.md`, W3C Audio Guidelines, YouTube/TikTok Platform Specs 2025.

---

## 1. Loudness & Mastering Standards

Short-form audio must be loud, crisp, and punchy on mobile phone speakers without digital distortion:

| Metric | Target Standard | Permitted Tolerance | Rationale |
|:---|:---|:---|:---|
| **Master Integrated Loudness ($I$)** | **`-15.0 LUFS`** | $\pm 0.5$ LUFS | Optimized for Instagram Reels, YouTube Shorts, TikTok. |
| **Voice Track Normalization** | **`-16.0 LUFS`** | $\pm 0.5$ LUFS | Clean vocal presence cutting through background music. |
| **True Peak ($TP$)** | **`-1.5 dBTP`** | $\le -1.5$ dBTP | Prevents inter-sample clipping on AAC mobile codecs. |
| **Loudness Range ($LRA$)** | **`6.0 – 8.0 dB`** | Controlled | Punchy dynamic range without listener fatigue. |

---

## 2. Audible Background Music (BGM) & Musical Sidechain Ducking

> **Key Discovery:** Overly aggressive ducking makes the background music sound muffled and creates a flat, boring video. The music groove and rhythm must remain **clearly audible** throughout the video!

* **Pre-Gain BGM Volume:** `0.50 – 0.55` (upbeat 110–130 BPM energetic tech/synthwave tracks).
* **Musical Sidechain Compressor Filter (FFmpeg):**
  ```bash
  sidechaincompress=threshold=0.08:ratio=2.5:attack=35:release=160
  ```
  * **Threshold (`0.08`):** Ducks gently only during loud vocal peaks.
  * **Ratio (`2.5:1`):** Gentle musical compression (ducks by ~4-6 dB, NOT 20 dB).
  * **Attack (`35ms`):** Natural smooth transition into speech.
  * **Release (`160ms`):** Fast return to full music energy between vocal phrases.

---

## 3. Multi-Layered Sound Effects (SFX) Taxonomy

Sound effects give tactile weight to digital animations:

| SFX Category | Audio File | Volume | Sync Rule | Timing Note |
|---|---|---|---|---|
| **Transition Whoosh** | `sfx/whoosh.mp3` | **`1.0`** | Stage & scene transitions | Start **15ms before** the visual cut |
| **Text Pop / Pluck** | `sfx/pop.mp3` | **`1.0`** | Badge & card appearances | Triggers on frame of element scale pop |
| **UI Click / Tap** | `sfx/click.mp3` | **`1.0`** | Button clicks & array pointer shifts | Exact frame synchronization |
| **Insight Chime** | `sfx/chime.mp3` | **`1.0`** | "Aha!" moments & final payoffs | Harmonic ring on punchline |
| **Alert Notification** | `sfx/notification.mp3` | **`1.0`** | High-energy layer reveals | Instant attention trigger |
| **Prompt Typing** | `sfx/typing.mp3` | **`0.95`** | User prompt input text | Multi-key rapid typing burst |

---

## 4. Voiceover Pacing & Dual-Character TTS

1. **Narrator (Chatterbox Neural TTS):**
   - Speed: **180–200 Words Per Minute (WPM)**.
   - Style: Confident, energetic, documentary-style authority.
   - Pacing: Tight gaps (`120ms – 160ms`) between sentences (zero dead air).
2. **Nemi Mascot (Edge-TTS `en-US-AnaNeural`):**
   - Pitch: `+12Hz`, Rate: `+20%`.
   - Role: Delivers emotional reactions, surprised gasps, and final smug punchlines.
