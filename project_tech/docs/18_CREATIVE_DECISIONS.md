# NEMI EXPLAINS — PERMANENT CREATIVE DECISION LOG

## 1. Decision: Warm Designer Cream (`#F8F6F0`) as Signature Background
* **Date:** 2026-08-16
* **Rationale:** Generic tech videos exclusively use pure `#000000` or dark grey, making them blend into the feed. A warm designer cream canvas with a subtle dot grid creates an immediate high-end editorial feel (resembling Notion / Linear / Stripe).
* **Rule:** Use cream for Hook, Question, and Payoff scenes; transition to deep obsidian (`#0D1117`) for internal memory, binary bit grids, and network execution diagrams.

---

## 2. Decision: Electric Yellow (`#FFD166`) as Primary Accent Token
* **Date:** 2026-08-16
* **Rationale:** Provides high-energy visual punch against both cream and charcoal backgrounds. Tied directly to Nemi's glasses and drawstrings for brand cohesion.

---

## 3. Decision: Nemi as the Audience Avatar (Never the Lecturer)
* **Date:** 2026-08-17
* **Rationale:** If the mascot explains technical definitions, it feels childish or condescending. When the Narrator explains the system while Nemi makes assumptions, gets surprised, and reacts, the audience identifies with Nemi and stays engaged.

---

## 4. Decision: Dynamic BGM Sidechain Ducking over Static Music
* **Date:** 2026-08-17
* **Rationale:** Static background music either drowns out dialogue or is set so low it provides zero emotion. Using FFmpeg sidechain compression (`15ms attack`, `300ms release`) ensures voice is 100% intelligible while music swells during pauses, reveals, and cleanups.

---

## 5. Decision: 0.65s–0.8s Mental Participation Window in Challenge Beat
* **Date:** 2026-08-17
* **Rationale:** Asking a riddle or question and immediately giving the answer creates passive watching. Inserting an intentional pause forces the viewer's brain to form a hypothesis, dramatically increasing dopamine when the reveal occurs.

---

## 6. Decision: Strict Target Runtime of 18–24 Seconds
* **Date:** 2026-08-17
* **Rationale:** Videos over 25s experience severe drop-off on Instagram/TikTok. Videos under 16s cannot deliver a complete micro-story. 19–23s represents the golden mean of maximum retention, story density, and narrative payoff.

---

## 7. Decision: Paragraphs over Cards (Coherent Performance Architecture)
* **Date:** 2026-08-17
* **Rationale:** Generating individual audio clips per scene causes mechanical start-and-stop cadence. Synthesizing 4–6 long-form narrator performance blocks captures human breathing and thought continuity.

---

## 8. Decision: Strict Speaker Orchestration & Non-Overlapping Dialogue
* **Date:** 2026-08-17
* **Rationale:** Overlapping dialogue creates auditory clutter. By default, `NARRATOR ACTIVE → NEMI CANNOT SPEAK` and `NEMI ACTIVE → NARRATOR CANNOT SPEAK`. Accidental overlap is **FORBIDDEN (0.00ms)**.

---

## 9. Decision: 10-Beat Story Density for Transformation Topics (V10 Standard)
* **Date:** 2026-08-17
* **Rationale:** Master arc for cleanup/engine topics: The Mess $\to$ The Problem $\to$ Viewer Challenge $\to$ Nemi Guess $\to$ Reversal $\to$ Camera Journey $\to$ Show The Rule $\to$ Cleanup Climax $\to$ Transformation $\to$ Payoff.

---

## 10. Decision: Continuous World Journey for Network Topics (V11 Standard)
* **Date:** 2026-08-17
* **Rationale:** When explaining distributed systems or network requests, create **One Continuous World** where the camera travels with the packet across 3D perspective routing nodes.

---

## 11. Decision: Mystery Archetype & Floating-Point Representation Grammar (V12 Standard)
* **Date:** 2026-08-17
* **Rationale:** When explaining counter-intuitive math or language quirks (e.g. `0.1 + 0.2 !== 0.3`), do NOT overwhelm the audience with 64 raw binary digits. Instead, map the concept to an intuitive human analogy: **Base-10 fractions like 1/3 repeat infinitely (0.3333...), and base-2 fractions like 0.1 repeat infinitely in binary (0.0001100110011...)**. The computer must round to 53 bits, so adding two rounded approximations generates the trailing 4.
