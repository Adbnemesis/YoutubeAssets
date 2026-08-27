# project_brawlstars

Brawl Stars fan content pipeline: real in-game VFX extracted from Supercell `.sc`
files, composited into gameplay-style attack scenes and tier-list shorts with
Remotion. Everything needed to run this project lives inside this directory
(self-contained, clone-and-run).

---

## Quick Start (fresh clone)

```bash
cd OpenMontage/project_brawlstars
./setup.sh          # venv + pip deps + JDK17 check + reference-renderer jars
```

`setup.sh` does:

1. Creates `tools/sc_converter/.venv` and installs the extractor deps
   (`numpy`, `zstandard`, `Pillow`, `flatbuffers`, `texture2ddecoder`).
2. Checks for a JDK 17 (installs via Homebrew if missing and brew exists).
   Only needed for the Java reference renderer, not for the Python extractor.
3. Verifies the prebuilt reference-renderer jars in
   `tools/sc_converter/reference_renderer/jars/`; if absent, rebuilds them from
   the vendored source via `build_reference_renderer.sh`.

---

## Prerequisites

| Requirement | Version | Needed for | Notes |
|---|---|---|---|
| Python | 3.10+ | SC6 extractor, parser, reference-renderer script | venv lives in `tools/sc_converter/.venv` |
| JDK | 17 | Java reference renderer (`BatchRender`) | auto-installed by `setup.sh` if brew exists; set `JAVA_HOME` otherwise |
| Node.js | 18+ | Remotion rendering of scenes/shorts | deps in `../remotion-composer/node_modules` |
| FFmpeg | recent | MP4 renders, frame extraction, previews | required by Remotion + ffmpeg |
| (macOS only) | — | KTX texture tools (`ktx2ktx2`, `toktx`) | binaries vendored at `tools/sc_converter/reference_renderer/vendor/ktx/bin` |

The sc-editor Java renderer, its three dependency repos (`sc-file`,
`supercell-swf`, `supercell-texture`), the `flatc` compiler, and the KTX tools are
all **vendored inside `tools/sc_converter/reference_renderer/vendor/`** and the
built jars in `.../jars/` — no network fetch needed to run.

---

## Directory Layout

```
project_brawlstars/
├── commonassets/                 # ALL shared assets live here (single home)
│   ├── brawler_effects/          # extracted .sc VFX + per-export frame PNGs
│   │   ├── effects_brawler_<name>.sc
│   │   ├── gale/  ash/  kit/  mortis/  hank/  willow/  nani/
│   │   └── <export>/frame_%04d.png + manifest.json + preview.mp4
│   ├── brawler_voices/           # per-brawler voice lines (attack/super ogg)
│   ├── expressions/              # brawler expression pins per brawler
│   ├── fonts/                    # Brawl Stars font (brawl_stars.ttf, brawl_stars_2.ttf)
│   ├── image_references/         # portraits (brawler_icons/), dialog, arrows, tier_list
│   ├── sound_effects/            # all game SFX + BGM (rank tier_list, whoosh, pop, ...)
│   ├── voices/                   # raw voice sample wavs
│   └── rendered_shorts/          # finished short outputs
├── components/                   # Remotion React components
│   ├── RankingVideoTemplate.tsx  # tier-list short master template
│   ├── ScEffect.tsx              # renders one extracted effect part
│   ├── TierList.tsx, RosterStrip.tsx, IntroRoster.tsx, WinnerReveal.tsx ...
│   └── characters/               # per-brawler rigs
├── compositions/                 # Remotion composition entry files
│   ├── AttackSceneComposition.tsx    # gameplay-style attack scenes (4 comps)
│   ├── ScEffectPreviewComposition.tsx# 3x2 grid previews per brawler
│   └── README.md                     # detailed render commands
├── characters/                   # roster showcases + expressions
├── expressions/                  # fetched brawler expression images
├── scenes/                       # rendered attack-scene PNG sequences + mp4s
│   └── gale/ ash/ kit/
├── shorts/                       # finished short projects + renders
│   └── project_brawlstars_short_2_v2/...
├── references/                   # guide docs + reference videos
│   └── prompt_references/        # sc_extraction_guide.md, brawl_tier_guide.md, ...
├── tools/sc_converter/           # the SC extraction toolchain
│   ├── sc6_parser.py             # SC6 FlatBuffer decoder (the parser)
│   ├── extract_effects.py        # SC5 extractor
│   ├── extract_effects_v6.py     # SC6 extractor (primary)
│   ├── requirements.txt
│   ├── vendor/                   # vendored sc5_parser + sc_compression (Python)
│   ├── unpack.mjs                # optional SC unpack helper (needs @ultrapowa/sc-tools)
│   └── reference_renderer/       # sc-editor Java renderer + batch tools
│       ├── jars/                 # prebuilt jars (no build needed)
│       ├── vendor/               # Java sources, flatc, KTX tools
│       ├── BatchRender.java      # renders exports->aligned frame PNGs
│       ├── DumpColorBanks.java   # verifies decoded color/matrix banks vs sc-editor
│       ├── render_frames.py      # CLI wrapper over BatchRender
│       ├── build_reference_renderer.sh
│       └── README.md
├── abilities.ts, beatGrid.ts, layout.ts, motion.ts, fonts.ts, types.ts
├── voicebox_generate.py          # voice-line batch generation via Voicebox MCP
├── fetch_brawler_expressions.py  # downloads expression images from wiki
└── setup.sh
```

