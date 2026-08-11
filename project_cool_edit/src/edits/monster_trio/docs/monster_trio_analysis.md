# Exhaustive Frame-by-Frame & Timestamp Analysis: `monster_trio.mp4`

This document serves as the **complete, authoritative, frame-by-frame specification** for the `monster_trio` edit style reverse-engineered from `monster_trio.mp4` (One Piece Monster Trio AMV / Phonk Edit). 

With this exact specification, any future trio or multi-character edit (e.g. Brawl Stars Trio, Anime Trio, Gaming Trio) can be created in a **single prompt** by providing a list of 3 brawlers/characters, accent colors, and climax assets.

---

## 📽 Master Video Metadata & Audio Sync

- **Resolution**: `1080 x 1080` (1:1 Square Ratio)
- **FPS**: `60.0`
- **Total Duration**: `8.824s` (525 Frames)
- **Estimated BPM**: `85.24` / High-Tempo Phonk Beat
- **Audio Track**: `monster_trio_audio.wav`
- **Audio-Visual Pacing & Edit DNA**:
  - **Average Cut Interval**: `59.38 frames` (~0.99s)
  - **Median Cut Interval**: `16.5 frames` (~0.275s)
  - **Fastest Cut Burst**: `15 frames` (0.25s rapid cut sequence)
  - **Beat-Synced Cut Ratio**: `44.4%`
  - **Average Camera Shake Intensity**: `0.81`
  - **Total Scene Transitions**: `19` distinct scene boundaries

---

## ⏱ Complete 19-Scene Frame-by-Frame & Timestamp Breakdown

