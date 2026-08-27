# Video Edit Plan - Project 12: Monkey Explains Qwen 3.8 Max vs Kimi K3 in 3 Mins!

This is the full blueprint for the Remotion composition. It includes scene-by-scene image, animation, SFX, and overlay mapping.

---

## Theme & Colors
| Property | Value |
|----------|-------|
| Theme | `flat-motion-graphics` |
| Background | `#FFFFFF` |
| Primary | `#F5820D` (Orange — Tech Monkey) |
| Accent | `#2D5FBF` (Cobalt Blue) |
| Surface | `#F9FAFB` |
| Text | `#000000` |
| Caption Highlight | `#F5820D` |

---

## Available SFX Catalog (from `projects/common_assets/sfx/`)
| SFX File | Use Case |
|----------|----------|
| `whoosh.mp3` | Fast movements, transitions, speed bursts |
| `error.mp3` | Failures, deaths, mistakes, bugs |
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
| `sticker` | Bouncy vector SVG overlay (e.g. up/down arrows, warning icons) |

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

### ACT 1 — THE JUNGLE LAB (00:00 – 00:29)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_01 | `[00:00]` – `[00:03]` | Imagine walking into a massive jung... | `[00-00]_Hand-drawn_2D_doo.jpg` | `zoom-in` | whoosh.mp3 @ 0.5 vol | `hero_title`: "QWEN 3.8 MAX vs KIMI K3" @ center |
| SCENE_02 | `[00:03]` – `[00:13]` | You want to translate a text, but i... | `[00-03]_Hand-drawn_2D_doo.jpg` | `pan-left` | — | `sticker`: "question_mark.svg" @ bottom-left (03s-08s)<br>`sticker`: "lightbulb.svg" @ bottom-right (08s-13s) |
| SCENE_03 | `[00:13]` – `[00:16]` | That is exactly how Kimi K3 works.... | `[00-13]_Hand-drawn_2D_doo.jpg` | `none` | chime.mp3 @ 0.5 vol | — |
| SCENE_04 | `[00:16]` – `[00:19]` | It is a massive Mixture-of-Experts ... | `[00-16]_Hand-drawn_2D_doo.jpg` | `none` | pop.mp3 @ 0.4 vol | — |
| SCENE_05 | `[00:19]` – `[00:24]` | But does it actually beat Alibaba's... | `[00-19]_Hand-drawn_2D_doo.jpg` | `none` | riser.mp3 @ 0.3 vol | — |
| SCENE_06 | `[00:24]` – `[00:29]` | Let us break down these two brand n... | `[00-24]_Hand-drawn_2D_doo.jpg` | `zoom-out` | clock-ticking.mp3 @ 0.4 vol | `section_title`: "THE DUEL" / "3-Minute Breakdown" |

### ACT 2 — MODEL SIZE (00:29 – 00:54)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_07 | `[00:29]` – `[00:32]` | First, let us look at their size.... | `[00-29]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_08 | `[00:32]` – `[00:37]` | Kimi K3 is an absolute monster with... | `[00-32]_Hand-drawn_2D_doo.jpg` | `zoom-in` | pop.mp3 @ 0.4 vol | `stat_reveal`: "2.8 Trillion" / "Parameters" @ bottom-right |
| SCENE_09 | `[00:37]` – `[00:42]` | Qwen 3.8 Max is slightly smaller, c... | `[00-37]_Hand-drawn_2D_doo.jpg` | `none` | pop.mp3 @ 0.4 vol | `stat_reveal`: "2.4 Trillion" / "Parameters" @ bottom-right |
| SCENE_10 | `[00:42]` – `[00:44]` | But wait, why does size matter?... | `[00-42]_Hand-drawn_2D_doo.jpg` | `none` | anime-wow.mp3 @ 0.4 vol | — |
| SCENE_11 | `[00:44]` – `[00:49]` | More parameters mean the model can ... | `[00-44]_Hand-drawn_2D_doo.jpg` | `ken-burns` | — | — |
| SCENE_12 | `[00:49]` – `[00:53]` | However, running a model this big i... | `[00-49]_Hand-drawn_2D_doo.jpg` | `none` | error.mp3 @ 0.5 vol | `sticker`: "warning.svg" @ bottom-right |
| SCENE_13 | `[00:53]` – `[00:54]` | How do they keep it fast and cheap?... | `[00-53]_Hand-drawn_2D_doo.jpg` | `none` | — | — |

### ACT 3 — MIXTURE OF EXPERTS (00:54 – 01:28)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_14 | `[00:54]` – `[00:59]` | They use a trick called Mixture-of-... | `[00-54]_Hand-drawn_2D_doo.jpg` | `none` | chime.mp3 @ 0.4 vol | `section_title`: "THE SECRET" / "Mixture-of-Experts" |
| SCENE_15 | `[00:59]` – `[01:00]` | Think of it like this.... | `[00-59]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_16 | `[01:00]` – `[01:07]` | When you ask Kimi K3 a question, it... | `[01-00]_Hand-drawn_2D_doo.jpg` | `pan-left` | — | — |
| SCENE_17 | `[01:07]` – `[01:11]` | It only activates the sixteen best ... | `[01-07]_Hand-drawn_2D_doo.jpg` | `zoom-in` | pop.mp3 @ 0.4 vol | `stat_reveal`: "16 / 896" / "Active Experts" @ bottom-right |
| SCENE_18 | `[01:11]` – `[01:14]` | That keeps it fast and energy-effic... | `[01-11]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_19 | `[01:14]` – `[01:21]` | Plus, Moonshot AI introduced two se... | `[01-14]_Hand-drawn_2D_doo.jpg` | `none` | notification.mp3 @ 0.4 vol | `section_title`: "INNOVATION" / "KDA & AttnRes" |
| SCENE_20 | `[01:21]` – `[01:27]` | These tricks make Kimi K3 two point... | `[01-21]_Hand-drawn_2D_doo.jpg` | `zoom-in` | pop.mp3 @ 0.4 vol | `stat_reveal`: "2.5x" / "Efficiency Boost" @ center |
| SCENE_21 | `[01:27]` – `[01:29]` | Isn't that a massive leap?... | `[01-27]_Hand-drawn_2D_doo.jpg` | `none` | anime-wow.mp3 @ 0.4 vol | `sticker`: "up_arrow.svg" @ bottom-left |

