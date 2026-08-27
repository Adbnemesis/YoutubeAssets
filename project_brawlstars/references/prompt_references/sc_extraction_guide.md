# SC Effect Extraction Guide — Brawl Stars VFX

This guide explains how to extract real Brawl Stars attack VFX from Supercell `.sc` files
for use in tier-list shorts.

## Prerequisites

### Python 3.11+ (required — sc5-parser uses modern typing)
```bash
/opt/homebrew/bin/python3.11 --version  # or use your system's 3.11+
```

### Install dependencies
```bash
# sc5-parser — SC5/SC6 FlatBuffer parser
cd /tmp && git clone https://github.com/obus-globus/sc5-parser.git
cd /tmp/sc5-parser && /opt/homebrew/bin/python3.11 -m pip install -e .

# sc-compression — handles SC6 compression algorithms
/opt/homebrew/bin/python3.11 -m pip install sc-compression

# texture2ddecoder — decodes ASTC/ETC2 compressed textures
# (installed automatically with sc5-parser)
```

## How .sc Files Work

Supercell `.sc` files are compressed containers:
```
┌─────────────────────────────────────────────────┐
│  'SC' (2 bytes)                                 │
│  version (u32 = 5 or 6)                         │
│  Compressed payload (ZSTD / LZMA / other)       │
│  └── FlatBuffer structure                       │
│      ├── DataStorage (strings, vertices, frames)│
│      ├── ExportNames ("gale_006_atk_projectile")│
│      ├── Shapes (UV-mapped quads)               │
│      ├── MovieClips (animation timelines)       │
│      └── Textures (KTX/ASTC compressed)         │
└─────────────────────────────────────────────────┘
```

- **SC5**: The older format — `sc5_parser` handles this natively
- **SC6**: The newer format (Brawl Stars current) — requires `sc6_parser.py`
- Textures are embedded in SC6 as KTX containers with ASTC 8x8 compression

## Extracting Effects

### Step 1: Place the .sc file
```bash
cp effects_brawler_yourbrawler.sc \
  OpenMontage/project_brawlstars/commonassets/brawler_effects/
```

### Step 2: Run the extractor
```bash
cd OpenMontage/project_brawlstars/tools/sc_converter
/opt/homebrew/bin/python3.11 extract_effects_v6.py --brawler yourbrawler
```

### Step 3: Verify output
```bash
ls OpenMontage/project_brawlstars/commonassets/brawler_effects/yourbrawler/
# → yourbrawler_001_atk_projectile/
#    frame_0000.png, frame_0001.png, ...
#    manifest.json
```

Each effect part gets its own folder with:
- `frame_XXXX.png` — composited PNG frames on a shared canvas
- `manifest.json` — frame count, canvas size, anchor point, scale

## Available Effects (Gale Example)

```
gale_006_atk_projectile     — flying snowball projectile (6 frames)
gale_006_atk_reached        — impact burst at target (60 frames)
gale_006_atk_hit            — full hit effect at target (90 frames)
gale_006_atk_muzzle_01      — muzzle flash at attacker (30 frames)
gale_006_ulti_projectile    — ultimate projectile (5 frames)
gale_006_ulti_reached_01..08 — ultimate impact effects (75 frames each)
```

## Using Effects in Remotion

### 1. Paths are auto-symlinked
The extraction script links `commonassets/brawler_effects` →
`remotion-composer/public/brawl/effects/`. This means:
```
SC_EFFECT_ROOT = "brawl/effects"
```

### 2. Use the ScEffect component
```tsx
import { ScEffect } from "../../components/ScEffect";

<ScEffect
  brawler="gale"                  // lower-case brawler id
  part="gale_006_atk_projectile"  // effect export name
  x={fromX}                       // screen X for the anchor
  y={y}                           // screen Y for the anchor
  start={turnStart}               // composition frame when animation begins
  speed={1}                       // frames of comp time per SC frame
  loop                            // loop the animation
  scale={1.1}                     // visual scale multiplier
  flip={dir === -1}               // mirror for attacks aimed left
/>
```

### 3. Cleanup old frames before re-extracting
```bash
rm -rf OpenMontage/project_brawlstars/commonassets/brawler_effects/gale/
# then re-run extract_effects_v6.py
```

## Troubleshooting

### "Unsupported SC version 6"
Use `sc6_parser.py` (via `extract_effects_v6.py`) — it handles SC6.

### "ModuleNotFoundError: sc5_parser"
```bash
/opt/homebrew/bin/python3.11 -m pip install -e /tmp/sc5-parser
```

### Textures appear blank/transparent
Check that `texture2ddecoder` is installed (comes with sc5-parser).
Verify the KTX internal format — 0x93B7 = ASTC 8x8.

### Frames are different sizes
The extractor composites all frames onto a shared union canvas.
If old frames persist, clear the output dir first.

## Supported Brawler Effects

Drop a new `.sc` file in `commonassets/brawler_effects/` and extract.
Each brawler has different effect export names — check the `index.json`
after extraction to see what's available.

To add a new brawler's effects to the short:
1. Extract the .sc file
2. Add a `GaleScAttack`-style component in `TierList.tsx` that uses `ScEffect`
3. Update the `AbilityVfx` component to route to the new effect
4. Add SFX entries in the config's audio section