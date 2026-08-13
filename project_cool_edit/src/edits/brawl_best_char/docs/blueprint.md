# Technical Blueprint: Brawl Stars Best Character Edit (`brawl_best_char`)

## Overview

The `brawl_best_char` edit is a vertical 9:16 Short recreating the exact frame pacing, beats, shakes, text pops, background motion effects, 7-panel climax reveal, and character voice line overlays of `best_character.mp4`.

---

## 🛑 MANDATORY PRODUCTION RULES

> [!IMPORTANT]
> **RULE 1: 2nd Last Dummy Winner Mechanics (`startFrame: 222, endFrame: 313`)**:
> - **The 2nd Last Brawler is the Dummy/Fake Winner** (e.g., Crow before Surge, or Leon before Kenji).
> - **Starts at Frame F222** (7.400s) on the pre-drop build-up audio beat.
> - **Entrance Voice Line (`contender.voiceLine`)**: Plays at F222 upon entrance.
> - **Secondary Pose Cut at Frame F263** (8.767s, local frame 41): Switches from `image` to `secondaryImage` with a flash burst & chromatic glitch shift to depict the brawler as the fake-out winner right before the true climax twist!
> - **Intermediate brawlers MUST NOT have voice lines or secondary pose cuts.**

> [!IMPORTANT]
> **RULE 2: True Climax Winner Mechanics (`startFrame: 313, endFrame: 377`)**:
> - **The Final Brawler is the True Winner** (e.g., Surge or Kenji).
> - Starts at **Frame F313** (10.433s) on the main drop hit.
> - Gets the **7-panel climax reveal sequence** (`winnerPanels`) spanning F313 to F377.
> - Gets multi-voice line triggers at reveal start (F315) and victory text pop (F345).

> [!IMPORTANT]
> **RULE 3: Dynamic Background Collage & Edit Theme per Edit**:
> Every edit MUST customize its intro background collage and styling:
> - `intro.bgImages`: Array of 4 brawler panel images matching the edit's character roster for the blurred intro collage.
> - `theme.bgGradient`: Custom radial background gradient / color palette matching the topic theme.
> - `theme.sunburstColors`: Custom conic-gradient radial beam colors for the intro sunburst.
> - `theme.fontFamily`, `theme.textShadow` & `theme.textStroke`: Custom typography styling.

---

## ⏱ Master Frame-by-Frame & Timestamp Schedule

| Frame Range | Timestamp | Section | Visual Mechanics & Effects | Audio & Voice Line | Asset / Image |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `F000 → F012` | `0.000s → 0.400s` | Intro Title | Rotating anime sunburst beams + blurred collage backdrop (`intro.bgImages`) | Phonk Track | Dynamic Intro Brawler Collage |
| `F012 → F033` | `0.400s → 1.100s` | Subtitle Pop | Continuous sunburst spin + ambient particle burst | Phonk Track | Dynamic Intro Brawler Collage |
| `F033 → F064` | `1.100s → 2.133s` | Intro Hit & Zoom | Camera impact shake `[intensity: 0.8]` at F33 | Beat Hit #1 | Dynamic Intro Brawler Collage |
| `F064 → F096` | `2.133s → 3.200s` | Contender 1: Meg | RGB flash (F64-F66), pink particles, chromatic glitch shift | Beat Hit (No Voice) | `meg_panel_1.png` |
| `F096 → F127` | `3.200s → 4.233s` | Contender 2: Spike | RGB flash (F96-F98), green particles, camera shake (F96-F104) | Beat Hit (No Voice) | `spike_panel_1.png` |
| `F127 → F159` | `4.233s → 5.300s` | Contender 3: Sandy | RGB flash (F127-F129), purple particles, moving speed lines | Beat Hit (No Voice) | `sandy_panel_1.png` |
| `F159 → F222` | `5.300s → 7.400s` | Contender 4: Leon | RGB flash (F159-F161), cyan particles, floating artwork | Beat Hit (No Voice) | `leon_panel_1.png` |
| `F222 → F263` | `7.400s → 8.767s` | Contender 5: Crow (Dummy Winner Image 1) | **Dummy Winner Entrance at F222**, blue particles, moving speed lines | **Crow Voice Line** (`crow/attack.ogg` at F222) | `crow_panel_1.png` |
| `F263 → F313` | `8.767s → 10.433s` | Contender 5: Crow (Dummy Winner Image 2) | **Pose Cut at F263 (Beat 7)**, chromatic glitch shift (F263-F267) | Beat Hit | `crow_panel_4.png` |
| `F313 → F322` | `10.433s → 10.733s` | Climax Image 1 | Climax Shockwave Shake `[intensity: 1.0]`, gold radial aura | **Surge Voice 1** (`surge_atk_vo_04.ogg` at F315) | `surge_panel_1.png` |
| `F322 → F331` | `10.733s → 11.033s` | Climax Image 2 | Flash burst on cut, gold particle aura, moving speed lines | Beat Hit | `surge_panel_3.png` |
| `F331 → F340` | `11.033s → 11.333s` | Climax Image 3 & Text Pop | **Gold Text Pop at F330**, text spring scale, flash burst | Beat / Text Pop | `surge_panel_5.png` |
| `F340 → F349` | `11.333s → 11.633s` | Climax Image 4 | Flash burst on cut, gold particle aura | **Surge Voice 2** (`surge_hurt_vo_05.ogg` at F345) | `surge_panel_7.png` |
| `F349 → F358` | `11.633s → 11.933s` | Climax Image 5 | Flash burst on cut, gold particle aura | Beat Hit | `surge_panel_9.png` |
| `F358 → F367` | `11.933s → 12.233s` | Climax Image 6 | Flash burst on cut, gold particle aura | Beat Hit | `surge_panel_11.png` |
| `F367 → F377` | `12.233s → 12.566s` | Climax Image 7 (Victory Pose) | Final victory stance, max gold crown aura glow, black flash at F373 | Final Beat | `surge_panel_13.png` |

