# Technical Blueprint: Brawl Stars Best Character Edit (`brawl_best_char`)

## Overview

The `brawl_best_char` edit is a vertical 9:16 Short recreating the exact frame pacing, beats, shakes, text pops, background motion effects, 7-panel climax reveal, and character voice line overlays of `best_character.mp4`.

---

## 🎙 Voice Line Overlay Specifications

1. **Fake Winner Presentation Voice (`contender.voiceLine`)**:
   - Played during the fake winner presentation (e.g. Leon `"Sneaky time!"` voice line at frame F222).
   - Serves as an auditory hook convincing the viewer that Leon is the winner before the climax twist.

2. **True Winner Reveal Multi-Voice (`winner.voiceLines`)**:
   - **Voice Line 1** (`super.ogg`): Triggered at frame F315 (local frame 2) when the true winner reveal begins.
   - **Voice Line 2** (`attack.ogg`): Triggered at frame F345 (local frame 32) after the gold announcement text pop with a clean timing gap.

---

## ⏱ Master Frame-by-Frame & Timestamp Schedule

| Frame Range | Timestamp | Section | Visual Mechanics & Effects | Audio & Voice Line | Asset / Image |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `F000 → F012` | `0.000s → 0.400s` | Intro Title | Rotating anime sunburst beams + blurred collage backdrop + purple/pink radial aura | Phonk Track | Brawler Collage Grid |
| `F012 → F033` | `0.400s → 1.100s` | Subtitle Pop | Continuous sunburst spin + ambient particle burst | Phonk Track | Brawler Collage Grid |
| `F033 → F064` | `1.100s → 2.133s` | Intro Hit & Zoom | Camera impact shake `[intensity: 0.8]` at F33 | Beat Hit #1 | Brawler Collage Grid |
| `F064 → F096` | `2.133s → 3.200s` | Contender 1: Mortis | RGB flash (F64-F66), purple particles, chromatic glitch shift | Beat Hit | `mortis_panel_1.png` |
| `F096 → F127` | `3.200s → 4.233s` | Contender 2: Edgar | RGB flash (F96-F98), red particles, camera shake (F96-F104) | Beat Hit | `edgar_panel_1.png` |
| `F127 → F159` | `4.233s → 5.300s` | Contender 3: Crow | RGB flash (F127-F129), blue particles, moving speed lines | Beat Hit | `crow_panel_1.png` |
| `F159 → F189` | `5.300s → 6.300s` | Contender 4: R-T | RGB flash (F159-F161), sky blue particles, floating artwork | Beat Hit | `rt_panel_1.png` |
| `F189 → F222` | `6.300s → 7.400s` | Contender 5: Tara | RGB flash (F189-F191), pink particles, moving speed lines | Beat Hit | `tara_panel_1.png` |
| `F222 → F263` | `7.400s → 8.767s` | Contender 6: Leon (Image 1) | RGB flash (F222-F224), green particles, floating artwork | **Leon Voice Line** (`leon_ulti_vo_01.ogg`) | `leon_panel_1.png` |
| `F263 → F313` | `8.767s → 10.433s` | Contender 6: Leon (Image 2) | Secondary pose cut at F263, chromatic glitch shift (F263-F267) | Beat Hit | `leon_panel_4.png` |
| `F313 → F322` | `10.433s → 10.733s` | Climax Image 1 | Climax Shockwave Shake `[intensity: 1.0]`, gold radial aura | **Kenji Voice 1** (`super.ogg` at F315) | `kenji_panel_1.png` |
| `F322 → F331` | `10.733s → 11.033s` | Climax Image 2 | Flash burst on cut, gold particle aura, moving speed lines | Beat Hit | `kenji_panel_4.png` |
| `F331 → F340` | `11.033s → 11.333s` | Climax Image 3 & Text Pop | **Gold Text Pop at F330**, text spring scale, flash burst | Beat / Text Pop | `kenji_panel_6.png` |
| `F340 → F349` | `11.333s → 11.633s` | Climax Image 4 | Flash burst on cut, gold particle aura | **Kenji Voice 2** (`attack.ogg` at F345) | `kenji_panel_8.png` |
| `F349 → F358` | `11.633s → 11.933s` | Climax Image 5 | Flash burst on cut, gold particle aura | Beat Hit | `kenji_panel_11.png` |
| `F358 → F367` | `11.933s → 12.233s` | Climax Image 6 | Flash burst on cut, gold particle aura | Beat Hit | `kenji_panel_13.png` |
| `F367 → F377` | `12.233s → 12.566s` | Climax Image 7 (Victory Pose) | Final victory stance, max gold crown aura glow, black flash at F373 | Final Beat | `kenji_panel_15.png` |

---

## 🚀 How to Generate Future Edits in a Single Prompt

```typescript
export const newEditProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  intro: { headerText: "THE BEST BRAWLER", subText: "WHO IS THE #1?", startFrame: 0, endFrame: 64 },
  contenders: [
    // Include optional voiceLine for the fake winner candidate!
    { id: "leon", name: "Leon", questionText: "LEON?", image: staticFile("images/leon/leon_panel_1.png"), voiceLine: staticFile("brawler_voices/leon/leon_ulti_vo_01.ogg"), accentColor: "#10b981", startFrame: 222, endFrame: 313 },
  ],
  winner: {
    // Include voiceLines array for the true winner reveal!
    voiceLines: [
      staticFile("brawler_voices/kenji/super.ogg"),
      staticFile("brawler_voices/kenji/attack.ogg"),
    ],
    ...
  }
};
```
