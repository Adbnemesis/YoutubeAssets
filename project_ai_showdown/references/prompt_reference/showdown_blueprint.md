# 🎭 The AI Showdown - Prompt Blueprint & Episode Architecture

## 1. Episode Directory Naming Convention

Every YouTube video project folder lives under `project_ai_showdown/episodes/` and follows this exact naming pattern:

```text
episodes/ep{ep_number:02d}_{short_topic_slug}/
```

---

## 2. Required Assets inside Each Episode Package

Inside each episode directory, the automated pipeline maintains these standard assets:

1. **`script.json`**: Structured dialogue JSON with speaker names, roles, vote targets, and speech strings.
2. **`transcript.txt`**: Clean, readable text transcript of the episode.
3. **`metadata.txt`**: YouTube title, description, tags, hashtags, and thumbnail prompts.
4. **`video_plan.md`**: Visual beat plan, scene breakdown, and camera directives.
5. **`audio/`**: Generated TTS character dialogue audio files (`turn_01_narrator.wav`, `turn_02_claude.wav`, etc.).
6. **`final_video.mp4`**: Final rendered 1080p MP4 output video.

---

## 3. Modular Character & Audio Guidelines

- **Voices**: Powered by Edge-TTS neural speech synthesis with fast-paced silence trimming (`silenceremove` filter). Host/Narrator uses unified `en-US-ChristopherNeural`.
- **Roster Alignment**: Dynamic sidebar roster automatically filters to show only the participating AI characters in the script.
- **Speech Bubbles & Subtitles**: Fixed 540x180 speech bubble with 15-word paged refresh and active karaoke word highlight (`#EF4444`).

---

## 4. Visual Overlays, SFX & Stage Motion

- **Turn Transition Whip SFX**: `sfx/whoosh.mp3` with 0.85 -> 1.0 spring pop scale and horizontal slide.
- **Dynamic Vote Badges & Pop SFX**: `🗳️ N Votes` badge dynamically updates on target's roster card with `sfx/pop.mp3`. Reset per round.
- **Elimination Overlays**: Red `ELIMINATED!` stamp overlay drops onto stage with `sfx/error.mp3` and grayscaled roster status.
- **Stage Presence**: Host Narrator stands solo on stage during host turns; AI contestants pop in on left when speaking.

---

## 5. Composition Isolation & Meme Timing Rules (`meme_guide.md`)

- **Separate Episode Compositions**: Create a dedicated file for each episode (e.g. `remotion-composer/src/compositions/Ep02VoteSomeoneOutComposition.tsx`) to isolate episode-specific timeline code.
- **Meme Reaction Structure**: Follow `setup → punchline → meme reaction → return to flow`.
- **Audio Breathing Pauses**: Standalone 30–45 frame timeline gaps let meme reaction graphics (`savage_roast.svg`, `plot_twist.svg`, `emotional_damage.svg`, SpongeBob time card) and audio SFX (`bruh.mp3`, `anime-wow.mp3`, `fahhh.mp3`) land cleanly without clashing with dialogue.

---

## 6. YouTube Monetization & Content Authenticity SOP

1. **Avoid Inauthentic Content Flag**: Content relies on custom vector animations, dynamic vote tracking overlays, interactive elimination stamps, and custom prompt logic.
2. **Audio Acting Differentiation**: Each character uses custom pitch (`-4Hz` to `+4Hz`) and speed rate curves to guarantee distinct vocal personalities.
3. **Disclosure Rule**: Classified as unrealistic 2D vector animation; exempt from synthetic media disclosures while maintaining full YPP eligibility.
