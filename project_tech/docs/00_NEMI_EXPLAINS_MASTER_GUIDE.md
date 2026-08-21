# 📘 NEMI EXPLAINS — MASTER PRODUCTION & HIGH-RETENTION SYSTEM GUIDE

This document serves as the official specification, aesthetic rulebook, viral psychology framework, and engineering architecture for all videos produced under the **`@nemi.explains`** brand.

---

## 🚀 1. The High-Retention Blueprint: Eliminating the 3-4s Drop-off

> **Algorithm Reality:** Short-form viewers on Instagram Reels, YouTube Shorts, and TikTok make the decision to swipe or stay within **1.7 seconds** (70%+ drop-off if hook fails). An average view duration of 3–4 seconds means the hook was too passive or visual velocity was too slow.

To achieve **75%+ 3-Second Retention** and **60%+ Full Completion**, every reel strictly executes the **OpenMontage Viral Short-Form Framework**:

```
[0.0s - 1.5s]  ⚡ FRAME-1 HOOK IMPACT
               - Visual: High-contrast pattern interrupt + immediate camera punch-in (1.0 -> 1.05x).
               - Audio: Sub-impact SFX + crisp voiceover starts at FRAME 0 (Zero dead air).
               - Psychological: Misconception-First / Contradiction Hook ("Stop thinking X does Y!").

[1.5s - 6.0s]  🔓 THE CURIOSITY GAP & INFORMATION TENSION
               - "Here's what everyone gets wrong..." Show the naive failure or mystery.
               - Visual velocity: 2 visual state changes within the first 4 seconds.

[6.0s - 18.0s] 🧠 PROGRESSIVE REVELATION (Visual Change every 1.5 - 2.5s)
               - Show, don't tell: Dynamic Manim math transforms / animated UI / live interactive state.
               - The "But-Therefore" momentum engine (no boring "and then" transitions).

[18.0s - 22.0s] 💡 THE "AHA!" MOMENT & MASCOT EMOTIONAL REACTION
               - Nemi Mascot delivers the shocking realization ("96 layers of math?! 🤯").

[22.0s - 25.5s] 🏆 PAYOFF & SEAMLESS REPLAY LOOP
               - Nemi delivers the smug technical punchline.
               - Final sentence connects back to the opening sentence for an infinite replay loop!
```

---

## 🛡️ 2. Instagram / Shorts / TikTok 4-Edge Safe Zone Architecture

Vertical 9:16 mobile video viewports (1080x1920) have native UI overlays (notch, dynamic island, status bar, bottom caption marquee, and right-hand engagement rails).

All elements must strictly respect the **4-Edge Safe Margins**:

| Safe Zone Boundary | Padding / Offset | Protected Content |
|---|---|---|
| **Top Safe Inset** | **`85px - 90px`** | Clears phone status bar, camera hole-punch, and Instagram top header |
| **Topic Title Inset** | **`165px - 170px`** | Guaranteed clean breathing room under HUD |
| **Horizontal Gutters (Left & Right)** | **`65px - 70px`** | Shields cards & labels from Instagram's right-side interaction rail and curved screen corners |
| **Main Card Top Anchor** | **`380px`** (Height: `520px - 540px`) | Perfect vertical balance between header and mid-screen (Embeds Remotion UI or Manim cutaways) |
| **Mid-Screen Dynamic Visuals** | **`top: 920px - 1100px`** | Interactive badges, relationship arrows, and state pills |
| **Viral Karaoke Captions Zone** | **`top: 1140px - 1280px`** | Dedicated clear band above Nemi with zero asset overlap |
| **Nemi Mascot Dock** | **`bottom: 70px`** | Dedicated bottom-center dock with organic breathing |
| **Nemi Speech Bubble** | **`bottom: 440px`** | Floating above Nemi's head, spring-animated with arrow pointer |

---

## 💬 3. Dynamic Viral Karaoke Captions System

Captions are mandatory (**80%+ of users scroll muted initially**):

1. **Dedicated Safe Zone (`top: 1140px`):** Positioned in the clear visual band between mid-screen badges and Nemi's head. Zero overlap with cards or speech bubbles.
2. **Word-by-Word Highlight Animation:** Spoken words punch smoothly with `1.18x` spring physics. Active words light up in **Vibrant Gold (`#FFD166`)** or **Electric Cyan (`#06B6D4`)** with glowing drop shadows.
3. **Frosted Glass Container:** `rgba(10, 15, 30, 0.88)` with `blur(20px)`, subtle purple border, and soft drop shadow.
4. **Smart Mascot Coordination:** Automatically hides (`!nemiSpeech`) when Nemi's yellow speech bubble is active to eliminate duplicate text clutter.
5. **Whisper Precision:** Generated with millisecond-accuracy using `faster_whisper` on CPU (`int8`), grouped into 3–5 word punchy chunks.

---

## 🔊 4. Multi-Layered Sound Design & Audio Engineering

Audio drives over **50% of emotional retention**. We follow the OpenMontage Sound Design Skill:

