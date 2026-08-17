# 📖 NEMI EXPLAINS — CANONICAL MASTER PRODUCTION GUIDE
> **VERSION:** 2.0 (Systemization & Production Standard)  
> **STATUS:** **CANONICAL SINGLE SOURCE OF TRUTH (FROZEN FOUNDATION)**  
> **MASTER REFERENCE:** `reference/NemiExplains_MasterReference.mp4` (V14 Standard)

---

## 1. THE TWO-LAYER OPERATING PRINCIPLE

The Nemi Explains production system strictly separates content into **two isolated architectural layers**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  LAYER A: TOPIC-SPECIFIC CONTENT (CHANGES EVERY EPISODE)                │
│  • Topic & Concept • Research & Facts • Script & Narration Text          │
│  • Visual World (Network, RAM, AST, AI) • Physical Metaphor & Props     │
│  • Specific Code / Arithmetic / Logic • Story Beats & Semantic Cues     │
├──────────────────────────────────────────────────────────────────────────┤
│  LAYER B: BRAND & PRODUCTION SYSTEM (FROZEN & REUSABLE)                  │
│  • Visual DNA (Cream/Dark/Yellow) • Typography & Scale Hierarchy         │
│  • Nemi Character Bible & Poses • 8 Narrative Archetypes & Pipelines    │
│  • Full-Screen 9:16 Canvas Rules • 12 Camera Primitives                 │
│  • Voice Identity (Chatterbox) • Dynamic BGM Envelope & SFX Taxonomy    │
│  • Zero-Overlap Audio State Machine • 100-Point Master QA Scorecard      │
└──────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Core Rule:** Never hardcode Layer A (topic details) into Layer B (reusable components). Any future topic—whether DSA, AI, Databases, Network Protocols, or Compiler Theory—must plug directly into Layer B without modifying the brand engine.

---

## 2. BRAND NORTH STAR & AUDIENCE JOURNEY

### Brand Identity
* **Channel:** `@nemi.explains`
* **Mission:** Make complicated computer science, software architecture, and technology mysteries feel like intuitive, physical visual stories worth stopping the scroll for.
* **Tone:** Intelligent, curious, elegant, slightly playful, restrained, and visually stunning.

### The 3-Beat Emotional Arc
```
1. "Wait... how does that actually work?"  (Hook & Curiosity)
2. "Whoa, that makes complete physical sense." (Investigation & Aha)
3. "That was genuinely satisfying."       (Transformation & Payoff)
```

---

## 3. FROZEN BRAND PALETTE & SEMANTIC COLOR SYSTEM

| Semantic Role | Color Name | Hex Code | Purpose & Usage Rule |
|---|---|---|---|
| **Canvas Light** | Designer Cream | `#FBFBF9` | Primary light scene background, warm editorial aesthetic |
| **Canvas Dark** | Obsidian Slate | `#0B0F17` | Technical deep-dive, binary registers, hardware chassis |
| **Panel Surface** | Charcoal Panel | `#18181B` | Code terminals, register containers, takeaway boxes |
| **Brand Accent** | Nemi Solar Gold | `#FFD166` | Mascot goggles, spark highlights, key discoveries |
| **Active Glow** | Cyan Laser Beam | `#06B6D4` | Binary data streams, network packets, live memory pointers |
| **Success State** | Emerald Green | `#10B981` | Human math, resolved bugs, successful requests |
| **Error / Alert** | Crimson Coral | `#F43F5E` | Numerical mismatches, hardware truncation cut-offs, syntax bugs |
| **Warning / Tag** | Amber Glow | `#F59E0B` | Badges, question tags, intermediate execution states |
| **Text Heading** | Dark Slate | `#0F172A` | Primary titles on cream canvas |
| **Text Code** | Monospace White | `#F8FAFC` | Code syntax, numbers, registers |
| **Text Secondary**| Cool Muted Gray | `#94A3B8` | Explanatory subtext, labels, terminal paths |

---

## 4. TYPOGRAPHY & SCALE HIERARCHY

### Font System
* **Primary Display & Headings:** `Outfit`, `Inter`, or `Roboto` (sans-serif, weights `700`, `800`, `900`).
* **Code & Numerical Mono:** `JetBrains Mono`, `Fira Code`, or `SF Mono` (monospace, weights `700`, `900`).

