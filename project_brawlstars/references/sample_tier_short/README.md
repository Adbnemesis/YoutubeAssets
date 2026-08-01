# Brawl Stars Tier List Short Template

This directory contains the reference configuration for generating dynamic "Who is the best brawler?" tier list shorts.

## Structure
- `sampleScene01_template.ts`: The exact Remotion configuration used to generate the reference viral short. It defines the timeline, camera choreography, fight sequences, and colors.
- `types.ts` (in `src/brawl`): Defines the schema (`RankingVideoConfig`) that a python automation script must output.

## How to Automate
When writing a Python script to generate these videos automatically, follow this structure:

1. **Dialogue Phase**: A brawler asks a question (e.g., "Who is the best brawler in Brawl Stars?" or "Who is the worst trio?"). You map the audio timing for each word so the text pops up on screen perfectly synced.
2. **Beat Drop (Grid Reveal)**: The music drops, the screen flashes red, and the full tier list grid is revealed.
3. **Fighting Phase**: Brawlers attack each other in sequence. You dictate the `beat` they attack on, and the target they hit. The attacker card will dynamically lunge and flash their weapon, and the target will recoil and flash red.
4. **Final Winner Edit**: The last surviving brawler spins out and transitions into a high-energy outro sequence (flashing colors, zooming backgrounds, CSS speedlines).

**Duration**: The total video duration is *not* locked to 18 seconds. The length entirely depends on the voiceover length and the background music beat timings you specify in your JSON configuration.

## Generation Steps
1. Generate the voiceover (`kenji_natural.mp3`) using the voice generation agent.
2. Calculate the beat timestamps using `librosa` or similar beat detection on the background music.
3. Map the dialogue words to frames.
4. Output a JSON file that matches `RankingVideoConfig`.
5. Run the Remotion render passing the generated JSON file as the input props.

## How it renders (React Components)
When the Remotion render is triggered, it uses a suite of custom React components in `project_brawlstars/components` to visually assemble the video:
- `RankingVideoTemplate.tsx`: The main orchestration component that wraps everything together.
- `CameraSystem.tsx`: Reads the JSON config to simulate dynamic 2D camera panning and zooming over the tier list.
- `TierList.tsx`: Displays the grid and uses `BrawlerCard` to handle attack lunges, damage shaking, and defeat animations.
- `IntroTitle.tsx`: Renders the synced dialogue with dynamic text sizes, neon gradients, and drop shadows perfectly synced to the audio.
- `WinnerReveal.tsx`: Mounts the final outro phase, taking the winning brawler and animating them with speedlines over a dynamically zooming grid.
- `AudioTracks.tsx`: Mixes the BGM and Voiceover, automatically ducking the BGM when the fight phase or voiceover starts.
