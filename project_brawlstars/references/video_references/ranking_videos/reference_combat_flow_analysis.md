# Reference Video Combat Flow Analysis — "Who is the Best Epic Brawler in Brawl Stars"

## Overview

This document analyzes the COMBAT FLOW of the reference video — the middle act where
brawlers stop being ranked and start FIGHTING. Unlike the tier-promotion stages
(splash/glitch/domino FX from the existing docs), this is the part that makes the
video feel alive.

**Reference Video**: `Who is the best epic brawler in brawl stars🔥...mp4`
**Brawlers in the fight**: `Hank` (S-tier), `Ash` (S-tier), `Pearl` (3rd icon, S-tier), `Meeple` (D-tier), `Shade` (D-tier)

---

## Combat Flow Timeline (measured from the video)

| Phase | Beat | Time | Event |
| :--- | :--- | :--- | :--- |
| Intro | B1–B7 | 0–2.9s | Title words pop on each beat; roster shows all candidates |
| Drop | B10 | 4.8s | All brawlers slam into D-tier with dislike pins |
| Rise | B13–B19 | 5.9–9s | Shortlisted brawlers (Hank, Ash, Pearl) rise to S-tier |
| **FIGHT BEGINS** | **B18 area** | **~8.2s** | **BGM STOPS** — complete silence except fight SFX/voices |
| **Attack 1** | B18–B19 | ~8.2–9s | **Hank attacks Pearl** with his water attack. **Simultaneously Ash also attacks Pearl.** Both are in S-tier, attacking the 3rd S-tier icon. |
| **Defeat 1** | B19 | ~9s | **Pearl is defeated** — disappears/vanishs. Her icon is gone. |
| **Attack 2** | B20 | ~9.8s | **Meeple (from D-tier) throws its gadget box** — ranged throw across the board to S-tier. The box lands on Hank & Ash. |
| **Trap** | B20+ | ~10s | **Hank & Ash are trapped inside the box** — their icons shift slightly down (the box is on top of them). |
| **Attack 3** | B22 | ~10.7s | **Shade (from D-tier) moves up to B-tier** — this takes 1-2 beats as it's short-ranged. |
| **Clap** | B23 | ~11.2s | **Shade uses its basic attack (clap)** — short-range melee hitting both Hank & Ash. |
| **Defeat 2+3** | B24 | ~11.7s | **Hank and Ash are both defeated** — disappear from the box. |
| **Winner** | B27 | ~13.1s | **Shade declared victor** — final edit with full-screen color transitions, game footage. |

---

## Editing Style Principles

### 1. BGM Stops Completely For The Fight
- The music is **DUCKED TO ZERO** during the fight segment (~8.2s–12.8s)
- Only sfx and voice lines play
- The music slams back in at the winner reveal
- **Our implementation**: `fightDuck: { from: 6.2, to: 12.8, volume: 0.0 }` ✅

### 2. Real Brawl Stars Attack VFX
- The reference uses **actual in-game attack animations** for each brawler:
  - Hank: water projectile torrent
  - Ash: rat swarm / melee swipe
  - Meeple: gadget box throw
  - Shade: clap (generic melee swing)
- **Our implementation**: `GaleScAttack` now uses real `.sc` extracted frames
  - muzzle flash → projectile → reached impact → hit effect (4-stage attack)

### 3. Combat Mechanics Are Matched
- **Ranged brawlers**: throw from their own tier slot (Meeple from D to S — far distance)
- **Melee brawlers**: physically move adjacent to their target (Shade moves from D to B before clapping)
- **Simultaneous attacks**: multiple brawlers attack on the same beat (Hank + Ash both hit Pearl)
- **Gadget mechanics**: projectiles can trap multiple targets (Meeple's box)

### 4. Defeats Are Clean
- Defeated brawlers **vanish/despawn** — no lingering bodies
- First defeat happens ON the attacking beat
- Target icon disappears instantly (no slide-off animation — it's gone)

### 5. Camera Framing
- During the fight, camera locks on the **attacking pair or group** (~1.7x zoom)
- Bystanders are dimmed/out of frame — no clutter
- Melee attackers and targets are both fully visible

### 6. Beat-Synced Everything
- Every attack fires on a beat
- Defeats happen on the attack beat
- Trap/gadget events have their own beat with SFX
- Camera cuts/zooms happen on beats

---

## Key Template Parameters

### Fight Window
```
fight: {
  start: Beat 14,  // BGM drop begins here
  end: Beat 27,    // winner reveal
  cleanVfx: true,  // clean single-projectile look
}
```

### Fight Turns (beat-aligned)
```
{ beat: 14, id: "bibi", ability: "BAT SWING", kind: "attack", targetId: "gale", melee: true },
{ beat: 16, id: "gale", ability: "SNOWBALL SPREAD", kind: "attack", targetId: "bibi" },
{ beat: 18, id: "bibi", ability: "SPITBALL!", kind: "super", targetId: "gale" },
// simultaneous attack — two attackers on the same beat
{ beat: 20, id: "melodie", ability: "NOTE VOLLEY", kind: "attack", targetId: "crow" },
{ beat: 20, id: "bibi", ability: "BAT SWING", kind: "attack", targetId: "crow", melee: true },
```

### Audio Ducking
```ts
// Reference: BGM completely stops during the fight
fightDuck: { from: 6.2, to: 12.8, volume: 0.0 }
```

---

## How To Build New Shorts That Match

1. **Structure each short**: Intro → Drop → Shortlist Rise → FIGHT → Winner Reveal
2. **Design the fight** with 2-3 exchanges max — keep it READABLE
3. **One beat per attack** — no attacks firing between beats
4. **Add simultaneous attacks** for drama (2 attackers on same target)
5. **Ranged vs melee variety** — have one ranged thrower, one melee closer
6. **Defeats on attack beats** — target disappears when hit
7. **BGM silence during fight** — volume 0.0
8. **Camera locks on the pair** — ~1.7x zoom, bystanders dimmed
9. **Clean VFX** — use real `.sc` frames when available, hand-drawn as fallback