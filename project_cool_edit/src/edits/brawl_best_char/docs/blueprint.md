# Technical Blueprint: Brawl Stars Best Character Edit (`brawl_best_char`)

## Overview

The `brawl_best_char` edit is a vertical 9:16 Short recreating the exact frame pacing, beats, shakes, text pops, background motion effects, 7-panel climax reveal, and character voice line overlays of `best_character.mp4`.

---

## 🛑 MANDATORY PRODUCTION RULES

> [!IMPORTANT]
> **RULE 1: Voice Line Placement**:
> Character voice lines MUST ONLY play for:
> 1. **The 2nd Last Brawler** (`contender.voiceLine`): Serves as the pre-climax auditory build-up hook (e.g., Crow voice line at frame F222).
> 2. **The Final Winner** (`winner.voiceLines`): Triggered at reveal (F315) and victory announcement text pop (F345).
> **Intermediate brawlers MUST NOT have voice lines.**

> [!IMPORTANT]
> **RULE 2: Dynamic Background & Text Styling per Edit**:
> Every edit MUST customize its background theme and text styling via `theme`:
> - `theme.bgGradient`: Custom radial background gradient / color palette matching the topic.
> - `theme.fontFamily`: Custom typography font family for the edit theme.
> - `theme.textShadow` & `theme.textStroke`: Custom text glow, drop shadow, and stroke parameters.

---

## 🎙 Voice Line Overlay Specifications

1. **2nd Last Brawler Voice (`contender.voiceLine`)**:
   - Triggered when the 2nd last brawler enters (e.g., Crow at frame F222).
   - Serves as an auditory hook right before the winner climax reveal.

2. **True Winner Reveal Multi-Voice (`winner.voiceLines`)**:
   - **Voice Line 1** (`super.ogg`): Triggered at frame F315 (local frame 2) when the true winner reveal begins.
   - **Voice Line 2** (`attack.ogg`): Triggered at frame F345 (local frame 32) after the gold announcement text pop with a clean timing gap.

---

## ⏱ Master Frame-by-Frame & Timestamp Schedule

| Frame Range | Timestamp | Section | Visual Mechanics & Effects | Audio & Voice Line | Asset / Image |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `F000 → F012` | `0.000s → 0.400s` | Intro Title | Rotating anime sunburst beams + blurred collage backdrop + custom theme radial aura | Phonk Track | Brawler Collage Grid |
| `F012 → F033` | `0.400s → 1.100s` | Subtitle Pop | Continuous sunburst spin + ambient particle burst | Phonk Track | Brawler Collage Grid |
| `F033 → F064` | `1.100s → 2.133s` | Intro Hit & Zoom | Camera impact shake `[intensity: 0.8]` at F33 | Beat Hit #1 | Brawler Collage Grid |
| `F064 → F096` | `2.133s → 3.200s` | Contender 1: Meg | RGB flash (F64-F66), pink particles, chromatic glitch shift | Beat Hit (No Voice) | `meg_panel_1.png` |
| `F096 → F127` | `3.200s → 4.233s` | Contender 2: Spike | RGB flash (F96-F98), green particles, camera shake (F96-F104) | Beat Hit (No Voice) | `spike_panel_1.png` |
| `F127 → F159` | `4.233s → 5.300s` | Contender 3: Sandy | RGB flash (F127-F129), purple particles, moving speed lines | Beat Hit (No Voice) | `sandy_panel_1.png` |
| `F159 → F189` | `5.300s → 6.300s` | Contender 4: Leon | RGB flash (F159-F161), cyan particles, floating artwork | Beat Hit (No Voice) | `leon_panel_1.png` |
| `F189 → F222` | `6.300s → 7.400s` | Contender 4: Leon (Pose 2) | Secondary pose cut at F189, chromatic glitch shift | Beat Hit (No Voice) | `leon_panel_4.png` |
| `F222 → F313` | `7.400s → 10.433s` | Contender 5: Crow (2nd Last) | RGB flash (F222-F224), blue particles, moving speed lines | **Crow Voice Line** (`crow/attack.ogg`) | `crow_panel_1.png` |
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
    bgGradient: "radial-gradient(circle at center, #2e1065 0%, #030208 100%)",
    textShadow: "0 0 35px #f59e0b, 0 0 70px #7c3aed, 0 0 100px #000000",
    textStroke: "4px #000000",
  },
  intro: { headerText: "THE BEST LEGENDARY", subText: "WHO IS THE #1?", startFrame: 0, endFrame: 64 },
  contenders: [
    { id: "meg", name: "Meg", questionText: "MEG?", image: staticFile("images/meg/meg_panel_1.png"), accentColor: "#ec4899", startFrame: 64, endFrame: 96 },
    { id: "spike", name: "Spike", questionText: "SPIKE?", image: staticFile("images/spike/spike_panel_1.png"), accentColor: "#22c55e", startFrame: 96, endFrame: 127 },
    { id: "sandy", name: "Sandy", questionText: "SANDY?", image: staticFile("images/sandy/sandy_panel_1.png"), accentColor: "#a855f7", startFrame: 127, endFrame: 159 },
    { id: "leon", name: "Leon", questionText: "LEON?", image: staticFile("images/leon/leon_panel_1.png"), accentColor: "#06b6d4", startFrame: 159, endFrame: 222 },
    // STRICT RULE: ONLY 2ND LAST BRAWLER HAS VOICE LINE!
    { id: "crow", name: "Crow", questionText: "CROW?", image: staticFile("images/crow/crow_panel_1.png"), voiceLine: staticFile("brawler_voices/crow/attack.ogg"), accentColor: "#3b82f6", startFrame: 222, endFrame: 313 },
  ],
  winner: {
    id: "surge",
    name: "Surge",
    announcementText: "OFC IT'S SURGE 👑",
    image: staticFile("images/surge/surge_panel_13.png"),
    winnerPanels: [ ... ],
    // STRICT RULE: WINNER HAS VOICE LINES!
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
