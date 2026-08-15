# Project Chatnemi (Discord Comedy Skit Engine)

Welcome to **Project Chatnemi**, a YouTube Shorts and TikTok video automation system inspired by Beluga's fast-paced, high-retention Discord chat comedy. 

The project supports two distinct comedy universes powered by the same pixel-perfect Remotion Discord engine:

1. 🤖 **The Original AI Universe (`episodes/`)**: Starring Nemi, Shroot, Booger, and various AI models (ChatGPT, Claude, Grok, Gemini).
2. 🌵 **The Brawl Stars Discord Universe ([`brawl_stars/`](./brawl_stars/README.md))**: Starring Brawl Stars brawlers (Edgar, Mortis, Shelly, Crow, Frank, Starr Park Moderator) arguing over Ranked matches, failed trickshots, bush camping, and toxic pins.

---

## 📂 Project Structure Overview

```
project_chatnemi/
├── brawl_stars/                                 # 🌵 BRAWL STARS DISCORD UNIVERSE
│   ├── README.md                                # Master guide for Brawl Stars Discord skits
│   ├── brawler_roster.json                      # Pre-configured brawlers registry (colors, avatars, archetypes)
│   ├── types.ts                                 # Brawl Stars typed schema definitions
│   ├── templates/                               # Starter episode templates
│   ├── references/                              # Brawl Stars tropes, memes & sound cue guide
│   └── episodes/                                # Brawl Stars episode scripts & metadata
│       ├── bs_ep01_trickshot_disaster/
│       └── bs_ep02_bushcamp_confession/
│
├── episodes/                                    # 🤖 ORIGINAL AI / NEMI UNIVERSE
│   ├── ep2_skip_school/
│   ├── ep3_viral_influencer/
│   ├── nemi_fake_gym/
│   └── sample_episode/
│
├── components/                                  # ⚙️ SHARED REMOTION DISCORD ENGINE
│   ├── ChatnemiMasterTemplate.tsx               # Master template with dynamic zoom & sound synchronization
│   ├── DiscordMessage.tsx                       # Whitney font Discord message component
│   ├── DiscordCall.tsx                          # Full-screen incoming voice call screen
│   ├── DiscordLayout.tsx                        # Container & spacing wrapper
│   └── TypingIndicator.tsx                      # Discord 3-dot typing animation
│
├── assets/                                      # 🎨 SHARED ASSET POOL
│   ├── profile_pic/                             # Avatars (Nemi, AI logos, Brawlers, Starr Park)
│   ├── sounds/                                  # Sound kit (Discord SFX, meme audio, Brawl Stars SFX)
│   └── images/                                  # Cutaway cards, memes, reaction pins (👍, 👎, clown)
│
├── types.ts                                     # Core TypeScript interfaces (ChatScript, Character, etc.)
├── README.md                                    # This master documentation
└── .agents/AGENTS.md                            # Rules and architecture guide for AI agents
```

---

## 🎭 The Universes

### Universe A: Original AI & Nemi Universe (`episodes/`)
- **Nemi (Main Character):** Tries to look cool or get things done, but constantly fails or gets roasted by AI and his friends.
- **Shroot (The Girlfriend):** Skeptical of Nemi's claims and easily unimpressed. Often calls in AI models to fact-check Nemi.
- **Booger (The Best Friend):** Loyal but completely incompetent best friend. Makes situations 10x worse.
- **AI Models (ChatGPT, Claude, Gemini, Grok):** Hyper-logical or chaotic neutral entities that fact-check or roast Nemi.
- **Celebrity Cameos (MrBeast, etc.):** Randomly summoned to settle absurd arguments.

### Universe B: Brawl Stars Discord Universe ([`brawl_stars/`](./brawl_stars/README.md))
- **Edgar:** Toxic thumbs-down spammer (👎), auto-jumps into Shellys, blames lag for 0-12 K/D.
- **Mortis:** Failed trickshot artist who dashes into walls in Brawl Ball instead of scoring open goals.
- **Shelly:** Hypercharge bush camper who one-shots anyone entering the center bush.
- **Crow:** Annoying poison poker screaming "CAW CAW".
- **Frank:** Always gets stunned 0.01s before his super lands; gets cut off when typing essays.
- **Starr Park Moderator:** Automated admin bot deducting -150 Ranked Elo and issuing creepy disclaimers.

---

## 🎬 Video Structure & Pacing

A classic 45s to 90s video should follow this structure:

1. **The Hook (0-10s):** Start *in media res*. Someone gets a ping. An absurd demand or ridiculous statement is made immediately.
2. **The Escalation (10s - 45s):** Rapid-fire typing. Back-and-forth arguments. Typographical errors. Misunderstandings. Introduce multiple characters to heighten the chaos.
3. **The Jailbreak / Call / Climax (45s - 75s):** The situation reaches peak absurdity. Discord voice call initiated, someone gets banned, or an incriminating image is sent.
4. **The Punchline (Last 5s - 10s):** An abrupt, funny ending. A final unexpected message, a dramatic zoom, and an abrupt cut to silence/boom.

