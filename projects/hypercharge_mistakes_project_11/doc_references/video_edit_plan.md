# Video Edit Plan - Project 11: Every Mistake Players Make with Hypercharge

This is the full blueprint for the Remotion composition. It includes scene-by-scene image, animation, SFX, and overlay mapping.

---

## Theme & Colors
| Property | Value |
|----------|-------|
| Theme | `flat-motion-graphics` |
| Background | `#FFFFFF` |
| Primary | `#7C3AED` (Purple — Hypercharge) |
| Accent | `#EC4899` (Pink) |
| Surface | `#F9FAFB` |
| Text | `#000000` |
| Caption Highlight | `#7C3AED` |

---

## Available SFX Catalog (from `projects/common_assets/sfx/`)
| SFX File | Use Case |
|----------|----------|
| `whoosh.mp3` | Fast movements, transitions, speed bursts |
| `error.mp3` | Failures, deaths, mistakes |
| `pop.mp3` | Card/bubble reveals, stat pop-ups |
| `riser.mp3` | Tension buildup, suspense |
| `chime.mp3` | Bright ideas, realizations |
| `ping.mp3` | End screen, conclusions |
| `anime-wow.mp3` | Comedic surprises |
| `notification.mp3` | Smartphone pings, app reveals |
| `clock-ticking.mp3` | Time pressure, countdowns |

---

## Available Remotion Overlay Types
| Overlay Type | Description |
|--------------|-------------|
| `section_title` | Animated accent bar + title text (top-left/bottom-left/center) |
| `stat_reveal` | Bouncy number reveal with glow (bottom-right/center/right) |
| `hero_title` | Full-screen cinematic title |

---

## Available Remotion Animations
| Animation | Description |
|-----------|-------------|
| `none` | Static display |
| `zoom-in` | Gradual zoom toward center |
| `zoom-out` | Gradual zoom away from center |
| `ken-burns` | Cinematic zoom + diagonal drift |
| `pan-left` | Horizontal pan left |
| `pan-right` | Horizontal pan right |
| `parallax` | Subtle vertical parallax |

---

## Scene-by-Scene Edit Plan

### ACT 1 — THE TRAP (00:00 – 00:18)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_01 | `[00:00]` – `[00:06]` | You press the purple button... | `[00-00]_Hand-drawn_2D_doo.jpg` | `zoom-in` | `whoosh.mp3` @ 0.5 vol | — |
| SCENE_02 | `[00:06]` – `[00:09]` | Two seconds later, respawn screen | `[00-06]_Hand-drawn_2D_doo.jpg` | `none` | `error.mp3` @ 0.6 vol | — |
| SCENE_03 | `[00:09]` – `[00:10]` | Why does this happen? | `[00-09]_Hand-drawn_2D_doo.jpg` | `none` | `pop.mp3` @ 0.4 vol | — |
| SCENE_04 | `[00:10]` – `[00:14]` | Most common mistake... invincible | `[00-10]_Hand-drawn_2D_doo.jpg` | `ken-burns` | `riser.mp3` @ 0.3 vol | `section_title`: "MISTAKE #1" / "The Invincibility Myth" |
| SCENE_05 | `[00:14]` – `[00:18]` | Easiest way to throw a game | `[00-14]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_06 | `[00:18]` – `[00:20]` | Let us look at the math | `[00-18]_Hand-drawn_2D_doo.jpg` | `none` | — | — |

### ACT 2 — THE MATH (00:20 – 00:38)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_07 | `[00:20]` – `[00:23]` | Level 11 Edgar has 6600 health | `[00-20]_Hand-drawn_2D_doo.jpg` | `none` | `pop.mp3` @ 0.4 vol | `stat_reveal`: "6,600 HP" / "Edgar Base Health" @ bottom-right |
| SCENE_08 | `[00:23]` – `[00:27]` | 15% shield | `[00-23]_Hand-drawn_2D_doo.jpg` | `none` | `pop.mp3` @ 0.4 vol | `stat_reveal`: "+15%" / "Shield Bonus" @ bottom-right |
| SCENE_09 | `[00:27]` – `[00:31]` | Effective health to 7764 | `[00-27]_Hand-drawn_2D_doo.jpg` | `none` | `pop.mp3` @ 0.4 vol | `stat_reveal`: "7,764 HP" / "Effective Health" @ bottom-right |
| SCENE_10 | `[00:31]` – `[00:34]` | Less than one extra shot from Piper | `[00-31]_Hand-drawn_2D_doo.jpg` | `none` | `anime-wow.mp3` @ 0.5 vol | — |
| SCENE_11 | `[00:34]` – `[00:37]` | Not an unstoppable force | `[00-34]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_12 | `[00:37]` – `[00:39]` | Just a purple target | `[00-37]_Hand-drawn_2D_doo.jpg` | `none` | `error.mp3` @ 0.4 vol | — |