### Typography Rules
1. **Scale as Storytelling:** The most critical variable or result MUST be visually massive (`48px` to `68px`). Secondary labels must be smaller (`15px` to `20px`).
2. **Safe Margins:** No critical text closer than `60px` to screen borders.
3. **Mobile Readability:** Text must be immediately legible on a 5.5-inch phone screen without zooming.

---

## 5. NEMI CHARACTER BIBLE & PERFORMANCE VOCABULARY

### Character Profile
* **Who is Nemi?** A clever, curious, highly relatable developer monkey who serves as the **viewer's on-screen avatar**.
* **Nemi's Core Role:** Nemi **EXPERIENCES THE CONCEPT** alongside the viewer. Nemi NEVER delivers a dry technical lecture or recites definitions.

```
NEMI DOES:
✓ Notice weird outputs and react with genuine surprise
✓ Investigate physical mechanisms and point at moving data
✓ Guess or anticipate outcomes (and occasionally get tricked)
✓ Celebrate the sudden 'aha' realization with the viewer

NEMI DOES NOT:
✗ Explain formal technical definitions
✗ Repeat narration sentences word-for-word
✗ Sit permanently parked in the bottom footer
✗ Clutter every single frame as a decorative sticker
```

### The 12 Reusable Character Expressions / Poses
1. `curious`: Leaning in with wide inquisitive eyes.
2. `thinking`: Pondering a mystery with hand on chin.
3. `puzzled`: Tilted head, trying to make sense of a contradiction.
4. `shocked`: Wide-eyed jaw drop (`Wait, what?! 🤯`).
5. `explaining`: Hands open, presenting the active scene.
6. `pointing`: Pointing directly at the live data stream or collision.
7. `focused`: Narrowed eyes, inspecting an exact memory cell.
8. `aha`: Lightbulb moment, realization dawning.
9. `smug`: Knowing smile, wearing celebratory yellow glasses.
10. `relieved`: Wiping brow after a resolved bug.
11. `suspicious`: Narrowed gaze, spotting a sneaky edge-case.
12. `excited`: Celebrating the clean payoff.

---

## 6. FULL-SCREEN 9:16 VERTICAL COMPOSITION RULES

### The 4-Zone Canvas Distribution (Zero Dead Voids)
```
┌────────────────────────────────────────────────────────┐ Y: 0px
│ [ TOP ZONE: Y: 60 – 340px ]                            │
│ • Universal Brand Header & Tag Badge                   │
│ • Punchy Core Question / Mystery Headline              │
├────────────────────────────────────────────────────────┤ Y: 380px
│ [ UPPER-MIDDLE HERO ZONE: Y: 380 – 840px ]             │
│ • Primary Physical Console / Hardware Chassis / Arena  │
│ • Live Data Stream / Conveyor Belt / Network Topology  │
├────────────────────────────────────────────────────────┤ Y: 840px
│ [ CENTER & LOWER-MIDDLE ZONE: Y: 840 – 1280px ]        │
│ • NEMI as Active Scene Participant (leaning, pointing) │
│ • Reactive Speech Bubble ("Wait, what?!")              │
├────────────────────────────────────────────────────────┤ Y: 1320px
│ [ LOWER CONTEXT ZONE: Y: 1320 – 1600px ]               │
│ • Concrete Hardware / Protocol Context Callout Card    │
├────────────────────────────────────────────────────────┤ Y: 1800px
│ [ BOTTOM SAFE ZONE: Y: 1800 – 1920px ]                 │
│ • Minimal Channel Tag (@nemi.explains)                 │
└────────────────────────────────────────────────────────┘ Y: 1920px
```

> [!IMPORTANT]
> **Anti-Slideshow Rule:** A video is REJECTED if it behaves like a slide deck (Headline $\to$ Card $\to$ Card $\to$ Card). Content must be a **continuous physical world** where objects move, transform, collide, and resolve.

---

## 7. THE 12 CAMERA CHOREOGRAPHY PRIMITIVES

