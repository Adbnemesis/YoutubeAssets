# Reference vs Generated — Deep Comparison (Frame-by-Frame, v2)

Method: both videos extracted at 10fps (270×480), mean RGB compared per 0.1s
across all 18.6s. Reference = `Who is the best epic brawler in brawl stars...mp4`,
generated = `shorts/sample/BrawlRankingSampleScene.mp4`.

## Verified matching phases (measured values)

| Time | Reference mean RGB | Generated mean RGB | Match |
| :--- | :--- | :--- | :--- |
| 1.4s (intro word) | (54,53,45) | (60,70,48) | ✓ |
| 3.5s (red grid reveal) | (109,37,35) | (134,52,39) | ✓ |
| 4.2s (red decay) | (72,56,41) | (86,48,36) | ✓ |
| 5.1s (D-slam green flash) | (57,111,36) | (42,125,64) | ✓ |
| 7.0s (fight) | (67,74,58) | (53,56,45) | ✓ |
| 10.4s (purple phase) | (67,54,67) | (70,63,66) | ✓ |
| 12.8s (winner gold) | (229,209,85) | (248,196,45) | ✓ |
| 14.2s (cyan) | (137,180,200) | (94,210,214) | ✓ |
| 16.2s (blue) | (93,170,210) | (94,182,198) | ✓ |
| 17.9s (yellow outro) | (223,216,164) | (208,210,190) | ✓ |

## Mistakes found (from the v1 render) and fixes applied

1. **Intro was flooded red** — the red grid-reveal overlay used
   `interpolate(..., extrapolateLeft: "clamp")`, which pinned it at 0.55 opacity
   for the whole intro (96% of pixels red). Fixed: only render the tint after the
   reveal frame. Also removed the heavy warm overlay that amplified red; the
   reference intro is the tier list's own colors (bright left strip + dark body
   + green word), not a red wash.

2. **Intro font color** — reference text measured as spring green
   ≈ RGB(45,216,133) = `#2ED885`. Generated word now uses that exact green with a
   dark green stroke + layered glow (was a lime gradient).

3. **Grid reveal red tint** — reference decays red over ~1.5s (3.0–4.5s).
   Added a red overlay decaying 0.55→0 over 48 frames after B7. Verified (3.5s,
   4.2s rows above).

4. **D-slam green flash** — reference slams at ~4.9s (B11) with a full-screen
   green flash. Moved `slamFrame` from B10 to B11, dislike pins to B11, and
   boosted the green flash (0.9 / 8 frames). Verified at 5.1s.

5. **Fight-phase backgrounds were static dark** — reference dims (6.1–6.5),
   push-brightens (6.6–7.5), warms (8.5), goes purple (10.2), then grey-blue
   (11–12.5). Added per-beat `colorCycle` entries for all of these. Purple
   verified (10.4s row above).

6. **Winner per-beat colors misaligned** — re-measured the reference's exact
   per-beat colors: B27 gold, B28–29 pink, B30–31 cyan, B32 warm, B33 cyan-green,
   B34–35 blue, B36 warm, B37 white, B38 yellow. Rebuilt the `colorCycle` to
   match; gold/cyan/blue/yellow all verified.

7. **Winner title card too long** — reference gold reveal is only ~0.5s then the
   showcase colors start. Shortened the title phase to B27–B28.

8. **White flashes** — added the reference's brief white flash at B29 and the
   climax flash at B37.

## Remaining minor deltas

- **Intro brightness**: reference intro is brighter (mean ~103) than generated
  (~64). The left strip is equally bright; the body reads slightly darker.
- **13.6s pink**: the generated Kenji character model (white kimono/apron) makes
  the mean lighter than the reference's pink card. Cosmetic.
- **17.3s white flash**: lands ~4 frames after the reference (beat-grid rounding).
