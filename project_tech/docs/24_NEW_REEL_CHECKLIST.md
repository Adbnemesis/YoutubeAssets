# 📋 NEMI EXPLAINS — STEP-BY-STEP REEL CREATION CHECKLIST

Use this exact step-by-step procedure to conceive, engineer, and render every new reel:

---

## Phase 1: Scripting & Concept Architecture
- [ ] **Choose Topic:** Focus strictly on **Tech / AI / DSA / Computer Science**. Everyday-mystery bias until APV ≥ 40% (`26_…PLAYBOOK.md`).
- [ ] **Draft Hook via Pattern Matrix (`06_HOOK_SYSTEM.md` §7):** Pick 2–3 patterns (unresolved contradiction / specificity / timeframe / POV). Hook's LAST word = the unresolved half. Log patterns used in the reel case study.
- [ ] **Voice starts immediately at Frame 0.**
- [ ] **Write Chained-Suspense Script:** 6 to 8 tight events totaling **60–70 words** (~19–22s at 180–200 WPM — hard cap 24s, floor 19s). Every line opens a question the next answers; zero full resolutions before the payoff.
- [ ] **Assign Mascot Punchline:** Ensure Nemi delivers the emotional realization and final technical punchline.
- [ ] **Draft Infinite Loop:** Outro sentence connects back to the opening line.
- [ ] **Duration Gate:** Confirm script length targets 19–22s BEFORE production (QR shipped 18.2s — under target; do not repeat).

---

## Phase 2: Audio Synthesis & Word-Level Alignment
- [ ] **Configure `generate_audio.py`:**
  - Narrator blocks in `Chatterbox Neural TTS` (`exaggeration=0.55 - 0.65`).
  - Nemi blocks in `Edge-TTS en-US-AnaNeural` (`pitch=+12Hz`, `rate=+20%`).
  - Select upbeat BGM track from `assets/background_music/`.
- [ ] **Run Audio Pipeline:**
  - Normalize voice to `-16.0 LUFS`.
  - Apply gentle musical sidechain ducking (`volume=0.52`, `ratio=2.5:1`, `threshold=0.08`, `attack=35ms`, `release=160ms`).
  - Master audio exported to `-15.0 LUFS`.
- [ ] **Extract Subtitles with `faster_whisper`:**
  - Automatically extract millisecond word timestamps and 3-5 word phrase chunks into `src/data/<reel>_cues.json`.

---

## Phase 3: Visual Engineering (Manim + Remotion)
- [ ] **Determine if Manim is needed:**
  - If topic involves math proofs, matrix transforms, or tree/graph algorithms, write Python Manim script and render to `1080x540 / 30fps`.
- [ ] **Build Remotion Composition (`<ReelComp>.tsx`):**
  - Use `StageWrapper` for seamless scene cross-fades (max 2 per reel — punch cuts otherwise, `07` §6.1).
  - Mount dynamic cards or embedded Manim `<OffthreadVideo>`.
  - Add `DynamicKaraokeCaptions` at `top: 1140px` (hidden when `nemiSpeech` is active).
  - Add synchronized SFX sequences (whoosh, pop, click, chime).
  - **Apply Visual Hook System v3 (`02_VISUAL_SYSTEM.md` §5):**
    - [ ] Full-bleed Frame-0 anomaly (no cards/HUD until ~frame 60)
    - [ ] Animation opens at MAX velocity (no ease-in from static)
    - [ ] Text slam by frame 8 (≥90px, ≤2 lines) + thumbnail legibility test at 120px
    - [ ] ≥4 visual events in first 4 seconds incl. ⚡ pattern-interrupt hard cut at ~2.5s
    - [ ] Chained visual suspense: one new unresolved element per beat
    - [ ] Reward flood (emerald wash + zero-out) at payoff cue
    - [ ] Final frame matches Frame 0 (loop seam)
- [ ] **Register Composition in `src/Root.tsx`:**
  - Set `durationInFrames` matching `total_frames` from `_cues.json`.
  - Duration gate: total_frames must equal 19–22s × 30fps (570–660 frames); flag if outside.

---

## Phase 4: Verification & Still Audits
- [ ] **Render Critical Still Frames (duration-proportional):**
  - Frame 30 (Full-bleed hook + text slam — verify thumbnail legibility at 120px).
  - Frame ~2.5s mark (pattern-interrupt cut landed).
  - Frame at first mechanism beat.
  - Frame at payoff cue (reward flood visible).
  - Final frame (must visually match Frame 0 — loop seam check).
- [ ] **Verify Safe-Zone Compliance:**
  - Check that no text touches the top 85px, bottom 70px, or left/right 65px margins (full-bleed f0 exempt during frames 0–60).
  - Confirm captions sit cleanly without overlapping cards above or Nemi below.

---

## Phase 5: Master Render & Publication
- [ ] **Render Master MP4:**
  ```bash
  npx remotion render src/index.ts <CompID> out/<VideoName>.mp4
  ```
- [ ] **Publish via Social Media Tools:**
  - Instagram Reel: `python instagram/publish_instagram_reel.py --video out/...`
  - YouTube Short: `python youtube/nemi_explains/publish_youtube_video.py --video out/... --privacy unlisted`
- [ ] **Record Metadata & Links (`11_CONTENT_SCHEMA.md` §3):**
  - Create `reels/<reel_id>/metadata.txt` with zero long dashes (`====` or `----`).
  - Single punchy one-liner description.
  - Followed by 5 lines containing only a dot `.`.
  - Followed by exactly 5 relevant hashtags.
  - Record live publication URLs and commit to Git.

