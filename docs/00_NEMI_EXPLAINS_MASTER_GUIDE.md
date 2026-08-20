# 📘 NEMI EXPLAINS — MASTER PRODUCTION & DESIGN SYSTEM GUIDE

This document serves as the official specification, aesthetic rulebook, and engineering architecture for all videos produced under the **`@nemi.explains`** brand.

---

## 🛡️ 1. Instagram / Shorts / TikTok 4-Edge Safe Zone Architecture

Vertical 9:16 mobile video viewports (1080x1920) have native UI overlays and physical device cutouts (notch, dynamic island, status bar, bottom swipe bar, and right-hand engagement rails: like/comment/share buttons). 

To prevent content cropping on any mobile screen, all elements must strictly respect the **4-Edge Safe Margins**:

| Safe Zone Boundary | Padding / Offset | Protected Content |
|---|---|---|
| **Top Safe Inset** | **`85px - 90px`** | Clears phone status bar, camera hole-punch, and Instagram top header |
| **Topic Title Inset** | **`165px - 170px`** | Guaranteed clean breathing room under HUD |
| **Horizontal Gutters (Left & Right)** | **`65px - 70px`** | Shields cards & labels from Instagram's right-side interaction rail and curved screen corners |
| **Main Card Top Anchor** | **`380px`** (Height: `520px - 540px`) | Perfect vertical balance between header and mid-screen |
| **Mid-Screen Dynamic Visuals** | **`top: 920px - 1100px`** | Interactive badges, relationship arrows, and state pills |
| **Viral Karaoke Captions Zone** | **`top: 1140px - 1280px`** | Dedicated clear band above Nemi with zero asset overlap |
| **Nemi Mascot Dock** | **`bottom: 70px`** | Dedicated bottom-center dock with organic breathing |
| **Nemi Speech Bubble** | **`bottom: 440px`** | Floating above Nemi's head, spring-animated with arrow pointer |

---

## 💬 2. Dynamic Viral Karaoke Captions System

Viral short-form content demands rapid, punchy, and highly legible on-screen captions:

1. **Dedicated Non-Overlapping Safe Zone:**
   - Captions are anchored at **`top: 1140px`**, in the clear visual band between the mid-screen badges (`920px - 1100px`) and Nemi's mascot head.
   - **Zero Overlap Guarantee:** Captions never collide with the main cards above or Nemi / Speech Bubble below.
2. **Word-by-Word Highlight Animation:**
   - Each spoken word scales up smoothly (`interpolate(frame - w.start_frame, [0, 3, 7], [1.0, 1.18, 1.08])`). Words **never scale below `1.0`** so text is always 100% visible.
   - Active words light up in **Vibrant Gold (`#FFD166`)** or **Electric Cyan (`#06B6D4`)** with a glowing drop shadow (`textShadow: 0 0 20px ...`).
   - Inactive words remain crisp silver-white (`#F8FAFC`) with dark text-shadow for razor-sharp legibility against all backgrounds.
3. **Frosted Glass Container:**
   - Background: `rgba(10, 15, 30, 0.88)`
   - Backdrop Filter: `blur(20px)`
   - Border: `2px solid rgba(168, 85, 247, 0.55)`
   - Border Radius: `24px`
   - Shadow: `0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(168, 85, 247, 0.25)`
4. **Smart Mascot Coordination:**
   - The caption pill automatically hides (`!nemiSpeech`) when Nemi's yellow speech bubble is active to prevent redundant/duplicate on-screen text.
5. **Automated Timestamp Extraction:**
   - Generated with millisecond accuracy using `faster_whisper` (`base` model, `int8` on CPU) and grouped into 3–5 word phrase chunks in `src/data/<reel>_cues.json`.

---

## 🔊 3. Audio, Voice & SFX Engineering

1. **Dual-Voice Character Setup:**
   - **Narrator:** Deep, authoritative tech documentary voice via `Chatterbox Neural TTS` (`exaggeration=0.55 - 0.65`).
   - **Nemi Mascot:** Cute, expressive mascot via `Edge-TTS en-US-AnaNeural` (`pitch=+12Hz`, `rate=+18%` to `+20%`).
   - **Mascot Dialogue Rule:** Nemi strictly delivers emotional punchlines, surprise reactions, and closing technical payoffs (e.g. *"Pure Transformer architecture! 😎⚡"*).
