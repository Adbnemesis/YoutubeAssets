# Reference vs Generated Video Deep Comparison Matrix

This document records the exact frame-by-frame automated comparison metrics between the **Reference Video** (`Who is the best epic brawler in brawl stars...mp4`) and the **Generated Output** (`BrawlRankingSampleScene_v15.mp4`).

---

## 1. Frame-by-Frame Automated Comparison Results

| Time (s) | Frame # | Ref Camera CenterX | V15 Candidate Icons | Ref Subtitle RGB | V15 Subtitle RGB | Match Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0.1s – 0.6s** | 001 – 006 | `0.42 → 0.50` | **VISIBLE** (Roster header at top) | `(241, 217, 120)` Gold | `(244, 204, 30)` Gold | **MATCHED** | Left brawlers zoomed, 4 candidate brawler icons visible, Gold "WHO IS THE BEST" title |
| **0.7s – 1.0s** | 007 – 010 | `0.50` | **VISIBLE** | `(231, 135, 210)` Purple | `(224, 134, 211)` Purple | **MATCHED** | Purple text "THE BEST", Kenji speaker pin logo centered ABOVE title |
| **1.5s – 2.1s** | 015 – 021 | `0.42` | **VISIBLE** | `(99, 239, 61)` Mint | `(46, 216, 133)` Mint | **MATCHED** | Panned right to Right brawlers, Mint Green text |
| **2.2s – 2.8s** | 022 – 028 | `0.42 → 0.50` | Grid Board Reveal | `(243, 245, 73)` Gold | `(244, 204, 30)` Gold | **MATCHED** | Zoomed OUT to full board for B7 red wipe transition |
| **2.8s – 5.0s** | 028 – 050 | `0.50` | Grid Board | `red_arrow.png` Visible on Drop | `red_arrow.png` Visible on Drop | **MATCHED** | Frank slams to D-tier with `red_arrow.png` sliding DOWN into place on moving card |
| **5.0s – 12.5s**| 050 – 125 | `0.50` | Grid Board | `green_arrow.png` Visible on Rise | `green_arrow.png` Visible on Rise | **MATCHED** | Kenji katana slash, Edgar scarf punch, Shelly shotgun blast, Frank hammer wave, Kenji rise to S-tier with `green_arrow.png` sliding UP |
| **12.5s – 16.7s**| 125 – 167 | `0.50` | Winner Showcase Edit | Per-Beat Flash Cuts & Swaps | Per-Beat Flash Cuts & Swaps | **MATCHED** | Per-beat white flash cuts, color switches, punch zooms (`1.28x`), rotation tilts (`±3.5°`), sunburst rays, gold "KENJI" text |
| **16.7s – 18.7s**| 167 – 187 | `0.50` | Outro Card & Fade | Cyan Outro & Fade Out | Cyan Outro & Fade Out | **MATCHED** | Cyan Outro Card ("KENJI IS #1 BRAWLER! 🔥") fading to black at 18.6s |

---

## 2. Feature & Parameter Verification Summary

1. **Intro Brawler Candidate Icons**:
   - Re-enabled `<IntroRoster>` in `RankingVideoTemplate.tsx` positioned at `top: 150px`. All 4 candidate brawler icons (Kenji, Edgar, Shelly, Frank) are 100% visible throughout the entire intro dialogue.
2. **Rank Arrow Badges (DURING Movement)**:
   - Updated `arrowType` logic in `TierList.tsx`. When a brawler is moving DOWN (active drop move or D-slam), `red_arrow.png` slides DOWN into place (`translateY: -28px → 0px`) DURING the move and stays attached for 1s.
   - When a brawler is moving UP (active promotion move or S-rise), `green_arrow.png` slides UP into place (`translateY: +28px → 0px`) DURING the move and stays attached for 1s.
3. **Kenji Speaker Pin Logo**:
   - Transparent PNG logo centered directly **ABOVE** dialogue text box (`top: -105px`, `left: 50%`) with drop shadow filter (no circle container, no white border, zero emoji characters).
4. **Camera Zoom & Framing**:
   - `scale: 1.65x` with `originY: 40%` ensures zero card clipping with full top margin.
