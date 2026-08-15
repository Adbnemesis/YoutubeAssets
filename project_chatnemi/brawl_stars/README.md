# 🌵 Brawl Stars Discord Edition (`project_chatnemi/brawl_stars`)

Welcome to the **Brawl Stars Discord Skits** edition of `project_chatnemi`! 

This module adapts the ultra-fast, high-retention **Beluga Discord comedy editing style** into the chaotic, hilarious universe of **Brawl Stars**. Brawlers argue in group chats after losing Ranked matches, accuse each other of being bad randoms, defend failed trickshots, confess to bush camping, spam 👎 pins, and get banned by the Starr Park Moderator.

---

## 🎭 The Brawler Cast & Discord Archetypes

Unlike standard game clips, these videos treat Brawlers as members of a chaotic Discord server with distinct comedic personalities:

| Brawler | Role / Archetype | Discord Behavior & Tropes | Signature Color |
| :--- | :--- | :--- | :--- |
| **Edgar** | Toxic Thumbs-Down Spammer | Constantly spams 👎, claims he carried with 0-12 K/D, jumps straight into Shellys with Super, blames lag. | `#E91E63` (Hot Pink/Red) |
| **Mortis** | Failed Trickshot Artist | Refuses to walk the ball into an open goal, tries 5-bounce trickshots and hits the wall, blames Wi-Fi. | `#9C27B0` (Purple) |
| **Shelly** | Bush-Camping Menace | Sits silently in the center bush for 90% of the match, charges Hypercharge, one-shots anyone walking by. | `#29B6F6` (Sky Blue) |
| **Crow** | Annoying Poison Poker | Fast-talking pest who pecks from maximum range, screams "CAW CAW", jumps away the instant he gets hit. | `#FFC107` (Gold/Amber) |
| **Frank** | The Interrupted Tank | Tries to type long logical essays, always gets stunned or cancelled 0.01s before his super lands. | `#78909C` (Steel Blue) |
| **Kenji** | Pretentious Sushi Chef | Narcissistic master swordsman, complains about low-grade sashimi, treats Brawl Ball like culinary art. | `#FF5722` (Deep Orange) |
| **Melodie** | K-Pop Drama Queen | Demands everyone stream her new song, types in ALL CAPS, initiates dramatic voice calls when insulted. | `#F06292` (Pastel Pink) |
| **Hank** | "I WAS PRAWN READY! 🦐" | Military veteran who screams in army jargon, blows giant bubbles at the worst possible moments. | `#4CAF50` (Green) |
| **Gale** | Grumpy Janitor | The exhausted elder who wants everyone off his lawn, blows toxic assassins away with blizzard gale. | `#81D4FA` (Ice Blue) |
| **Leon** | Invisible Lurker | Lurks in chat without typing, suddenly posts humiliating screenshots from stealth. | `#4CAF50` (Emerald) |
| **Surge** | Hyperactive Party Bot | Drinks energy drinks, screams "SURGE PROTECTOR!", levels up his chat permissions mid-argument. | `#E53935` (Bright Red) |
| **Starr Park Bot** | Creepy Server Moderator | The automated admin. Enforces creepy corporate rules, deducts -150 Ranked Elo, and drops eerie lore disclaimers. | `#FFD700` (Gold) |

*(See `brawler_roster.json` for full character configurations ready to import into scripts!)*

---

## 🎬 Video Structure & Pacing Standards

Every video follows the high-retention Beluga pacing algorithm designed for YouTube Shorts and TikTok (45s to 90s duration):

```
┌─────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐      ┌────────────────────┐
│ 1. THE HOOK     │ ───> │ 2. THE ESCALATION       │ ───> │ 3. THE CLIMAX / CALL    │ ───> │ 4. THE PUNCHLINE   │
│ (0s - 10s)      │      │ (10s - 45s)             │      │ (45s - 75s)             │      │ (Last 5s - 10s)    │
│ Ping + Absurd   │      │ Rapid texts, pin spams, │      │ Discord voice call,     │      │ Abrupt cut, boom,  │
│ match screenshot│      │ receipts, bad Wi-Fi     │      │ Starr Park Bot enters   │      │ trophy deduction   │
└─────────────────┘      └─────────────────────────┘      └─────────────────────────┘      └────────────────────┘
```

### Pacing Rules:
1. **Message Bubble Duration:** Standard texts should display for **1.5s – 2.2s** to give viewers comfortable reading time.
2. **Rapid Spam Runs:** When characters spam quick one-liners ("no", "wait", "look"), set `delaySeconds` to **0.2s – 0.5s**.
3. **Suspense Typing:** Set `isTypingDuration` to **1.0s – 1.8s** before huge punchlines, confessions, or roasts.
4. **Graphic Cutaways:** Display meme cards and match screens for **2.5s – 3.5s**.
5. **No Dead Air:** Every single visual transition must have an accompanying sound effect.

---

## 🎵 Hybrid Sound Design Kit

Audio drives 50% of the comedy. We blend the classic Beluga meme sounds with authentic Brawl Stars in-game audio:

### Classic Discord Meme Audio:
- `ping.mp3` & `notification.mp3`: Standard message delivery.
- `typing.mp3` & `key-press.mp3`: Plays strictly while `isTypingDuration` is active.
- `discord_call.mp3`: Dramatic voice call cutaways.
- `discord_join.mp3` & `discord_leave.mp3`: When brawlers enter or rage-quit the group.
- `vine_boom.mp3`: Punchlines, absurd claims, and sudden reveals.
- `record_scratch.mp3`: Awkward pauses and mood shifts.
- `bruh.mp3`, `error.mp3`, `fahhh.mp3`, `get-out.mp3`: Comedic reaction sounds.

