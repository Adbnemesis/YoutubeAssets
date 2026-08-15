# Project Chatnemi Rules & Architecture

When working on `project_chatnemi`, you MUST adhere to the following architecture rules for the Remotion engine, asset resolution, and episode scripts across both supported skit universes.

## Multi-Universe Structure
1. **Universe A (AI / Nemi Comedy)**: Scripts in `episodes/` starring Nemi, Shroot, Booger, and AI models.
2. **Universe B (Brawl Stars Discord Comedy)**: Scripts in `brawl_stars/episodes/` starring Brawlers (Edgar, Mortis, Shelly, Crow, etc.) and Starr Park Bot. Follow the master bible in `brawl_stars/README.md` and brawler configs in `brawl_stars/brawler_roster.json`.

---

## The Beluga Engine Architecture (DO NOT BREAK THIS)
The core visual gag of Beluga's videos is how the camera dynamically zooms into the Discord chat depending on the length of the message. We have replicated this engine in `ChatnemiMasterTemplate.tsx`. 

### Key Layout Rules:
1. **The Avatar Anchor:** The avatar MUST be anchored near the far left of the screen. We use `transformOrigin: "80px center"` to keep the avatar anchored exactly on the left side during a zoom.
2. **The Dynamic Zoom:** The `calculateScale` function MUST dynamically measure the `estimatedMessageWidth` (avatar + text) and scale it so that the text perfectly hits the right edge of the 1920px screen. The scale formula is `1720 / estimatedMessageWidth`. This ensures there is **never any empty grey space** after the text. Short texts ("hi", "👎") will automatically trigger a massive 10x+ zoom, while long texts stay properly framed.
3. **The Infinite Grey Horizon:** To prevent the edges of the grey Discord background from showing when scaled or shifted, the wrapper uses an infinite pseudo-extension:
   ```tsx
   <div style={{ position: "absolute", left: -10000, right: -10000, top: 0, bottom: 0, backgroundColor: "#36393f", zIndex: -1 }} />
   ```
   Do NOT remove this, or the black video background will bleed through on the left/right sides.
4. **Vertical Centering:** The grey band must only be as tall as the `max-content` of the current text. The black video background is visible ONLY at the top and bottom of the video, framing the grey band in the center.

---

## Episode Creation & Render Workflow
1. For AI episodes, use `episodes/` and copy `sample_script.json`.
2. For Brawl Stars episodes, use `brawl_stars/episodes/` and copy `brawl_stars/templates/episode_template.json` or `brawl_stars/brawler_roster.json`.
3. Put avatar images in `assets/profile_pic/`, meme images in `assets/images/`, and sound effects in `assets/sounds/`.
4. Always render with Remotion using the `Chatnemi` composition in `remotion-composer/src/Root.tsx`, outputting directly to the episode folder (e.g. `brawl_stars/episodes/bs_ep01_trickshot_disaster/bs_ep01_trickshot_disaster.mp4`).
5. Always weave meme sounds (`vine_boom.mp3`, `bruh.mp3`, `record_scratch.mp3`) and game SFX (`brawl_super.mp3`, `supercell_jingle.mp3`, `shelly_super.mp3`) into the script JSON.
6. **Disclaimers in `metadata.txt`:**
   - AI Episodes: *"Disclaimer: This video is purely for entertainment purposes. No actual AI models were used or harmed in the making of this video."*
   - Brawl Stars Episodes: *"This material is unofficial and is not endorsed by Supercell. For more information see Supercell's Fan Content Policy: www.supercell.com/fan-content-policy."*
