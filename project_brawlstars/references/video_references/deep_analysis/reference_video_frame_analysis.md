# Frame-By-Frame Analysis — "Who is the Best Epic Brawler in Brawl Stars"

> Measured from the actual reference file (NOT the 30fps doc — that doc mis-scaled the frame count).
> **Real specs**: 720x960 @ 59.9fps, **1115 frames, 18.62s total** (the old guide claimed 37.2s @ 30fps — wrong).
> **BGM**: `ranking_tier_list.mp3`, 126 BPM, 79s. Video audio == BGM starting at **offset 8.4990s** (verified by cross-correlation, top candidate 8.4980-8.4991s).
> **Beat grid**: 126 BPM → beat = 0.4762s = 14.29 frames @ 30fps. Measured beats (video time): 0.15, 0.64, 1.13, 1.60, 2.08, 2.57, 3.04, 3.54, 4.02, 4.48, 5.00, 5.44, 5.92, 6.40, 6.87, 7.36, 7.84, 8.31, 8.80, 9.28, 9.75, 10.24, 10.72, 11.19, 11.68, 12.16, 12.64, 13.12, 13.59, 14.07, 14.56, 15.03, 15.51, 16.00, 16.47, 16.96, 17.44, 17.91, 18.40.

---

## Dialogue (whisper word timestamps)

| Start | End | Text |
| :--- | :--- | :--- |
| 0.00 | 0.40 | Who |
| 0.40 | 0.60 | is |
| 0.60 | 0.72 | the |
| 0.72 | 1.06 | best |
| 1.06 | 1.38 | epic |
| 1.38 | 2.10 | brawler |
| 2.10 | 2.88 | in Brawl Stars? |
| 8.16 | 9.78 | "I smell zombie!" (meme interjection, low-confidence transcription) |

Second voice line sits exactly on a music breakdown (audio RMS drops to ~0.06 at 7.8-8.0s, voice rides 8.2-9.8s over a build).

The supplied `scene01_kenji.wav` (2.96s) speaks the intro line "Who is the best brawler in Brawl Stars?" with word timings: Who 0.00-0.46, is 0.46-0.68, the 0.68-0.80, best 0.80-1.06, brawler 1.06-1.56, in 1.56-1.76, Brawl 1.76-2.14, Stars? 2.14-2.34.

## Music energy map (reference audio RMS, 0.2s bins)

- 0.00-2.90: music ducked under intro voice (RMS 0.28-0.66, words crest at ~0.65)
- 3.00-5.40: full music (RMS 0.82-0.84) — tier-list act, kick-heavy
- 5.40-5.90: brief dip (0.42-0.76) — mini-breakdown
- 6.60-8.00: energy collapse 0.35 → 0.06 — breakdown before 2nd voice
- 8.20-9.80: voice rides build (0.34-0.53)
- 10.6-12.5: mid-energy beat run
- 12.6-13.2: drop (0.65) — GOLD flash scene
- 13.6-14.0: peak 0.78 — beat drop
- 14.6-18.0: high energy alternation (0.63-0.76) with color-switch per beat
- 18.3-18.6: fade to black + music fade

## Visual phase map (per-frame color analysis @ 10fps)