### ACT 3 — TUNNEL VISION (00:39 – 00:55)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_13 | `[00:39]` – `[00:43]` | Second major mistake: tunnel vision | `[00-39]_Hand-drawn_2D_doo.jpg` | `none` | `notification.mp3` @ 0.4 vol | `section_title`: "MISTAKE #2" / "Tunnel Vision" |
| SCENE_14 | `[00:43]` – `[00:46]` | Stop playing tactically | `[00-43]_Hand-drawn_2D_doo.jpg` | `none` | `error.mp3` @ 0.4 vol | — |
| SCENE_15 | `[00:46]` – `[00:52]` | Stop using walls, stop dodging... | `[00-46]_Hand-drawn_2D_doo.jpg` | `zoom-out` | — | — |
| SCENE_16 | `[00:52]` – `[00:56]` | Why waste the most powerful part? | `[00-52]_Hand-drawn_2D_doo.jpg` | `none` | — | — |

### ACT 4 — SPEED BOOST (00:56 – 01:11)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_17 | `[00:56]` – `[01:02]` | Massive speed boost, 20%–26% | `[00-56]_Hand-drawn_2D_doo.jpg` | `zoom-in` | `whoosh.mp3` @ 0.5 vol | `stat_reveal`: "20–26%" / "Speed Boost" @ center |
| SCENE_18 | `[01:02]` – `[01:09]` | Position yourself, bait gadgets, waste ammo | `[01-02]_Hand-drawn_2D_doo.jpg` | `ken-burns` | — | `section_title`: "THE FIX" / "Use Speed First" |
| SCENE_19 | `[01:09]` – `[01:11]` | Once defenseless, that is when you strike | `[01-09]_Hand-drawn_2D_doo.jpg` | `none` | `chime.mp3` @ 0.5 vol | — |

### ACT 5 — CHARGE LOCK (01:11 – 01:48)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_20 | `[01:11]` – `[01:14]` | Hidden mechanic | `[01-11]_Hand-drawn_2D_doo.jpg` | `none` | `pop.mp3` @ 0.5 vol | `section_title`: "MISTAKE #3" / "Hidden Mechanic" |
| SCENE_21 | `[01:14]` – `[01:17]` | Hypercharge charge lock | `[01-14]_Hand-drawn_2D_doo.jpg` | `none` | `riser.mp3` @ 0.3 vol | `stat_reveal`: "CHARGE LOCK" / "Hidden Mechanic" @ center |
| SCENE_22 | `[01:17]` – `[01:21]` | Charges at 40% of regular rate | `[01-17]_Hand-drawn_2D_doo.jpg` | `ken-burns` | — | `stat_reveal`: "40%" / "Super Charge Rate" @ bottom-right |
| SCENE_23 | `[01:21]` – `[01:26]` | Damage doesn't contribute | `[01-21]_Hand-drawn_2D_doo.jpg` | `zoom-in` | — | — |
| SCENE_24 | `[01:26]` – `[01:28]` | Meter is completely locked | `[01-26]_Hand-drawn_2D_doo.jpg` | `none` | `error.mp3` @ 0.5 vol | — |
| SCENE_25 | `[01:28]` – `[01:35]` | Zero progress toward next Hypercharge | `[01-28]_Hand-drawn_2D_doo.jpg` | `zoom-out` | — | `stat_reveal`: "0%" / "Progress While Active" @ center |
| SCENE_26 | `[01:35]` – `[01:40]` | Charge Super before activating | `[01-35]_Hand-drawn_2D_doo.jpg` | `ken-burns` | `chime.mp3` @ 0.4 vol | `section_title`: "PRO TIP" / "Charge First, Activate Second" |
| SCENE_27 | `[01:40]` – `[01:48]` | Use upgraded Super immediately | `[01-40]_Hand-drawn_2D_doo.jpg` | `pan-right` | — | — |

