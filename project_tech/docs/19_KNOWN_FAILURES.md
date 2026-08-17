# NEMI EXPLAINS — KNOWN FAILURES & ANTI-PATTERNS (DO NOT REGRESS)

## 1. Resolved Anti-Patterns (PERMANENTLY SOLVED)

### Failure 1: The Static Lecture Intro
* **Status:** `RESOLVED (V05)`
* **Approved Rule:** Frame 0 must contain immediate typing, cascading motion, or an impossible output.

### Failure 2: Sentence-per-Scene Fragmentation
* **Status:** `RESOLVED (V08)`
* **Approved Rule:** Synthesize 4–7 coherent long-form narrator performance blocks with semantic phrase cues.

### Failure 3: Accidental Speaker Overlap (Narrator + Nemi)
* **Status:** `RESOLVED (V09)`
* **Approved Rule:** Zero accidental overlap (`0.00ms`). Compute all start times dynamically and validate via Python validators.

### Failure 4: Generic Cyber / Packet Montages
* **Status:** `RESOLVED (V11)`
* **Approved Rule:** Every visual object must represent a real conceptual step.

### Failure 5: Weak Vertical Frame Utilization (Top Clutter & Footer Nemi)
* **Status:** `RESOLVED (V14)`
* **Symptom:** Cluttering content into the top 35%, leaving a large 600px dead void in the center, and parking Nemi permanently as a footer in the bottom corner.
* **Approved Rule:** Distribute elements across the entire 1080×1920 canvas (Top headline $\to$ Upper-middle hero console $\to$ Center/lower-middle active Nemi mascot $\to$ Lower-third hardware context card).

### Failure 6: Inaudible or Static Flat BGM
* **Status:** `RESOLVED (V14)`
* **Symptom:** BGM set so quiet that it cannot be heard, or left at a static flat volume without narrative pacing.
* **Approved Rule:** Maintain an audible BGM mix with dynamic volume automation (builds during technical investigation, swells during climax/discoveries, subtle dips during questions).

---

## 2. Active Quality Watch-list
* **Watch-list 1:** Keep Nemi scale between `1.5x` and `1.7x`.
* **Watch-list 2:** Video duration strictly in `[18.0s, 24.5s]`.
* **Watch-list 3:** Master loudness strictly in `[-16.0, -14.0] LUFS`.
