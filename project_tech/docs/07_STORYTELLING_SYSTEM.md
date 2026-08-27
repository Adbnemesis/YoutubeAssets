# 📖 NEMI EXPLAINS — STORYTELLING SYSTEM & HIGH-VELOCITY PACING

> Sources: OpenMontage `skills/creative/storytelling.md`, Richard Mayer "Multimedia Learning", 3Blue1Brown Guided Discovery framework, Kurzgesagt pacing rules.

---

## 1. The "But-Therefore" Momentum Engine

Traditional lectures fail because they connect sentences with *"And then..."*:
* ❌ *Bad (Boring lecture):* "ChatGPT has layers, AND THEN it has attention, AND THEN it picks words..."
* ✅ *Good (High-retention momentum):* "You give ChatGPT a sentence, **BUT** it doesn't understand English, **THEREFORE** it converts words into vectors. **BUT** words have multiple meanings, **THEREFORE** Self-Attention calculates context, **THEREFORE** it predicts the next token!"

### Momentum Structure:
```
1. SETUP:     Here is what you think happens (Intuitive model).
2. BUT:       Why that's physically or algorithmically impossible.
3. THEREFORE: The real computer science architecture needed.
4. BUT:       A new complication / bottleneck emerges.
5. THEREFORE: The clever algorithmic trick that solves it.
6. PAYOFF:    The complete mental model locked in!
```

---

## 2. Visual Velocity: The 1.5–2.5s Rule

Short-form mobile viewers experience cognitive fatigue when a visual remains unchanged for $>3$ seconds.

| Retention Metric | Pacing Standard | Production Rule |
|---|---|---|
| **Visual State Change** | Every **1.5 – 2.5 seconds** | Card shift, pointer move, color pulse, or badge reveal. |
| **Camera Breathing** | Continuous subtle zoom | `1.0 -> 1.03x` over key conceptual beats. |
| **Kinetic Word Highlighting** | Real-time | Active words scale `1.18x` in Gold/Cyan in synchronization with voice. |
| **No Static Holds** | Max **2.0 seconds** | Never leave a static graphic without motion. |

---

## 3. Guided Discovery (The 3Blue1Brown Method)

Never lecture the final answer immediately. **Reconstruct the path of discovery**:

1. **The Question (0–3s):** Pose a concrete puzzle (*"How does it know if bank means money or water?"*).
2. **The Naive Attempt (3–7s):** Show what happens if you just look up a dictionary (Collision / Failure).
3. **The Core Insight (7–15s):** Introduce the real architecture (Self-Attention Matrix / Hash Map lookup).
4. **The Step-by-Step Build (15–20s):** Apply the insight layer-by-layer across the data.
5. **The Emotional Climax (20–23s):** Mascot reacts with the "Aha!" realization.
6. **The Payoff (23–25s):** Clear, memorable punchline.

---

## 4. The Infinite Replay Loop

To maximize algorithmic view completion rate ($>100\%$), the final sentence must loop seamlessly back to the opening statement:

* **Opening Line (Second 0):** *"How does ChatGPT write code in seconds?"*
* **Closing Line (Second 25):** *"So when you hit send, it loops this 15ms math... to answer how ChatGPT writes code in seconds!"*
* **Result:** The viewer doesn't realize the video ended, watching the opening 3 seconds twice.

---

## 5. Storytelling Quality Checklist

- [ ] Every section connects via **"But"** or **"Therefore"** (Zero "and then").
- [ ] Visual state changes at least **10 times in 25 seconds**.
- [ ] At least one **unexpected technical reversal / surprise**.
- [ ] Mascot delivers emotional reaction and technical punchline.
- [ ] Infinite loop phrase aligned at outro.

---

## 6. EDIT ENERGY OVERHAUL (AUG 2026 — MANDATORY)

Field data shows retention dying in the edit, not the script: gentle StageWrapper crossfades + atmospheric synthwave read as a calm slideshow in a feed that rewards punch. New execution standards for every reel:

1. **Beat-Synced Punch Cuts:** Stage transitions CUT HARD on BGM transients. Reserve StageWrapper parallax crossfades for deliberate calm beats — max 2 per reel.
2. **Punch-In Accents:** Camera snaps `1.00x -> 1.06–1.08x` over 3–4 frames on emphasis words, reveals, and reversals. Continuous slow breathing stays underneath.
3. **Speed Contrast:** Connective tissue moves faster (1.1–1.2x feel); hold the reveal for a beat (brief 0.9x + glow). Contrast creates emphasis; uniform pace reads as monotony.
4. **Payoff by 55–60%:** The core "aha" lands mid-video. Back half = a fast second-layer twist + tight loop — NOT a long takeaway-card finale (75–87% of viewers never reach second 16). Takeaway content becomes a mid-video beat.
5. **≥14 Visual Events per 20–22s** (raised from 10-in-25s): every beat cut, punch-in, color flip, badge pop counts.
6. **Loop Seam:** The final frame must visually match Frame 0 so the loop is invisible. Endings return to the hook image; recap cards are banned from the last 4 seconds.
7. **BGM Energy Floor:** Replace moody synthwave defaults with 120–140 BPM driving tracks (or trending audio when license-clean). Atmospheric tracks only for genuinely dark topics. Keep sidechain ducking as specified in `08_AUDIO_SYSTEM.md`.
8. **Pattern-Interrupt Re-Hook at ~2.5s (added 2026-08-23):** The retention graph dies at 3–4s, so plant a HARD CUT there — composition flips completely (light→dark world, macro→micro scale, card→full-bleed) + zoom punch + SFX hit. It resets the viewer's swipe timer exactly when it expires. See `02_VISUAL_SYSTEM.md` §5.3 for the opening cut-density table.
9. **Chained Visual Suspense (added 2026-08-23):** Mirror the script's open loops visually — every beat introduces EXACTLY ONE new unresolved element that answers the previous line and opens the next. No beat ever shows "the complete diagram"; the complete picture exists only at the payoff. Pair with hook patterns (`06_HOOK_SYSTEM.md` §7): hook opens the loop → body keeps it open → payoff closes it at 55–60%.
