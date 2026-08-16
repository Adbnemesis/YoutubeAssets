# Brawler Voice Lines (Vo) — How To Download

This guide documents how to download **genuine Brawl Stars** character voice
lines (VO) and insert them into `project_cool_edit`'s shared asset pool. It is
based on direct research against the public assets repo, so the steps will get
real Supercell voice files — not fan-made or re-recorded ones.

---

## 1. Where the real voices come from

The project uses the public GitHub mirror of Brawl Stars' official game assets:

```
tailsjs/brawl-stars-assets
```

This repo mirrors versions of the game's `.csv`/`.sc`/`sfx` pack. Voice lines
live under the `sfx/` folder of each game version, with the pattern:

```
{brawler}_{type}_vo_{NN}.ogg
```

- `{brawler}` — lowercase brawler slug (e.g. `leon`, `surge`, `tara`)
- `{type}` — voice category (see table in §3)
- `{NN}` — voice variant number (e.g. `01`, `02`)

### Raw download URL template

```
https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/{VERSION}/sfx/{brawler}_{type}_vo_{NN}.ogg
```

VERSION is a game build number like `68.250`. In this project `68.250` verified
as a working version.

---

## 2. Folder layout (maintain this!)

All brawler voices live in the shared asset pool:

```
project_cool_edit/assets/brawler_voices/
```

**Convention: one folder per brawler.**

```
brawler_voices/
├── <brawler>/          ← one folder per brawler
│   ├── <file>.ogg      ← raw genuine VO files (kept under the brawler's name)
└── ...
```

- Keep the original downloaded filename (e.g. `leon_ulti_vo_01.ogg`) inside the
  brawler's folder so it stays traceable to the source.
- Some folders alternatively use semantic names (`attack.ogg` / `super.ogg`).
  Both are accepted; the important rule is **each brawler has its own folder**
  and their files live inside it — never loose at the `brawler_voices/` root.
- Existing folders: `8bit/`, `amber/`, `angelo/`, `bea/`, `belle/`, `bo/`,
  `brock/`, `bull/`, `buzz/`, `crow/`, `edgar/`, `fang/`, `frank/`,
  `gale/`, `hank/`, `kenji/`, `leon/`, `max/`, `meg/`, `melodie/`,
  `mortis/`, `sandy/`, `shelly/`, `stu/`, `surge/`, `tara/`, `willow/`.

---

## 3. Voice types / categories

| Suffix (type) | Meaning                                        |
|---------------|------------------------------------------------|
| `atk`         | Attack cast voice line                          |
| `ulti`        | Super / ultimate voice line  *(≈ "super VO")*   |
| `super`       | Some brawlers expose `*_super_vo_*` too         |
| `start`       | Match / round start taunt                      |
| `lead`        | Intro / spotlight lead-in line                  |
| `kill`        | Kill confirmation line                          |
| `hurt`        | Taking-damage grunt                             |
| `die`         | Death / knock-out grunt                         |
| `push`        | Pushed / knockback reaction                     |

> Not every brawler has every category. Any of `atk`, `ulti`, `super`,
> `start`, `lead`, `kill` are usable as a brawler's "voice".

---

## 4. Steps to find & download a brawler's voice

### 4.1 — Pick a working game version

Any of the mirror's version folders work. Verified available: `68.250`,
`67.264`, `66.262` (the `sfx` folder exists in all of them).

```bash
curl -s "https://api.github.com/repos/tailsjs/brawl-stars-assets/contents/68.250/sfx?per_page=100" \
  | grep -o '"name": *"[^"]*"'
```

### 4.2 — Find the exact VO filenames for a brawler

List the `sfx` folder and filter for the brawler's `*_vo_*.ogg` files:

```bash
# e.g. all Leon voice lines in version 68.250
curl -s "https://api.github.com/repos/tailsjs/brawl-stars-assets/contents/68.250/sfx?per_page=100&page=1" \
  | grep -o '"name": *"[^"]*"' \
  | grep -iE '^leon.*_vo_.*\.ogg$'
```

💡 The `sfx` folder has hundreds of files and is paginated. If a brawler's
files aren't on page 1, bump `page=2..15` and repeat the grep.

### 4.3 — (Optional) Health-check a file before downloading

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/68.250/sfx/leon_ulti_vo_01.ogg"
# 200 = exists   |   404 = doesn't exist under that name
```

### 4.4 — Download the file into the brawler's folder

```bash
cd project_cool_edit/assets/brawler_voices
mkdir -p leon

curl -sL -o leon/leon_ulti_vo_01.ogg \
  "https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/68.250/sfx/leon_ulti_vo_01.ogg"
```

Repeat for each `{type}_vo_{NN}` file you want (attack, super, taunt, etc.).

---

## 5. One-liner: download a full brawler voice set

```bash
B=leon; V=68.250
BASE="https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/$V/sfx"
mkdir -p "project_cool_edit/assets/brawler_voices/$B"
for type in atk_vo_01 atk_vo_02 ulti_vo_01 ulti_vo_02 start_vo_01 lead_vo_01 kill_vo_01; do
  curl -sL -o "project_cool_edit/assets/brawler_voices/$B/${B}_${type}.ogg" \
    "$BASE/${B}_${type}.ogg"
