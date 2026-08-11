# Brawl Stars Trio Edit Blueprint (brawl_cool_trio)

Reference: `src/edits/brawl_cool_trio/references/trio_edit.mp4`

## 📊 Reference Video Analysis

| Property | Value |
|---|---|
| Resolution | 1080x1080 (square) |
| Frame rate | 60 fps |
| Duration | 14.48s (869 frames) |
| Codec | H.264 + AAC |
| Audio tempo | ~105 BPM |

The reference is a **Hunter x Hunter** anime AMV-style edit with an extremely aggressive cut rhythm (dozens of cuts, ~229 audio onsets in 14.5s). It is **character-card driven**: characters appear as high-contrast manga-style stills with colored glows, glitch/scanline/chromatic-aberration overlays, and full-screen flash-cuts.

> [!NOTE]
> For the Brawl Stars version, replace the anime characters with Brawl Stars brawler art (the shared `assets/images/<brawler>/` panels and `assets/brawler_gifs/*_win.webm` reveal clips). The timing/structure below is what we replicate.

---

## 🎬 Structure Overview (4 phases)

```
Phase 1  Trio Intro Card       0.00s – 2.80s
Phase 2  Character Pair Rush   2.80s – 6.90s
Phase 3  Moody Blue Section    6.90s – 9.90s
Phase 4  Climax (Green→Red)    9.90s – 14.48s
```

The palette shifts by phase — this is the "story" the cuts tell:
**Monochrome/trio → neon pairs → cold blue → hot red finale.**

---

## Phase 1 — Trio Intro Card (0.00s – 2.80s)

Three characters side-by-side, full-body, high-contrast B&W manga style. Center character has a colored aura. "TRIO" title text bottom-center. Scanlines + chromatic aberration overlay throughout.

| Time | Visual |
|---|---|
| 0.00–0.60 | Trio appears with spring/glitch-in. Title text "BRAWL TRIO" bottom-center |
| 0.60–1.00 | Loudness spike (0.44) — punch cut / flash on beat |
| 1.00–2.15 | Hold trio card; title + glitch bars sweep across |
| 2.15 | Cut 1 — re-frame trio, more aggressive glitch |
| 2.42 | Killua-style focus shift: center char highlighted w/ yellow aura |
| 2.80 | End of intro, transition into rapid pair cuts |

> [!TIP]
> For Brawl Stars: the "trio" = the 3 brawlers of the video (e.g. Crow / Leon / Tara). Use their panels side-by-side with each brawler's aura color. Reuse the `GlitchEffect`/`FlashTransition` building blocks from `brawl_forms`.

---

## Phase 2 — Character Pair Rush (2.80s – 6.90s)

Fast hard cuts (~0.4–0.6s apart) between 2-character cards. Characters alternate left/right with **contrasting aura colors** (cyan vs yellow, blue vs orange). Every cut = a beat impact.

| Time | Cut | Visual |
|---|---|---|
| 2.82 | 1 | Char A (left) + Char B (right), yellow glow on B |
| 3.27 | 2 | Char C (left) + Char D (right), "name tag" text bottom |
| 3.80 | 3 | New pair, centered layering |
| 4.20 | 4 | Killua/Illumi pair — cyan + yellow split |
| 4.40 | 5 | Split-screen: same character two poses |
| 4.68 | 6 | Pair with yellow/blue glitched outlines |
| 5.12 | 7 | Pair w/ sidekick; cyan + yellow auras |
| 5.52 | 8 | Pair, one leaning forward (depth) |
| 6.10 | 9 | Pair, cyan + yellow |
| 6.38 | 10 | 3-char neon composition (build back to trio) |
| 6.88 | 11 | Trio datamosh — start of transition |

> [!IMPORTANT]
> **Every cut lands on a musical accent.** The audio onsets cluster at ~0.4s intervals here. In Remotion, `dropCuts`-style arrays drive these hard cuts — no easing, straight cuts with a 3-frame white `FlashTransition` on each.

---

## Phase 3 — Moody Blue Section (6.90s – 9.90s)

Palette flips to **deep navy / black / electric blue**. Characters rendered as dramatic close-ups or standing poses in ruined/scenic backgrounds with heavy blue glow. Text overlays appear bottom-center ("THOSE DAYS", "@handle" style watermarks).

