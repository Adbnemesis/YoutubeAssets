# Master Reference Editing Guide & Deep Analysis — "Who is the Best Epic Brawler in Brawl Stars"

> **Reference Video File**: `project_brawlstars/references/video_references/ranking_videos/Who is the best epic brawler in brawl stars_🔥  #brawlstars   #supercell   #edit   #shorts.mp4`  
> **Clean BGM Asset**: `project_brawlstars/commonassets/shorts_bgm/ranking_tier_list.mp3`  
> **Official Font Asset**: `project_brawlstars/commonassets/fonts/brawl_stars.ttf`  
> **Video Duration**: `37.17 seconds` (1,115 frames @ 30fps)  
> **Clean BGM Alignment Offset**: **`8.4990 seconds` (Frame 254 in `ranking_tier_list.mp3`)**  
> **Music Tempo & Beat Grid**: `123.0 BPM` → `1 Beat = 14.634 frames (0.4878s)`  

---

## 🎵 Master BGM Timeline & Frame Alignment Map

This master reference table maps every single second of the **Clean BGM track (`ranking_tier_list.mp3`)** to the **Video Frame @ 30fps**, the **Phonk Beat Drop**, the **Voiceover / SFX**, and the **Exact Visual Mechanics**:

| Video Frame | Video Sec | BGM Track Sec | Beat # | Visual Mechanic, Camera Motion & Asset State | Audio Track / SFX Event |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Frame 0001` | `00.00s` | `08.50s` | `Beat 01` | **Phase 1 Intro**: Candidate roster row across top (`Hank`, `Ash`, `Pearl`, `Rt`). Word **"WHO"** pops up centered in green glowing Brawl Stars font (`#22C55E`). Sunglasses Mortis Pin top right begins tilt oscillation `rotate(sin(f * 0.12) * 8deg)`. | Voiceover starts: *"Who..."* |
| `Frame 0015` | `00.49s` | `08.99s` | `Beat 02` | Word **"IS"** pops up in center screen with spring scale `scale(1.18)` + radial green light burst. | Voiceover: *"...is..."* |
| `Frame 0027` | `00.91s` | `09.41s` | `Beat 03` | Word **"THE"** pops up with green neon glow shadow `0 0 35px #22C55E`. | Voiceover: *"...the..."* |
| `Frame 0041` | `01.37s` | `09.87s` | `Beat 04` | Word **"BEST"** pops up centered. Top roster portraits pulse scale `1.08`. | Voiceover: *"...best..."* |
| `Frame 0055` | `01.86s` | `10.36s` | `Beat 05` | Word **"EPIC"** pops up. Green glow shadow intensifies. | Voiceover: *"...epic..."* |
| `Frame 0070` | `02.35s` | `10.85s` | `Beat 06` | Word **"BRAWLER"** pops up in stacked vertical alignment. | Voiceover: *"...brawler..."* |
| `Frame 0084` | `02.81s` | `11.31s` | `Beat 07` | Text **"IN BRAWL STARS?"** pops up in large stacked layout. | Voiceover finishes: *"...in Brawl Stars?"* |
| `Frame 0172` | `05.73s` | `14.23s` | `Beat 13` | **TRANSITION 1**: Heavy bass drop + vertical motion blur wipe (`blur(0px 40px)`). Screen snaps from dark intro to full Tier List grid (S, A, B, C, D rows). | Heavy bass kick + `whoosh.mp3` SFX |
| `Frame 0286` | `09.53s` | `18.03s` | `Beat 21` | **STAGE 2 (D-Tier Slam Drop)**: Motion spike = `71.88`. All candidate brawlers drop simultaneously into D-tier row on the Phonk beat drop. Red angry dislike pin badges (`👎`) land on each portrait. | Heavy snare drop + `pop.mp3` x4 SFX |
| `Frame 0355` | `11.84s` | `20.34s` | `Beat 26` | **STAGE 3 (B-Tier Elevation & Liquid Splash)**: Brawler 1 (`Hank`) is elevated out of D-tier up to B-tier. An expanding **cyan liquid splash circle pool** (`#38BDF8`) bursts outward behind the portrait. | Phonk bass drop + liquid splash SFX |
| `Frame 0488` | `16.28s` | `24.78s` | `Beat 35` | **STAGE 4 (A-Tier Promotion & Glitch Box)**: Brawlers 1 & 2 (`Ash` & `Hank`) are promoted to A-tier simultaneously. A **cyan/purple digital glitch frame container** (`#06B6D4`) wraps around both portraits as they snap into place. | Digital glitch distortion SFX + drum roll |
| `Frame 0541` | `18.03s` | `26.53s` | `Beat 38` | **STAGE 5 (S-Tier Reveal & 3D Domino Explosion)**: Brawlers reach S-tier! **Pink heart love pin badges** (`💖`) overlay on top of their portraits. A **3D border box of 16 purple domino/brick tiles** expands outward around them on beat drop! | Phonk synth drop + brick crash SFX |
| `Frame 0604` | `20.13s` | `28.63s` | `Beat 42` | **STAGE 6 (Final Candidate S-Tier Elevation)**: Motion spike = `57.66`. Final brawler (`Rt` / `Edgar`) is elevated into S-tier with smoke and flash burst effects. | Bass impact + smoke burst SFX |
| `Frame 0747` | `24.90s` | `33.40s` | `Beat 52` | **TRANSITION 2 & STAGE 7 (Winner Title Card)**: Motion spike = `107.13`. Screen flashes white. Vibrant purple background (`#7C3AED`) with **double white border frame** appears. 3D metallic flame font title **"SHADE"** / **"EDGAR"** pops in center screen! | Phonk music climax + `brawl_match_win.mp3` SFX |
| `Frame 0901` | `30.03s` | `38.53s` | `Beat 62` | **STAGE 8 (High-Energy 3D Spin Showcase)**: Camera zooms in full-screen on orange/yellow background. Winner 3D brawler card spins 360° with colorful neon aura and pulse filters. | High-tempo Phonk synth loop |
| `Frame 1001` | `33.37s` | `41.87s` | `Beat 69` | **STAGE 9 (Final Outro Spotlight Card)**: Soft cyan/blue pastel backdrop (`#0284C7`) with **double white border frame**. Winner brawler stands centered in high resolution with title **"EDGAR IS #1 BRAWLER! 🔥"**. | Music fade-out + cheer SFX |

