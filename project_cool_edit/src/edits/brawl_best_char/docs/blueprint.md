# Master Architecture & Production Blueprint: `brawl_best_char`

## Overview

The `brawl_best_char` edit is a standardized vertical (9:16) Short template that ranks brawlers against a phonk audio track. It features a **7-Brawler Roster (6 Contenders + 1 True Winner)** across a 377-frame timeline:

1. **Intro Phase** (`F000 -> F064`): High-energy title header + subtext pop over a 4-brawler blurred collage backdrop with rotating anime sunburst light beams.
2. **Contenders Phase** (`F064 -> F313`): Exactly 6 sequential contender cards showing character artwork + question text (e.g., `"LEON?"`).
   - Contender 1: `F064 -> F096` (32 frames)
   - Contender 2: `F096 -> F127` (31 frames)
   - Contender 3: `F127 -> F159` (32 frames)
   - Contender 4: `F159 -> F189` (30 frames)
   - Contender 5: `F189 -> F222` (33 frames)
   - **Contender 6 (2nd Last / Dummy Winner)**: `F222 -> F313` (91 frames), featuring a voice line on entrance at `F222` and a secondary pose cut at `F263` (Beat 7).
3. **True Winner Climax** (`F313 -> F377`): Climax drop with a 7-panel image reveal sequence, victory crown aura, victory text, and character voice lines.

---

## 🛑 MANDATORY PRODUCTION RULES FOR ANY EDIT

> [!IMPORTANT]
> **RULE 1: 7-Brawler Roster & Frame Continuity (Zero Gaps / Zero Black Screens)**
> - Every `brawl_best_char` edit MUST contain **exactly 6 contenders + 1 true winner (7 brawlers total)** to maintain beat-perfect audio synchronization.
> - Every contender's `startFrame` **MUST EXACTLY EQUAL** the preceding contender's `endFrame`.
> - **Mandatory Contender Cut Anchor Points**:
>   - Contender 1: `F064 -> F096`
>   - Contender 2: `F096 -> F127`
>   - Contender 3: `F127 -> F159`
>   - Contender 4: `F159 -> F189`
>   - Contender 5: `F189 -> F222`
>   - Contender 6 (Dummy Winner): `F222 -> F313`
>   - Winner (True Climax): `F313 -> F377`

> [!IMPORTANT]
> **RULE 2: 2nd Last Brawler is ALWAYS the Dummy Winner (`F222 -> F313`)**
> - The 6th contender in `contenders` (e.g. Crow or Leon) **MUST start at F222 and end at F313**.
> - **Entrance Voice Line (`contender.voiceLine`)**: Plays at `F222` upon entrance.
> - **Secondary Pose Cut (`contender.secondaryImage`)**: Switches from primary artwork to 2nd pose artwork at **Beat 7 (`F263`)** with a flash burst & chromatic glitch shift.
> - **Intermediate brawlers MUST NOT have voice lines or secondary pose cuts.**

> [!IMPORTANT]
> **RULE 3: Final Brawler is ALWAYS the True Winner (`F313 -> F377`)**
> - The final winner object `winner` **MUST start at F313 and end at F377**.
> - **7-Panel Climax Reveal (`winner.winnerPanels`)**: Exactly 7 image panel URLs displayed at ~9-frame intervals.
> - **Voice Line Triggers (`winner.voiceLines`)**: Played at `F315` (reveal start) and `F345` (victory text pop).

> [!IMPORTANT]
> **RULE 4: Topic Theme & Dynamic Intro Collage (`intro.bgImages`, `theme`)**
> Every edit theme MUST customize:
> - `intro.bgImages`: Array of 4 brawler panel images matching the edit's character roster.
> - `theme.bgGradient`: Custom radial background gradient matching the theme palette.
> - `theme.sunburstColors`: Custom conic-gradient radial beam colors for the intro sunburst.
> - `theme.fontFamily`, `theme.textShadow` & `theme.textStroke`: Custom typography styling.

---

## ⏱ Master Timeline & Audio Beat Anchor Table

