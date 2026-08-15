# 🌵 Brawl Stars Discord Edition (`project_chatnemi/brawl_stars`)

Welcome to the **Brawl Stars Discord Skits** edition of `project_chatnemi`! 

This module adapts the ultra-fast, high-retention **Beluga Discord comedy editing style** into the chaotic, hilarious universe of **Brawl Stars**. Brawlers argue in group chats after losing Ranked matches, accuse each other of being bad randoms, defend failed trickshots, confess to bush camping, spam 👎 pins, and get banned by the Starr Park Moderator.

---

## 🎭 The Brawler Cast & Discord Archetypes

Unlike standard game clips, these videos treat Brawlers as members of a chaotic Discord server with distinct comedic personalities:

| Brawler | Role / Archetype | Discord Behavior & Tropes | Signature Color |
| :--- | :--- | :--- | :--- |
| **Chester** | Chaos Prankster & Server Troll | Fakes update leaks, changes server nicknames, posts inspect-element patch notes, trolls Mandy. | `#FF7043` (Vibrant Orange) |
| **Mandy** | Exasperated Candy Queen | Server moderator trying to keep order; exposes Chester's pranks; threatens sugar ray supers. | `#EC407A` (Candy Pink) |
| **Edgar** | Toxic Thumbs-Down Spammer | Constantly spams 👎, claims he carried with 0-12 K/D, jumps straight into Shellys with Super, blames lag. | `#E91E63` (Hot Pink/Red) |
| **Mortis** | Failed Trickshot Artist | Refuses to walk the ball into an open goal, tries 5-bounce trickshots and hits the wall, blames Wi-Fi. | `#9C27B0` (Purple) |
| **Shelly** | Bush-Camping Menace | Sits silently in the center bush for 90% of the match, charges Hypercharge, one-shots anyone walking by. | `#29B6F6` (Sky Blue) |
| **Bibi** | The Homerun Enforcer | Drops into voice calls with shaking screen & Hypercharge glow; launches toxic randoms into orbit. | `#FF4081` (Bubblegum) |
| **Kit** | Head-Clinging Carry Wannabe | Sits on teammates' heads, blames them for walking into poison, tries to unfriend people mid-air. | `#AB47BC` (Lilac Purple) |
| **Colt** | Narcissistic Sharpshooter | Boasts about 500 fan requests; gets exposed for missing 84 silver bullet shots in a row. | `#42A5F5` (Bright Blue) |
| **Colette** | Obsessive Scrapbook Stalker | Makes 500 alt accounts to track everyone's match histories, misses, and embarrassing deaths. | `#F48FB1` (Pastel Pink) |
| **Piper** | Polite Off-Screen Sniper | Sweet and courteous in chat; drops devastating polite roasts before 4,500 damage off-screen snipes. | `#BA68C8` (Lavender) |
| **Crow** | Annoying Poison Poker | Fast-talking pest who pecks from maximum range, screams "CAW CAW", jumps away the instant he gets hit. | `#FFC107` (Gold/Amber) |
| **Frank** | The Interrupted Tank | Tries to type long logical essays, always gets stunned or cancelled 0.01s before his super lands. | `#78909C` (Steel Blue) |
| **Hank** | "I WAS PRAWN READY! 🦐" | Military veteran who screams in army jargon, blows giant bubbles at the worst possible moments. | `#4CAF50` (Green) |
| **Leon** | Invisible Lurker | Lurks in chat without typing, suddenly posts humiliating screenshots from stealth. | `#4CAF50` (Emerald) |
| **Starr Park Bot** | Creepy Server Moderator | The automated admin. Enforces creepy corporate rules, deducts -150 Ranked Elo, and drops eerie lore disclaimers. | `#FFD700` (Gold) |