| Time | Cut | Visual |
|---|---|---|
| 6.97 | 1 | Abstract motion-blur, blue, watermark |
| 7.30 | 2 | Char A wide pose, ruined bg, blue aura |
| 7.40 | 3 | Char B wide pose, ruins, blue aura |
| 7.60 | 4 | Abstract glitch, blue |
| 7.93 | 5 | Char A close-up, blue outline, B&W |
| 8.00 | 6 | Char B center, "THOSE DAYS." text |
| 8.10 | 7 | Char C close-up glitch, electric blue |
| 8.42 | 8 | Char A face close-up, big eyes, "KILLUASENPAI" |
| 8.53 | 9 | Char D face close-up, blue glow |
| 8.60 | 10 | Char C tilted close-up, blue aura |
| 8.72 | 11 | Abstract glitch, "MEMOSENSE" |
| 9.08 | 12 | Layered 3-char composition, blue neon |
| 9.80–9.93 | 13–14 | Glitchy close-up, start of green shift |

> [!NOTE]
> This section feels **sadder/calmer but still cut-per-beat** (~0.3–0.5s per cut). For Brawl Stars: use the brawlers' sad/angry **expression pins** (`assets/expressions/<brawler>/...`) as close-up cards and blue-tint the auras. Text overlays can be the brawler names in the Brawl Stars font (`assets/fonts/brawl_stars.ttf`).

---

## Phase 4 — Climax: Green Glitch → Red Finale (9.90s – 14.48s)

Two-part finale. First a **forest-green glitch storm** (~9.9–11.0s), then the **red hot climax** (~11.0–14.48s) with silhouette → full-power pose → quote text.

### Part A: Green Glitch Storm (9.90s – 11.00s)

| Time | Cut | Visual |
|---|---|---|
| 9.88–10.37 | 1–3 | Distorted close-up, forest green, heavy scanlines |
| 10.47–10.93 | 4–5 | Silhouette w/ weapon (knife), neon green aura |
| 10.93 | 5 | Menacing pose, green outline |

### Part B: Red Finale (11.00s – 14.48s)

| Time | Cut | Visual |
|---|---|---|
| 11.50 | 1 | **Silhouette** — dark figure center, fiery orange/green bg (this is the "drop") |
| 11.90 | 2 | Silhouette muscular pose, black/red |
| 12.08 | 3 | Silhouette full-body, red |
| 12.50 | 4 | **Power pose** — arms wide, saturated red, speech-bubble quote text ("...LIMIT EVIL... / ...AND KILL EVERY-ONE!") |
| 12.77 | 5 | Face silhouette, red watermark |
| 13.35 | 6 | Abstract red landscape, "BRAWL TRIO" title |
| 13.45 | 7 | Low-angle combat pose, white/red energy, vertical lyric box ("FLOWING WATER ROCK SMASHING FIST!") |
| 13.82 | 8 | Two chars overlapped, red glitch |
| 14.00–14.48 | 9 | Final pose, red bg, lyric text — hold to end |

> [!IMPORTANT]
> **The drop is at ~11.50s** (the loudness peak 0.63 at 11.2s). The silhouette lands here. Everything before (green storm) is the build-up riser; everything after is the payoff.

---

## 🎯 Sync Rules (How photos/videos are synced)

1. **The "1+3" Finale Pattern (CRITICAL):** When a brawler's main section plays (e.g. at 7.5s, 9.5s, 11.5s), you MUST follow this exact "1+3" rhythm pattern to ensure maximum impact and beat alignment:
   - **(1) Silhouette Phase (~0.50s):** The brawler's win `.webm` rendered as a solid color silhouette slides up from the bottom.
   - **(1b) Seamless Reveal Phase (~0.37s to ~0.64s):** The same `.webm` snaps to full color. To prevent the GIF from repeating or jumping backwards, the reveal's `videoStartFrame` MUST perfectly match the silhouette's frame duration (e.g. `videoStartFrame: 15`).
   - **(+3) Action Clips (The "+3" Rule):** Exactly 3 fast-cut static action panels of the brawler must follow the Reveal. These must be perfectly synchronized to the dominant musical beats (aiming for ~0.35s to ~0.58s per clip).
   