1. `CameraPush`: Smoothly scale in ($1.0 \to 1.15$) to build tension and focus into a specific number or memory cell.
2. `CameraPull`: Pull back ($1.15 \to 1.0$) to reveal the broader architecture or context.
3. `CameraPan`: Lateral tracking following an active data packet or scrolling conveyor belt.
4. `CameraTilt`: Vertical pan from upper headline down to hardware chassis.
5. `CameraFollow`: Locked tracking attached to a moving packet through a network.
6. `FocusShift`: Dim surrounding elements while spotlighting the active variable.
7. `ZoomThrough`: Dive through an interface element (e.g. entering the browser bar into DNS).
8. `WorldTransition`: Seamless slide or iris wipe between light and dark environments.
9. `SnapCut`: Instant zero-frame cut on a punchy semantic cue (e.g., glitch pop).
10. `MicroShake`: High-frequency 3-frame vibration ($4\text{px}$) on collision/barrier impact.
11. `DepthLayering`: Foreground Nemi ($Z: 40$) over Midground Mechanism ($Z: 20$) over Background Grid ($Z: 0$).
12. `RestingSettle`: Gentle spring deceleration easing into the final resolution.

---

## 8. AUDIO ARCHITECTURE & BROADCAST STANDARDS

### The Hierarchy of Audio
$$\text{VOICE (Narrator + Nemi)} > \text{SFX (Event Punctuation)} > \text{BGM (Emotional Bed)}$$

### Audio Standards & Constraints
* **Master Broadcast Loudness:** Strictly **$-16.0 \pm 1.0\text{ LUFS}$** (Target: **$-15.5\text{ LUFS}$**).
* **True Peak Ceiling:** Strictly **$\le -1.5\text{ dBTP}$** (Zero digital clipping).
* **Loudness Range (LRA):** $\le 3.5\text{ dB}$ (Consistent mobile loudness).
* **Accidental Speaker Overlap:** **Exactly $0.00\text{ms}$** (Automated validation gate).

### Chatterbox Neural TTS Voice Profile
* **Voice Configuration:** `tech_voice_profile.json` (Warm, intelligent, restrained, conversational).
* **Narrator Architecture:** **3–5 coherent long-form performance blocks** (NEVER sentence-by-sentence clips).
* **Nemi Spoken Lines:** **2–3 punchy reactive moments** per Reel ($< 1.5\text{s}$ each).

### Dynamic BGM Narrative Envelope Curve
```
[0.0s - 3.5s (Hook)]       : Volume = 0.32 (Crisp, energetic intro)
[3.5s - 7.5s (Question)]   : Volume = 0.25 (Subtle dip for question clarity)
[7.5s - 13.0s (Explore)]   : Volume = 0.32 (Steady build as mechanism unfolds)
[13.0s - 17.5s (Discovery)]: Volume = 0.40 (Climax swell on collision / spark)
[17.5s - 22.2s (Payoff)]   : Volume = 0.28 (Warm, satisfying resolution)
```
* **Sidechain Compression:** BGM is automatically ducked by $10\text{–}12\text{dB}$ during active speech ($20\text{ms}$ attack, $250\text{ms}$ release).

### SFX Taxonomy (10 Reusable Sound Events)
1. `glitch_pop`: Unexpected error or mismatch badge appearance.
2. `terminal_keystroke`: Typing code prompt.
3. `bit_tick`: Mechanical conveyor belt movement.
4. `laser_cut`: Physical truncation cut-off barrier hit.
5. `spark_ignite`: Electric trailing '4' / carry bit explosion.
6. `sub_impact`: Bass drop on major conceptual reveal.
7. `network_whoosh`: Packet travelling through cable/DNS.
8. `success_chime`: Valid calculation or cache hit.
9. `pop_in`: Spring card entry.
10. `shutter_click`: Outro channel watermark resolution.

---

## 9. THE 8 STORY ARCHETYPES

