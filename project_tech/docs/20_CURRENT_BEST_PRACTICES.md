# NEMI EXPLAINS — CURRENT BEST PRACTICES & PRODUCTION RULES

## 1. Master Production Workflow (Under 10 Minutes per Reel)

```
[1. Idea & Archetype] → [2. generate_nemi_vXX_audio.py] → [3. mix_vXX_audio.py] → [4. Full-Screen Remotion Comp] → [5. Render & Audit MP4]
```

---

## 2. Full-Screen Vertical Canvas Guidelines (V14 Standard)
1. **Vertical 9:16 Canvas Distribution:**
   - **Top (Y: 60–340):** Brand badge and punchy headline question.
   - **Upper-Middle (Y: 380–840):** Primary hero console / conveyor belt / hardware chassis.
   - **Center & Lower-Middle (Y: 840–1200):** Nemi as an active scene participant (leaning over console, pointing at conveyor, inspecting register).
   - **Lower-Third (Y: 1320–1560):** Secondary educational hardware context callouts.
   - **Bottom (Y: 1800+):** Channel tag watermark `@nemi.explains`.
2. **Dynamic Nemi Placement:** Never park Nemi as a static footer in the corner. Place Nemi directly adjacent to or interacting with the scene object.

---

## 3. Dynamic BGM & Audio Engineering (V14 Standard)
1. **Audible Emotional Bed:** BGM must be audible with headphones and speakers.
2. **Automated Narrative Envelope:**
   - Hook: Energetic intro (`vol: 0.32`).
   - Question: Subtle dip for speech clarity (`vol: 0.25`).
   - Investigation: Steady build (`vol: 0.32`).
   - Collision & Discovery: Climax swell (`vol: 0.40`).
   - Payoff: Warm resolution (`vol: 0.28`).
3. **Sidechain Ducking:** 10–12dB ducking against voice track (`20ms attack`, `250ms release`).
4. **Master Broadcast Loudness:** Target `-16.0 ± 1.0 LUFS` with True Peak $\le -1.5$ dBTP.
