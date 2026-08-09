# Project Chatnemi Rules & Architecture

When working on `project_chatnemi`, you MUST adhere to the following architecture rules for the Remotion engine and the episode scripts.

## The Beluga Engine Architecture (DO NOT BREAK THIS)
The core visual gag of Beluga's videos is how the camera dynamically zooms into the Discord chat depending on the length of the message. We have perfectly replicated this engine in `ChatnemiMasterTemplate.tsx`. 

### Key Layout Rules:
1. **The Avatar Anchor:** The avatar MUST be anchored near the far left of the screen. We use `transformOrigin: "80px center"` to keep the avatar anchored exactly on the left side during a zoom.
2. **The Dynamic Zoom:** The `calculateScale` function MUST dynamically measure the `estimatedMessageWidth` (avatar + text) and scale it so that the text perfectly hits the right edge of the 1920px screen. The scale formula is `1720 / estimatedMessageWidth`. This ensures there is **never any empty grey space** after the text. Short texts ("hi") will automatically trigger a massive 10x+ zoom, while long texts stay properly framed.
3. **The Infinite Grey Horizon:** To prevent the edges of the grey Discord background from showing when scaled or shifted, the wrapper uses an infinite pseudo-extension:
   ```tsx
   <div style={{ position: "absolute", left: -10000, right: -10000, top: 0, bottom: 0, backgroundColor: "#36393f", zIndex: -1 }} />
   ```
   Do NOT remove this, or the black video background will bleed through on the left/right sides.
4. **Vertical Centering:** The grey band must only be as tall as the `max-content` of the current text. The black video background is visible ONLY at the top and bottom of the video, framing the grey band in the center.

## Episode Creation Workflow
1. Use `episodes/ep1_hack/script.json` as a template for new episodes.
2. Put images, memes, and sound effects in `public/project_chatnemi_assets/`.
3. Use `npx remotion render` and always output the video into the episode's specific folder (e.g. `episodes/ep2/ep2.mp4`), NOT the root folder.
4. Always weave meme sounds (`vine_boom.mp3`, `bruh.mp3`) into the script JSON at punchlines.
5. Set `script.bgm` (e.g., `sneaky_snitch.mp3`) for global background music.
6. **Metadata Generation:** When creating the `metadata.txt` for YouTube/TikTok upload, you MUST include this disclaimer: *"Disclaimer: This video is purely for entertainment purposes. No actual AI models were used or harmed in the making of this video."*
