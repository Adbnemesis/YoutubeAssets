# Exhaustive Frame-by-Frame & Timestamp Analysis: `best_character.mp4`

This document serves as the **complete, authoritative, frame-by-frame specification** for the `brawl_best_char` edit style reverse-engineered from `best_character.mp4`. 

With this exact specification, any future character edit (e.g. Brawl Stars, Anime, Gaming) can be created in a **single prompt** by providing a list of contender images and a winner brawler.

---

## 📽 Master Video Metadata & Audio Sync

- **Resolution**: `720 x 1280` (9:16 Vertical Short)
- **FPS**: `30.0`
- **Total Duration**: `12.566s` (377 Frames)
- **Estimated BPM**: `57.42` / Phonk Synced Onsets
- **Audio Track**: `best_character_audio.wav`

---

## ⏱ Complete Frame-by-Frame & Timestamp Breakdown

| Frame Range | Timestamp Range | Phase / Segment | Visual / FX Details | Audio / Beat Event | Text / Typography Overlay | Image Asset / Pose | Remotion Props Mapping |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `F000 → F012` | `0.000s → 0.400s` | Intro Hook Title | Rotating anime sunburst beams, blurred brawler collage backdrop, purple/pink radial aura | Track Start | `"THE BEST BRAWLER"` (White, purple glow, stroke 3.5px) | Brawler Collage Grid | `intro.headerText` |
| `F012 → F033` | `0.400s → 1.100s` | Intro Subtitle Pop | Anime sunburst continuous spin, ambient particle burst, spring scale bounce | Pre-Beat Build | `"WHO IS THE #1?"` (Yellow `#fbbf24`, gold glow stroke 2.5px) | Brawler Collage Grid | `intro.subText` |
| `F033 → F040` | `1.100s → 1.333s` | Intro Onset Impact | Camera impact micro-shake `[intensity: 0.8]`, background light pulse | **Beat Hit #1 (F33)** | `"THE BEST BRAWLER WHO IS THE #1?"` | Brawler Collage Grid | `intro` |
| `F040 → F064` | `1.333s → 2.133s` | Intro Transition | Slow zoom out `[scale: 1.05 → 1.00]`, speed lines background | Pre-Cut Transition | Full Intro Text | Brawler Collage Grid | `intro` |
| `F064 → F096` | `2.133s → 3.200s` | Contender 1: Mortis | White/RGB flash burst (F64-F66), purple particle overlay, chromatic glitch offset | **Cut #1 / Beat Hit (F64)** | `"MORTIS?"` (White, purple `#a855f7` glow, stroke 3.5px) | `mortis_panel_1.png` | `contenders[0]` |
| `F096 → F127` | `3.200s → 4.233s` | Contender 2: Edgar | White/RGB flash burst (F96-F98), red particle overlay, camera shake (F96-F104) | **Cut #2 / Beat Hit (F96)** | `"EDGAR?"` (White, red `#ef4444` glow, stroke 3.5px) | `edgar_panel_1.png` | `contenders[1]` |
| `F127 → F159` | `4.233s → 5.300s` | Contender 3: Crow | White/RGB flash burst (F127-F129), blue particle overlay, speed lines motion | **Cut #3 / Beat Hit (F127)** | `"CROW?"` (White, blue `#3b82f6` glow, stroke 3.5px) | `crow_panel_1.png` | `contenders[2]` |
| `F159 → F189` | `5.300s → 6.300s` | Contender 4: Kit | White/RGB flash burst (F159-F161), yellow particle overlay, floating hover motion | **Cut #4 / Beat Hit (F159)** | `"KIT?"` (White, yellow `#f59e0b` glow, stroke 3.5px) | `kenji_panel_4.png` | `contenders[3]` |
| `F189 → F222` | `6.300s → 7.400s` | Contender 5: Tara | White/RGB flash burst (F189-F191), pink particle overlay, speed lines motion | **Cut #5 / Beat Hit (F189)** | `"TARA?"` (White, pink `#ec4899` glow, stroke 3.5px) | `tara_panel_1.png` | `contenders[4]` |
| `F222 → F263` | `7.400s → 8.767s` | Contender 6: Leon (Image 1) | White/RGB flash burst (F222-F224), green particle overlay, floating hover motion | **Cut #6 / Beat Hit (F222)** | `"LEON?"` (White, green `#10b981` glow, stroke 3.5px) | `leon_panel_1.png` | `contenders[5].image` |
| `F263 → F313` | `8.767s → 10.433s` | Contender 6: Leon (Image 2) | Secondary action pose cut (F263), chromatic glitch shift (F263-F267), camera shake | **Cut #7 / Beat Hit (F263)** | `"LEON?"` (White, green `#10b981` glow, stroke 3.5px) | `leon_panel_4.png` | `contenders[5].secondaryImage` |
| `F313 → F322` | `10.433s → 10.733s` | Winner Climax: Image 1 | Climax Shockwave Shake `[intensity: 1.0]`, gold radial aura, gold particles | **Climax Beat Hit (F313)** | None | `kenji_panel_1.png` | `winner.winnerPanels[0]` |
| `F322 → F331` | `10.733s → 11.033s` | Winner Climax: Image 2 | Flash burst on cut, gold particle aura, high-contrast speed lines | **Cut / Beat (F322)** | None | `kenji_panel_4.png` | `winner.winnerPanels[1]` |
| `F331 → F340` | `11.033s → 11.333s` | Winner Climax: Image 3 & Text Pop | **Gold Text Pop at F330**, text spring scale, flash burst on cut | **Beat / Text Pop (F330)** | `"OFC IT'S KENJI 👑"` (Gold `#fbbf24`, gold glow, stroke 3.5px) | `kenji_panel_6.png` | `winner.winnerPanels[2]` |
| `F340 → F349` | `11.333s → 11.633s` | Winner Climax: Image 4 | Flash burst on cut, gold particle aura, continuous camera shake | **Cut / Beat (F340)** | `"OFC IT'S KENJI 👑"` | `kenji_panel_8.png` | `winner.winnerPanels[3]` |
| `F349 → F358` | `11.633s → 11.933s` | Winner Climax: Image 5 | Flash burst on cut, gold particle aura, high-contrast speed lines | **Cut / Beat (F349)** | `"OFC IT'S KENJI 👑"` | `kenji_panel_11.png` | `winner.winnerPanels[4]` |
| `F358 → F367` | `11.933s → 12.233s` | Winner Climax: Image 6 | Flash burst on cut, gold particle aura, continuous camera shake | **Cut / Beat (F358)** | `"OFC IT'S KENJI 👑"` | `kenji_panel_13.png` | `winner.winnerPanels[5]` |
| `F367 → F377` | `12.233s → 12.566s` | Winner Climax: Image 7 (Victory Pose) | Final victory stance, max gold crown aura glow, black flash out at F373 | **Final Climax Beat (F367/F374)** | `"OFC IT'S KENJI 👑"` | `kenji_panel_15.png` | `winner.winnerPanels[6]` |