done
```

Only keep files that actually downloaded (`curl -sL` fails silently on a 404;
use the health-check step to confirm a file exists if it seems missing).
---

## 6. Verified: known-good filenames (version 68.250)

These were confirmed to return HTTP 200 during research. The shared prefix is
`{brawler}` (e.g. `leon`). Full example filenames:

| Brawler | Confirmed voice files |
|---------|-----------------------|
| leon    | `_ulti_vo_01`, `_ulti_vo_02`, `_start_vo_01`, `_lead_vo_01`, `_kill_vo_01` |
| max     | `_ulti_vo_01`, `_ulti_vo_02`, `_lead_vo_01`, `_kill_vo_01` |
| meg     | `_ulti_vo_01`, `_ulti_vo_02`, `_start_vo_01`, `_lead_vo_01`, `_kill_vo_01` |
| surge   | `_atk_vo_01`, `_atk_vo_02`, `_ulti_vo_01`, `_ulti_vo_02`, `_start_vo_01`, `_lead_vo_01`, `_kill_vo_01` |
| tara    | `_start_vo_01`, `_lead_vo_01`, `_kill_vo_01` |

Examples of full URLs:

```
https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/68.250/sfx/surge_atk_vo_01.ogg
https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/68.250/sfx/surge_ulti_vo_01.ogg
https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/68.250/sfx/tara_lead_vo_01.ogg
https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/68.250/sfx/leon_ulti_vo_01.ogg
```

---

## 7. Tying voices into an edit

After downloading, reference the file from a Remotion component relative to the
public dir (`assets/` is remapped as `public/`):

```ts
staticFile("brawler_voices/leon/leon_ulti_vo_01.ogg")
```

See existing usage in:

- `src/edits/brawl_forms/props.ts` (e.g. `brawler_voices/surge/surge_atk_vo_04.ogg`)
- `src/edits/brawl_best_char/props.ts` (e.g. `brawler_voices/surge/surge_atk_vo_04.ogg`)

---

## 8. Notes & gotchas

- The mirror may add/remove build versions; if `68.250` ever 404s, swap to
  another verified version (e.g. `67.264`, `66.262`) in the URL.
- Names are case-sensitive and match the brawler's game slug exactly.
- A brawler may not have an `atk_vo` file (e.g. `leon`, `max`, `meg`, `tara`
  had no `_atk_vo_*` in this build). In that case `ulti_vo` / `start` /
  `lead` / `kill` are the correct substitute voices.
- The GitHub API is rate-limited for anonymous use (~60 req/hr). Reuse a
  dumped file listing instead of re-fetching pages repeatedly.

---

# Brawler Pin Emotes & Expressions — How To Download

This section documents how to download official **Brawl Stars Pin Emotes** (Neutral, Happy, Angry, Sad, Special, Thanks, GG, Clap, Facepalm, Phew) and organize them into `project_cool_edit/assets/expressions/`.

---

## 9. Where official pin emotes come from

Official high-resolution transparent pin emotes are mirrored in:

```
AlecksDeee/Brawl-Stars-Pins
```

### URL Template for Pins:
```
https://raw.githubusercontent.com/AlecksDeee/Brawl-Stars-Pins/master/{CATEGORY}/{Brawler}_Pin-{CATEGORY}.png
```

- `{CATEGORY}` — one of: `Neutral`, `Happy`, `Angry`, `Sad`, `Special`, `Thanks`, `GG`, `Clap`, `Facepalm`, `Phew`
- `{Brawler}` — Capitalized brawler name (e.g. `Bibi`, `Hank`, `Frank`, `Edgar`, `Mortis`, `Crow`, `Leon`, `Surge`, `Max`, `Meg`, `Tara`, `Kenji`)

### Examples of Raw Download URLs:
```
https://raw.githubusercontent.com/AlecksDeee/Brawl-Stars-Pins/master/Angry/Bibi_Pin-Angry.png
https://raw.githubusercontent.com/AlecksDeee/Brawl-Stars-Pins/master/Happy/Bibi_Pin-Happy.png
https://raw.githubusercontent.com/AlecksDeee/Brawl-Stars-Pins/master/Neutral/Bibi_Pin-Neutral.png
https://raw.githubusercontent.com/AlecksDeee/Brawl-Stars-Pins/master/Sad/Bibi_Pin-Sad.png
```

---

## 10. Expressions Folder Structure

All expression pins live under:

```
project_cool_edit/assets/expressions/<brawler>/
```

### Standard Naming Convention:
```
expressions/<brawler>/
├── angry.png         ← Angry pin
├── happy.png         ← Happy pin
├── normal.png        ← Neutral default pin
├── sad.png           ← Sad / crying pin
├── special.png       ← Special / heart / hyper pin
├── thanks.png        ← Thanks / thumbs-up pin
├── gg.png            ← GG pin
├── clap.png          ← Applause / clapping pin
├── facepalm.png      ← Facepalm / sigh pin
└── phew.png          ← Phew / sweat-wipe pin
```

---

## 11. Tying expressions into an edit

In `brawl_forms` and other templates, reference the expression pin via:

```ts
iconSrc: "expressions/bibi/angry.png"
```