*(Inspired by the comedy style of top creators like **@CelevanBS** and **@GemzoBS**, blended with Beluga's rapid-fire algorithm! See `brawler_roster.json` for full character configurations).*

---

## 🎬 Video Structure & Pacing Standards

Every video follows the high-retention Beluga pacing algorithm designed for YouTube Shorts and TikTok (45s to 90s duration):

```
┌─────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐      ┌────────────────────┐
│ 1. THE HOOK     │ ───> │ 2. THE ESCALATION       │ ───> │ 3. THE CLIMAX / CALL    │ ───> │ 4. THE PUNCHLINE   │
## ⏱️ Long-Form Pacing & Comedy Engineering Standards

> [!IMPORTANT]
> **FORMAT DIRECTIVE**: This edition is strictly for **YouTube Long-Form Landscape Videos (16:9, 1920x1080)**.
> **TARGET DURATION**: **2:00 to 3:30 Minutes** (approx. 3,600 to 6,300 frames @ 30 FPS).
> **NEVER** format as 9:16 Shorts or compress episodes to under 60 seconds!

### 📐 Reading Duration & Buffer Rules (Length-Based):
1. **Same-Speaker Consecutive Texts:**
   - `delaySeconds` = **0.4s – 1.4s** based on sentence length (`0.4s + text.length * 0.02s`).
2. **Speaker Switch / Cutaway Transitions (Crucial Reading Window):**
   - When a text is followed by a **cutaway** or a **different brawler**, the text must remain on screen proportionally to its length:
   - Formula: `delaySeconds = 0.7s + (text.length * 0.035)s` (~25–30 chars per second).
   - Short text ("Edgar.", "BOOM. 💥"): `0.8s – 1.0s`.
   - Medium text (20–40 chars): `1.4s – 1.8s`.
   - Long text (60–80 chars): `2.6s – 3.2s`.
3. **Suspense Typing:** `isTypingDuration` = **0.6s – 0.9s** before major punchlines and roasts.
4. **Meme Photo Duration:** All meme cutaways must last **1.0 second maximum** (`durationSeconds: 1.0`) so the video stays punchy without lagging.
5. **Meme Transition Effects:**
   - `"effect": "fade"`: Smooth cross-fade in (6 frames) and out (6 frames) with steady 1.0x scale (clean default).
   - `"effect": "zoom"` / `"slam"`: Spring slam punch-in entrance.
6. **Dynamic Timestamps:** Time advances by **+1 minute every 4 messages** automatically (`startTime` customizable).

---

## 🎭 The 4-Act Long-Form Narrative Formula

Every 2–3 minute episode follows a 4-act escalating storyline:

```
[ ACT 1: THE MATCH DEFEAT & GASLIGHTING ] (0:00 - 0:35)
➔ Brawler enters claiming a close match or defending their loss
➔ Teammate drops the brutal cold-hard score ("The score was 0 to 40")
➔ First reaction cutaway (Edgar rage / crying)

[ ACT 2: THE 3D RECEIPTS & SERVER TROLLING ] (0:35 - 1:15)
➔ Brawler makes an absurd defense ("Psychological warfare / lag spike")
➔ Teammates drop 3D in-game match stat card & clown meme
➔ Server trolls (Chester, Mandy, Colette) join with fake patch notes & inspect element roasts

[ ACT 3: THE VOICE CALL TRAP & POINT-BLANK SUPER ] (1:15 - 1:45)
➔ Panic incoming Discord voice call overlay (ringing + camera shake)
➔ Accuser asks where they are sitting ➔ Plays point-blank Super SFX through the mic

[ ACT 4: THE STARR PARK AUDIT & DEMOTION CLIMAX ] (1:45 - 2:15+)
➔ Starr Park Bot drops official disciplinary verdict & Elo penalty
➔ Ridiculous promotion (e.g. Jessie's stationary turret promoted to Server Moderator)
➔ Closing ragequit cutaway & suspension stamp
```

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
  --props=../project_chatnemi/brawl_stars/episodes/edgar_0_15_defense/script.json \
  --output=../project_chatnemi/brawl_stars/episodes/edgar_0_15_defense/edgar_0_15_defense.mp4
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
│       └── edgar_0_15_defense/                  # Episode: Edgar's 0-15 Damage Defense
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