---

## 🚀 How to Configure New Edits

```typescript
export const newEditProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  theme: {
    fontFamily: "'Outfit', 'Impact', sans-serif",
    bgGradient: "radial-gradient(circle at center, #3b0764 0%, #030208 100%)",
    sunburstColors: "conic-gradient(from 0deg, rgba(245, 158, 11, 0.3) 0deg 15deg, transparent 15deg 30deg, rgba(239, 68, 68, 0.3) 30deg 45deg, transparent 45deg 60deg)",
    centerGlowColor: "radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(239, 68, 68, 0.35) 45%, transparent 75%)",
    textShadow: "0 0 35px #f59e0b, 0 0 70px #ef4444, 0 0 100px #000000",
    textStroke: "4px #000000",
  },
  intro: {
    headerText: "THE BEST LEGENDARY",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
    bgImages: [
      staticFile("images/surge/surge_panel_13.png"),
      staticFile("images/spike/spike_panel_1.png"),
      staticFile("images/sandy/sandy_panel_1.png"),
      staticFile("images/meg/meg_panel_1.png"),
    ],
  },
  contenders: [
    { id: "meg", name: "Meg", questionText: "MEG?", image: staticFile("images/meg/meg_panel_1.png"), accentColor: "#ec4899", startFrame: 64, endFrame: 96 },
    { id: "spike", name: "Spike", questionText: "SPIKE?", image: staticFile("images/spike/spike_panel_1.png"), accentColor: "#22c55e", startFrame: 96, endFrame: 127 },
    { id: "sandy", name: "Sandy", questionText: "SANDY?", image: staticFile("images/sandy/sandy_panel_1.png"), accentColor: "#a855f7", startFrame: 127, endFrame: 159 },
    { id: "leon", name: "Leon", questionText: "LEON?", image: staticFile("images/leon/leon_panel_1.png"), accentColor: "#06b6d4", startFrame: 159, endFrame: 222 },
    // STRICT RULE: 2ND LAST DUMMY WINNER STARTS AT F222 WITH SECONDARY IMAGE CUT AT F263 & VOICE LINE AT F222!
    { id: "crow", name: "Crow", questionText: "CROW?", image: staticFile("images/crow/crow_panel_1.png"), secondaryImage: staticFile("images/crow/crow_panel_4.png"), voiceLine: staticFile("brawler_voices/crow/attack.ogg"), accentColor: "#3b82f6", startFrame: 222, endFrame: 313 },
  ],
  winner: {
    id: "surge",
    name: "Surge",
    announcementText: "OFC IT'S SURGE 👑",
    image: staticFile("images/surge/surge_panel_13.png"),
    winnerPanels: [ ... ],
    voiceLines: [
      staticFile("brawler_voices/surge_atk_vo_04.ogg"),
      staticFile("brawler_voices/surge_hurt_vo_05.ogg"),
    ],
    accentColor: "#ef4444",
    startFrame: 313,
    endFrame: 377,
  }
};
```
