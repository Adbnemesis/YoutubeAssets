# Brawl Stars Tier List Generator

This repository contains a fully reusable, parameter-driven Remotion template to generate high-quality "Who is the Best Brawler?" tier list shorts.

## Using the Master Template

The master template is located in `remotion-composer/src/compositions/WhoIsTheBestBrawlerMasterTemplate.tsx`. Instead of being hardcoded, this composition is entirely driven by JSON properties. You can render endless variations of this video just by supplying different JSON config files to the CLI.

### How to Render a Custom Video

1. Create a `my_video.json` file matching the `RankingVideoConfig` schema. (A full example schema is provided below).
2. Inside `remotion-composer`, run the render command passing your custom JSON:

```bash
npx remotion render src/index.tsx WhoIsTheBestBrawlerMasterTemplate path/to/output/my_custom_short.mp4 --props=./my_video.json
```

## `RankingVideoConfig` Schema

Every aspect of the video is customizable. Here is the structure of the JSON payload you need to provide:

```json
{
  "config": {
    "fps": 30,
    "durationInFrames": 561, // Control the total length of the video
    
    // 1. DIALOGUE & INTRO
    "titleWords": [
      { "text": "WHO", "frame": 0, "fontSize": 170, "color": "#22C55E" },
      { "text": "IS", "frame": 14, "fontSize": 170, "color": "#22C55E" }
      // ... words synced to the voiceover beat
    ],
    "introPin": { "emoji": "😎", "color": "#FFD60A" },
    
    // 2. ROSTER (Top bar during intro)
    "roster": [
      { "id": "kenji", "name": "Kenji", "imageSrc": "brawl/portraits/kenji.png", "tier": "S", "accentColor": "#22C55E" }
      // ...
    ],

    // 3. TIER LIST BOARD & ANIMATION
    "tierList": {
      "rows": [
        { "key": "S", "label": "S", "color": "#E0245E", "textColor": "#FFFFFF" }
      ],
      "labelStripSrc": "brawl/images/tier_list.png",
      "entries": [
        {
          "id": "kenji",
          "name": "Kenji",
          "imageSrc": "brawl/portraits/kenji.png",
          "dropFrame": 0,
          "initialTier": "S",
          "moves": [
            { "frame": 210, "tier": "D", "duration": 42 }, // Brawler drops to D
            { "frame": 390, "tier": "B", "fx": "splash" }  // Brawler promotes to B
          ],
          "dislikeFrame": 330,
          "heartFrame": 570,
          "accentColor": "#22C55E"
        }
      ]
    },

    "gridRevealFrame": 210,
    "gridSettleFrame": 210,
    "slamFrame": 330, // When the D-tier drop happens (triggers screen shake and dislike pins)

    // 4. THE FIGHT (Brawlers battling in the tier list)
    "fight": {
      "start": 420,
      "end": 720,
      "turns": [
        {
          "beat": 14, // Which beat the attack triggers
          "id": "kenji", // The attacker
          "ability": "KATANA SLASH", // Label displayed
          "kind": "attack", // "attack" or "super" triggers different procedural VFX
          "voiceSrc": "brawl/sfx/scene01_kenji.wav",
          "voiceFrom": 0,
          "voiceTo": 1
        }
      ]
    },

    // 5. COLORS, FLASHES, AND TRANSITIONS
    // You can dynamically change the background color per beat!
    "colorCycle": [
      { "beat": 1, "color": "#242008" },
      { "beat": 7, "color": "#12100D" }
    ],
    // Screen-wide color flashes
    "flashes": [
      { "frame": 210, "color": "#FF2A2A", "maxOpacity": 0.8, "duration": 6 }
    ],
    // Screen wipe transitions
    "transitions": [
      { "frame": 210 }
    ],

    // 6. WINNER SHOWCASE (The final edit)
    "winner": {
      "phases": [
        {
          "type": "title",
          "frame": 720,
          "endFrame": 750,
          "backgroundColor": "#7C3AED",
          "accentColor": "#FFD60A",
          "entryId": "kenji",
          "title": "KENJI"
        },
        {
          "type": "spin",
          "frame": 750,
          "endFrame": 1110,
          "backgroundColor": "#3D1E23",
          "accentColor": "#FFD60A",
          "entryId": "kenji",
          "title": "KENJI",
          "spinSpeed": 9
        },
        {
          "type": "outro",
          "frame": 1110,
          "endFrame": 1200,
          "backgroundColor": "#0284C7",
          "accentColor": "#FFD60A",
          "entryId": "kenji",
          "title": "KENJI",
          "subtitle": "IS #1 BRAWLER! 🔥"
        }
      ]
    },

    // 7. CAMERA CHOREOGRAPHY
    "camera": {
      "baseScale": 1,
      // You can define a custom path for the camera to follow during the intro
      "introPath": [
        { "frame": 0, "scale": 1.0, "originX": 50, "originY": 50 },
        { "frame": 8, "scale": 1.45, "originX": 26, "originY": 15 }
      ],
      // Trigger punches and screen shakes on specific frames
      "events": [
        { "frame": 210, "type": "punch", "intensity": 1 },
        { "frame": 330, "type": "shakeBig", "intensity": 1 }
      ]
    },
    "cameraZoomOut": {
      "from": 210,
      "to": 226,
      "fromScale": 1,
      "toScale": 1
    },

    // 8. AUDIO
    "audio": {
      "bgmSrc": "brawl/sfx/ranking_tier_list.mp3",
      "bgmStartSeconds": 8.499,
      "bgmVolume": 1,
      // Audio ducking (e.g. lowering BGM volume while someone speaks or fights)
      "duck": { "from": 0, "to": 3.1, "volume": 0.4 },
      "fightDuck": { "from": 6.0, "to": 11.8, "volume": 0.2 },
      "voiceSrc": "brawl/sfx/scene01_kenji.wav",
      "voiceVolume": 1,
      "fadeOutFrames": 26,
      // Array of sound effects to play exactly on frame
      "sfx": [
        { "frame": 210, "src": "brawl/sfx/whoosh.mp3", "volume": 0.95 },
        // Use brawlerId to mute SFX if the brawler gets eliminated before the frame happens
        { "frame": 420, "src": "brawl/sfx/kenji_atk_sfx_01.mp3", "volume": 0.9, "brawlerId": "kenji" }
      ]
    }
  }
}
```

## How the Code Works

The `RankingVideoTemplate.tsx` component is the root of the video. It accepts a `config` object conforming to the `RankingVideoConfig` interface (defined in `types.ts`).

The CLI `props.json` is passed into `remotion-composer/src/Root.tsx`, which attaches it via `defaultProps` to the `WhoIsTheBestBrawlerMasterTemplate` composition. The `calculateRankingMetadata` function dynamically calculates the correct total duration of the video based on the `durationInFrames` specified in your custom JSON!
