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
| **Main Card Top Anchor** | **`380px`** (Height: `550px`) | Perfect vertical balance between header and mid-screen |
| **Mid-Screen Visual Anchor** | **`top: 960px`** | Perfectly centered between main cards and mascot |
| **Bottom Safe Inset** | **`bottom: 70px`** | Clears Instagram bottom caption area, audio marquee, and device home swipe bar |

---

## 📐 2. Visual Hierarchy & High-Visibility Typography Rules (Ultra-Scale Standard)

All components strictly adhere to the following **High-Visibility Token Standards**:

| Element | Initial Base | +10% Scale | **Ultra Standard (+20% Total)** | Weight / Styling |
|---|---|---|---|---|
| **Main Topic Headline** | `44px - 50px` | `56px` | **`58px - 62px`** | `fontWeight: 900`, `letterSpacing: -1.5px` |
| **HUD Category Tag** | `18px - 22px` | `25px` | **`26px - 28px`** | `fontWeight: 900`, uppercase, glowing cyan indicator (`18px`) |
| **HUD Stage Badge** | `14px - 17px` | `19px` | **`20px - 22px`** | `fontWeight: 900`, `padding: "12px 24px"`, Mono |
| **Primary Numbers & Array Values** | `28px - 34px` | `40px` | **`44px - 46px`** | `fontWeight: 900`, Mono, index tags `16px` |
| **Complement / Key Formula** | `24px - 32px` | `36px / 28px` | **`38px / 30px`** | `fontWeight: 900`, Mono, high contrast glowing border |
| **Card Headers & Titles** | `17px - 22px` | `25px` | **`26px - 28px`** | `fontWeight: 900`, letterSpacing `1.5px` |
| **Body Explanations & Captions** | `13px - 16px` | `19px - 20px` | **`20px - 22px`** | `fontWeight: 700 - 800` |
| **Status Pills & Stage Tags** | `14px - 17px` | `19px` | **`20px - 22px`** | `padding: "12px 28px"`, Mono |
| **Mid-Screen Floating Emojis** | `28px - 38px` | `44px` | **`46px - 50px`** | Clean floating glassmorphic pills (zero solid black boxes) |
| **Connecting Arrows** | `22px - 28px` | `32px` | **`32px - 36px`** | `fontWeight: 900` |
| **Nemi Mascot Scale** | `1.30 - 1.42` | `1.56` | **`1.65 - 1.72`** | Dedicated bottom-center dock with organic breathing |
| **Nemi Speech Bubble** | `22px - 26px` | `30px` | **`32px - 34px`** | `padding: "16px 38px"`, `fontWeight: 900`, spring pop |

---

## 🎨 3. Design Aesthetics & Layout Blueprint

1. **Airy, Breathable Negative Space (Zero Heavy Solid Black Rectangles):**
   - Never use massive solid black cards covering the middle canvas.
   - Use clean, transparent glassmorphic pills with glowing borders (`border: "2px solid rgba(...)"`).
2. **Deterministic Frame-by-Frame Motion:**
   - Never use CSS transitions for positions or opacity.
   - Always use Remotion `interpolate()` or `spring()` with `extrapolateLeft: "clamp"`.
3. **Continuous World Stage Manager:**
   - Multi-beat scenes cross-fade smoothly using `StageWrapper` parallax sliding (`translateY: 30px -> 0px -> -30px`, `opacity: 0 -> 1 -> 0`).

---

## 🎙️ 4. Audio & Voice Architecture

1. **Dual-Voice Character Setup:**
   - **Narrator:** Deep, authoritative tech documentary voice via `Chatterbox Neural TTS` (`exaggeration=0.55 - 0.65`).
   - **Nemi Mascot:** Cute, expressive mascot via `Edge-TTS en-US-AnaNeural` (`pitch=+12Hz`, `rate=+18%`).
2. **Zero Overlap State Machine:**
   - Gaps strictly locked between `180ms` and `250ms`.
3. **Background Music & Ducking:**
   - Energetic synthwave track: `assets/background_music/Synthwave Goose - Blade Runner 2049.mp3`.
   - Sidechain compression via FFmpeg: `threshold=0.035`, `ratio=7`, `attack=25ms`, `release=220ms`.
   - Target Loudness: `-15.5 LUFS`.

---

## 🎬 5. Production Catalog

| Reel # | Composition ID | Topic | Duration | Master Video |
|---|---|---|---|---|
| **#1** | `NemiExplainsCaptcha` | How CAPTCHA Knows You're Human (Micro-Tremors) | `22.79s` (683f) | `out/NemiExplains_14_Master.mp4` |
| **#2** | `NemiExplainsGoogle` | What Happens When You Type google.com? (64ms Journey) | `19.72s` (592f) | `out/NemiExplains_Google_20260818.mp4` |
| **#3** | `NemiExplainsTwoSum` | Two Sum: The $O(N^2)$ Trap vs The 1-Pass Hash Map (LeetCode #1) | `24.47s` (734f) | `out/NemiExplains_TwoSum_20260818.mp4` |
| **#4** | `NemiExplainsChatGPT` | How ChatGPT Actually Predicts Words: Embeddings & Attention | `26.68s` (801f) | `out/NemiExplains_ChatGPT_20260820.mp4` |