---

## 🎨 Exact Asset, Animation & Styling Specifications

### 1. Typography & Text Styling (`brawl_stars.ttf`)
- **Font Face**: `@font-face { font-family: 'BrawlStarsFont'; src: url('static/brawl_stars.ttf'); }`
- **Text Color**: Lime Green (`#22C55E`) fill with dark green stroke (`#15803D`).
- **Text Shadow Stack**:
  ```css
  text-shadow: 0 6px 0 #000000, 0 0 35px #22C55E, 0 0 70px #15803D;
  ```
- **Pop-In Physics**:
  ```tsx
  transform: `scale(${spring({ frame: frame % 28, fps: 30, config: { damping: 10, stiffness: 220 } })})`;
  ```

### 2. Candidate Roster Header
- **Positioning**: `top: 28px`, centered horizontally with `gap: 10px`.
- **Card Bounds**: `width: 90px`, `height: 90px`, `border-radius: 14px`.
- **Border & Shadow**: `border: 3px solid [Theme Color]`, `box-shadow: 0 4px 14px rgba(0,0,0,0.8), 0 0 15px [Theme Color]88`.

### 3. Reaction Pins
- **Sunglasses Mortis Pin**: Floating top right (`top: 150px`, `right: 50px`), circular border `4px solid #FFFFFF` with yellow glow `box-shadow: 0 0 25px rgba(234, 179, 8, 0.8)`. Continuous tilt oscillation `rotate(sin(frame * 0.12) * 8deg)`.
- **Red Dislike Pin (`👎`)**: Placed at `bottom: -6px`, `left: -6px` on D-tier icons.
- **Pink Heart Love Pin (`💖`)**: Placed at `top: -8px`, `right: -8px` on S-tier icons.

### 4. Progression FX Elements
- **Liquid Splash Circle Pool**: Expanding cyan circle (`#38BDF8`) positioned behind brawler icons during B-tier promotion (`Frame 355`).
- **Digital Glitch Box**: `3px dashed #06B6D4` container wrapping multi-brawler promotions in A-tier (`Frame 488`).
- **3D Domino Brick Tile Explosion**: 16 purple domino/brick tiles expanding outward in a rectangular container around S-tier portraits (`Frame 541 – 600`).

### 5. Winner Spotlight Screens
- **Phase 7 Title Card (`Frame 747`)**: Full-screen purple backdrop (`#7C3AED`) + double white border frame (`border: 6px solid #FFFFFF`, inset `30px`).
- **Phase 8 3D Spin Showcase (`Frame 901`)**: Orange backdrop (`#D97706`), 360° character spin rotation `rotate(${(frame - 901) * 8}deg)`.
- **Phase 9 Outro Card (`Frame 1001`)**: Cyan backdrop (`#0284C7`), double white border frame, high-res Edgar character pose + golden banner **"EDGAR IS #1 BRAWLER! 🔥"**.
