# Project Chatnemi (AI Discord Skits)

Welcome to **Project Chatnemi**, a YouTube Shorts/TikTok video series inspired by Beluga's fast-paced Discord chat comedy, starring Nemi as the main character alongside various AI models! 

This `README.md` serves as the master guide, template, and bible for creating every episode. Refer to this when writing scripts, gathering sound effects, and editing to maintain consistency across the series.

---

## 🎭 The Cast (Original Universe)

To avoid copyright strikes, we do NOT use Beluga's characters (Hecker, Skittle, etc.). Our episodes feature an original cast combined with AI models and famous personalities:

1. **Nemi (Main Character)**
   *   **Personality:** The main character. Tries to look cool or get things done, but constantly fails or gets roasted by AI and his friends.

2. **Shroot (The Girlfriend)**
   *   **Personality:** Nemi's girlfriend. Skeptical of Nemi's claims and easily unimpressed. Often calls in AI models to fact-check Nemi.

3. **Booger (The Best Friend)**
   *   **Personality:** Nemi's loyal but completely incompetent best friend. Tries to help Nemi but usually makes the situation 10x worse (e.g. terrible Photoshop skills).

4. **AI Models (ChatGPT, Claude, Gemini, Grok)**
   *   **Personality:** These act as the hyper-logical or chaotic neutral entities in the chat. Shroot often summons them to roast Nemi, or Nemi argues with them.

5. **Celebrity Cameos (John Cena, MrBeast, etc.)**
   *   **Personality:** Brought into the chat randomly to settle disputes. They are absurdly famous and usually immediately roast Nemi before leaving.
---

## 🎬 Video Structure & Pacing

A classic 2-3 minute video should follow this structure:

1. **The Hook (0-15s):** Start *in media res*. Someone gets a ping. An absurd demand or ridiculous statement is made immediately. 
   *   *Example:* Nemi gets pinged by Claude: "I have your search history."
2. **The Escalation (15s - 1m30s):** Rapid-fire typing. Back-and-forth arguments. Typographical errors. Misunderstandings. Introduce multiple characters to heighten the chaos.
3. **The Jailbreak / Climax (1m30s - 2m30s):** The situation reaches peak absurdity. Someone gets "hacked," someone gets banned, or a ridiculous image is sent.
4. **The Punchline (2m30s - 3m00s):** An abrupt, funny ending. Usually a final unexpected message, a dramatic zoom, and an abrupt cut to silence.

---

## 🎵 Sound Effects & Music (The "Beluga" Kit)

Audio is 50% of the comedy. Use these consistently:

*   **Discord Ping (`ping.mp3` & `notification.mp3`):** Used every time a message is received. Overuse it during spam moments for comedic effect.
*   **Discord Call Ringtone (`discord_call.mp3`):** For dramatic moments when a character actually tries to call the other.
*   **Discord Join/Leave (`discord_join.mp3` / `discord_leave.mp3`):** When someone gets added or kicked from the group chat.
*   **Keyboard Typing (`typing.mp3` & `key-press.mp3`):** Play aggressively when characters are "typing...".
*   **Vine Boom (`vine_boom.mp3`):** Essential for dramatic reveals, sudden bans, or shocking text.
*   **Spongebob Time Cards (`a-few-moments-later.mp3`):** E.g., "3 hours later..." to skip time.
*   **Record Scratch (`record_scratch.mp3`):** When the mood suddenly shifts.
*   **Other Memes included:** `bruh.mp3`, `anime-wow.mp3`, `error.mp3`, `get-out.mp3`
*   **Music:** Fast-paced, royalty-free background music (like Kevin MacLeod's "Sneaky Snitch" or "Monkeys Spinning Monkeys"). Stop the music abruptly on the punchline.

---

## 🖼️ Visuals & Memes

*   **The UI:** Recreate a pixel-perfect Discord UI (or use HTML/CSS overlays). 
*   **Typing Indicator:** Show the `[Character] is typing...` animation frequently to build suspense.
*   **Zooming:** Dramatically zoom in on specific text bubbles, typos, or profile pictures during intense moments.
*   **Memes:** Incorporate deep-fried images, low-res cat memes, or absurd AI-generated images that the characters send to each other.

---

## 📝 Master Script Template

Copy and paste this template for every new video you plan.

```markdown
# Episode Title: [Insert Title]

## Concept
[1-2 sentence summary of the joke/plot]

## Assets Needed
- Custom Images: [List any generated images/memes needed]
- Specific SFX: [Any unique sounds beyond the standard kit]

## Script

| Time | Character | Dialogue/Text | Visual/SFX Notes |
| :--- | :--- | :--- | :--- |
| 0:00 | System | *Nemi is typing...* | SFX: Keyboard typing |
| 0:02 | Nemi | hello? is anyone alive in here? | SFX: Discord ping |
| 0:04 | System | *Claude is typing...* | Zoom in on Claude's avatar |
| 0:06 | Claude | I cannot fulfill this request as it violates my safety guidelines. | SFX: Vine boom |
| ... | ... | ... | ... |
```

---

## 🚀 Workflow Checklist for Every Video

- [ ] Write script using the template.
- [ ] Generate any necessary meme images/assets.
- [ ] Assemble in editor (Remotion/Premiere/AE).
- [ ] Add sound effects (Pings, booms, typing) from the `assets/` folder.
- [ ] Add visual polish (Zooms, screen shakes).
- [ ] Review for pacing (must be FAST despite the longer length).
- [ ] Render the video directly into its episode folder (e.g., `project_chatnemi/episodes/ep01/ep01.mp4`). Do not leave it in the default `out/` folder.
- [ ] Generate the `metadata.txt` for upload, and ensure it includes the AI entertainment disclaimer.
- [ ] Upload to YouTube/TikTok!

---

## ⚙️ Engine Architecture & Layout

When creating future episodes or tweaking the engine (`ChatnemiMasterTemplate.tsx`), adhere to the following architecture rules to maintain the "Beluga" style:

1. **The Avatar Anchor:** The avatar is anchored near the far left of the screen (`transformOrigin: "80px center"`). 
2. **The Dynamic Zoom:** The `calculateScale` function dynamically measures the `estimatedMessageWidth` (avatar + text) and scales it so the text perfectly hits the right edge of the 1920px screen. This ensures there is **never any empty grey space** after the text. Short texts ("hi") will automatically trigger a massive 10x+ zoom, while long texts stay properly framed.
3. **The Infinite Grey Horizon:** To prevent the edges of the grey Discord background from showing when scaled, the wrapper uses an infinite pseudo-extension. The black video background is visible ONLY at the top and bottom of the video, framing the grey band horizontally across the entire screen.

*(Note: These rules are also documented in `.agents/AGENTS.md` so AI agents automatically follow them in future tasks!)*