---

## 🎵 Sound Effects & Music (The Master Kit)

Audio is 50% of the comedy. Use these consistently:

*   **Discord Ping (`ping.mp3` & `notification.mp3`):** Used every time a message is received. Overuse it during spam moments for comedic effect.
*   **Discord Call Ringtone (`discord_call.mp3`):** For dramatic moments when a character actually tries to call the other.
*   **Discord Join/Leave (`discord_join.mp3` / `discord_leave.mp3`):** When someone gets added or rage-quits from the group chat.
*   **Keyboard Typing (`typing.mp3` & `key-press.mp3`):** Play aggressively when characters are "typing...".
*   **Vine Boom (`vine_boom.mp3`):** Essential for dramatic reveals, sudden bans, or shocking text.
*   **Brawl Stars SFX (`supercell_jingle.mp3`, `brawl_super.mp3`, `brawl_hypercharge.mp3`, `brawl_match_lose.mp3`, `shelly_super.mp3`, `edgar_punch.mp3`):** Authentic game sounds synced with in-game actions.
*   **Spongebob Time Cards (`a-few-moments-later.mp3`):** E.g., "3 hours later..." to skip time.
*   **Record Scratch (`record_scratch.mp3`):** When the mood suddenly shifts.
*   **Reaction Memes:** `bruh.mp3`, `anime-wow.mp3`, `error.mp3`, `get-out.mp3`, `fahhh.mp3`.
*   **SFX Variety Rule:** Do NOT repeat the same high-impact reaction sound effect (such as `bruh.mp3`) within a 15-second window. Alternate reaction SFX to keep the audio dynamic.
*   **Audio Truncation Rule:** Always set `durationInFrames={event.durationFrames}` on cutaway SFX Sequences in `ChatnemiMasterTemplate.tsx` so long audio clips terminate cleanly the moment the cutaway screen ends.
*   **Pacing Standard:** Provide 1.5s - 2.5s per message bubble and 2.5s - 3.5s for graphic cutaway cards so viewers have comfortable time to read and digest the comedy without feeling rushed.
*   **Music:** Fast-paced background music (`sneaky_snitch.mp3`, `monkeys_spinning_monkeys.mp3`, `fluffing_a_duck.mp3`).

---

## 🖼️ Visuals & Memes

*   **The UI:** Pixel-perfect Discord UI running Whitney font and dark theme (`#36393f`).
*   **Typing Indicator:** Show the `[Character] is typing...` animation frequently to build suspense.
*   **Dynamic Zoom:** Dramatically zoom in on specific text bubbles, typos, or profile pictures during intense moments.
*   **Cutaways:** Full-screen cutaway cards for memes, reaction pins (`thumbs_down.png`, `clown_pin.png`), match results, and incoming Discord voice calls.

---

## 🚀 Rendering Instructions

To render any episode (AI or Brawl Stars) using the Remotion engine:

```bash
cd /Users/talus/Downloads/youtube_ai/OpenMontage/remotion-composer

# Preview in interactive Studio
npm run dev

# Render AI Episode
npx remotion render src/index.tsx Chatnemi \
  --props=../project_chatnemi/episodes/ep2_skip_school/script.json \
  --output=../project_chatnemi/episodes/ep2_skip_school/ep2_skip_school.mp4

# Render Brawl Stars Episode
npx remotion render src/index.tsx Chatnemi \
  --props=../project_chatnemi/brawl_stars/episodes/bs_ep01_trickshot_disaster/script.json \
  --output=../project_chatnemi/brawl_stars/episodes/bs_ep01_trickshot_disaster/bs_ep01_trickshot_disaster.mp4
```

---

## ⚙️ Engine Architecture & Layout Rules

When creating future episodes or tweaking the engine (`ChatnemiMasterTemplate.tsx`), adhere to the following architecture rules:

1. **The Avatar Anchor:** The avatar is anchored near the far left of the screen (`transformOrigin: "80px center"`). 
2. **The Dynamic Zoom:** The `calculateScale` function dynamically measures the `estimatedMessageWidth` (avatar + text) and scales it so the text perfectly hits the right edge of the 1920px screen. This ensures there is **never any empty grey space** after the text. Short texts ("hi", "👎") will automatically trigger a massive 10x+ zoom, while long texts stay properly framed.
3. **The Infinite Grey Horizon:** To prevent the edges of the grey Discord background from showing when scaled, the wrapper uses an infinite pseudo-extension. The black video background is visible ONLY at the top and bottom of the video, framing the grey band horizontally across the entire screen.
4. **Disclaimers in Upload Metadata:**
   - For AI Skits: *"Disclaimer: This video is purely for entertainment purposes. No actual AI models were used or harmed in the making of this video."*
   - For Brawl Stars Skits: *"This material is unofficial and is not endorsed by Supercell. For more information see Supercell's Fan Content Policy: www.supercell.com/fan-content-policy."*
