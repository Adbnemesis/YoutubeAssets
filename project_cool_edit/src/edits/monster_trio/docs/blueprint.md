# Monster Trio Edit Blueprint (`monster_trio`)

Reference Video: `src/edits/monster_trio/references/monster_trio.mp4`

## 📊 Reference Video Technical Specification

| Property | Value |
| :--- | :--- |
| **Resolution** | 1080x1080 (Square 1:1) |
| **Frame Rate** | 60.0 fps |
| **Total Frames** | 525 frames (8.824s) |
| **Total Scene Transitions** | 19 distinct scene boundaries (scenes.json) |
| **Audio BPM** | ~85.24 BPM (High-Tempo Phonk Edit) |
| **Pacing Style** | 3-Part Character Sequence (Dark Strobe -> Spotlight -> Action Stance) + Rapid Climax Finale |

---

## 🎬 19-Scene Structure Breakdown (extracted by `project_video_analyze`)

```text
Scene 1:  F000 - F043 (44f) -> Intro Logo Hook ("KAGE")
Scene 2:  F044 - F059 (16f) -> Brawler 1 Dark Strobe 1a (Purple `#a855f7`)
Scene 3:  F060 - F075 (16f) -> Brawler 1 Dark Strobe 1b
Scene 4:  F076 - F138 (63f) -> Brawler 1 Main Card Spotlight ("MORTIS")
Scene 5:  F139 - F170 (32f) -> Brawler 1 Secondary Action Stance
Scene 6:  F171 - F186 (16f) -> Brawler 2 Dark Strobe 2a (Red `#ef4444`)
Scene 7:  F187 - F203 (17f) -> Brawler 2 Dark Strobe 2b
Scene 8:  F204 - F264 (61f) -> Brawler 2 Main Card Spotlight ("EDGAR")
Scene 9:  F265 - F298 (34f) -> Brawler 2 Secondary Action Stance
Scene 10: F299 - F314 (16f) -> Brawler 3 Dark Strobe 3a (Blue `#3b82f6`)
Scene 11: F315 - F331 (17f) -> Brawler 3 Dark Strobe 3b
Scene 12: F332 - F394 (63f) -> Brawler 3 Main Card Spotlight ("CROW")
Scene 13: F395 - F411 (17f) -> Brawler 3 Action Stance Variant 1
Scene 14: F412 - F427 (16f) -> Brawler 3 Action Stance Variant 2
Scene 15: F428 - F443 (16f) -> Climax Transition
Scene 16: F444 - F459 (16f) -> Climax Rapid Cut 1
Scene 17: F460 - F474 (15f) -> Climax Rapid Cut 2
Scene 18: F475 - F490 (16f) -> Climax Rapid Cut 3
Scene 19: F491 - F524 (34f) -> Final Victory Stance & Flash Out
```

---

## 🎨 Remotion Component Rules

1. **3-Part Brawler Rhythmic Sequence**: Each of the 3 brawlers MUST follow the sequence:
   - **Dark Radial Strobe**: ~32 frames (`F44-F75`, `F171-F203`, `F299-F331`) with background glow in brawler's accent color.
   - **Main Card Spotlight**: ~63 frames (`F76-F138`, `F204-F264`, `F332-F394`) with brawler name text pop.
   - **Secondary Action Stance**: ~32 frames (`F139-F170`, `F265-F298`, `F412-F443`) with the brawler's **animated GIF** playing at original speed.

2. **Rapid Climax Finale**: Frames `F444 -> F524` must cut rapidly every 15-16 frames across 4 panels. Each panel slides in with a **reduced travel (~30%) spring slide** and **carries its own brawler background** (Mortis → shop art, Edgar → graffiti, Crow → windstock; victory panel → anime art) so the background slides along with the character. No title text is rendered.

---

## 🎨 Visual Treatment (current implementation)

1. **Full-bleed backgrounds**: Every character scene renders a Brawl Stars background artwork
   (`assets/brawl_backgrounds/`) behind the brawler via `PhonkBackdrop` — full-frame `cover`,
   brightness-boosted, accent-tinted, with a slow ken-burns drift and edge vignette so the
   character pops.
   - Mortis → `BrawlStars_OdditiesShop_BG_01.png` (purple shop, boost 1.5)
   - Edgar → `background_graffiti.png` (urban street, boost 1.1)
   - Crow → `background_windstock_1.png` (wind/blue, boost 1.35)
   - Climax → `background_anime.png` (bright, gold-tinted)
2. **Big characters**: Brawler art is sized by **height** (`height: 82-90%`) so every panel
   (landscape or square) fills the frame consistently — characters render at ~75-85% of frame
   height (5-10% smaller than the previous pass per feedback).
3. **Reference-matched transitions** (`PhonkTransition` variants):
   - `blackFlash` → text-card cuts (F44/F171/F299) — card opens on pure black
   - `exposureSpike` → action-pose cuts (F76/F204/F332/F395) — 1-frame brightness boost
   - `chroma` → intro shake cuts — RGB split + motion blur
   - Climax panels → golden sunburst + white flash strobe on each slide
4. **Text cards stay as-is**: pure-black background, rapid font cycling, accent glow — unchanged.
5. **Entrance motion** (matches the reference):
   - First brawler (`entrance: "rise"`): first image slams up from the bottom of the frame over
     ~13 frames with a violent multi-axis camera shake (amplitude ~32px + rotation), growing from
     smaller to full screen as it settles.
   - Second/third brawlers (`entrance: "slideLeft"` / `"slideRight"`): their intro Sequence starts
     **14 frames before the previous character's action pose ends** (Edgar F125, Crow F253) and is
     given an explicit `zIndex` so the new card paints above the previous card. The new character
     **+ background grows from the bottom-center over the previous character + background** — the
     previous character stays visible around it while the new card slowly fills the screen
     (growth eased over **~34 frames** so the overlap transition is clearly visible), then a
     **damped vertical shake** (~20px, slower frequency + longer decay, matching the reference's
     slam-down/rebound dy oscillation) rocks the card into place. No horizontal slide.
6. **Action-pose life motion**: the "second image" of each brawler is the brawler's **animated GIF**
   (`assets/brawler_gif_frames/<name>/`, extracted from `assets/brawler_gifs/<name>_win.gif`, 33.3fps,
   transparent PNGs) played **at its original speed** — frame-synced via `GifFrames`, never sped up,
   looped, or waiting for completion; the clip simply covers the segment. It opens with a soft
   **fade-in** (0.5 → 1), then slowly **drifts sideways** (~54px, direction alternating per brawler)
   with a gentle low-frequency float (~5px) and a slow zoom-in (`1.0 → 1.09` over the segment).
7. **No watermark or title text** is rendered anywhere in the edit.