---

## 🤖 Single-Prompt Reusability Blueprint

To generate a new edit in this exact style for any brawler or character set, simply specify the props JSON matching `BestCharEditProps`:

```typescript
export const customBestCharProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  intro: {
    headerText: "THE BEST BRAWLER",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
  },
  contenders: [
    { id: "mortis", name: "Mortis", questionText: "MORTIS?", image: staticFile("images/mortis/mortis_panel_1.png"), accentColor: "#a855f7", startFrame: 64, endFrame: 96 },
    { id: "edgar", name: "Edgar", questionText: "EDGAR?", image: staticFile("images/edgar/edgar_panel_1.png"), accentColor: "#ef4444", startFrame: 96, endFrame: 127 },
    { id: "crow", name: "Crow", questionText: "CROW?", image: staticFile("images/crow/crow_panel_1.png"), accentColor: "#3b82f6", startFrame: 127, endFrame: 159 },
    { id: "kit", name: "Kit", questionText: "KIT?", image: staticFile("images/kenji/kenji_panel_4.png"), accentColor: "#f59e0b", startFrame: 159, endFrame: 189 },
    { id: "tara", name: "Tara", questionText: "TARA?", image: staticFile("images/tara/tara_panel_1.png"), accentColor: "#ec4899", startFrame: 189, endFrame: 222 },
    { id: "leon", name: "Leon", questionText: "LEON?", image: staticFile("images/leon/leon_panel_1.png"), secondaryImage: staticFile("images/leon/leon_panel_4.png"), accentColor: "#10b981", startFrame: 222, endFrame: 313 },
  ],
  winner: {
    id: "kenji",
    name: "Kenji",
    announcementText: "OFC IT'S KENJI 👑",
    image: staticFile("images/kenji/kenji_panel_15.png"),
    winnerPanels: [
      staticFile("images/kenji/kenji_panel_1.png"),
      staticFile("images/kenji/kenji_panel_4.png"),
      staticFile("images/kenji/kenji_panel_6.png"),
      staticFile("images/kenji/kenji_panel_8.png"),
      staticFile("images/kenji/kenji_panel_11.png"),
      staticFile("images/kenji/kenji_panel_13.png"),
      staticFile("images/kenji/kenji_panel_15.png"),
    ],
    accentColor: "#f59e0b",
    startFrame: 313,
    endFrame: 377,
  },
};
```