---

## Main Workflows

### 1. Extract Brawl Stars VFX from `.sc` files

```bash
cd tools/sc_converter
source .venv/bin/activate

# All exports of a brawler (reads commonassets/brawler_effects/effects_brawler_gale.sc)
python extract_effects_v6.py --brawler gale

# Only specific exports, custom scale
python extract_effects_v6.py --brawler gale --exports gale_006_atk_projectile gale_006_atk_hit --scale 6
```

Output per export:
`commonassets/brawler_effects/<brawler>/<export>/frame_%04d.png` + `manifest.json`
(canvas size, anchor point, per-frame bounds).

`.sc` files are Supercell's compressed FlatBuffer containers (ZSTD/LZMA payload →
DataStorage, ExportNames, Shapes, MovieClips, Textures). The decoder lives in
`sc6_parser.py` and is verified byte-identical to sc-editor's own decoder
(color/matrix banks + frame elements). See `references/prompt_references/sc_extraction_guide.md`.

### 2. Ground-truth frames via the reference renderer (sc-editor)

The Python rasterizer composites some effects differently than the game's OpenGL
pipeline. When you need frames exactly as sc-editor renders them:

```bash
cd tools/sc_converter/reference_renderer
export JAVA_HOME=$(/usr/libexec/java_home -v 17)   # if needed
python render_frames.py \
  ../../commonassets/brawler_effects/effects_brawler_gale.sc \
  /tmp/ref_frames 4 \
  gale_006_atk_projectile gale_006_atk_hit gale_006_atk_muzzle_01
```

The script uses the prebuilt jars in `jars/` automatically. Details + known
limitations in `reference_renderer/README.md`.

### 3. Render attack scenes / previews (Remotion)

From `OpenMontage/remotion-composer/`:

```bash
# Attack scenes (transparent, for overlaying on your brawler)
npx remotion render ../project_brawlstars/compositions/AttackSceneComposition.tsx GaleAttackScene out/frame-%03d.png --sequence
npx remotion render ../project_brawlstars/compositions/AttackSceneComposition.tsx GaleSuperScene out/GaleSuper.mp4 --codec=h264

# Effect-part grid previews (3x2 per brawler)
npx remotion render ../project_brawlstars/compositions/ScEffectPreviewComposition.tsx GaleEffectPreview out/GaleEffectPreview.mp4
```

Compositions:

| id | description |
|----|-------------|
| `GaleAttackScene` | snowball fan: muzzle + 6 shards + hit |
| `GaleSuperScene`  | icy tornado: ~90 bolt/nut particles swirling |
| `AshAttackScene`  | dust/trash clouds lobbed + impact |
| `KitSuperScene`   | yarn burst + ground carpet |
| `GaleEffectPreview` / `AshEffectPreview` / `KitEffectPreview` | 3x2 grid of each extracted part |