| Archetype | Core Narrative Engine | Ideal Topics | Target Duration | Typical Payoff |
|---|---|---|:---:|---|
| **1. The Mystery** | Impossible result $\to$ Investigate physical cause $\to$ Revelation | Floating point, JavaScript coercion, memory leaks | 18–24s | "It was a hardware limit all along." |
| **2. The Hidden Journey** | Everyday action $\to$ Follow request through hidden layers $\to$ Return | `google.com`, HTTPS handshake, SQL query execution | 19–25s | Full visual journey map resolved. |
| **3. The Transformation** | Chaotic state $\to$ Clever mechanism $\to$ Clean structure | Garbage collection, tree balancing, index creation | 18–22s | Cluttered space cleanly swept. |
| **4. The Duel / Race** | Method A vs Method B $\to$ Visual race $\to$ Asymptotic winner | Binary search vs Linear, HashMap vs Array | 15–20s | Exponential speedup visualized. |
| **5. The Challenge** | Code snippet shown $\to$ Viewer predicts output $\to$ Reveal twist | Event loop timing, closure scope, Python mutability | 12–18s | "Did you spot the sneaky trap?" |
| **6. The Wrong Assumption**| "You think X happens..." $\to$ Reality is Y $\to$ True mechanism | React re-renders, virtual DOM, Git commits | 18–24s | Mental model corrected. |
| **7. Behind the Scenes** | Simple UI click $\to$ Massive invisible orchestration revealed | WebRTC video call, OAuth flow, Kafka stream | 20–26s | Invisible complexity appreciated. |
| **8. The Escalation** | Simple code $\to$ Breaks at scale $\to$ Enterprise architecture fix | Caching, database connection pooling, sharding | 22–28s | Elegant scalability pattern. |

---

## 10. THE 20-STEP CANONICAL PRODUCTION WORKFLOW

```
 1. IDEA SELECTION        → Pick ranked topic from 24_CONTENT_IDEA_MATRIX.md
 2. TECHNICAL RESEARCH     → Gather authoritative RFCs, specs, runtime source code
 3. FACT-CHECKING AUDIT   → Eliminate edge-case falsehoods and oversimplifications
 4. ARCHETYPE SELECTION   → Match topic to 1 of 8 Story Archetypes
 5. HOOK CRAFTING         → Write high-curiosity Frame 0 visual & audio hook
 6. VISUAL WORLD DESIGN   → Define visual environment (Cream / Obsidian / Grid)
 7. PHYSICAL METAPHOR     → Design physical objects (tapes, registers, packets, nodes)
 8. SCRIPTING (3-5 BLOCKS)→ Write coherent narrator script + 2-3 punchy Nemi lines
 9. SEMANTIC CUE MAPPING  → Align phrase timestamps to visual triggers
10. CHATTERBOX TTS        → Synthesize voice via tech_voice_profile.json
11. AUDIO TIMELINE SYNC   → Generate nemi_vXX_cues.json (0.00ms overlap guaranteed)
12. DYNAMIC BGM & SFX MIX → Run mix_vXX_audio.py with volume envelope curve
13. REMOTION CHOREOGRAPHY → Build 9:16 full-screen component in src/compositions/
14. CAMERA CHOREOGRAPHY   → Implement smooth push/pull/pan/follow transitions
15. NEMI INTEGRATION      → Place Nemi as dynamic actor across upper/mid/lower canvas
16. KEYFRAME STILL AUDIT  → Render 6 stills to inspect visual hierarchy
17. AUTOMATED QA ENGINE   → Run qa_engine.py (duration, overlap, loudness, anti-slide)
18. REMOTION MASTER RENDER→ Render out/NemiExplains_XX.mp4
19. HUMAN PLAYBACK REVIEW → Verify pacing, audio balance, and mobile readability
20. DOCUMENT & ARCHIVE    → Log in docs/reels/ and update experiment history
```

---

## 11. MULTI-AGENT PIPELINE ROLES & CONTRACTS

| Agent Role | Input Contract | Output Deliverable | Quality Gate |
|---|---|---|---|
| **1. Idea Agent** | Content idea matrix | Single validated topic & angle | High curiosity & clear mystery |
| **2. Research & Fact Agent** | Topic concept | Technical truth sheet & verified specs | $100\%$ factually bulletproof |
| **3. Story Architect** | Fact sheet | Archetype selection & 5-beat narrative arc | Follows Event $\to$ Discovery $\to$ Payoff |
| **4. Visual Director** | Narrative arc | Physical world design & prop definitions | "What does the viewer physically SEE?" |
| **5. Script Agent** | Narrative arc + props | 3–5 coherent narrator blocks + 2 Nemi lines | Conversational, natural phrasing |
| **6. Voice & Audio Agent** | Script & cues | Master audio mix with dynamic BGM envelope | $-16.0$ LUFS, $0.00\text{ms}$ overlap |
| **7. Remotion Engineer** | Props, audio, cues | Complete TSX composition in `src/` | Full-screen 9:16 vertical distribution |
| **8. QA Master Agent** | Master MP4 | Scorecard evaluation across 14 dimensions | Overall Score $\ge 9.0 / 10.0$ |