2. **Exact "1+3" Sync Timings (Per Brawler):** Use these exact timings for the 1+3 pattern so that the rhythm feels perfectly synced and readable:
   - **~7.5s Edgar VO →** `edgar_win.webm` Silhouette (7.40-7.90) → Reveal (7.90-8.27, `videoStartFrame: 15`) → 3 Action Clips (8.27-8.62, 8.62-8.97, 8.97-9.30) using panels 1, 4, 7.
   - **~9.5s Mortis VO →** `mortis_win.webm` Silhouette (9.30-9.80) → Reveal (9.80-10.23, `videoStartFrame: 15`) → 3 Action Clips (10.23-10.59, 10.59-11.16, 11.16-11.74) using panels 3, 6, 9.
   - **~11.5s Kenji VO →** `kenji_win.webm` Silhouette (11.74-12.24) → Reveal (12.24-12.88, `videoStartFrame: 15`) → 3 Action Clips (12.88-13.46, 13.46-14.04, 14.04-14.48) using panels 2, 5, 8.

3. **Retention Glitch Effects (Intro):** The first 2.8s (Trio intro) must inject `heavy_glitch`, `rgb_shift`, and `flash` effects heavily into the `effects` array. Because the initial cards are mostly static, these intense visual effects are CRITICAL to artificially create high energy and drive viewer retention right from frame 1.

4. **One visual per audio accent.** Outside of the 1+3 finale, the video cuts at ~0.4s cadence (60fps → every ~24 frames). Each new card/photo lands exactly on an onset.

5. **Color tells the phase.** Monochrome+1 aura → pairs → blue → green → red. Keep each phase's hue consistent.

---

## 🧩 Building Blocks to Reuse

From `src/edits/brawl_forms/templates/`:
- `GlitchEffect.tsx` — scanlines / glitch overlays
- `FlashTransition.tsx` — white flash on every cut
- `MangaPhonkClip.tsx` — static-image reveal w/ silhouette support (`isSilhouette` + `silhouetteColor`)

Shared assets (via `assets/` public dir):
- Brawler panels: `images/<brawler>/<brawler>_panel_N.png`
- Expression pins: `expressions/<brawler>/<pin>.png`
- Reveal webms: `brawler_gifs/<brawler>_win.webm`
- Fonts: `fonts/brawl_stars.ttf`
- SFX: `sound_effects/*` (e.g. `crow_throw_01.mp3`, `brawl_super.mp3`)

## 📁 Location of Assets
- Reference Video: `src/edits/brawl_cool_trio/references/trio_edit.mp4`
- Extracted Audio (TIMING-REFERENCE ONLY): `src/edits/brawl_cool_trio/data/trio_edit.wav`
- Sample Audio (Kenji/Mortis/Edgar, render-ready): `assets/audio/sample_audio.wav`
- Tempo: ~105 BPM, duration 14.48s

> [!NOTE]
> Remotion serves static files from the public dir (`assets/`), so the render-ready sample audio lives at `assets/audio/sample_audio.wav` (referenced via `staticFile("audio/sample_audio.wav")`). The raw reference audio stays in the edit's `data/` folder as the timing source.

> [!WARNING]
> **The extracted `trio_edit.wav` contains the anime characters' voices baked into the mix (~54% voice-band content). Do NOT use it as the final audio track.** It exists only so we can measure the exact cut/onset timestamps against the video. For the Brawl Stars render:
> - **Music/BGM:** play the phonk track directly (e.g. `sound_effects/ranking_1_phonk_bgm.mp3`) synced to the same timeline — no anime voices.
> - **Voices:** use each brawler's own VO from `assets/brawler_voices/<brawler>/<file>.ogg` (e.g. `crow/attack.ogg`, `leon/leon_ulti_vo_01.ogg`, `tara/tara_kill_vo_04.ogg`) layered at the same spots the anime VO energy appears (check the voice-band chart in the analysis).
> - **SFX:** layer `sound_effects/*` hits on the cuts as in `brawl_forms`.

> [!NOTE]
> **`sample_audio.wav`** is the reference edit's own music (anime vocals stripped via demucs) with Edgar/Mortis/Kenji VO layered at the decided placements (~7.5s / ~9.5s / ~11.5s, no intro VO) — demonstrating what the brawl audio should sound like. The Remotion template should still layer the music, per-form `sfxSrc` VO, and SFX separately (like `brawl_forms`) so volumes are tweakable live.

