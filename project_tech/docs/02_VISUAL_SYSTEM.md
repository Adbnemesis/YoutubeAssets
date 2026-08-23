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

---

## 5. VISUAL HOOK SYSTEM v3 (added 2026-08-23 — MANDATORY from Ep.12)

> Field context: all six published reels lose ~75–85% of viewers inside 3–4s regardless of topic family. The visual opening — not just the words (`06_HOOK_SYSTEM.md` §7) — is the under-engineered half. Stacks on `07_STORYTELLING_SYSTEM.md` §6.

### 1. Full-Bleed Frame-0 (no cards at open)
The anomaly fills the ENTIRE canvas edge-to-edge at Frame 0 — no floating card on cream, no HUD, no margins, no safe-zone chrome. Cards/HUD may enter only AFTER the hook (~frame 60). First frame must read like a movie poster mid-explosion, not a slide.

### 2. Start at MAX Velocity
The animation opens at its PEAK — trash lid already mid-flight, waves already colliding at full amplitude. Never ease-in from static at f0; the story rewinds and rebuilds afterwards. Ease-in openings are pre-swiped.

### 3. Opening Cut Density — ≥4 visual events in the first 4 seconds

| Time | Required event |
|---|---|
| 0–0.3s | Text slam lands (see #5) |
| ~0.8s | First state change (color flip / tag reveal / element pulse) |
| ~2.5s | ⚡ HARD PATTERN-INTERRUPT CUT (composition flips completely + zoom punch + SFX) |
| ~4.0s | New element reveal (answers the previous line, opens the next) |

Top performers cut every 1–1.5s during the opening. Stage compositions running 2–4s unchanged are banned from the first 5 seconds.

### 4. Muted-Legibility Text Slam
Large share of feed viewers watch muted first.
* Overlay lands by frame 8 (~0.3s), full-width, max 2 lines, ≥`90px` fontWeight 900, high-contrast dual-tone.
* **Thumbnail test:** screenshot Frame 0 at ~120px width — if the text isn't readable, redesign.

### 5. Reward Flood at Payoff
At the payoff cue: full-screen color wash (Success Emerald radial burst) + numeric zero-out + glow spike. The brain's reward signal made visible — saves/shares happen AT this frame, so it must feel like an event.

### 6. Loop Seam (visual contract)
Final composition visually matches Frame 0 (same layout, same subject state) so the loop is invisible and rewatch-driven APV >100% becomes possible. Cross-ref `07_STORYTELLING_SYSTEM.md` §6.6.

### 7. Nemi Face-at-f0 Experiment (test once)
Faces are the strongest stop-scroll trigger. One variant test: Nemi's shocked face large in-frame at f0 reacting to the anomaly, shrinking to the dock after second 2. Compare retention vs standard dock-only opening before adopting.

### Worked Storyboard Example (Ep.12 Trash Deletion — hook B)

| Time | Screen |
|---|---|
| f0 | FULL-BLEED: bin lid mid-flight, files bursting out but ghost-reforming back into the bin; text slam lands by f8 |
| 0.8s | Ghost-files pulse red "STILL HERE" tags |
| 2.5s | ⚡ HARD CUT: camera dives INTO the bin → dark disk-hex world, bytes glowing |
| 3–12s | Chained mechanism beats: one new element per line (free-space marker → recovery scan → single-byte zoom) |
| 55–60% | PAYOFF FLOOD: erase beam wipes bytes to a green ZERO screen |
| final | Return to f0 composition (loop seam) |

---

## 6. TOPIC-SPECIFIC DYNAMIC VECTOR VISUALS & ZERO-GENERIC-BOX MANDATE (added 2026-08-23)

> **Core Rule:** Generic rounded cards containing static text bullets or basic colored boxes are BANNED from being the primary visual. Every reel must feature custom, topic-specific SVG mathematical & physical animation engines (3Blue1Brown / ByteByteGo / Reducible quality standard).

### Required Visual Engines by Topic Domain:

1. **Algorithms, Sorting & Data Structures:**
   * **Real Coordinate Complexity Graphs:** Dynamic Cartesian axes with live-drawing $O(N)$ vs $O(\log N)$ or $O(N^2)$ curves (`strokeDashoffset`), glowing data points, and tick marks.
   * **Active Binary Decision Trees:** Multi-tier branching nodes with curved Bezier conduit paths, active signal propagation pulses, and slashed elimination states.
   * **Density Waveforms & Particle Slicers:** 50–100 animated vertical spectral bars with physical laser guillotine slicing and falling polygon particle disintegration.
   * **Exponential Telescope Funnels:** 3D-feeling logarithmic tiers compressing numbers from 1 Billion to 1 in real time.

2. **Audio, Signal Processing & Acoustics:**
   * **Real-Time Waterfall Spectrograms:** Dynamic frequency-time matrix undulating with real audio amplitude waves (`Math.sin`).
   * **Constellation Star Maps:** Floating peaks and audio fingerprint hash tables connected by laser vectors.
   * **Wave Interference Collisions:** Inverted phase waves physically canceling noise down to a flatline zero.

3. **Networking, Security & Error Correction:**
   * **Reed-Solomon Matrix Repair Rays:** Visual damaged module matrices reconstructed in real time with laser repair conduits.
   * **Dynamic Packet Routing Highways:** Holographic glowing packets traveling through routers, firewalls, and cryptographic handshakes.

4. **AI, Embeddings & Large Language Models:**
   * **Multi-Dimensional Vector Space:** 3D-feeling galaxy of clustered floating embedding points with cosine similarity laser vectors.
   * **Attention Weight Heatmaps:** Dynamic multi-head attention matrix grids glowing and routing token probabilities.

