# 📋 NEMI EXPLAINS — STEP-BY-STEP REEL CREATION CHECKLIST

Use this exact step-by-step procedure to conceive, engineer, and render every new reel:

---

## Phase 1: Scripting & Concept Architecture
- [ ] **Choose Topic:** Focus strictly on **Tech / AI / DSA / Computer Science**.
- [ ] **Draft Misconception-First Hook:** Frame 0 contradiction + voice starts immediately at Frame 0.
- [ ] **Write "But-Therefore" Script:** 6 to 8 tight events totaling **65–75 words** (~24–25.5s at 180-200 WPM).
- [ ] **Assign Mascot Punchline:** Ensure Nemi delivers the emotional realization ("96 layers?! 🤯") and final technical punchline.
- [ ] **Draft Infinite Loop:** Outro sentence connects back to the opening line.

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
  - Use `StageWrapper` for seamless scene cross-fades.
  - Mount dynamic cards or embedded Manim `<OffthreadVideo>`.
  - Add `DynamicKaraokeCaptions` at `top: 1140px` (hidden when `nemiSpeech` is active).
  - Add synchronized SFX sequences (whoosh, pop, click, chime).
- [ ] **Register Composition in `src/Root.tsx`:**
  - Set `durationInFrames` matching `total_frames` from `_cues.json`.

---

## Phase 4: Verification & Still Audits
- [ ] **Render 5 Critical Still Frames:**
  - Frame 45 (Hook & light mode prompt).
  - Frame 200 (Core insight card).
  - Frame 400 (Deep architecture / Manim cutaway).
  - Frame 600 (Mascot reaction with speech bubble).
  - Frame 720 (Final summary payoff).
- [ ] **Verify Safe-Zone Compliance:**
  - Check that no text touches the top 85px, bottom 70px, or left/right 65px margins.
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
- [ ] **Record Metadata & Links:** Update `reels/<reel_id>/metadata.txt` and commit to Git.
