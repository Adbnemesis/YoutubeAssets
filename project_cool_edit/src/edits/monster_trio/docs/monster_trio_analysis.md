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
  1. **Image Shake Entrance**: (`~44 frames` / `~0.73s`) Character Image 1 with camera shake (`intensity 0.92`) and zoom punch (`scale 1.0 → 1.14 → 1.0`).
  2. **Text Card Pop**: (`~32 frames` / `~0.53s`) Animated Text Header ("MORTIS", "EDGAR", "CROW") pop on **PURE BLACK BACKGROUND (`#000000`)** with rapid font family cycling (`Impact`, `Arial Black`, `Trebuchet MS`, `Courier New`).
  3. **Secondary Action Stance Cut**: (`~63 frames` / `~1.05s`) Cut to Character Image 2 — the brawler's **animated GIF** (`mortis_win.gif` / `edgar_win.gif` / `crow_win.gif`, 33.3fps) played **at its original speed** (frame-synced; never sped up or looped) with brawler accent aura, soft fade-in, slow drift and slow zoom.

---

## ⏱ Complete 19-Scene Frame-by-Frame Breakdown

| Scene # | Frame Range | Timestamp Range | Duration | Phase / Segment | Visual / FX Details | Audio / Beat Event | Text Overlay | Image Asset | Remotion Props Mapping |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Scene 1` | `F000 → F044` | `0.000s → 0.733s` | `44f` | Brawler 1 (Mortis): Image Shake Entrance | Zoom Punch `[scale: 1.0 → 1.14 → 1.0]`, camera shake `[0.92]`, purple radial sunburst | **Beat / Onset Hit (F00)** | None | `mortis_panel_1.png` | `brawlers[0]` (mode: `image_shake`) |
| `Scene 2 & 3` | `F044 → F076` | `0.733s → 1.267s` | `32f` | Brawler 1 (Mortis): Text Card Pop | Pure black background (`#000`), rapid font cycling text pop `"MORTIS"`, spring scale | **Bass Impact Hit (F44)** | `"MORTIS"` (White, purple glow) | `mortis_panel_1.png` | `brawlers[0]` (mode: `text_card`) |
| `Scene 4` | `F076 → F139` | `1.267s → 2.300s` | `63f` | Brawler 1 (Mortis): Action Stance 2 | **Animated GIF** (`mortis_win.gif`, original speed), purple accent aura (`#a855f7`), Chromatic Aberration RGB split | **Cut #2 / Beat Hit (F76)** | None | `brawler_gif_frames/mortis` (76f) | `brawlers[0]` (mode: `action_pose`) |
| `Scene 5 & 6` | `F139 → F171` | `2.317s → 2.850s` | `32f` | Brawler 2 (Edgar): Overlap Image Shake | Edgar Image 1 overlaps Mortis, camera shake, red radial sunburst | **Bass Impact Hit (F139)** | None | `edgar_panel_1.png` | `brawlers[1]` (mode: `image_shake`) |
| `Scene 7 & 8` | `F171 → F204` | `2.850s → 3.400s` | `33f` | Brawler 2 (Edgar): Text Card Pop | Pure black background (`#000`), rapid font cycling text pop `"EDGAR"`, spring scale | **Bass Impact Hit (F171)** | `"EDGAR"` (White, red glow) | `edgar_panel_1.png` | `brawlers[1]` (mode: `text_card`) |
| `Scene 9` | `F204 → F267` | `3.400s → 4.450s` | `63f` | Brawler 2 (Edgar): Action Stance 2 | **Animated GIF** (`edgar_win.gif`, original speed), red accent aura (`#ef4444`), Chromatic Aberration RGB split | **Cut #4 / Beat Hit (F204)** | None | `brawler_gif_frames/edgar` (121f) | `brawlers[1]` (mode: `action_pose`) |
| `Scene 10 & 11` | `F267 → F299` | `4.450s → 4.983s` | `32f` | Brawler 3 (Crow): Overlap Image Shake | Crow Image 1 overlaps Edgar, camera shake, blue radial sunburst | **Bass Impact Hit (F267)** | None | `crow_panel_1.png` | `brawlers[2]` (mode: `image_shake`) |
| `Scene 12 & 13` | `F299 → F332` | `4.983s → 5.533s` | `33f` | Brawler 3 (Crow): Text Card Pop | Pure black background (`#000`), rapid font cycling text pop `"CROW"`, spring scale | **Bass Impact Hit (F299)** | `"CROW"` (White, blue glow) | `crow_panel_1.png` | `brawlers[2]` (mode: `text_card`) |
| `Scene 14 & 15` | `F332 → F395` | `5.533s → 6.583s` | `63f` | Brawler 3 (Crow): Action Stance 2 | **Animated GIF** (`crow_win.gif`, original speed), electric blue accent aura (`#3b82f6`) | **Cut #6 / Beat Hit (F332)** | None | `brawler_gif_frames/crow` (117f) | `brawlers[2]` (mode: `action_pose`) |
| `Scene 16 → 19` | `F395 → F525` | `6.583s → 8.824s` | `130f` | **7-Panel Rapid Alternating Slide Climax** | **6.58s to 8.82s**: 7 panels alternate slide transitions (reduced travel ~30%); **each panel carries its own brawler background** (Mortis → shop, Edgar → graffiti, Crow → windstock), victory panel on the anime background | **Climax Beat Onset (F395)** | None | `climax.rapidPanels` (bg per panel) | `climax` |

---

## 🤖 Single-Prompt Reusability Blueprint

To generate a new edit in this exact style for any Brawl Stars Trio or custom character set, specify the props JSON matching `MonsterTrioEditProps`:

```typescript
export interface BrawlerCardProps {
  id: string;
  name: string;
  text: string;
  image: string;
  secondaryPoseGif: { base: string; frameCount: number };
  backgroundImage: string;
  backgroundBoost?: number;
  entrance?: "rise" | "slideLeft" | "slideRight";
  voiceLine?: string;
  accentColor: string;
}

export interface ClimaxPanel {
  image: string;
  backgroundImage: string;
  backgroundBoost?: number;
  accentColor: string;
}

export interface MonsterTrioEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  brawlers: BrawlerCardProps[];
  climax: {
    accentColor: string;
    backgroundImage: string;
    rapidPanels: ClimaxPanel[];
    victoryStance: string;
  };
}
```

> **Entrance motion** (matching the reference): `entrance: "rise"` on the first brawler makes
> its first image slam up from the bottom of the frame with a violent multi-axis camera shake.
> `entrance: "slideLeft"` / `"slideRight"` on the second and third brawlers make their first
> image **overlap the previous character + background**: the intro Sequence has an explicit
> `zIndex` above the previous action pose and starts 14 frames early (Edgar F125, Crow F253).
> The new character + background grows from the bottom-center over the previous character
> (which stays visible around it), slowly filling the screen over ~34 eased frames so the
> overlap is clearly visible, then a damped vertical shake (the reference's slam-down/rebound
> dy oscillation) rocks the card into place. No horizontal slide.
> The action-pose "second image" is smooth — soft fade-in, slow sideways drift (alternating
> per brawler), a gentle low-frequency float, and a slow zoom, with no trembling sway.
> No watermark or title text is rendered.