Full details in `compositions/README.md`.

### 4. Build a tier-list short

The master template is `components/RankingVideoTemplate.tsx`. Shorts are
assembled under `shorts/` (each has a `config.ts` + composition). Finished
renders land in `shorts/<project>/`.

| Short | Brawlers | Winner | Fight VFX |
|---|---|---|---|
| `project_brawlstars_short_2_v2` | Melodie / Bibi / Gale / Crow | Melodie | mix of .sc + SVG |
| `project_brawlstars_short_3` | Gale / Mortis / Hank / Willow | **Gale** | **attack VFX only** (GaleScAttack / MortisScDash / HankScAttack / WillowScAttack) |

Fight VFX live in `components/TierList.tsx` (the `AbilityVfx` dispatch) and play
real `.sc` attack frames over the brawler cards. New attack scenes are added by
writing a `*ScAttack` component and registering it in `AbilityVfx`.

Reference material: `references/prompt_references/ranking_video_editing_guide.md`
(BGM alignment, beat grid, frame maps) and `references/video_references/`.

### 5. Voice lines

- `voicebox_generate.py` — batch-generates brawler voice lines via the local
  Voicebox MCP server (`http://127.0.0.1:17493/mcp/`). No external Python deps.
- `fetch_brawler_expressions.py` — downloads the 6 expression states
  (normal/happy/angry/sad/excited/shocked) for a roster from the wiki.

---

## Brawler effects reference

The `.sc` files bundle a skin-specific variant prefix per brawler:

| Brawler | File | Export prefix | Typical exports |
|---|---|---|---|
| Gale | `effects_brawler_gale.sc` | `gale_006_` | `atk_muzzle_01/02`, `atk_projectile`, `atk_hit`, `atk_reached`, `ulti_projectile`, `ulti_reached_01..08`, `ulti_trail_bolts_02`, `ulti_trail_nuts_02` |
| Ash | `effects_brawler_ash.sc` | `ash_008_` | `atk_cloud_01/02`, `atk_impact01..03`, `ulti_projectile`, `ulti_trail_wifi`, `ulti_ground_crack_lv1_01/02`, `ulti_ground_crack_lv3`, `ulti_reached_cloud_01/02`, `projectile_light`, `shadow_normal_circle_big` |
| Kit | `effects_brawler_kit.sc` | `kit_def_oc_ulti_` | `ulti_projectile(_red)`, `ulti_explode`, `ulti_ground(_red)`, `ulti_wool`, `ulti_grass_01/02` |

Note: Kit's file contains **only super effects** — no basic-attack exports.

---

## Known limitations

- **Colors are sc-editor's raw VFX output.** Gale reads mint/green, Ash blue,
  Kit purple/pink over dark backgrounds; over a bright arena they read as
  pale icy tones. The game adds its own lighting/compositing on top.
- **sc-editor's video export renders black frames** — only the per-frame PNG
  path works (`BatchRender` uses it).
- **Kit's `ulti_projectile` and `ulti_projectile_red`** crash after frame 0
  inside sc-editor's own MovieClip renderer (`IndexOutOfBoundsException`), so
  those exports show a static frame.
- `extract_effects_v6.py` needs Python 3.10+ (the vendored `sc_compression`
  supports `lzham` via a bundled exe fallback).

---

## Portability / pushing to GitHub

This directory is fully self-contained — no absolute paths and no external
repos are required at runtime. To clone it on a new machine:

1. `git add` the whole `project_brawlstars/` tree **including**
   `tools/sc_converter/reference_renderer/` and `commonassets/brawler_effects/`
   (they are untracked but not gitignored — they must be explicitly added).
2. On the new machine run `./setup.sh`, then the workflows above.
3. Only system-level tools (Python, JDK 17, Node, FFmpeg) must be installed
   manually — everything project-specific is in this directory.

`node_modules` and `.venv` are gitignored (regenerated via `package.json` /
`requirements.txt`).