1. **Dual-Voice Character Setup:**
   - **Narrator:** Authoritative tech documentary voice via `Chatterbox Neural TTS` (`exaggeration=0.55 - 0.65`). Paced at **180-200 WPM** (energetic, zero dead air).
   - **Nemi Mascot:** Expressive mascot via `Edge-TTS en-US-AnaNeural` (`pitch=+12Hz`, `rate=+20%`). Strictly delivers reactions and punchlines.
2. **Layered Sound Effects (SFX):**
   - **Transition Whooshes (`1.0` vol):** Starts 15ms before visual cut.
   - **Pops & Plucks (`1.0` vol):** Triggers on text/badge reveals.
   - **Notification/Chime (`1.0` vol):** Triggers on "Aha!" insights.
   - **Typing SFX (`0.95` vol):** Frame-synced to prompt inputs.
3. **Audible Background Music (BGM) with Musical Ducking:**
   - Base volume: `0.50 - 0.55` (upbeat 110-130 BPM).
   - Sidechain Compression: `threshold=0.08:ratio=2.5:attack=35ms:release=160ms`.
   - Target Loudness: `-15.0 LUFS` (`TP=-1.5 dBTP`).

---

## 🧮 5. Hybrid Manim + Remotion Visual Architecture

For deep math, vector spaces, and algorithm proofs, we deploy **Manim (Python)** inside **Remotion**:

```
┌────────────────────────────────────────────────────────┐
│                   MANIM (Python Engine)                │
│  - Mathematical proofs & LaTeX morphs                  │
│  - Vector embeddings & 3D Loss landscapes              │
│  - Graph & Tree Traversals (Dijkstra, BFS, AVL trees)   │
│  - Matrix multiplications (Q x K^T Attention)          │
└──────────────────────────┬─────────────────────────────┘
                           │ Renders 3-5s MP4 Card Asset
                           ▼
┌────────────────────────────────────────────────────────┐
│                 REMOTION (Master Stage)                │
│  - 9:16 Vertical Safe-Zone Layout (1080x1920)          │
│  - Nemi Mascot character animations & speech bubbles   │
│  - Word-by-word viral karaoke captions                │
│  - Top Category HUD & animated stage cards             │
│  - Synchronized SFX & Master Audio ducking             │
└────────────────────────────────────────────────────────┘
```

| Visual Requirement | Recommended Engine | Rationale |
|---|---|---|
| **App UI, Chat interfaces, Web mockups** | **Remotion** | Native CSS, flexbox, pixel-perfect modern web cards |
| **Nemi Mascot, Reactions, Speech Bubbles** | **Remotion** | SVG spring physics, eye-tracking, dialogue sync |
| **Viral Karaoke Captions & Safe-Zone HUDs** | **Remotion** | Dynamic text layout, viewport constraints, backdrop blurs |
| **Vector Space Projections & Embeddings** | **Manim** | High-dimensional geometric transforms, cosine distances |
| **Self-Attention Heatmaps & Dot Products** | **Manim** | Smooth matrix multiplication animations ($QK^T / \sqrt{d}$) |
| **Graph & Tree Algorithms (Trees, Pointers)** | **Manim** | Graph node traversals, pointer shifting, edge weighting |
| **LaTeX Equation Transformations** | **Manim** | `TransformMatchingTex` morphing symbols dynamically |
| **Big-O Growth Curves & Asymptotics** | **Manim** | Mathematical plotting ($O(1)$ vs $O(N)$ vs $O(N^2)$) |

---

## 📐 6. Visual Hierarchy & High-Visibility Typography Rules (Ultra-Scale Standard)

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

## 🎬 7. Production Catalog

| Reel # | Composition ID | Topic | Duration | Visual Engine | BGM Track | Master Video |
|---|---|---|---|---|---|---|
| **#1** | `NemiExplainsCaptcha` | How CAPTCHA Knows You're Human (Micro-Tremors) | `22.79s` (683f) | Remotion UI | *Synthwave Goose - Blade Runner 2049* | `out/NemiExplains_Captcha_20260817.mp4` |
| **#2** | `NemiExplainsGoogle` | What Happens When You Type google.com? (64ms Journey) | `19.72s` (592f) | Remotion UI | *Synthwave Goose - Blade Runner 2049* | `out/NemiExplains_Google_20260818.mp4` |
| **#3** | `NemiExplainsTwoSum` | Two Sum: $O(N^2)$ Trap vs 1-Pass Hash Map (LeetCode #1) | `24.47s` (734f) | Remotion DSA | *Synthwave Goose - Blade Runner 2049* | `out/NemiExplains_TwoSum_20260818.mp4` |
| **#4** | `NemiExplainsChatGPT` | How ChatGPT ACTUALLY Works: The Transformer Network | `25.61s` (768f) | Remotion AI + Captions | *Death of a Bluebird - Rorschach Roy 4.mp3* | `out/NemiExplains_ChatGPT_20260820.mp4` |
| **#5+** | *(Upcoming)* | Binary Search Trees / Backpropagation / Hash Collisions | `~24-25s` | **Hybrid Manim + Remotion** | *TBD Curated Track* | *In Development* |
