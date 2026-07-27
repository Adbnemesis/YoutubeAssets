# 🔥 The AI Showdown - Master Project Architecture & Episode SOP

Welcome to **The AI Showdown** repository! This project manages full end-to-end generation for 5-AI panel debate YouTube videos.

---

## 📁 Project Directory Structure

```text
project_ai_showdown/
├── common_assets/
│   ├── characters/          # React Chibi vector character components (ChibiAnimeModels.tsx, ChibiRoleCharacters.tsx)
│   ├── logos/               # Official brand logo emblems (original/)
│   ├── avatars/             # Avatar PNG/SVG graphics (#1 Claude to #7 Grok)
│   ├── sound_effects/       # Debate bell rings, buzzers, background music
│   ├── overlays/            # Rank badges (#1-#7), lower thirds, speaker highlights
│   └── backgrounds/         # Virtual debate stage backgrounds
├── references/
│   ├── prompt_reference/    # Character persona guides & blueprint specs
│   ├── video_plans/         # Storyboards, scene plans, video editing templates
│   └── topics_library.json  # Curated list of high-engagement video topics
├── episodes/                # Output folders for generated episodes
├── personas.json            # Ranked AI models & system prompts
├── run_ai_showdown.py       # Showdown engine generator script
└── EPISODE_PRODUCTION_DOCTRINE.md # Master episode production doctrine & SOP
```

---

## 🎬 Episode Production Standard Operating Procedure (SOP)

Every episode generated under `project_ai_showdown/episodes/<episode_id>/` conforms to the following production standards:

### 1. Required Episode Package Structure
```text
episodes/<episode_id>/
├── script.json         # Structured dialogue turns (speakers, roles, vote targets, text)
├── transcript.txt      # Clean readable text transcript
├── metadata.txt       # YouTube titles, description, tags, thumbnail prompts
├── video_plan.md       # Visual beat plan, scene breakdown, and camera directives
├── audio/              # Generated TTS dialogue audio files
└── final_video.mp4     # Rendered 1080p MP4 output video
```

### 2. Dynamic Roster & Brand Assets
- **Active Roster**: The sidebar roster dynamically displays **only the participants** present in that specific episode script.
- **Brand Badges**: Character shirts and roster cards display official brand logos (`common_assets/logos/original/`).

### 3. Speech Bubbles & Subtitle Pacing
- **Fixed Speech Bubbles**: Speech bubbles (`540px x 180px`) are positioned clear of character faces.
- **15-Word Paged Refresh**: Text automatically refreshes in 15-word pages to prevent box overflow.
- **Karaoke Word Highlight**: Active spoken word is highlighted dynamically in bold `#EF4444`.

### 4. Character Stage & Host Mechanics
- **Solo Host Stage Presence**: When the Host/Narrator speaks, the active contestant on the left is hidden so the Host stands solo on stage.
- **Host Styling**: Host/Narrator turns trigger the green-sweater Host Narrator component (`ChibiNarrator`).
- **Pose Holds**: Hand gestures use discrete ~1.6s pose holds with spring interpolation.

### 5. Dedicated Remotion Composition (.tsx) per Episode
- **Isolated Episode Compositions**: Each episode MUST maintain its own dedicated Remotion composition file (e.g. `remotion-composer/src/compositions/Ep02VoteSomeoneOutComposition.tsx`) registered in `Root.tsx`. This avoids repeatedly modifying shared files and preserves exact visual history per episode.

### 6. Meme Timing & Editing Guidelines (`meme_guide.md`)
- **Structure (`setup → punchline → meme reaction → return to flow`)**:
  - Insert meme reaction beats **strictly AFTER punchlines finish landing**, never overlapping active dialogue.
  - Dedicated standalone reaction pauses (30–45 frames / 1.0–1.5s) allow character audio and video to breathe.
- **Graphic Vector Meme Cards**:
  - High-impact graphic cards (`savage_roast.svg`, `plot_twist.svg`, `emotional_damage.svg`) trigger with spring pop physics (`damping: 14, stiffness: 220`) and drop shadows.
- **SpongeBob Time Cards**:
  - Pacing resets between rounds use full-screen SpongeBob-style cards (`a_few_moments_later.svg`) with opacity fade transitions (`interpolate([0, 6, 38, 45], [0, 1, 1, 0])`) and French Narrator audio.
- **Meme Sound Effects**:
  - `sfx/whoosh.mp3`: Whip transition on speech turns.
  - `sfx/pop.mp3`: Vote badge drops.
  - `sfx/bruh.mp3`, `sfx/anime-wow.mp3`, `sfx/fahhh.mp3`: Reaction punchlines.
  - `sfx/error.mp3` & `sfx/get-out.mp3`: Elimination finale.

---

## ⚖️ YouTube Monetization Compliance & Policy Guarantee

To ensure 100% eligibility for the **YouTube Partner Program (YPP)** and guarantee zero demonetization flags under YouTube's **Inauthentic Content** and **Synthetic Media** policies:

1. **Human Voice Performance Differentiation**:
   - Every AI character uses a unique neural voice model (`en-GB-Ryan`, `en-US-Ava`, `en-US-Guy`, `en-AU-Natasha`, `en-US-Eric`, `en-GB-Sonia`, `en-US-Steffan`) with distinct pitch (`-4Hz` to `+4Hz`) and speed rate adjustments (`-4%` to `+6%`).
2. **Original 2D Vector Motion Graphics**:
   - Uses custom React Remotion vector code rather than repetitive stock photos or unedited template clips.
3. **Dynamic Visual Beat Transitions**:
   - Incorporates spring pop scales, horizontal whip slides, dynamic vote tally badges, elimination stamp overlays, and sound effects (`whoosh.mp3`, `pop.mp3`, `error.mp3`).
4. **Synthetic Disclosure Exemption**:
   - Because character graphics are 2D cartoon/chibi vectors, they fall under YouTube's **unrealistic animation exemption**, requiring zero synthetic disclosure checks while remaining fully monetizable.

---

## 🚀 Execution Commands

```bash
# 1. Generate Episode Script (Debate Mode or Survival Mode):
python3 project_ai_showdown/run_ai_showdown.py --topic "<YOUR_TOPIC>" --mode debate
python3 project_ai_showdown/run_ai_showdown.py --topic "<YOUR_TOPIC>" --mode survival

# 2. Generate Character TTS Audio:
python3 project_ai_showdown/generate_episode_audio.py --ep-dir project_ai_showdown/episodes/<episode_id>

# 3. Build Remotion Props JSON Payload:
python3 project_ai_showdown/build_scariestai_props.py --ep-dir project_ai_showdown/episodes/<episode_id>

# 4. Render Video with Remotion:
npx remotion render AIShowdownComposition ../project_ai_showdown/episodes/<episode_id>/final_video.mp4 --props=public/showdown_props.json
```