### Authentic Brawl Stars Audio:
- `supercell_jingle.mp3`: Starr Park / Supercell admin announcements.
- `brawl_super.mp3`: When a brawler threatens to use their Super.
- `brawl_hypercharge.mp3`: Ultimate power flex in chat.
- `brawl_match_lose.mp3`: Defeat sound when someone gets exposed or roasted.
- `brawl_match_win.mp3`: Victory celebration.
- `pin_surrender.mp3`: White flag / clown emoji spam.
- `edgar_punch.mp3` & `edgar_super_jump.mp3`: Edgar raging or jumping in.
- `shelly_super.mp3`: Instant point-blank explosion.

---

## 🖼️ Visuals, Cutaways & Engine Rules

This edition runs on the proven `ChatnemiMasterTemplate.tsx` engine:

1. **The Dynamic Bounding-Box Zoom:**
   - Single short words ("👎", "what", "bro") automatically trigger extreme **8x–12x zooms**.
   - Multi-line arguments stay cleanly framed against the 1920x1080 canvas.
2. **Infinite Grey Background:**
   - The Discord `#36393f` band stretches infinitely horizontally, framed with cinematic black bars top and bottom.
3. **Brawler Cutaways (`mediaUrl`):**
   - `thumbs_down.png` / `clown_pin.png`: Zoom in on toxic pin reactions.
   - `DISCORD_CALL_<characterId>`: Triggers the authentic Discord incoming call overlay with vibrating avatar and ringing audio.
   - Custom match result screenshots, bad Wi-Fi icons, and bush camping memes.

---

## 📝 Master Episode Script Schema

All episodes are written in standardized JSON format (`script.json`):

```json
{
  "characters": [
    { "id": "edgar", "name": "Edgar", "color": "#E91E63", "avatarUrl": "edgar.png" },
    { "id": "mortis", "name": "Mortis", "color": "#9C27B0", "avatarUrl": "mortis.png" },
    { "id": "shelly", "name": "Shelly", "color": "#29B6F6", "avatarUrl": "shelly.png" }
  ],
  "bgm": "sneaky_snitch.mp3",
  "events": [
    {
      "type": "message",
      "characterId": "mortis",
      "text": "guys my trickshot was calculated",
      "delaySeconds": 0.5,
      "sfx": "ping.mp3"
    },
    {
      "type": "message",
      "characterId": "edgar",
      "text": "YOU TRICKSHOTTED INTO OUR OWN GOAL",
      "delaySeconds": 1.5,
      "isTypingDuration": 1.0,
      "sfx": "vine_boom.mp3"
    },
    {
      "type": "cutaway",
      "mediaUrl": "thumbs_down.png",
      "durationSeconds": 2.0,
      "delaySeconds": 1.0,
      "fadeIn": true,
      "sfx": "bruh.mp3"
    }
  ]
}
```

---

## 🚀 Step-by-Step Episode Creation & Render Workflow

### 1. Plan the Episode
Pick a conflict trope (e.g. Ranked Brawl Ball throw, Showdown teaming betrayal, bad randoms blaming each other).

### 2. Create the Episode Folder
Create `project_chatnemi/brawl_stars/episodes/<episode_name>/`:
- `script.json` (The dialogue & timing events)
- `metadata.txt` (YouTube Shorts / TikTok upload details)

### 3. Render with Remotion
Run the render command from the `remotion-composer` workspace:

```bash
cd /Users/talus/Downloads/youtube_ai/OpenMontage/remotion-composer

# Preview in interactive Studio
npm run dev

# Or render directly to the episode folder:
npx remotion render src/index.tsx Chatnemi \
  --props=../project_chatnemi/brawl_stars/episodes/bs_ep01_trickshot_disaster/script.json \
  --output=../project_chatnemi/brawl_stars/episodes/bs_ep01_trickshot_disaster/bs_ep01_trickshot_disaster.mp4
```

### 4. Upload Metadata with Supercell Disclaimer
Every YouTube Shorts/TikTok upload must include the fan content disclaimer in `metadata.txt`:

> *"This material is unofficial and is not endorsed by Supercell. For more information see Supercell's Fan Content Policy: www.supercell.com/fan-content-policy."*

---

## 📂 Directory Structure

```
project_chatnemi/
├── brawl_stars/                                 # Brawl Stars Discord Edition
│   ├── README.md                                # This master guide & bible
│   ├── brawler_roster.json                      # Pre-configured brawlers registry
│   ├── types.ts                                 # TypeScript schema definitions
│   ├── templates/
│   │   └── episode_template.json                # Starter template for new episodes
│   ├── references/
│   │   └── brawl_discord_tropes.md              # Trope guide, banter dynamics & meme maps
│   └── episodes/
│       ├── bs_ep01_trickshot_disaster/          # Episode 1: Ranked Brawl Ball throw
│       │   ├── script.json
│       │   └── metadata.txt
│       └── bs_ep02_bushcamp_confession/         # Episode 2: Solo Showdown mystery
│           ├── script.json
│           └── metadata.txt
│
├── assets/                                      # Shared assets for all Chatnemi editions
│   ├── profile_pic/                             # Brawler & AI avatar PNGs
│   ├── sounds/                                  # Discord & authentic Brawl SFX
│   └── images/                                  # Meme cutaways & reaction pins
└── components/                                  # Remotion React engine components
    ├── ChatnemiMasterTemplate.tsx
    ├── DiscordMessage.tsx
    ├── DiscordCall.tsx
    ├── DiscordLayout.tsx
    └── TypingIndicator.tsx
```
