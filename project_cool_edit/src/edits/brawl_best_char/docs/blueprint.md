# Technical Blueprint: Brawl Stars Best Character Edit (`brawl_best_char`)

## Overview

The `brawl_best_char` edit is a vertical 9:16 Short recreating the exact frame pacing, beats, shakes, text pops, and visual cuts of `best_character.mp4`.

## Source of Truth Analyzed Data

Analysis file location:
`analysis/best_character/edit_analysis.json`

## Remotion Sequence & Frame Schedule (30 FPS)

```tsx
<Composition
  id="BrawlBestChar"
  component={BrawlBestCharTemplate}
  durationInFrames={377}
  fps={30}
  width={720}
  height={1280}
/>
```

| Frame Range | Timestamp Range | Event / Component | Action / VFX |
| :--- | :--- | :--- | :--- |
| `0 → 64` | `0.00s → 2.13s` | `<IntroHook>` | Text pop `"THE BEST BRAWLER"`, radial zoom `1.0 → 1.05`, impact shake at F33 |
| `64 → 96` | `2.13s → 3.20s` | `<ContenderCard brawler="mortis">` | Hard cut onto Mortis artwork, text `"MORTIS?"` at F75 |
| `96 → 127` | `3.20s → 4.23s` | `<ContenderCard brawler="edgar">` | Hard cut onto Edgar artwork, shake at F96, text `"EDGAR?"` at F105 |
| `127 → 159` | `4.23s → 5.30s` | `<ContenderCard brawler="crow">` | Hard cut onto Crow artwork, text `"CROW?"` at F135 |
| `159 → 189` | `5.30s → 6.30s` | `<ContenderCard brawler="kit">` | Hard cut onto Kit artwork, shake at F180 & F186 |
| `189 → 222` | `6.30s → 7.40s` | `<ContenderCard brawler="melodie">` | Hard cut onto Melodie artwork, text `"MELODIE?"` at F195 |
| `222 → 313` | `7.40s → 10.43s` | `<ContenderCard brawler="leon">` | Hard cut onto Leon artwork, text `"LEON?"` at F255 |
| `313 → 377` | `10.43s → 12.56s` | `<WinnerReveal brawler="kenji">` | Climax hard cut, massive screen shake at F313 `[intensity: 0.95]`, gold text `"OFC IT'S KENJI 👑"` at F330 |

## Source Code Integration Example

```tsx
import editAnalysis from "../../../analysis/best_character/edit_analysis.json";
import { getBeatFrame, getEventsAtFrame } from "../../../../project_video_analyze/remotion/editAnalysisLoader";
```
