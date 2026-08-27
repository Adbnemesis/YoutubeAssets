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

### BGM Library (project_tech/public/bgm/) — 2026-08-22 audit

| Track | Duration | Mean loudness | Peak | Vibe | Used by | Era |
|---|---|---|---|---|---|---|
| `joel sunny - luminary [original song]` | 3:09 | −14.3 dB | 0.0 dBFS | Energetic violin-synth, anthemic | qr_06, shazam_07, tokenize_08, gps_10 | Modern (last 4) |
| `Death of a Bluebird - Rorschach Roy` | 1:00 | −19.5 dB | −2.4 dB | Quiet, atmospheric, introspective | chatgpt_04, riddle_05, **noise_11** | Mid + current |
| `Synthwave Goose - Blade Runner 2049` | 3:47 | −10.1 dB | 0.0 dB | Hot, dense synthwave | captcha_01, google_02, twosum_03, floating_point_01 | Early |

### BGM ROTATION RULE (added 2026-08-22)

1. **Never use the same track more than 2 consecutive reels.** Luminary ran 4 straight (Ep.6–Ep.9) → rotation debt. Bluebird now breaks the streak for Ep.11.
2. **Match the track to the topic mood, then the mix:**
   - Quiet/atmospheric topic (silence, deep focus) → **Death of a Bluebird** (it is ~5 dB quieter, so the dynamic envelope gets a higher plateau — see noise_11 mix: hook 0.40–0.60 vs Luminary's 0.26–0.42).
   - Energetic/tech/hidden-journey → **Luminary**.
   - High-energy / contrast topics → **Synthwave Goose** (mastered hot at 0 dBFS; pre-gain low ~0.22 and strong ducking required).
3. **Every reel's generate_audio.py must record which track was used + the exact envelope in the reel's case study** (`docs/reels/<slug>/V01.md`), so the rotation is auditable.

### Two-Layer Audio Strategy for Trending IG Audio (added 2026-08-22)

Trending Instagram audio only pays the full algorithmic dividend when added **in-app via the music sticker at publish time** (that's how IG counts usage and ranks the sound's page). Baked-in mp3s can't be tracked/ducked, and a ripped track risks Content-ID issues on YouTube Shorts on the same cross-post.

- **Layer 1 (baked):** quiet, royalty-free/self-owned brand bed (the BGM library above), sidechain-ducked to narration. This is the "brand consistency" layer.
- **Layer 2 (sticker):** at publish, overlay the user's chosen trending sound at low volume (~20–30%) via IG's music sticker. Full trend boost, zero copyright risk, voice mix untouched.
- Rule: pick the trending sound the day of publishing (trends rotate fast), not at render time. Add it to every reel's publish checklist.

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
