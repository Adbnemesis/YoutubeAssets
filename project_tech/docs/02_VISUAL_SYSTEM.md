# 🎨 NEMI EXPLAINS — VISUAL DESIGN SYSTEM & 4-EDGE SAFE ZONE TOKENS

> Sources: OpenMontage `skills/creative/typography.md`, `skills/creative/short-form.md`, `skills/creative/data-visualization.md`.

---

## 1. Color Palette Tokens

### Canvas & Backgrounds
* **Warm Designer Cream (Light Mode / Hook):** `#FAF8F5`
* **Deep Studio Dark (Technical Stage / Dark Mode):** `#070B12` / `#0F172A`
* **Card Surface (Light):** `#FFFFFF` (Border: `#E2E8F0`)
* **Card Surface (Dark):** `#0F172A` (Border: `#1E293B`)
* **Frosted Glass Pill:** `rgba(10, 15, 30, 0.88)` (Blur: `20px`, Border: `2px solid rgba(168, 85, 247, 0.55)`)

### Brand & Semantic Accents
* **Signature Electric Yellow:** `#FFD166` — Key emphasis, brand badge, speech bubble, active caption highlight.
* **Logic Cyan:** `#06B6D4` — Secondary highlight, pointers, memory addresses.
* **Neural Purple:** `#A855F7` — Transformer weights, architecture badges, attention laser beams.
* **Success Emerald:** `#10B981` — Winning tokens, optimal $O(1)$ solutions, verified states.
* **Alert Coral / Red:** `#EF4444` / `#F43F5E` — $O(N^2)$ traps, misconceptions, wrong paths.

---

## 2. Ultra-Scale Typography Tokens (+20% Scale Standard)

Mobile screens require large, bold typography for instant legibility while scrolling:

| UI Element | Font Size | Weight | Styling & Tracking |
|---|---|---|---|
| **Main Topic Headline** | **`56px - 60px`** | `fontWeight: 900` | `letterSpacing: -1.5px`, dual-tone accent |
| **HUD Category Tag** | **`26px`** | `fontWeight: 900` | Uppercase, glowing indicator dot (`18px`) |
| **HUD Stage Badge** | **`20px`** | `fontWeight: 900` | `padding: "12px 24px"`, Mono |
| **Card Header Titles** | **`26px - 28px`** | `fontWeight: 900` | `letterSpacing: 1.5px`, uppercase |
| **Primary Numbers & Array Values** | **`28px - 34px`** | `fontWeight: 900` | Mono, glowing badge containers |
| **Body Explanations** | **`19px - 21px`** | `fontWeight: 700 - 800` | Crisp `#94A3B8` / `#64748B` |
| **Dynamic Karaoke Captions** | **`32px`** | `fontWeight: 900` | Glowing `#FFD166` / `#06B6D4` active word |
| **Nemi Mascot Scale** | **`1.65`** | — | Bottom-center dock with organic breathing |
| **Nemi Speech Bubble** | **`32px`** | `fontWeight: 900` | `padding: "16px 36px"`, Brand Yellow |

---

## 3. Mobile 9:16 Safe-Zone Coordinate Architecture (1080x1920)

```
┌────────────────────────────────────────────────────────┐  Y = 0px
│ [TOP INSET: 85px] Top Phone Status Bar & Header Safe   │
│   • HUD Category & Stage Pill (Top: 85px)              │
│   • Main Topic Headline (Top: 165px)                   │
├────────────────────────────────────────────────────────┤  Y = 360px
│ [MAIN CARD STAGE: Top 360px - 880px]                   │
│   • Remotion Interactive Cards OR                      │
│   • Manim Rendered Cutaway Video (1080x540)            │
├────────────────────────────────────────────────────────┤  Y = 920px
│ [MID-SCREEN DYNAMIC BADGES: Top 920px - 1100px]        │
│   • Interactive flow arrows & state pills              │
├────────────────────────────────────────────────────────┤  Y = 1140px
│ [DYNAMIC KARAOKE CAPTIONS: Top 1140px - 1280px]        │
│   • Dedicated non-overlapping subtitle pill            │
├────────────────────────────────────────────────────────┤  Y = 1320px
│ [SPEECH BUBBLE ZONE: Bottom: 440px]                    │
│   • Yellow punchline bubble on top of Nemi             │
├────────────────────────────────────────────────────────┤  Y = 1440px
│ [MASCOT DOCK: Bottom: 70px]                            │
│   • Nemi Mascot Head (Scale: 1.65)                     │
│ [BOTTOM INSET: 70px] Instagram Caption & Marquee Safe  │
└────────────────────────────────────────────────────────┘  Y = 1920px
```

---

## 4. Deterministic Motion & Physics

* **Snappy Spring Pop:** `{ damping: 14, stiffness: 120 }` — Card appearances and modal pop-ups.
* **Word Karaoke Scale:** `interpolate(frame - w.start_frame, [0, 3, 7], [1.0, 1.18, 1.08])` — Active word punch.
* **Stage Transitions:** Cross-fade using `StageWrapper` parallax sliding (`translateY: 25px -> 0px -> -25px`, `opacity: 0 -> 1 -> 0`).
* **Continuous Camera Breathing:** Subtle zoom ramp (`1.0x -> 1.035x -> 1.0x`) across the duration of the reel.
