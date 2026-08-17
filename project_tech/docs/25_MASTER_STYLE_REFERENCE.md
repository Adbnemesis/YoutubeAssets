# 🎨 NEMI EXPLAINS — MASTER STYLE REFERENCE CHEAT SHEET
> **PURPOSE:** Instant reference card for visual tokens, composition coordinates, mascot poses, and audio levels.

---

## 1. COLOR TOKENS (EXACT HEX CODES)

```css
--bg-cream:         #FBFBF9; /* Light scene primary canvas */
--bg-dark:          #0B0F17; /* Dark deep-dive / hardware canvas */
--panel-charcoal:   #18181B; /* Terminal, register, and takeaway cards */
--brand-yellow:     #FFD166; /* Nemi signature accent / spark glow */
--accent-cyan:      #06B6D4; /* Binary streams, packets, pointers */
--state-success:    #10B981; /* Valid math, resolved bugs, green badges */
--state-error:      #F43F5E; /* Mismatches, truncation laser, red alerts */
--state-warning:    #F59E0B; /* Intermediate states, question tags */
--text-heading:     #0F172A; /* Dark slate titles on cream */
--text-code:        #F8FAFC; /* Clean white syntax text */
--text-muted:       #94A3B8; /* Secondary subtitles and labels */
```

---

## 2. TYPOGRAPHY HIERARCHY

* **Main Question Headline:** `62px – 68px`, Weight: `900`, Line-height: `1.12`, Letter-spacing: `-2px`.
* **Category Pill Tag:** `15px – 16px`, Weight: `900`, Letter-spacing: `2px`, Uppercase.
* **Code / Terminal Prompt:** `38px – 46px`, Monospace, Weight: `900`.
* **Important Output Number:** `48px – 56px`, Monospace, Glowing Accent.
* **Takeaway Point Title:** `22px – 25px`, Weight: `900`.
* **Takeaway Point Body:** `16px – 18px`, Weight: `600`, Muted Color.

---

## 3. VERTICAL 9:16 LAYOUT COORDINATES

```
┌────────────────────────────────────────────────────────┐
│ Header Badge:        top: 60px,  left: 60px, right: 60px
│ Headline Banner:     top: 170px, left: 60px, right: 60px
│ Upper-Middle Hero:   top: 380px – 440px, height: 380px – 520px
│ Active Nemi Mascot:  top: 840px – 960px, scale: 1.55 – 1.65
│ Lower Context Card:  top: 1320px – 1380px, height: 180px – 220px
│ Channel Watermark:   bottom: 40px, right: 40px
└────────────────────────────────────────────────────────┘
```

---

## 4. NEMI MASCOT POSES

| Pose Name | Emotional Meaning | Typical Scene Phase |
|---|---|---|
| `thinking` | Pondering a mystery with hand on chin | Frame 0 intro |
| `shocked` | Jaw drop, wide eyes (`Wait, what?! 🤯`) | Impossible output pop |
| `puzzled` | Tilted head, trying to make sense | Question presentation |
| `explaining`| Hands open, presenting the mechanism | Physical world unfolds |
| `pointing` | Pointing at live data conveyor / packet | Streaming data phase |
| `aha` | Sudden realization dawning | Collision / truncation discovery |
| `smug` | Wearing sunglasses with knowing smile | Celebratory outro payoff |

---

## 5. AUDIO LEVELS REFERENCE

* **Narrator TTS Track:** Normalized to `-16.0 LUFS` (Peak: $-2.5\text{ dBTP}$).
* **Nemi Reactive TTS:** Peak match to narrator ($-2.5\text{ dBTP}$).
* **BGM Level:** Dynamic envelope from `0.25` (question) to `0.40` (discovery swell).
* **BGM Sidechain Ducking:** $-10\text{ to }-12\text{dB}$ reduction during voice ($20\text{ms}$ attack, $250\text{ms}$ release).
* **SFX Level:** Master volume `0.30 – 0.45` (subtle punctuation).
* **Master Export Loudness:** Integrated `-15.5 to -16.0 LUFS`, True Peak $\le -1.5$ dBTP.
