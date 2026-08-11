# Monster Trio Edit Blueprint (`monster_trio`)

Reference Video: `src/edits/monster_trio/references/monster_trio.mp4`

## 📊 Reference Video Technical Specification

| Property | Value |
| :--- | :--- |
| **Resolution** | 1080x1080 (Square 1:1) |
| **Frame Rate** | 60.0 fps |
| **Total Frames** | 525 frames (8.824s) |
| **Total Scene Transitions** | 19 distinct scene boundaries (scenes.json) |
| **Audio BPM** | ~85.24 BPM (High-Tempo Phonk Edit) |
| **Pacing Style** | 3-Part Character Sequence (Dark Strobe -> Spotlight -> Action Stance) + Rapid Climax Finale |

---

## 🎬 19-Scene Structure Breakdown (extracted by `project_video_analyze`)

```text
Scene 1:  F000 - F043 (44f) -> Intro Logo Hook ("KAGE")
Scene 2:  F044 - F059 (16f) -> Brawler 1 Dark Strobe 1a (Purple `#a855f7`)
Scene 3:  F060 - F075 (16f) -> Brawler 1 Dark Strobe 1b
Scene 4:  F076 - F138 (63f) -> Brawler 1 Main Card Spotlight ("MORTIS")
Scene 5:  F139 - F170 (32f) -> Brawler 1 Secondary Action Stance
Scene 6:  F171 - F186 (16f) -> Brawler 2 Dark Strobe 2a (Red `#ef4444`)
Scene 7:  F187 - F203 (17f) -> Brawler 2 Dark Strobe 2b
Scene 8:  F204 - F264 (61f) -> Brawler 2 Main Card Spotlight ("EDGAR")
Scene 9:  F265 - F298 (34f) -> Brawler 2 Secondary Action Stance
Scene 10: F299 - F314 (16f) -> Brawler 3 Dark Strobe 3a (Blue `#3b82f6`)
Scene 11: F315 - F331 (17f) -> Brawler 3 Dark Strobe 3b
Scene 12: F332 - F394 (63f) -> Brawler 3 Main Card Spotlight ("CROW")
Scene 13: F395 - F411 (17f) -> Brawler 3 Action Stance Variant 1
Scene 14: F412 - F427 (16f) -> Brawler 3 Action Stance Variant 2
Scene 15: F428 - F443 (16f) -> Climax Transition
Scene 16: F444 - F459 (16f) -> Climax Rapid Cut 1 ("MONSTER TRIO 👑")
Scene 17: F460 - F474 (15f) -> Climax Rapid Cut 2
Scene 18: F475 - F490 (16f) -> Climax Rapid Cut 3
Scene 19: F491 - F524 (34f) -> Final Victory Stance & Flash Out
```

---

## 🎨 Remotion Component Rules

1. **3-Part Brawler Rhythmic Sequence**: Each of the 3 brawlers MUST follow the sequence:
   - **Dark Radial Strobe**: ~32 frames (`F44-F75`, `F171-F203`, `F299-F331`) with background glow in brawler's accent color.
   - **Main Card Spotlight**: ~63 frames (`F76-F138`, `F204-F264`, `F332-F394`) with brawler name text pop.
   - **Secondary Action Stance**: ~32 frames (`F139-F170`, `F265-F298`, `F412-F443`).

2. **Rapid Climax Finale**: Frames `F444 -> F524` must cut rapidly every 15-16 frames across 4 panels, displaying the gold title text `"MONSTER TRIO 👑"` and ending on a victory stance.
