# Monster Trio Edit Blueprint (`monster_trio`)

Reference Video: `src/edits/monster_trio/references/monster_trio.mp4`

## 📊 Reference Video Technical Specification

| Property | Value |
| :--- | :--- |
| **Resolution** | 1080x1080 (Square 1:1) |
| **Frame Rate** | 60.0 fps |
| **Duration** | 8.824s (525 frames) |
| **Audio BPM** | ~85.24 BPM (High-Tempo Phonk Edit) |
| **Pacing Style** | Rapid Cut Montage + Zoom Punches + Camera Shake Impacts |

---

## 🎬 Editing Structure (4 Phases)

```text
Phase 1: Intro Hook & Text Entrance    (F000 - F044 | 0.00s - 0.73s)
Phase 2: Character Trio Spotlight      (F044 - F225 | 0.73s - 3.75s)
Phase 3: Impact Shake & Climax Title   (F225 - F335 | 3.75s - 5.58s)
Phase 4: Multi-Panel Rapid Cut Finale  (F335 - F525 | 5.58s - 8.82s)
```

---

## 🎨 Phase Breakdown & Remotion Component Rules

### Phase 1 — Intro Hook & Text Entrance (F000 - F044)
- **Visuals**: Intro Character Panel with dark radial aura, zoom punch `[scale: 1.0 -> 1.11 -> 1.0]`, camera shake `[intensity: 0.92]`.
- **Text**: Animated text pop `"KAGE"` at frame 15 with spring scale bounce.
- **Audio**: Intro phonk beat hit at frame 0 and strong beat hit at frame 14.

### Phase 2 — Character Trio Spotlight (F044 - F225)
- **Character 1 (Luffy)**: F044 - F089 (~0.75s). Hard cut at F44, black flash burst, bright red aura (`#ef4444`), text pop `"LUFFY"`.
- **Character 2 (Zoro)**: F089 - F139 (~0.83s). Hard cut at F89, green particle burst (`#10b981`), chromatic glitch offset, text pop `"ZORO"`.
- **Character 3 (Sanji)**: F139 - F189 (~0.83s). Hard cut at F139, electric blue particle aura (`#3b82f6`), text pop `"SANJI"`.
- **Character 2 Secondary Pose (Zoro)**: F189 - F225 (~0.60s). Action pose cut, green particle aura.

### Phase 3 — Impact Shake & Climax Title (F225 - F335)
- **Visuals**: Climax shockwave camera shake `[intensity: 0.87]`, golden radial aura, ambient particles.
- **Text**: `"MONSTER TRIO 👑"` text pop at frame 270 with spring scale entrance and gold glow (`#fbbf24`).

### Phase 4 — Multi-Panel Rapid Cut Finale (F335 - F525)
- **Visuals**: Rapid 15-frame cut sequence (7 consecutive image panels changing every 15 frames: F335, F350, F365, F380, F395, F410, F425, F444), white flash on each cut.
- **Victory Stance**: Frame 444 to 525 (final victory pose, gold crown aura, black flash out at F520-F525).

---

## 🛠 Reusable Remotion Template Architecture

To adapt this blueprint for any Brawl Stars Trio (e.g. Mortis, Edgar, Crow or Leon, Kenji, Kit):
1. **Replace Character Art**: Use 3 brawler main panels + secondary poses + 7 rapid climax panels.
2. **Set Accent Colors**: Apply each brawler's unique hex color (`accentColor`).
3. **Keep Exact Frame Timings**: Reuse analyzed frame markers (`F44`, `F89`, `F139`, `F189`, `F225`, `F270`, `F335`, `F444`).