### ACT 4 — ALIBABA'S BEAST (01:28 – 01:55)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_22 | `[01:29]` – `[01:30]` | What about Alibaba's Qwen 3.8 Max?... | `[01-29]_Hand-drawn_2D_doo.jpg` | `none` | — | `section_title`: "ALIBABA'S PLAY" / "Qwen 3.8 Max" |
| SCENE_23 | `[01:30]` – `[01:42]` | Alibaba has not shared its exact ex... | `[01-30]_Hand-drawn_2D_doo.jpg` | `ken-burns` | — | `sticker`: "warning.svg" @ bottom-left (30s-36s)<br>`sticker`: "lightbulb.svg" @ bottom-right (36s-42s) |
| SCENE_24 | `[01:42]` – `[01:47]` | In early testing, Alibaba ranks it ... | `[01-42]_Hand-drawn_2D_doo.jpg` | `none` | pop.mp3 @ 0.4 vol | `stat_reveal`: "#2 Rank" / "Below Claude 5 Fable" @ bottom-right |
| SCENE_25 | `[01:47]` – `[01:50]` | Both models have a massive one mill... | `[01-47]_Hand-drawn_2D_doo.jpg` | `zoom-out` | notification.mp3 @ 0.4 vol | `stat_reveal`: "1M Tokens" / "Context Window" @ bottom-right |
| SCENE_26 | `[01:50]` – `[01:55]` | That is like handing them a thousan... | `[01-50]_Hand-drawn_2D_doo.jpg` | `none` | clock-ticking.mp3 @ 0.4 vol | — |

### ACT 5 — THE PRICING WAR (01:55 – 02:22)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_27 | `[01:55]` – `[01:58]` | But Kimi K3 has an insane pricing a... | `[01-55]_Hand-drawn_2D_doo.jpg` | `none` | whoosh.mp3 @ 0.4 vol | `section_title`: "THE PRICING WAR" / "Cost Breakdown" |
| SCENE_28 | `[01:58]` – `[02:05]` | If you ask it a question about a do... | `[01-58]_Hand-drawn_2D_doo.jpg` | `pan-right` | — | — |
| SCENE_29 | `[02:05]` – `[02:11]` | This cache hit gets you a ninety pe... | `[02-05]_Hand-drawn_2D_doo.jpg` | `zoom-in` | pop.mp3 @ 0.4 vol | `stat_reveal`: "90% OFF" / "$0.30 per 1M" @ center<br>`sticker`: "red_down_arrow.svg" @ top-left |
| SCENE_30 | `[02:11]` – `[02:13]` | For new questions, it costs three d... | `[02-11]_Hand-drawn_2D_doo.jpg` | `none` | pop.mp3 @ 0.4 vol | `stat_reveal`: "$3.00" / "Standard Price" @ bottom-right<br>`sticker`: "gold_coin.svg" @ bottom-left |
| SCENE_31 | `[02:13]` – `[02:19]` | Qwen 3.8 Max is currently in previe... | `[02-13]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_32 | `[02:19]` – `[02:22]` | So, which model wins the crown?... | `[02-19]_Hand-drawn_2D_doo.jpg` | `none` | riser.mp3 @ 0.4 vol | — |

### ACT 6 — THE CONCLUSION (02:22 – end)

| Scene | Timestamp | Narration | Image | Animation | SFX | Overlays |
|-------|-----------|-----------|-------|-----------|-----|----------|
| SCENE_33 | `[02:22]` – `[02:27]` | If you need long-horizon coding or ... | `[02-22]_Hand-drawn_2D_doo.jpg` | `zoom-in` | chime.mp3 @ 0.4 vol | `section_title`: "KIMI K3" / "Coding Champion" @ top-left<br>`sticker`: "green_checkmark.svg" @ bottom-right |
| SCENE_34 | `[02:27]` – `[02:34]` | If you need a multi-modal agent to ... | `[02-27]_Hand-drawn_2D_doo.jpg` | `zoom-in` | chime.mp3 @ 0.4 vol | `section_title`: "QWEN 3.8 MAX" / "Multimodal Champion" @ top-left<br>`sticker`: "green_checkmark.svg" @ bottom-right |
| SCENE_35 | `[02:34]` – `[02:36]` | Both models are changing the game.... | `[02-34]_Hand-drawn_2D_doo.jpg` | `none` | — | — |
| SCENE_36 | `[02:36]` – `[02:40]` | Which one will you try first?... | `[02-36]_Hand-drawn_2D_doo.jpg` | `none` | ping.mp3 @ 0.5 vol | `sticker`: "question_mark.svg" @ top-right |
