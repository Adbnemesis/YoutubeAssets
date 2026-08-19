# 📘 NEMI EXPLAINS — MASTER PRODUCTION & DESIGN SYSTEM GUIDE

This document serves as the official specification, aesthetic rulebook, and engineering architecture for all videos produced under the **`@nemi.explains`** brand.

---

## 📐 1. Visual Hierarchy & High-Visibility Typography Rules (Ultra-Scale Standard)

On 1080x1920 (9:16 vertical) mobile viewports, small elements become unreadable while scrolling fast. All components must strictly adhere to the following **High-Visibility Token Standards**:

| Element | Initial Base | +10% Scale | **Ultra Standard (+20% Total)** | Weight / Styling |
|---|---|---|---|---|
| **Main Topic Headline** | `44px - 50px` | `56px` | **`62px`** | `fontWeight: 900`, `letterSpacing: -1.5px` |
| **HUD Category Tag** | `18px - 22px` | `25px` | **`28px`** | `fontWeight: 900`, uppercase, glowing cyan indicator (`20px`) |
| **HUD Stage Badge** | `14px - 17px` | `19px` | **`22px`** | `fontWeight: 900`, `padding: "14px 26px"`, Mono |
| **Primary Numbers & Array Values** | `28px - 34px` | `40px` | **`46px`** | `fontWeight: 900`, Mono, index tags `18px` |
| **Complement / Key Formula** | `24px - 32px` | `36px / 28px` | **`40px / 32px`** | `fontWeight: 900`, Mono, high contrast glowing border |
| **Card Headers & Titles** | `17px - 22px` | `25px` | **`28px`** | `fontWeight: 900`, letterSpacing `1.5px` |
| **Body Explanations & Captions** | `13px - 16px` | `19px - 20px` | **`22px - 24px`** | `fontWeight: 700 - 800` |
| **Status Pills & Stage Tags** | `14px - 17px` | `19px` | **`22px`** | `padding: "14px 32px"`, Mono |
| **Mid-Screen Floating Emojis** | `28px - 38px` | `44px` | **`50px`** | Clean floating glassmorphic pills (zero black boxes) |
| **Connecting Arrows** | `22px - 28px` | `32px` | **`36px`** | `fontWeight: 900` |
| **Nemi Mascot Scale** | `1.30 - 1.42` | `1.56` | **`1.72`** | Dedicated bottom-center dock with organic breathing |
| **Nemi Speech Bubble** | `22px - 26px` | `30px` | **`34px`** | `padding: "18px 42px"`, `fontWeight: 900`, spring pop |

---

## 🎨 2. Design Aesthetics & Layout Blueprint

1. **Airy, Breathable Negative Space (Zero Heavy Solid Black Rectangles):**
   - Never use massive solid black cards covering the middle canvas.
   - Use clean, transparent glassmorphic pills with glowing borders (`border: "2px solid rgba(...)"`).
2. **Deterministic Frame-by-Frame Motion:**
   - Never use CSS transitions for positions or opacity.
   - Always use Remotion `interpolate()` or `spring()` with `extrapolateLeft: "clamp"`.
3. **Continuous World Stage Manager:**
   - Multi-beat scenes cross-fade smoothly using `StageWrapper` parallax sliding (`translateY: 30px -> 0px -> -30px`, `opacity: 0 -> 1 -> 0`).

---

## 🎙️ 3. Audio & Voice Architecture

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

## 🎬 4. Production Catalog

| Reel # | Composition ID | Topic | Duration | Master Video |
|---|---|---|---|---|
| **#1** | `NemiExplainsCaptcha` | How CAPTCHA Knows You're Human (Micro-Tremors) | `22.79s` (683f) | `out/NemiExplains_14_Master.mp4` |
| **#2** | `NemiExplainsGoogle` | What Happens When You Type google.com? (64ms Journey) | `19.72s` (592f) | `out/NemiExplains_Google_20260818.mp4` |
| **#3** | `NemiExplainsTwoSum` | Two Sum: The $O(N^2)$ Trap vs The 1-Pass Hash Map (LeetCode #1) | `24.47s` (734f) | `out/NemiExplains_TwoSum_20260818.mp4` |