| Video time | Beat | Mean RGB | Event |
| :--- | :--- | :--- | :--- |
| 0.00-0.10 | B1 | dark (38,39,29) | "WHO" pops center |
| 0.13-0.47 | B1-B2 | dark green, bright band climbs 3→19% | word line settles top-third; roster appears top |
| 0.50-0.83 | B2-B3 | mid brightens 77→92 | more words fill |
| 1.03-1.33 | B3-B4 | bright line at 30% height, top stays lit | stacked title layout |
| 1.37-1.83 | B4-B5 | green channel spikes at 30% band | "EPIC"/"BRAWLER" emphasis |
| 2.90-3.00 | B7 | RED FLASH (188,6,8) frame-diff 73 | transition 1: whoosh + red flash + motion-blur wipe |
| 3.0-4.8 | B7-B10 | red decaying to olive (142→66, G rising) | tier-list grid on red tint, kick beats |
| 4.9-5.2 | B11 | GREEN FLASH (35,243,11) | brawlers slam into D-tier + pop SFX |
| 5.2-6.0 | B12-B13 | stable olive grid (66,60,44) | grid idle |
| 6.1-7.5 | B14-B16 | brightens 51→85 | slow push-in on grid |
| 8.5-8.7 | B18 | warm shift (66→79 R>G>B) | scene change, 2nd voice |
| 9.3-10.1 | B20-B21 | warm bright (83-100) | answer brawler showcase |
| 10.2 | B22 | PURPLE shift (B>R 65,52,64), diff 92.6 | purple winner phase |
| 11.2-12.3 | B24-B26 | purple, slow build | build-up |
| 12.6 | B27 | GOLD FLASH (235,189,47), diff 130 | S-tier gold reveal |
| 12.6-13.0 | B27-B28 | gold | gold card |
| 13.5 | B29 | bright flash (229,213,224) | color switch |
| 13.6-14.0 | B29-B30 | pink/magenta (188,99,159) | pink card |
| 14.0-14.4 | B30 | cyan/white (213,247,251) | cyan card |
| 14.5-14.9 | B31 | blue then magenta (177,92,161) | blue→magenta |
| 15.0-15.3 | B32 | yellow (232,188,57) | yellow card |
| 15.4 | B33 | cyan-white (202,231,197) | cyan |
| 15.5-16.3 | B34 | cyan-blue (85,174,216) | blue |
| 16.4-17.2 | B35-B36 | magenta/warm (195,150,144) | magenta |
| 17.3 | B37 | WHITE FLASH (218,244,242) | climax flash |
| 17.4-17.7 | B37 | cyan | cyan card |
| 17.8 | B38 | white-yellow (225,251,220) | outro flash |
| 18.3-18.6 | — | fade 234→41 gray→black | fade out |

Key finding: **from B27 onward every single beat switches the background color** (gold→pink→cyan→blue→magenta→yellow→cyan→white). The edit is a beat-synced color-language video.

## Editing rhythm

- 39 beats in 18.62s → every visual event sits on the 0.48s beat grid.
- No hard cuts — continuous animation with flashes/wipe transitions as "cut" equivalents.
- Intro: one text word pops per beat for 7 beats.
- Transitions: screen flash (2-4 frames) + whoosh/riser SFX + vertical motion blur.
- Dialogue: words never lock to text; text is beat-driven, voice is speech-driven.
- Winner showcase: background color changes every beat; flashes on downbeats.

## Why every edit exists

1. Word pops on beats = retention hook; keeps eye busy during monotone voice.
2. Music ducks under voice (reference mixes dialogue over quiet bed, then slams full width on B7).
3. Color-per-beat showcase = "phonk edit" language; every drop gets a visual hit.
4. Flash transitions = cheap, fast way to suggest cuts without losing continuous motion.
5. Breakdown at 6.6-8.0s sets up the meme voice line on a fresh build.

---

## Correction: the deep_analysis.md frame numbers ARE real frame numbers (@59.9fps)

The earlier `who_is_the_best_epic_brawler_deep_analysis.md` lists events by frame
(172, 286, 355, 488, 541, 604, 747, 901, 1001) but assumed 30fps (→ 37.2s).
The frames are actually from the 59.9fps video. Dividing by 59.9 makes them match
the measured visual events exactly:

| Doc frame | Real time (÷59.9) | Beat | Event |
| :--- | :--- | :--- | :--- |
| 172 | 2.87s | B7 | Transition 1 → tier grid |
| 286 | 4.78s | B10 | D-tier slam (👎 pins) |
| 355 | 5.93s | B13 | B-tier promotion (cyan splash) |
| 488 | 8.15s | B18 | A-tier promotion (glitch box) |
| 541 | 9.03s | B19 | S-tier reveal (domino + 💖) |
| 604 | 10.08s | B21 | Final candidate to S-tier |
| 747 | 12.47s | B27 | Winner title card (purple) |
| 901 | 15.04s | B32 | Spin showcase (per-beat colors) |
| 1001 | 16.71s | B35 | Outro card (cyan) + fade |

The grid is a full-screen 5-row tier list (S,A,B,C,D) with the tier list image's
label column cropped into a left strip and cards overlaid in ~192px rows
(720-wide: 5 card slots at x150–630, left strip x0–90).