---

## 12. MASTER EPISODE STORYBOARD JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "NemiEpisodeStoryboard",
  "type": "object",
  "required": ["topic", "slug", "archetype", "target_duration_s", "world", "timeline_events"],
  "properties": {
    "topic": { "type": "string" },
    "slug": { "type": "string" },
    "archetype": { "type": "string", "enum": ["Mystery", "Hidden Journey", "Transformation", "Duel", "Challenge", "Wrong Assumption", "Behind the Scenes", "Escalation"] },
    "target_duration_s": { "type": "number", "minimum": 12.0, "maximum": 30.0 },
    "world": {
      "type": "object",
      "properties": {
        "primary_theme": { "type": "string", "enum": ["cream", "dark_slate", "cyber_grid"] },
        "metaphor_type": { "type": "string" },
        "hero_props": { "type": "array", "items": { "type": "string" } }
      }
    },
    "timeline_events": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "speaker", "text", "start_frame", "end_frame", "nemi_pose", "semantic_cues"],
        "properties": {
          "id": { "type": "string" },
          "speaker": { "type": "string", "enum": ["narrator", "nemi"] },
          "text": { "type": "string" },
          "start_frame": { "type": "integer" },
          "end_frame": { "type": "integer" },
          "nemi_pose": { "type": "string" },
          "nemi_coordinates": { "type": "object", "properties": { "x": { "type": "number" }, "y": { "type": "number" }, "scale": { "type": "number" } } },
          "camera_primitive": { "type": "string" },
          "semantic_cues": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "cue": { "type": "string" },
                "frame": { "type": "integer" },
                "sfx": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 13. MASTER REEL SCORECARD & QUALITY GATES

| Category | Max Pts | Passing Threshold | Evaluation Standard |
|---|:---:|:---:|---|
| **1. Hook & Scroll-Stop** | 10 | $\ge 9.0$ | Visual glitch / impossible output in first 0.8s |
| **2. Curiosity Engine** | 10 | $\ge 9.0$ | Compelling mystery established without lecture cards |
| **3. Story Progression** | 15 | $\ge 13.5$ | Continuous narrative flow from event to revelation |
| **4. Visual Storytelling** | 15 | $\ge 13.5$ | Physical mechanism visualized; concept watched, not read |
| **5. Vertical Canvas Utilization**| 10 | $\ge 9.0$ | 9:16 frame fully commanded (Zero dead 600px middle voids) |
| **6. Technical Accuracy** | 10 | $\ge 9.5$ | Factually truthful; no misleading universal claims |
| **7. Nemi Character & Acting** | 10 | $\ge 8.5$ | Active participant in the scene; expressive 12-pose acting |
| **8. Voice Naturalness** | 8 | $\ge 7.2$ | Conversational, restrained Chatterbox TTS |
| **9. Audio Mix & BGM Arc** | 5 | $\ge 4.5$ | Master loudness $-16 \pm 1$ LUFS; dynamic BGM volume curve |
| **10. Audio / Visual Sync** | 5 | $\ge 4.5$ | SFX, phrase triggers, and visual actions hit same frame |
| **11. Surprise & Wonder** | 5 | $\ge 4.2$ | Genuine unexpected 'aha' twist |
| **12. Payoff & Satisfaction** | 7 | $\ge 6.3$ | Clean closure with high-density developer takeaway |
| **TOTAL SCORE** | **100** | **$\ge 90.0$** | **Master Standard: $\ge 9.0 / 10.0$** |

---

## 14. MOBILE-FIRST & ANTI-SLOP HARD GATES

Before ANY Reel is marked ready for publication, it MUST pass these 5 hard gates:
1. 🚫 **No Slide Decks:** If the video can be understood just as well as a PDF presentation, REJECT.
2. 🚫 **No Footer Nemi:** If Nemi stays in the bottom corner the entire video, REJECT.
3. 🚫 **No Dead Voids:** If there is a $> 300\text{px}$ unused vertical gap between top and bottom, REJECT.
4. 🚫 **No Overlap:** Accidental speaker overlap $> 0.00\text{ms}$ is an automatic BUILD FAILURE.
5. 🚫 **No Fake Benchmarks:** Every technical claim must be grounded in verified runtime specifications.