| Timeline Frame Range | Timestamp Range | Section / Brawler Role | Beat Anchor | Mechanics & Visual Effects | Audio & Sound Effects |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `F000 → F012` | `0.000s → 0.400s` | Intro Title Header | Start | Rotating sunburst beams + blurred brawler collage (`intro.bgImages`) | Phonk Audio Track |
| `F012 → F033` | `0.400s → 1.100s` | Subtitle Pop | Subtext Beat | Continuous sunburst rotation + ambient floating particles | Phonk Audio Track |
| `F033 → F064` | `1.100s → 2.133s` | Intro Impact Zoom | Beat #1 | Camera impact shake `[intensity: 0.8]` at F33 | Phonk Beat #1 |
| `F064 → F096` | `2.133s → 3.200s` | Contender 1 (e.g. Meg) | Beat #2 | Entrance flash (F64-F66), floating artwork, question text pop | Phonk Beat #2 |
| `F096 → F127` | `3.200s → 4.233s` | Contender 2 (e.g. Spike) | Beat #3 | Entrance flash (F96-F98), floating artwork, question text pop | Phonk Beat #3 |
| `F127 → F159` | `4.233s → 5.300s` | Contender 3 (e.g. Sandy) | Beat #4 | Entrance flash (F127-F129), floating artwork, question text pop | Phonk Beat #4 |
| `F159 → F189` | `5.300s → 6.300s` | Contender 4 (e.g. Kenji) | Beat #5 | Entrance flash (F159-F161), floating artwork, question text pop | Phonk Beat #5 |
| `F189 → F222` | `6.300s → 7.400s` | Contender 5 (e.g. Leon) | Beat #6 | Entrance flash (F189-F191), floating artwork, question text pop | Phonk Beat #6 |
| `F222 → F263` | `7.400s → 8.767s` | **Contender 6: Dummy Winner (Pose 1)** | **Beat #7 (Hook)** | Entrance flash burst (F222-F224), moving speed lines | **Dummy Winner Voice Line** at `F222` |
| `F263 → F313` | `8.767s → 10.433s` | **Contender 6: Dummy Winner (Pose 2)** | **Beat #8 (Pose Cut)** | Secondary pose cut at `F263`, chromatic glitch burst (F263-F267) | Phonk Beat #8 |
| `F313 → F377` | `10.433s → 12.566s` | **True Climax Winner** | **Beat #9 (Drop)** | 7-panel climax reveal, climax shockwave `[intensity: 1.0]`, gold crown aura | **Winner Voice Line 1** at `F315`<br>**Winner Voice Line 2** at `F345` |

---

## 🛠 Generic Edit Configuration Pattern

To create a new edit for `brawl_best_char`, copy and adapt this JSON/Props structure:

```typescript
export const myCustomEditProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  theme: {
    fontFamily: "'Outfit', 'Impact', sans-serif",
    bgGradient: "radial-gradient(circle at center, #1e1b4b 0%, #04050a 100%)",
    textShadow: "0 0 35px #f59e0b, 0 0 70px #ef4444, 0 0 100px #000000",
    textStroke: "4px #000000",
    sunburstColors: "conic-gradient(from 0deg, rgba(245, 158, 11, 0.3) 0deg 15deg, transparent 15deg 30deg, rgba(239, 68, 68, 0.3) 30deg 45deg, transparent 45deg 60deg)",
    centerGlowColor: "radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(239, 68, 68, 0.35) 45%, transparent 75%)",
  },
  intro: {
    headerText: "EDIT HEADER TEXT",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
    bgImages: [
      staticFile("images/brawler1/brawler1_panel_1.png"),
      staticFile("images/brawler2/brawler2_panel_1.png"),
      staticFile("images/brawler3/brawler3_panel_1.png"),
      staticFile("images/brawler4/brawler4_panel_1.png"),
    ],
  },
  contenders: [
    { id: "brawler1", name: "Brawler 1", questionText: "BRAWLER 1?", image: staticFile("images/brawler1/brawler1_panel_1.png"), accentColor: "#ec4899", startFrame: 64, endFrame: 96 },
    { id: "brawler2", name: "Brawler 2", questionText: "BRAWLER 2?", image: staticFile("images/brawler2/brawler2_panel_1.png"), accentColor: "#22c55e", startFrame: 96, endFrame: 127 },
    { id: "brawler3", name: "Brawler 3", questionText: "BRAWLER 3?", image: staticFile("images/brawler3/brawler3_panel_1.png"), accentColor: "#a855f7", startFrame: 127, endFrame: 159 },
    { id: "brawler4", name: "Brawler 4", questionText: "BRAWLER 4?", image: staticFile("images/brawler4/brawler4_panel_1.png"), accentColor: "#f59e0b", startFrame: 159, endFrame: 189 },
    { id: "brawler5", name: "Brawler 5", questionText: "BRAWLER 5?", image: staticFile("images/brawler5/brawler5_panel_1.png"), accentColor: "#06b6d4", startFrame: 189, endFrame: 222 },
    // 2ND LAST DUMMY WINNER: ALWAYS F222 -> F313 WITH SECONDARY IMAGE CUT AT F263 & VOICE LINE AT F222
    { id: "dummy_winner", name: "Dummy Winner", questionText: "DUMMY WINNER?", image: staticFile("images/dummy/dummy_panel_1.png"), secondaryImage: staticFile("images/dummy/dummy_panel_4.png"), voiceLine: staticFile("brawler_voices/dummy/attack.ogg"), accentColor: "#3b82f6", startFrame: 222, endFrame: 313 },
  ],
  winner: {
    id: "true_winner",
    name: "True Winner",
    announcementText: "OFC IT'S WINNER 👑",
    image: staticFile("images/winner/winner_panel_13.png"),
    winnerPanels: [
      staticFile("images/winner/winner_panel_1.png"),
      staticFile("images/winner/winner_panel_3.png"),
      staticFile("images/winner/winner_panel_5.png"),
      staticFile("images/winner/winner_panel_7.png"),
      staticFile("images/winner/winner_panel_9.png"),
      staticFile("images/winner/winner_panel_11.png"),
      staticFile("images/winner/winner_panel_13.png"),
    ],
    voiceLines: [
      staticFile("brawler_voices/winner/voice1.ogg"),
      staticFile("brawler_voices/winner/voice2.ogg"),
    ],
    accentColor: "#ef4444",
    startFrame: 313,
    endFrame: 377,
  }
};
```