### 🎙️ Where the Anime VO Appeared (→ place Brawler VO here)
Voice-band analysis of `trio_edit.wav` (300–3000 Hz energy ratio). The dense voice windows map to the reference's dialogue/grunt moments — these are where brawler VO should land:

| Window | Phase | Suggested Brawler VO |
|---|---|---|
| 0.72 – 3.48s | Intro / Pair Rush | attack VO of the 3 brawlers (one per character card) |
| 3.55 – 3.92s | Pair Rush | attack VO on the hard cut |
| 4.39 – 4.74s | Pair Rush | super VO |
| 5.09 – 6.36s | Pair Rush | attack / taunt VO |
| 6.43 – 8.66s | Moody Blue | sad/angry pin VO style (ult/taunt) |
| 9.03 – 10.26s | Green storm | hypercharge / super VO |
| 11.68 – 13.93s | Red finale (drop + power pose) | biggest VO: super + kill line + ult layered on the 12.50s power pose |

> [!NOTE]
> Keep VO volume low relative to the BGM (~0.5–0.7) exactly like the `sfxSrc` handling in `brawl_forms` (each form's `sfxSrc` already does this pattern).

> [!IMPORTANT]
> **Exact VO Sync Timestamps (brawl_cool_trio):** No brawler VO in the intro at all. The BGM track must place exactly **3 brawler voice lines** strictly synchronized to the Silhouette → Reveal drops for maximum impact. The intro (0–7s) is music-only.
> 
> When mixing the audio, trigger the voice lines at these exact times:
> - **Brawler 1 (e.g. Edgar): Start VO at exactly 7.40s**. This matches the silhouette start, allowing the voice windup to happen in the dark and the "shout" to peak exactly at the 7.90s visual reveal drop.
> - **Brawler 2 (e.g. Mortis): Start VO at exactly 9.30s**. This allows the voice to peak exactly at the 9.80s visual reveal drop.
> - **Brawler 3 (e.g. Kenji): Start VO at exactly 11.74s**. This allows the voice to peak exactly at the 12.24s visual reveal drop.
>
> This **overrides** the analysis table above — the table documents where the *anime* voices appeared in the reference, but for the brawl edit only the 3 exact placements above are used.

> [!TIP]
> **Visual Effects Engine (`effects` array):**
> 1. **Hits/Impacts:** Use `["heavy_glitch"]` or `["flash"]` to mark the exact timestamp of an action hit (e.g. punches/slashes).
> 2. **Breathers & Transitions:** Use `["dark_fade", "rgb_shift"]` to sink the viewer into a transition just before a massive reveal.
> 3. **Power Poses:** Use `["sustained_rgb_shift"]` during finale sequences to simulate heavy chromatic camera shake.
>
> In `props.ts`, each brawler section explicitly uses `effects` arrays to map exact visual hits to the raw micro-cuts.
>
> The intro (0–2.8s) uses heavy glitch overlays. In `props.ts`, each brawler section explicitly uses `effects` arrays to map exact visual hits to the raw micro-cuts.

---

## ✅ Status: Wired into Remotion

The `BrawlCoolTrio` composition is built for **Kenji / Edgar / Mortis**:

- `src/edits/brawl_cool_trio/templates/TrioCard.tsx` — card renderer (single / pair / trio layouts, silhouette + reveal, auras, text overlays, phase tints, scanlines)
- `src/edits/brawl_cool_trio/templates/TrioPhonkTemplate.tsx` — main template (cards as sequences, flash on every cut, glitch overlays in green-storm + red-finale phases, intro title)
- `src/edits/brawl_cool_trio/props.ts` — full card timeline following the phase tables above
- `src/edits/brawl_cool_trio/index.tsx` + `src/Root.tsx` — registered as `BrawlCoolTrio` (1080x1080, 60fps, 869 frames)

Render with:
```bash
npx remotion render src/index.tsx BrawlCoolTrio out/BrawlCoolTrio.mp4
```

To tweak a card's art/color/text, edit `src/edits/brawl_cool_trio/props.ts`. To change the cut timestamps, adjust each card's `startTime`/`endTime` there.