2. **Audible & Musical Background Music Mix:**
   - BGM Volume: `0.50 - 0.55` (ensures the melody, groove, and rhythm are clearly audible).
   - Sidechain Compression Filter:
     ```bash
     [bgm][voice_sc]sidechaincompress=threshold=0.08:ratio=2.5:attack=35:release=160[ducked_bgm]
     ```
   - **Result:** Gentle, musical ducking during voice segments while keeping the music energized and audible throughout the reel.
   - Master Target Loudness: `-15.0 LUFS` (`TP=-1.5`, `LRA=7`).
3. **High-Impact SFX Layer:**
   - All SFX volumes boosted to `0.90 - 1.0` (typing `0.95`, whoosh `1.0`, pop `1.0`, notification `1.0`, click `1.0`, chime `1.0`).
   - Sound effects are frame-synchronized to visual changes (typing, matrix pop, layer glow, winner token reveal).

---

## 📐 4. Visual Hierarchy & High-Visibility Typography Rules (Ultra-Scale Standard)

All components strictly adhere to the following **High-Visibility Token Standards**:

| Element | Size | Weight / Styling |
|---|---|---|
| **Main Topic Headline** | `56px - 60px` | `fontWeight: 900`, `letterSpacing: -1.5px`, dual-tone accent |
| **HUD Category Tag** | `26px` | `fontWeight: 900`, uppercase, glowing indicator dot (`18px`) |
| **HUD Stage Badge** | `20px` | `fontWeight: 900`, `padding: "12px 24px"`, Mono |
| **Card Headers & Titles** | `26px - 28px` | `fontWeight: 900`, letterSpacing `1.5px` |
| **Primary Numbers / Values** | `28px - 34px` | `fontWeight: 900`, Mono, glowing badges |
| **Body Explanations** | `19px - 21px` | `fontWeight: 700 - 800`, `#94A3B8` |
| **Karaoke Captions** | `32px` | `fontWeight: 900`, `#FFD166` / `#06B6D4` active highlight |
| **Nemi Mascot Scale** | `1.65` | Dedicated bottom-center dock with organic breathing |
| **Nemi Speech Bubble** | `32px` | `padding: "16px 36px"`, `fontWeight: 900`, brand yellow |

---

## 🎨 5. Design Aesthetics & Visual Blueprint

1. **Airy, Breathable Negative Space (Zero Heavy Solid Black Rectangles):**
   - Never use massive solid black cards covering the middle canvas.
   - Use clean, transparent glassmorphic pills with glowing borders (`border: "2px solid rgba(...)"`).
2. **Deterministic Frame-by-Frame Motion:**
   - Never use CSS transitions for positions or opacity.
   - Always use Remotion `interpolate()` or `spring()` with `extrapolateLeft: "clamp"`.
3. **Continuous World Stage Manager:**
   - Multi-beat scenes cross-fade smoothly using `StageWrapper` parallax sliding (`translateY: 25px -> 0px -> -25px`, `opacity: 0 -> 1 -> 0`).
4. **Curiosity-Driven Scripting for Tech / AI / DSA:**
   - Explain real computer science architectures clearly and simply (e.g. Attention context disambiguation, 96 Layers / 175B weights, 15ms sampling).
   - Target reel duration: **24.0s – 26.0s** (fast-paced, high retention, under 26s).

---

## 🎬 6. Production Catalog

| Reel # | Composition ID | Topic | Duration | BGM Track | Master Video |
|---|---|---|---|---|---|
| **#1** | `NemiExplainsCaptcha` | How CAPTCHA Knows You're Human (Micro-Tremors) | `22.79s` (683f) | *Synthwave Goose - Blade Runner 2049* | `out/NemiExplains_Captcha_20260817.mp4` |
| **#2** | `NemiExplainsGoogle` | What Happens When You Type google.com? (64ms Journey) | `19.72s` (592f) | *Synthwave Goose - Blade Runner 2049* | `out/NemiExplains_Google_20260818.mp4` |
| **#3** | `NemiExplainsTwoSum` | Two Sum: The $O(N^2)$ Trap vs The 1-Pass Hash Map (LeetCode #1) | `24.47s` (734f) | *Synthwave Goose - Blade Runner 2049* | `out/NemiExplains_TwoSum_20260818.mp4` |
| **#4** | `NemiExplainsChatGPT` | How ChatGPT ACTUALLY Works: The Transformer Network | `25.61s` (768f) | *Death of a Bluebird - Rorschach Roy 4.mp3* | `out/NemiExplains_ChatGPT_20260820.mp4` |