### ACT 6 — COUNTER-PLAY (01:48 – 02:07)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_28 | `[01:48]` – `[01:50]` | Learn to play against Hypercharge | `[01-48]_Hand-drawn_2D_doo.jpg` | `none` | `whoosh.mp3` @ 0.4 vol | `section_title`: "COUNTER-PLAY" / "vs Hypercharge" |
| SCENE_29 | `[01:50]` – `[01:54]` | Retreat when you see purple | `[01-50]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_30 | `[01:54]` – `[01:57]` | Hypercharge lasts only 5 seconds | `[01-54]_Hand-drawn_2D_doo.jpg` | `none` | `clock-ticking.mp3` @ 0.4 vol | `stat_reveal`: "5s" / "Hypercharge Duration" @ bottom-right |
| SCENE_31 | `[01:57]` – `[02:03]` | Use knockbacks, stuns, walls | `[01-57]_Hand-drawn_2D_doo.jpg` | `pan-left` | — | — |
| SCENE_32 | `[02:03]` – `[02:07]` | 5000-coin deficit for enemy | `[02-03]_Hand-drawn_2D_doo.jpg` | `none` | `anime-wow.mp3` @ 0.5 vol | `stat_reveal`: "5,000 🪙" / "Wasted Enemy Investment" @ center |

### ACT 7 — CONCLUSION (02:07 – 02:24)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_33 | `[02:07]` – `[02:12]` | Positioning tool first, damage second | `[02-07]_Hand-drawn_2D_doo.jpg` | `ken-burns` | `chime.mp3` @ 0.4 vol | — |
| SCENE_34 | `[02:12]` – `[02:18]` | Take space, wait for panic, value play | `[02-12]_Hand-drawn_2D_doo.jpg` | `zoom-in` | — | — |
| SCENE_35 | `[02:18]` – `[02:24]` | Subscribe and watch next video | `[02-18]_Hand-drawn_2D_doo.jpg` | `zoom-out` | `ping.mp3` @ 0.5 vol | `section_title`: "SUBSCRIBE" / "More Hidden Mechanics" |

---

## Overlays Summary

| Overlay | Type | Timestamp | Text | Subtitle | Position | Accent Color |
|---------|------|-----------|------|----------|----------|-------------|
| OVL_01 | `section_title` | 00:10 – 00:14 | MISTAKE #1 | The Invincibility Myth | top-left | `#EF4444` |
| OVL_02 | `stat_reveal` | 00:20 – 00:23 | 6,600 HP | Edgar Base Health | bottom-right | `#7C3AED` |
| OVL_03 | `stat_reveal` | 00:23 – 00:27 | +15% | Shield Bonus | bottom-right | `#10B981` |
| OVL_04 | `stat_reveal` | 00:27 – 00:31 | 7,764 HP | Effective Health | bottom-right | `#F59E0B` |
| OVL_05 | `section_title` | 00:39 – 00:43 | MISTAKE #2 | Tunnel Vision | top-left | `#EF4444` |
| OVL_06 | `stat_reveal` | 00:56 – 01:02 | 20–26% | Speed Boost | center | `#06B6D4` |
| OVL_07 | `section_title` | 01:02 – 01:09 | THE FIX | Use Speed First | top-left | `#10B981` |
| OVL_08 | `section_title` | 01:11 – 01:14 | MISTAKE #3 | Hidden Mechanic | top-left | `#EF4444` |
| OVL_09 | `stat_reveal` | 01:14 – 01:17 | CHARGE LOCK | Hidden Mechanic | center | `#EF4444` |
| OVL_10 | `stat_reveal` | 01:17 – 01:21 | 40% | Super Charge Rate | bottom-right | `#F59E0B` |
| OVL_11 | `stat_reveal` | 01:28 – 01:35 | 0% | Progress While Active | center | `#EF4444` |
| OVL_12 | `section_title` | 01:35 – 01:40 | PRO TIP | Charge First, Activate Second | top-left | `#10B981` |
| OVL_13 | `section_title` | 01:48 – 01:50 | COUNTER-PLAY | vs Hypercharge | top-left | `#06B6D4` |
| OVL_14 | `stat_reveal` | 01:54 – 01:57 | 5s | Hypercharge Duration | bottom-right | `#F59E0B` |
| OVL_15 | `stat_reveal` | 02:03 – 02:07 | 5,000 🪙 | Wasted Enemy Investment | center | `#EC4899` |
| OVL_16 | `section_title` | 02:18 – 02:24 | SUBSCRIBE | More Hidden Mechanics | top-left | `#7C3AED` |

