# ⚡ NEMI EXPLAINS — CURRENT BEST PRACTICES & THE 10 RETENTION LAWS

> Distilled from OpenMontage Creative Skills, 4 production iterations, and viral short-form retention analytics.

---

## 🏛️ The 10 Retention Laws of Nemi Explains

1. **Law of Frame 0:** Audio, SFX impact, and camera movement start at Frame 0. Never start on dead air or a static frame.
2. **Law of the 1.5s Contradiction:** Hook with what the audience thinks is true, then shatter it with the real computer science truth.
3. **Law of 2.0s Visual Velocity:** Every 1.5–2.5 seconds, something on screen must move, transform, color-shift, or pop.
4. **Law of the Audible Groove:** Background music must be heard! Set pre-gain to `0.52` with gentle `2.5:1` sidechain ducking.
5. **Law of Tactile SFX:** Every state transition has a whoosh (-15ms lead), every card pop has a pluck, every reveal has an impact.
6. **Law of Kinetic Captions:** High-visibility karaoke captions at `top: 1140px` with active words scaling to `1.18x` in Gold/Cyan.
7. **Law of the Mascot Payoff:** Nemi Mascot mirrors the audience's surprise at second 20 and delivers the technical punchline at second 24.
8. **Law of the Duration Window:** Total video duration targets **19.0s – 22.0s** with a **24.0s hard cap**. Length is not the retention problem — the hook is (see `06_HOOK_SYSTEM.md` §6). Field data: the two longest reels had the two worst APVs; don't creep past 24s chasing completeness — compress setup instead.
9. **Law of the Hybrid Manim Cutaway:** Use Python Manim for mathematical proofs, vector embeddings, and tree traversals embedded in Remotion.
10. **Law of the Seamless Loop:** The final phrase flows naturally back into the opening hook for infinite replay loops.
11. **Law of Living Motion (Zero Static Visuals):** Visuals must NEVER be static styled boxes or resting diagrams. Every stage must feature continuous, living motion: undulating waveforms (`Math.sin`), physical sweeping laser beams, active path drawing (`strokeDashoffset`), pulsing data packets streaming along wires, real-time filling meters/gauges, and dynamic node connections. The audience must *watch the physical process happen in motion*.
12. **Law of Topic-Specific Vector Visuals (Zero-Generic-Box Mandate):** Never display generic rounded cards filled with plain text or bullet points as the primary visual. Every reel must feature custom, topic-specific SVG mathematical & physical animation engines (e.g. 3Blue1Brown / ByteByteGo standard):
    * **Algorithms & Search/Sort:** Real coordinate complexity graphs ($O(N)$ vs $O(\log N)$ Cartesian plots), dynamic frequency spectrum density bars, laser partition slicers, animated branching decision trees, and exponential telescope funnels.
    * **Audio & Signals:** Real-time frequency waterfall spectrograms, constellation peak star maps, audio wave interference collisions.
    * **Systems & Error Correction:** Reed-Solomon parity repair beams, laser module rebuilds, active packet routing conduits.
    * **AI & LLMs:** Multi-dimensional vector embedding galaxy, attention connection matrices, tokenization byte-pair merges.

---

## 🛠️ Audio Mastering Formula (Exact Parameters)

```bash
# 1. Voice Track Normalization
ffmpeg -y -i voice_raw.wav -af "loudnorm=I=-16.0:TP=-1.5:LRA=7" -b:a 320k voice_master.mp3

# 2. Master Audio Sidechain Ducking
ffmpeg -y -i voice_master.mp3 -i "assets/background_music/Death of a Bluebird.mp3" \
  -filter_complex "[1:a]aloop=loop=-1:size=2e+09,atrim=0:25.6,volume=0.52,afade=t=in:st=0:d=0.3,afade=t=out:st=24.8:d=0.8[bgm]; \
                   [0:a]asplit=2[v_main][v_sc]; \
                   [bgm][v_sc]sidechaincompress=threshold=0.08:ratio=2.5:attack=35:release=160[ducked_bgm]; \
                   [v_main][ducked_bgm]amix=inputs=2:normalize=0[mix]; \
                   [mix]loudnorm=I=-15.0:TP=-1.5:LRA=7[out]" \
  -map "[out]" -b:a 320k master_audio.mp3
```

---

## 📐 Safe-Zone Inset Coordinates (At a Glance)

* Top HUD: `top: 85px`
* Headline: `top: 165px`
* Main Stage Card: `top: 360px - 880px`
* Mid-Screen Badges: `top: 920px - 1100px`
* Dynamic Karaoke Captions: `top: 1140px - 1280px`
* Speech Bubble: `bottom: 440px`
* Mascot Dock: `bottom: 70px`
