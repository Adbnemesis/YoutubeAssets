# Technical Blueprint: Brawl Stars Best Character Edit (`brawl_best_char`)

## Overview

The `brawl_best_char` edit is a vertical 9:16 Short recreating the exact frame pacing, beats, shakes, text pops, background motion effects, and rapid multi-panel climax reveal of `best_character.mp4`.

## Visual Effects & Animation Requirements

1. **Intro Phase (`F0 → F64`)**:
   - Dual-layer text glow (`#8b5cf6` & `#ec4899`) with spring pop.
   - Moving manga speed lines backdrop + pulsating radial light pulse.
2. **Contender Phase (`F64 → F313`)**:
   - Animated background grid (moving diagonal lines).
   - White/RGB flash opacity burst on entrance frame.
   - Heavy neon text stroke + multi-stage glow (`"MORTIS?"`, `"EDGAR?"`, `"CROW?"`, etc.).
   - Continuous float/hover motion on brawler artwork.
3. **Climax Winner Reveal Phase (`F313 → F377`)**:
   - **Rapid Multi-Panel Cycle**: Cycle through 6 Kenji panels (`panel_1.png`, `panel_4.png`, `panel_6.png`, `panel_9.png`, `panel_12.png`, `panel_15.png`) every 2-3 frames between F313 and F330.
   - Gold particle radial burst + camera shake `[intensity: 1.0]`.
   - Gold winner text `"OFC IT'S KENJI 👑"` at F330 with drop-shadow glow.

## Props Schema Update (`props.ts`)

```typescript
export interface WinnerBrawler {
  id: string;
  name: string;
  announcementText: string;
  image: string;
  winnerPanels: string[]; // Rapid montage panel array
  accentColor: string;
  startFrame: number;
  endFrame: number;
}
```