---

## SFX Summary

| Scene | Timestamp | SFX File | Volume | Rationale |
|-------|-----------|----------|--------|-----------|
| SCENE_01 | 00:00 | `whoosh.mp3` | 0.5 | Intro slide whoosh |
| SCENE_02 | 00:06 | `error.mp3` | 0.6 | Respawn death |
| SCENE_03 | 00:09 | `pop.mp3` | 0.4 | Question bubble |
| SCENE_04 | 00:10 | `riser.mp3` | 0.3 | Mistake buildup tension |
| SCENE_07 | 00:20 | `pop.mp3` | 0.4 | Stat card reveal |
| SCENE_08 | 00:23 | `pop.mp3` | 0.4 | Shield stat pop |
| SCENE_09 | 00:27 | `pop.mp3` | 0.4 | Effective HP pop |
| SCENE_10 | 00:31 | `anime-wow.mp3` | 0.5 | Comedic "less than one shot" |
| SCENE_12 | 00:37 | `error.mp3` | 0.4 | "Purple target" failure |
| SCENE_13 | 00:39 | `notification.mp3` | 0.4 | Mistake #2 card reveal |
| SCENE_14 | 00:43 | `error.mp3` | 0.4 | Tactical failure |
| SCENE_17 | 00:56 | `whoosh.mp3` | 0.5 | Speed boost whoosh |
| SCENE_19 | 01:09 | `chime.mp3` | 0.5 | "Strike" realization |
| SCENE_20 | 01:11 | `pop.mp3` | 0.5 | Hidden mechanic reveal |
| SCENE_21 | 01:14 | `riser.mp3` | 0.3 | Charge lock tension |
| SCENE_24 | 01:26 | `error.mp3` | 0.5 | Locked meter |
| SCENE_26 | 01:35 | `chime.mp3` | 0.4 | Pro tip realization |
| SCENE_28 | 01:48 | `whoosh.mp3` | 0.4 | Counter-play transition |
| SCENE_30 | 01:54 | `clock-ticking.mp3` | 0.4 | 5 second countdown |
| SCENE_32 | 02:03 | `anime-wow.mp3` | 0.5 | 5000-coin comedic reveal |
| SCENE_33 | 02:07 | `chime.mp3` | 0.4 | Conclusion realization |
| SCENE_35 | 02:18 | `ping.mp3` | 0.5 | Subscribe end screen |
