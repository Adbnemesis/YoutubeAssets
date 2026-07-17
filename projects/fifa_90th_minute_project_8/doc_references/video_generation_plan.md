# Project 8: Video Generation & Editing Plan

This document outlines the editing, animation, and sound design decisions for the Remotion video build.

## 1. Visual Theme
- **Theme Style:** Whiteboard hand-drawn doodle animation (`flat-motion-graphics` with custom overrides).
- **Backgrounds:** Flat clean white (`#FFFFFF`) to match the whiteboard doodle artwork.
- **Text & Captions:** Cobalt blue accent highlights and red markers (`#F5820D` orange highlights, `#2D5FBF` primary colors).

## 2. Animation & Transitions Plan
Per instructions, motion effects (like Ken Burns zooms/diagonal pans) are applied **ONLY** to scenes showing for 4.0 seconds or longer. Shorter scenes remain static to maintain a crisp pacing.

### Key Ken Burns Animation Sequences (duration >= 4s):
- `[00:00] - [00:05]` (5.0s): Argentina defies odds to reach final. (Gentle zoom-in)
- `[00:07] - [00:11]` (4.0s): Screamed as they defeated Egypt and England. (Parallax/pan)
- `[00:11] - [00:15]` (4.0s): Real reason is far stranger than tactics. (Ken Burns slow zoom)
- `[00:20] - [00:25]` (5.0s): Why does the mind wait until brink of disaster? (Gentle zoom-out)
- `[00:27] - [00:32]` (5.0s): Argentina trailing 2-0 to Egypt in 78th. (Ken Burns slow zoom)
- `[00:35] - [00:40]` (5.0s): Egyptian goalkeeper saves Messi's penalty. (Gentle pan-right)
- `[00:55] - [01:00]` (5.0s): How did they score 3 times in 13 minutes? (Gentle zoom-in)
- `[01:00] - [01:04]` (4.0s): Theory proposed by Dr. Samuele Marcora. (Gentle zoom-out)
- `[01:07] - [01:11]` (4.0s): Muscles do not actually stop you when tired. (Gentle pan-left)
- `[01:11] - [01:15]` (4.0s): Brain acts as a central governor. (Ken Burns slow zoom)
- `[01:15] - [01:20]` (5.0s): Monitors effort and creates feeling of fatigue. (Gentle zoom-in)
- `[01:20] - [01:24]` (4.0s): If you have a powerful reason, brain recalculates. (Gentle zoom-out)
- `[01:27] - [01:33]` (6.0s): Unlock chemical override in Argentine players? (Ken Burns slow zoom)
- `[01:44] - [01:48]` (4.0s): Lautaro Martínez scores winning goal. (Gentle pan-right)
- `[01:53] - [01:57]` (4.0s): Geir Jordet studying elite soccer players. (Gentle zoom-in)
- `[01:57] - [02:03]` (6.0s): Jordet discovered cognitive tunnel vision under stress. (Gentle zoom-out)
- `[02:09] - [02:13]` (4.0s): Scan the field more frequently in final seconds. (Ken Burns slow zoom)
- `[02:13] - [02:18]` (5.0s): How does brain maintain visual control? (Gentle zoom-in)
- `[02:21] - [02:25]` (4.0s): Dr. Christian Swann flow vs clutch states. (Gentle zoom-out)
- `[02:33] - [02:37]` (4.0s): Clutch state is deliberate and intense. (Gentle zoom-in)
- `[02:53] - [02:55]` (4.0s): Evolutionary mirror of your own history. (Gentle zoom-out)
- `[02:58] - [03:02]` (4.0s): Ancestors did not hunt when fresh, but starving. (Gentle zoom-in)
- `[03:04] - [03:09]` (5.0s): Survival depended on running down prey. (Ken Burns slow zoom)
- `[03:09] - [03:13]` (4.0s): Brain evolved to deliver max performance when desperate. (Gentle zoom-out)
- `[03:13] - [03:17]` (4.0s): When you face a deadline/crisis, brain taps this. (Gentle zoom-in)
- `[03:17] - [03:21]` (4.0s): Find focus when all hope seems lost. (Gentle zoom-out)
- `[03:21] - [03:25]` (4.0s): Succeed only when failure is the only other option? (Ken Burns slow zoom)
- `[03:25] - [03:31]` (6.0s): Watching Argentina defeat rivals is deep evolution. (Gentle zoom-in)
- `[03:34] - [03:39]` (5.0s): Same brain that saved ancestors is winning World Cup. (Gentle zoom-out)
- `[03:39] - [03:45]` (6.2s): Defying all odds to reach final. (Ken Burns slow zoom)

## 3. Captions Overlay
- Word-by-word highlighted captions derived from the raw whisper transcription (`voiceover_transcript.json`).
- Rendered using Space Grotesk bold font, styled at the bottom-center of the screen.

## 4. Sound Design & SFX
Subtle punctuations using common assets to emphasize transitions, events, and key milestones:
- **00:00**: `impact-bass-1.mp3` — Opening Hook
- **00:07**: `whoosh-cinematic.mp3` — "defeated Egypt and England"
- **00:17**: `impact-bass-2.mp3` — "biological hijack of the human brain"
- **00:27**: `click.mp3` — Scoreboard display EGY 2 - ARG 0
- **00:35**: `error.mp3` — Messi penalty saved
- **00:46**: `whoosh-short.mp3` — Romero goal scored
- **00:49**: `pop.mp3` — Messi equalizer
- **00:52**: `impact-bass-1.mp3` — Enzo Fernandez winner
- **01:10**: `notification.mp3` — Central governor fatigue alert
- **01:24**: `cash-register.mp3` — Safety reserves vault open
- **01:36**: `click.mp3` — England trailed scoreboard display
- **01:41**: `whoosh-short.mp3` — Enzo equalizer
- **01:44**: `impact-bass-1.mp3` — Lautaro winner
- **01:57**: `glitch-2.mp3` — "cognitive tunnel vision"
- **02:03**: `error.mp3` — "eyes freeze"
- **02:13**: `impact-bass-2.mp3` — Panic storm visual
- **02:30**: `clock-ticking.mp3` — Clutch state mountain climb
- **02:56**: `whoosh-cinematic.mp3` — Prehistoric mammoth hunt starts
- **03:09**: `impact-bass-2.mp3` — Desperation force flexing
- **03:13**: `typing.mp3` — Modern stick figure typing under deadline
- **03:21**: `chime.mp3` — Success scale tipping
- **03:39**: `sparkle.mp3` — Closing shot viewer on couch smiling