| Scene # | Frame Range | Timestamp Range | Duration | Phase / Segment | Visual / FX Details | Audio / Beat Event | Text / Typography Overlay | Image Asset / Character | Remotion Props Mapping |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Scene 1` | `F000 → F043` | `0.000s → 0.717s` | `44f` | Intro Hook | Zoom Punch `[scale: 1.0 → 1.11 → 1.0]`, camera shake `[intensity: 0.92]`, radial sunburst | **Beat / Onset Hit (F00)** | `"KAGE"` (White/Purple glow logo) | Intro Sunburst Backdrop | `intro.logoText` |
| `Scene 2` | `F044 → F059` | `0.733s → 0.983s` | `16f` | Brawler 1 Dark Strobe 1a | High-contrast dark radial strobe, purple aura tint | **Bass Impact Hit (F44)** | None | Dark Strobe Layer | `brawlers[0].darkGap` |
| `Scene 3` | `F060 → F075` | `1.000s → 1.250s` | `16f` | Brawler 1 Dark Strobe 1b | High-contrast dark radial strobe, purple aura tint | Pre-Beat Build | None | Dark Strobe Layer | `brawlers[0].darkGap` |
| `Scene 4` | `F076 → F138` | `1.267s → 2.300s` | `63f` | Brawler 1: Main Spotlight | Main Card Spotlight, purple particle burst (`#a855f7`), spring scale entrance | **Cut #2 / Beat Hit (F76)** | `"MORTIS"` (White, purple glow, stroke 3.5px) | `mortis_panel_1.png` | `brawlers[0]` |
| `Scene 5` | `F139 → F170` | `2.317s → 2.833s` | `32f` | Brawler 1: Action Stance 2 | Secondary action pose cut, camera impact micro-shake | **Audio RMS Spike (F141)** | `"MORTIS"` | `mortis_panel_4.png` | `brawlers[0].secondaryPose` |
| `Scene 6` | `F171 → F186` | `2.850s → 3.100s` | `16f` | Brawler 2 Dark Strobe 2a | High-contrast dark radial strobe, red aura tint | **Bass Impact Hit (F171)** | None | Dark Strobe Layer | `brawlers[1].darkGap` |
| `Scene 7` | `F187 → F203` | `3.117s → 3.383s` | `17f` | Brawler 2 Dark Strobe 2b | High-contrast dark radial strobe, red aura tint | Pre-Beat Build | None | Dark Strobe Layer | `brawlers[1].darkGap` |
| `Scene 8` | `F204 → F264` | `3.400s → 4.400s` | `61f` | Brawler 2: Main Spotlight | Main Card Spotlight, red particle burst (`#ef4444`), spring scale entrance | **Cut #4 / Beat Hit (F204)** | `"EDGAR"` (White, red glow, stroke 3.5px) | `edgar_panel_1.png` | `brawlers[1]` |
| `Scene 9` | `F265 → F298` | `4.417s → 4.967s` | `34f` | Brawler 2: Action Stance 2 | Secondary action pose cut, red aura pulse | **Glitch Onset (F267)** | `"EDGAR"` | `edgar_panel_4.png` | `brawlers[1].secondaryPose` |
| `Scene 10` | `F299 → F314` | `4.983s → 5.233s` | `16f` | Brawler 3 Dark Strobe 3a | High-contrast dark radial strobe, blue aura tint | **Bass Impact Hit (F299)** | None | Dark Strobe Layer | `brawlers[2].darkGap` |
| `Scene 11` | `F315 → F331` | `5.250s → 5.517s` | `17f` | Brawler 3 Dark Strobe 3b | High-contrast dark radial strobe, blue aura tint | Pre-Beat Build | None | Dark Strobe Layer | `brawlers[2].darkGap` |
| `Scene 12` | `F332 → F394` | `5.533s → 6.567s` | `63f` | Brawler 3: Main Spotlight | Main Card Spotlight, blue particle aura (`#3b82f6`), spring scale entrance | **Cut #6 / Beat Hit (F332)** | `"CROW"` (White, blue glow, stroke 3.5px) | `crow_panel_1.png` | `brawlers[2]` |
| `Scene 13` | `F395 → F411` | `6.583s → 6.850s` | `17f` | Brawler 3: Action Stance 2a | Secondary action pose variant, blue particle aura | **Beat Hit (F395)** | `"CROW"` | `crow_panel_4.png` | `brawlers[2].secondaryPose` |
| `Scene 14` | `F412 → F427` | `6.867s → 7.117s` | `16f` | Brawler 3: Action Stance 2b | Secondary action pose cut, speed lines motion | **Beat Hit (F412)** | `"CROW"` | `crow_panel_4.png` | `brawlers[2].secondaryPose` |
| `Scene 15` | `F428 → F443` | `7.133s → 7.383s` | `16f` | Climax Transition | High-contrast speed lines, gold aura build-up | **Pre-Climax Beat (F428)** | None | Climax Transition Layer | `climax.transition` |
| `Scene 16` | `F444 → F459` | `7.400s → 7.650s` | `16f` | Climax Rapid Cut 1 | Rapid 16-frame cut, gold text pop `"MONSTER TRIO 👑"`, white flash | **Climax Beat Hit #1 (F444)** | `"MONSTER TRIO 👑"` (Gold `#fbbf24`) | Rapid Panel 1 | `climax.rapidPanels[0]` |
| `Scene 17` | `F460 → F474` | `7.667s → 7.900s` | `15f` | Climax Rapid Cut 2 | Rapid 15-frame cut, gold text pop, white flash transition | **Climax Beat Hit #2 (F460)** | `"MONSTER TRIO 👑"` | Rapid Panel 2 | `climax.rapidPanels[1]` |
| `Scene 18` | `F475 → F490` | `7.916s → 8.167s` | `16f` | Climax Rapid Cut 3 | Rapid 16-frame cut, gold text pop, white flash transition | **Climax Beat Hit #3 (F475)** | `"MONSTER TRIO 👑"` | Rapid Panel 3 | `climax.rapidPanels[2]` |
| `Scene 19` | `F491 → F524` | `8.183s → 8.733s` | `34f` | Final Victory Stance | Final victory pose, max gold crown aura glow, black flash out at F520 | **Final Climax Beat (F491)** | `"MONSTER TRIO 👑"` | Victory Stance Panel | `climax.victoryStance` |

---

## 🤖 Single-Prompt Reusability Blueprint

To generate a new edit in this exact style for any Brawl Stars Trio or custom character set, specify the props JSON matching `MonsterTrioEditProps`:

```typescript
export interface CharacterCardProps {
  id: string;
  name: string;
  text: string;
  image: string;
  secondaryPose: string;
  voiceLine?: string;
  accentColor: string;
  darkGapStartFrame: number;
  darkGapEndFrame: number;
  mainStartFrame: number;
  mainEndFrame: number;
  secondaryStartFrame: number;
  secondaryEndFrame: number;
}

export interface MonsterTrioEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  intro: {
    logoText: string;
    watermarkText: string;
    startFrame: number;
    endFrame: number;
  };
  brawlers: CharacterCardProps[];
  climax: {
    titleText: string;
    accentColor: string;
    rapidPanels: string[];
    victoryStance: string;
    voiceLines?: string[];
    rapidCutFrames: number[];
    startFrame: number;
    endFrame: number;
  };
}
```
