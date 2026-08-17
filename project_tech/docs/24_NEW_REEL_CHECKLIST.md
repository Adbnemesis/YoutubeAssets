# 📋 NEMI EXPLAINS — NEW REEL PRODUCTION CHECKLIST
> **PURPOSE:** Step-by-step operational guide for producing a brand-new Nemi Explains episode on ANY topic.

---

## PHASE 1: RESEARCH & STORY ARCHITECTURE
- [ ] **1. Select Topic & Angle:** Pick topic from `docs/24_CONTENT_IDEA_MATRIX.md` or define a new core technical paradox/mystery.
- [ ] **2. Authoritative Fact-Check:** Verify against official RFCs, engine sources (V8, CPython, Linux Kernel, IEEE 754), and eliminate universal oversimplifications.
- [ ] **3. Select Narrative Archetype:** Match to 1 of 8 Story Archetypes (`Mystery`, `Hidden Journey`, `Transformation`, `Duel`, `Challenge`, `Wrong Assumption`, `Behind the Scenes`, `Escalation`).
- [ ] **4. Draft 5-Beat Storyboard:**
  - Beat 1 (Hook): Scroll-stopping contradiction or glitch (0.0s – 3.5s).
  - Beat 2 (Core Dilemma): Why does this happen? (3.5s – 7.5s).
  - Beat 3 (Physical Mechanism): Unfold the physical world / data stream (7.5s – 13.0s).
  - Beat 4 (The Revelation / Collision): Show the exact moment of failure or resolution (13.0s – 17.5s).
  - Beat 5 (Payoff & Takeaway): High-density practical takeaway + Nemi reaction (17.5s – 22.0s).

---

## PHASE 2: AUDIO SYNTHESIS & TIMELINE MAPPING
- [ ] **5. Write Script in 3–5 Coherent Narrator Blocks:** Avoid 1-sentence micro-clips. Write natural continuous narration.
- [ ] **6. Add 2–3 Reactive Nemi Moments:** Keep Nemi spoken lines short, reactive, and personality-driven (`< 1.5s`).
- [ ] **7. Synthesize Chatterbox Voice:** Run TTS script using `tech_voice_profile.json` normalized to `-16.0 LUFS`.
- [ ] **8. Generate Dynamic Audio Mix & Timeline Cues:**
  - Map semantic cue frames into `nemi_vXX_cues.json`.
  - Mix dynamic BGM envelope curve via `mix_vXX_audio.py` (audible bed with climax swell and sidechain ducking).
- [ ] **9. Verify 0.00ms Speaker Overlap:** Ensure zero accidental collision between narrator and Nemi speech.

---

## PHASE 3: REMOTION 9:16 VERTICAL CHOREOGRAPHY
- [ ] **10. Build Full-Screen Component:** Create `src/compositions/NemiExplains[Topic]Comp.tsx`.
- [ ] **11. Apply 4-Zone Canvas Distribution:**
  - Top Zone (Y: 60–340): Brand badge & punchy headline.
  - Upper-Middle Zone (Y: 380–840): Primary hero console / conveyor / chassis.
  - Center / Lower-Middle (Y: 840–1200): Nemi placed dynamically next to active elements (not parked in footer!).
  - Lower-Third Zone (Y: 1320–1600): Secondary educational context card.
  - Bottom Zone (Y: 1800+): Minimal watermark.
- [ ] **12. Implement Continuous Camera Transforms:** Add subtle push/pull/pan/follow interpolations.
- [ ] **13. Register in `src/Root.tsx`:** Set target frames at 30fps ($18\text{s} - 24\text{s}$ total runtime).

---

## PHASE 4: QUALITY CONTROL & BROADCAST AUDIT
- [ ] **14. Render Keyframe Stills (6 Frames):** Visually inspect composition, text contrast, and mascot acting.
- [ ] **15. Run Automated QA Engine:** Execute `python3 scripts/qa_engine.py` (checks overlap, duration, loudness, and anti-slideshow rules).
- [ ] **16. Render Master MP4:** Execute `npx remotion render src/index.ts [CompositionId] out/[FileName].mp4`.
- [ ] **17. Broadcast Loudness Audit:** Run `ffmpeg -af loudnorm` to verify Integrated Loudness $-16 \pm 1$ LUFS and True Peak $\le -1.5$ dBTP.
- [ ] **18. Mobile Playback Review:** Watch on a mobile screen to verify scroll-stop power and readability.
- [ ] **19. Documentation & Case Study:** Create `docs/reels/[topic_slug]/V01.md` and log score on Master Scorecard.
