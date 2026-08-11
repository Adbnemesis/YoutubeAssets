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
- **Character Flow Pattern per Brawler**:
  1. **Image Shake Entrance**: (`~44 frames` / `~0.73s`) Character Image 1 with camera shake (`intensity 0.92`) and zoom punch (`scale 1.0 → 1.12 → 1.0`).
  2. **Text Card Pop**: (`~32 frames` / `~0.53s`) Animated Text Header ("MORTIS", "EDGAR", "CROW") pop over Character Image 1 with glowing stroke & flash burst.
  3. **Secondary Action Stance Cut**: (`~63 frames` / `~1.05s`) Cut to Character Image 2 (Secondary Pose) with brawler accent aura.

---

## ⏱ Complete 19-Scene Frame-by-Frame Breakdown

| Scene # | Frame Range | Timestamp Range | Duration | Phase / Segment | Visual / FX Details | Audio / Beat Event | Text Overlay | Image Asset | Remotion Props Mapping |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Scene 1` | `F000 → F044` | `0.000s → 0.733s` | `44f` | Brawler 1 (Mortis): Image Shake Entrance | Zoom Punch `[scale: 1.0 → 1.12 → 1.0]`, camera shake `[0.92]`, purple radial sunburst | **Beat / Onset Hit (F00)** | None | `mortis_panel_1.png` | `brawlers[0]` (mode: `image_shake`) |
| `Scene 2 & 3` | `F044 → F076` | `0.733s → 1.267s` | `32f` | Brawler 1 (Mortis): Text Card Pop | Animated text pop `"MORTIS"`, spring scale entrance, white flash burst on cut | **Bass Impact Hit (F44)** | `"MORTIS"` (White, purple glow) | `mortis_panel_1.png` | `brawlers[0]` (mode: `text_card`) |
| `Scene 4` | `F076 → F138` | `1.267s → 2.300s` | `63f` | Brawler 1 (Mortis): Action Stance 2 | Secondary action pose cut, purple particle aura (`#a855f7`) | **Cut #2 / Beat Hit (F76)** | None | `mortis_panel_4.png` | `brawlers[0]` (mode: `action_pose`) |
| `Scene 5 & 6` | `F139 → F171` | `2.317s → 2.850s` | `32f` | Brawler 2 (Edgar): Overlap Image Shake | Edgar Image 1 overlaps Brawler 1, camera shake, red radial sunburst | **Bass Impact Hit (F139)** | None | `edgar_panel_1.png` | `brawlers[1]` (mode: `image_shake`) |
| `Scene 7 & 8` | `F171 → F204` | `2.850s → 3.400s` | `33f` | Brawler 2 (Edgar): Text Card Pop | Animated text pop `"EDGAR"`, spring scale entrance, white flash burst on cut | **Bass Impact Hit (F171)** | `"EDGAR"` (White, red glow) | `edgar_panel_1.png` | `brawlers[1]` (mode: `text_card`) |
| `Scene 9` | `F204 → F267` | `3.400s → 4.450s` | `63f` | Brawler 2 (Edgar): Action Stance 2 | Secondary action pose cut, red particle aura (`#ef4444`) | **Cut #4 / Beat Hit (F204)** | None | `edgar_panel_4.png` | `brawlers[1]` (mode: `action_pose`) |
| `Scene 10 & 11` | `F267 → F299` | `4.450s → 4.983s` | `32f` | Brawler 3 (Crow): Overlap Image Shake | Crow Image 1 overlaps Brawler 2, camera shake, blue radial sunburst | **Bass Impact Hit (F267)** | None | `crow_panel_1.png` | `brawlers[2]` (mode: `image_shake`) |
| `Scene 12 & 13` | `F299 → F332` | `4.983s → 5.533s` | `33f` | Brawler 3 (Crow): Text Card Pop | Animated text pop `"CROW"`, spring scale entrance, white flash burst on cut | **Bass Impact Hit (F299)** | `"CROW"` (White, blue glow) | `crow_panel_1.png` | `brawlers[2]` (mode: `text_card`) |
| `Scene 14 & 15` | `F332 → F444` | `5.533s → 7.400s` | `112f` | Brawler 3 (Crow): Action Stance 2 | Secondary action pose cut, electric blue particle aura (`#3b82f6`) | **Cut #6 / Beat Hit (F332)** | None | `crow_panel_4.png` | `brawlers[2]` (mode: `action_pose`) |
| `Scene 16 → 19` | `F444 → F525` | `7.400s → 8.824s` | `81f` | Trio Climax Rapid Cut Finale | Rapid 15-frame cut sequence across 4 panels, gold text `"MONSTER TRIO 👑"`, victory stance | **Climax Beat Hit (F444)** | `"MONSTER TRIO 👑"` (Gold `#fbbf24`) | Rapid Trio Panels & Victory Stance | `climax` |

---

## 🤖 Single-Prompt Reusability Blueprint

To generate a new edit in this exact style for any Brawl Stars Trio or custom character set, specify the props JSON matching `MonsterTrioEditProps`:

```typescript
export interface BrawlerCardProps {
  id: string;
  name: string;
  text: string;
  image: string;
  secondaryPose: string;
  voiceLine?: string;
  accentColor: string;
}

export interface MonsterTrioEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  watermarkText: string;
  brawlers: BrawlerCardProps[];
  climax: {
    titleText: string;
    accentColor: string;
    rapidPanels: string[];
    victoryStance: string;
  };
}
```
