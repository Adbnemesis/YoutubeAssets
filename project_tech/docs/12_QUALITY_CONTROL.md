# 🔍 NEMI EXPLAINS — QUALITY CONTROL & 3-4s RETENTION AUDIT CHECKLIST

Before any reel is approved for render, upload, or broadcast, it must achieve **100% compliance** across the **5 Quality Control Pillars**:

---

## 🛑 Pillar 1: The 3-4s Retention Audit (Eliminating Swipes)

- [ ] **Frame 0 Auditory Impact:** Audio (Voice + SFX impact) starts immediately at Frame 0 (0ms dead air).
- [ ] **Frame 0 Visual Interest:** No blank screens or static title cards. Camera zoom (`1.0x -> 1.05x`) is active.
- [ ] **Misconception-First Copy:** The hook establishes a cognitive contradiction within 1.5 seconds.
- [ ] **First Visual Cut/Change by Second 2.0:** A visual state change occurs within the first 60 frames.
- [ ] **Curiosity Gap Locked by Second 3.5:** The viewer knows the core question they are investing time to discover.

---

## 🛡️ Pillar 2: 4-Edge Safe-Zone Validation

- [ ] **Top Safe Inset (`85px - 90px`):** Top HUD and category pills clear all phone status bars and dynamic islands.
- [ ] **Headline Safe Inset (`165px`):** Topic title has at least 15px clearance below the top HUD.
- [ ] **Horizontal Gutters (`65px - 70px`):** No text, buttons, or critical visual cards touch the left/right 65px margins.
- [ ] **Captions Band (`top: 1140px`):** Word-by-word karaoke pill sits cleanly in the empty middle-lower band.
- [ ] **Mascot & Bubble Zone (`bottom: 70px` / `bottom: 440px`):** Speech bubble is positioned strictly above Nemi's head without overlapping the captions above.

---

## 🔊 Pillar 3: Audio & Sound Design Audit

- [ ] **Audible Background Music:** BGM volume is set to `0.50 – 0.55` (upbeat 110–130 BPM).
- [ ] **Musical Sidechain Ducking:** FFmpeg filter configured with `threshold=0.08:ratio=2.5:attack=35:release=160` (BGM remains clearly audible throughout).
- [ ] **Integrated SFX Volume:** All sound effects (whoosh, pop, notification, chime, click) set to `0.95 – 1.0`.
- [ ] **Voice Track Loudness:** Normalized to `-16.0 LUFS` ($\pm 0.5$ LUFS).
- [ ] **Master Audio Loudness:** Calibrated to `-15.0 LUFS` (`TP = -1.5 dBTP`).
- [ ] **Zero Voice Overlap:** Minimum 120ms gap between narrator and mascot lines.

---

## 💬 Pillar 4: Kinetic Karaoke Captions Audit

- [ ] **Word Alignment:** Whisper millisecond timestamps correctly extracted and stored in `_cues.json`.
- [ ] **Active Word Highlighting:** Active word scales smoothly (`1.18x`) and lights up in Gold (`#FFD166`) / Cyan (`#06B6D4`).
- [ ] **Text Size & Readability:** Caption font size is at least `32px` bold with dark frosted container.
- [ ] **Mascot Speech Coordination:** Caption pill automatically hides when Nemi's yellow speech bubble is active.

---

## 🧮 Pillar 5: Technical Engine & Composition Audit

- [ ] **Pacing & Duration:** Total reel duration targets **19.0s – 22.0s** (hard ceiling **24.0s** @ 30fps). Compress setup, never the payoff.
- [ ] **Visual Velocity:** Visual state changes occur every 1.5 – 2.5 seconds (at least 8–10 distinct visual states).
- [ ] **Manim Cutaways (If Applicable):** 3–5s Manim `.mp4` rendered at 1080x540 / 30fps with dark background (`#070B12`).
- [ ] **Infinite Replay Loop:** Outro sentence connects back logically to the opening hook.
