import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { ScEffect } from "../components/ScEffect";

/**
 * Composites brawler attacks as gameplay-style scenes matching the real game.
 *
 * The .sc file stores single building blocks (one muzzle flash, one projectile,
 * one icy bolt). The game spawns & positions MANY of them. These scenes stage
 * the blocks into recognizable attacks that match actual Brawl Stars gameplay.
 *
 * Output is transparent-background so the user can overlay on their brawler.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* ---------- Types ---------- */

export interface StaticSpawn {
  part: string;
  start: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  loop: boolean;
  flip?: boolean;
  blendMode?: React.CSSProperties["mixBlendMode"];
  filter?: string;
}

export interface MovingSpawn {
  part: string;
  start: number;
  dur: number;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  cx?: number;
  cy?: number;
  arc?: number;
  scale: number;
  rot: [number, number];
  loop: boolean;
  maxOpacity: number;
  flip?: boolean;
  blendMode?: React.CSSProperties["mixBlendMode"];
  filter?: string;
}

export type Script = Array<StaticSpawn | MovingSpawn>;

const isMoving = (s: StaticSpawn | MovingSpawn): s is MovingSpawn =>
  (s as MovingSpawn).dur !== undefined;

/* ---------- Scene renderer ---------- */

export const Scene: React.FC<{ brawler: string; script: Script; rel?: number }> = ({
  brawler,
  script,
  rel,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", pointerEvents: "none", zIndex: 100 }}>
      {script.map((s, i) => {
        const t = (rel !== undefined ? rel : f) - s.start;
        if (t < 0) return null;
        if (isMoving(s)) {
          if (t >= s.dur) return null;
          const prog = Math.min(1, t / s.dur);
          const e = easeOut(prog);
          let x, y;
          if (s.cx !== undefined && s.cy !== undefined) {
            x = (1 - e) * (1 - e) * s.fx + 2 * (1 - e) * e * s.cx + e * e * s.tx;
            y = (1 - e) * (1 - e) * s.fy + 2 * (1 - e) * e * s.cy + e * e * s.ty;
          } else {
            x = lerp(s.fx, s.tx, e);
            y = lerp(s.fy, s.ty, e);
          }
          if (s.arc) {
            y -= Math.sin(e * Math.PI) * s.arc;
          }
          const rot = lerp(s.rot[0], s.rot[1], prog);
          // Fade out near end of flight
          const opacity = s.maxOpacity * (1 - Math.pow(prog, 4));
          return (
            <ScEffect
              key={i}
              brawler={brawler}
              part={s.part}
              x={x}
              y={y}
              start={f - t}
              scale={s.scale}
              rotate={rot}
              opacity={Math.max(0, opacity)}
              loop={s.loop}
              flip={s.flip}
              blendMode={s.blendMode}
              filter={s.filter}
            />
          );
        }
        return (
          <ScEffect
            key={i}
            brawler={brawler}
            part={s.part}
            x={s.x}
            y={s.y}
            start={f - t}
            scale={s.scale}
            rotate={s.rotate}
            opacity={s.opacity}
            loop={s.loop}
            flip={s.flip}
            blendMode={s.blendMode}
            filter={s.filter}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ==========================================================================
 * GALE ATTACK — "Polar Vortex"
 *
 * In-game: Gale fires a wide cone-shaped spray of 6 snowball projectiles
 * from his snowblower. Each shard travels outward in a fan pattern. A bright
 * muzzle flash appears at the blower nozzle, and a frosty impact plays at
 * the landing zone. The whole attack is icy-blue with additive glow.
 * ========================================================================== */

export const galeAttack = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];

  // Muzzle flash at the snowblower nozzle — small, brief, additive.
  // Native sprite ~151px wide; 0.55 renders ~85px ≈ half a brawler card.
  script.push({
    part: "gale_006_atk_muzzle_01",
    start: 0,
    x: fromX + dir * 15,
    y: fromY,
    scale: 0.55 * s,
    rotate: 0,
    opacity: 1,
    loop: false,
    blendMode: "screen",
    flip: dir === -1,
    filter: "brightness(1.3)",
  });
  script.push({
    part: "gale_006_atk_muzzle_02",
    start: 2,
    x: fromX + dir * 20,
    y: fromY + 5,
    scale: 0.45 * s,
    rotate: 0,
    opacity: 0.8,
    loop: false,
    flip: dir === -1,
    blendMode: "screen",
  });

  // In-game: Gale fires 6 snowballs SIMULTANEOUSLY in a fan that leaves the
  // muzzle spread out and CONVERGES on the aim point (like Spike/Tara fans).
  // Projectile sprite is a ball+trail composite (~214px native) so the ball
  // reads ~1/4 of a card at this scale. Travel is fast: full range in ~0.5s.
  const muzzleSpread = 64;
  for (let i = 0; i < 6; i++) {
    const yOffset = -muzzleSpread / 2 + (i / 5) * muzzleSpread;

    script.push({
      part: "gale_006_atk_projectile",
      start: 0,
      dur: 16,
      fx: fromX + dir * 30,
      fy: fromY + yOffset,
      tx: toX,
      ty: toY,
      scale: 0.4 * s,
      rot: [0, 0],
      loop: true,
      maxOpacity: 1,
      flip: dir === -1,
    });

    // Trail twinkle along each shard's path
    script.push({
      part: "gale_006_atk_trail_twinkle",
      start: 3,
      dur: 13,
      fx: fromX + dir * 60,
      fy: fromY + yOffset,
      tx: toX,
      ty: toY,
      scale: 0.34 * s,
      rot: [0, 0],
      loop: true,
      maxOpacity: 0.5,
      flip: dir === -1,
      blendMode: "screen",
    });

    // Liquid trail drops along path
    if (i % 2 === 0) {
      script.push({
        part: "gale_006_atk_trail_liquid",
        start: 5,
        dur: 11,
        fx: fromX + dir * 80,
        fy: fromY + yOffset + 5,
        tx: toX,
        ty: toY + 5,
        scale: 0.4 * s,
        rot: [0, 0],
        loop: false,
        maxOpacity: 0.6,
        flip: dir === -1,
      });
    }
  }

  // Frosty burst where the volley lands (native ~239px; 0.5 ≈ card-sized pop)
  script.push({
    part: "gale_006_atk_hit",
    start: 15,
    x: toX,
    y: toY,
    scale: 0.5 * s,
    rotate: 0,
    opacity: 1,
    loop: false,
    blendMode: "screen",
    flip: dir === -1,
  });

  return script;
};

/* ==========================================================================
 * GALE SUPER — "Gale Force"
 *
 * In-game: A massive, wide WALL of snow and wind that travels forward in a
 * straight line, pushing everything in its path. NOT a tornado — it's a
 * rectangular blizzard wave. The main body is the ulti_projectile, with
 * bolts and nuts swirling along its edges.
 *
 * The Super pushes enemies to its max range. On reaching, multiple cracking
 * frost effects play on the ground.
 * ========================================================================== */

export const galeSuper = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];
  const dist = toX > fromX ? 300 : -300; // super fast and wide

  // The main projectile wall (5 distinct chunks side-by-side)
  // Native chunk ~128x110 → 0.8 renders ~102x88, five of them spanning the
  // whole row like the in-game blizzard wall.
  const spreadWidth = 190;
  for (let i = 0; i < 5; i++) {
    const yOff = -spreadWidth / 2 + (i / 4) * spreadWidth;
    script.push({
      part: "gale_006_ulti_projectile",
      start: 0,
      dur: 22, // crosses in ~0.7s like the game's fast push wall
      fx: fromX,
      fy: fromY + yOff,
      tx: fromX + dist,
      ty: fromY + yOff,
      scale: 0.8 * s,
      rot: [0, 0],
      loop: false,
      maxOpacity: 1,
      flip: dir === -1,
    });
  }

  // A few nuts trailing behind the wall naturally
  for (let i = 0; i < 5; i++) {
    const yOff = -spreadWidth / 2 + (i / 4) * spreadWidth;
    script.push({
      part: "gale_006_ulti_trail_nuts_01",
      start: 3,
      dur: 19,
      fx: fromX - dir * 20,
      fy: fromY + yOff,
      tx: fromX + dist - dir * 50,
      ty: fromY + yOff,
      scale: 0.5 * s,
      rot: [0, 180],
      loop: true,
      maxOpacity: 0.7,
      flip: dir === -1,
    });
  }

  return script;
};

/* ==========================================================================
 * ASH ATTACK — "Clean-Up"
 *
 * In-game: Ash slams his broom into the ground, creating a piercing
 * shockwave that travels forward at ground level. It's NOT thrown projectiles
 * arcing through the air — it's a fast, low, wide shockwave along the floor.
 * Dust clouds burst up along the shockwave path. Impact is a big splash.
 * ========================================================================== */

const ashAttack = (cx = 120, cy = 310, targetX = 440): Script => {
  const script: Script = [];

  // Dust clouds bursting up sequentially along the shockwave path
  const clouds = ["ash_008_atk_cloud_01", "ash_008_atk_cloud_02"];
  for (let i = 0; i < 7; i++) {
    const progress = (i + 1) / 8;
    const cloudX = lerp(cx + 40, targetX - 20, progress);
    const yJitter = (i % 3 - 1) * 20;

    script.push({
      part: clouds[i % 2],
      start: i * 3, // sequential
      x: cloudX,
      y: cy + yJitter - 10,
      scale: 1.0 + (i % 3) * 0.2,
      rotate: (i % 2 === 0 ? -10 : 10) + i * 5,
      opacity: 0.9,
      loop: false,
    });
  }

  // Impact at target zone — multiple cascading impacts
  script.push({
    part: "ash_008_atk_impact01",
    start: 32,
    x: targetX,
    y: cy,
    scale: 1.8,
    rotate: 0,
    opacity: 1,
    loop: false,
  });
  script.push({
    part: "ash_008_atk_impact02",
    start: 35,
    x: targetX + 15,
    y: cy - 10,
    scale: 1.5,
    rotate: 15,
    opacity: 0.9,
    loop: false,
  });
  script.push({
    part: "ash_008_atk_impact03",
    start: 38,
    x: targetX - 10,
    y: cy + 15,
    scale: 1.3,
    rotate: -10,
    opacity: 0.8,
    loop: false,
  });

  // Ground cracks at impact point
  script.push({
    part: "ash_008_ulti_ground_crack_lv1_01",
    start: 34,
    x: targetX,
    y: cy + 30,
    scale: 1.5,
    rotate: 0,
    opacity: 0.9,
    loop: false,
  });
  script.push({
    part: "ash_008_ulti_ground_crack_lv1_02",
    start: 36,
    x: targetX + 20,
    y: cy + 25,
    scale: 1.3,
    rotate: 20,
    opacity: 0.8,
    loop: false,
  });

  return script;
};

/* ==========================================================================
 * KIT SUPER — Yarn Ball Explosion
 *
 * In-game: Kit throws an exploding yarn ball that creates an area of effect.
 * The yarn ball projectile travels to a location, explodes, creates a
 * ground carpet, and then grass grows in the area. Whimsical pink/purple.
 * ========================================================================== */

const kitSuper = (cx = 270, cy = 300): Script => {
  const script: Script = [];

  // Kit Yarn Ball Lob (only)
  script.push({
    part: "kit_def_oc_ulti_projectile",
    start: 0,
    dur: 20,
    fx: cx - 80,
    fy: cy - 60,
    tx: cx,
    ty: cy - 20,
    arc: 120, // Huge parabolic lob
    scale: 2.0,
    rot: [0, 360],
    loop: false,
    maxOpacity: 1,
  });

  return script;
};

/* ==========================================================================
 * MORTIS
 * ========================================================================== */
export const mortisAttack = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];
  
  // Slash effect at the end of the dash (native ~327x280; 0.7 renders a wide
  // ~1.3-card swipe arc like Mortis' shovel sweep in-game)
  script.push({
    part: "mortis_def_oc_atk_slash",
    start: 0, x: toX, y: toY, // Triggers instantly, no projectile
    scale: 0.7 * s, rotate: 0, opacity: 1, loop: false,
    flip: dir === -1,
  });
  // Ground wind impact
  script.push({
    part: "mortis_def_oc_atk_area",
    start: 2, x: toX, y: toY + 10,
    scale: 0.85 * s, rotate: -20, opacity: 0.9, loop: false,
    flip: dir === -1,
  });
  
  return script;
};

export const mortisSuper = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];
  // Default bats traveling forward in a wide, dense swarm
  const batSpread = 160;
  for (let i = 0; i < 8; i++) {
    const yOff = -batSpread / 2 + (i / 7) * batSpread;
    script.push({
      part: "mortis_def_g1_bat_flight", // Default bats, not the skin
      start: i % 3,
      dur: 25 + (i % 2) * 5,
      fx: fromX, fy: fromY + yOff,
      tx: toX, ty: toY + yOff + (i % 2 === 0 ? 30 : -30),
      scale: (0.55 + (i % 3) * 0.1) * s, rot: [0, 0], loop: true, maxOpacity: 1,
      flip: dir === -1,
    });
  }
  return script;
};

/* ==========================================================================
 * HANK
 * ========================================================================== */
export const hankAttack = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];
  // Quick-tap charge: Hank puffs a small bubble on himself (first ~0.4s of the
  // pre-rendered expand animation) before releasing. Stationary burst, so the
  // whole 420-frame charge never plays out — matches a tap-release in-game.
  script.push({
    part: "hank_004_atk_graffiti",
    start: 0, dur: 12,
    fx: fromX, fy: fromY - 10, tx: fromX, ty: fromY - 10,
    scale: 0.6 * s, rot: [0, 0], loop: false, maxOpacity: 1,
  });
  // Torpedo fires right after the charge and flies to the target (fast, ~0.4s)
  script.push({
    part: "hank_004_ulti_projectile",
    start: 6, dur: 12,
    fx: fromX + dir * 40, fy: fromY - 10, tx: toX, ty: toY - 10,
    scale: 0.55 * s, rot: [0, 0], loop: false, maxOpacity: 1,
    flip: dir === -1,
  });
  // Impact burst at the target when the torpedo lands
  script.push({
    part: "hank_004_ulti_hit_impact",
    start: 17, x: toX, y: toY - 10,
    scale: 0.7 * s, rotate: 0, opacity: 1, loop: false,
    flip: dir === -1,
  });
  return script;
};

export const hankSuper = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];
  // Torpedoes firing in 6 directions
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * (Math.PI / 180);
    const dist = 300;
    script.push({
      part: "hank_004_ulti_projectile",
      start: 0, dur: 26,
      fx: fromX, fy: fromY, 
      tx: fromX + Math.cos(angle) * dist, ty: fromY + Math.sin(angle) * dist,
      scale: 0.55 * s, rot: [i * 60, i * 60], loop: false, maxOpacity: 1,
    });
  }
  return script;
};

/* ==========================================================================
 * WILLOW
 * ========================================================================== */
export const willowAttack = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];
  
  // Lantern toss (Parabolic arc) — small, quick lob (~0.45s to land)
  script.push({
    part: "willow_004_atk_muzzle",
    start: 0, dur: 14,
    fx: fromX, fy: fromY - 20, tx: toX, ty: toY - 20,
    arc: 90, // Parabola
    scale: 0.5 * s, rot: [0, 360], loop: false, maxOpacity: 1,
    flip: dir === -1,
  });
  // Puddle forms on landing (native ~216px; 0.8 ≈ one brawler wide, persists)
  script.push({
    part: "willow_004_atk_pond",
    start: 14, x: toX, y: toY,
    scale: 0.8 * s, rotate: 0, opacity: 1, loop: true,
  });
  return script;
};

export const willowSuper = (fromX: number, fromY: number, toX: number, toY: number, s: number, dir: number): Script => {
  const script: Script = [];
  // Mind control projectile (native ~307px; 0.7 ≈ one card — reads clearly but
  // doesn't cover the board) — extremely fast, straight line
  script.push({
    part: "willow_004_ulti_mindcontrol",
    start: 0, dur: 12,
    fx: fromX, fy: fromY, tx: toX, ty: toY,
    scale: 0.7 * s, rot: [0, 0], loop: false, maxOpacity: 1,
    flip: dir === -1,
  });
  script.push({
    part: "willow_004_ulti_reached",
    start: 12, x: toX, y: toY,
    scale: 0.75 * s, rotate: 0, opacity: 1, loop: false,
    flip: dir === -1,
  });
  return script;
};

/* ==========================================================================
 * NANI
 * ========================================================================== */
const naniAttack = (cx = 120, cy = 300, targetX = 400): Script => {
  const script: Script = [];
  const dist = targetX - cx;
  
  // Center orb (straight)
  script.push({
    part: "nani_007_atk_projectile",
    start: 0, dur: 25,
    fx: cx, fy: cy, tx: cx + dist, ty: cy,
    scale: 1.2, rot: [0, 0], loop: false, maxOpacity: 1,
  });
  // Top orb (diamond trajectory via bezier)
  script.push({
    part: "nani_007_atk_projectile",
    start: 0, dur: 25,
    fx: cx, fy: cy, tx: cx + dist, ty: cy,
    cx: cx + dist / 2, cy: cy - 120, // Diamond peak
    scale: 1.2, rot: [0, 0], loop: false, maxOpacity: 1,
  });
  // Bottom orb (diamond trajectory via bezier)
  script.push({
    part: "nani_007_atk_projectile",
    start: 0, dur: 25,
    fx: cx, fy: cy, tx: cx + dist, ty: cy,
    cx: cx + dist / 2, cy: cy + 120, // Diamond peak
    scale: 1.2, rot: [0, 0], loop: false, maxOpacity: 1,
  });
  
  script.push({
    part: "nani_007_atk_hit",
    start: 25, x: cx + dist, y: cy,
    scale: 1.5, rotate: 0, opacity: 1, loop: false,
  });
  return script;
};

const naniSuper = (cx = 120, cy = 300, targetX = 400): Script => {
  const script: Script = [];
  const dist = targetX - cx;
  // Peep flying in a wider loop before hitting target
  script.push({
    part: "nani_007_ulti_projectile_trail_1",
    start: 0, dur: 45,
    fx: cx, fy: cy, tx: cx + dist, ty: cy,
    cx: cx + dist / 2, cy: cy - 250, // Loop up high
    scale: 2.0, rot: [0, 0], loop: true, maxOpacity: 1,
  });
  // Peep explosion
  script.push({
    part: "nani_007_ulti_explode_huge",
    start: 45, x: cx + dist, y: cy,
    scale: 3.0, rotate: 0, opacity: 1, loop: false,
  });
  return script;
};

/* ---------- Composition Components ---------- */

const GaleAttackScene: React.FC = () => (
  <Scene brawler="gale" script={galeAttack(120, 270, 460, 270, 1, 1)} />
);
const GaleSuperScene: React.FC = () => (
  <Scene brawler="gale" script={galeSuper(270, 270, 570, 270, 1, 1)} />
);
const AshAttackScene: React.FC = () => (
  <Scene brawler="ash" script={ashAttack()} />
);
const KitSuperScene: React.FC = () => (
  <Scene brawler="kit" script={kitSuper()} />
);

const MortisAttackScene: React.FC = () => (
  <Scene brawler="mortis" script={mortisAttack(120, 300, 400, 300, 1, 1)} />
);
const MortisSuperScene: React.FC = () => (
  <Scene brawler="mortis" script={mortisSuper(120, 300, 460, 300, 1, 1)} />
);
const HankAttackScene: React.FC = () => (
  <Scene brawler="hank" script={hankAttack(270, 300, 270, 300, 1, 1)} />
);
const HankSuperScene: React.FC = () => (
  <Scene brawler="hank" script={hankSuper(270, 300, 270, 300, 1, 1)} />
);
const WillowAttackScene: React.FC = () => (
  <Scene brawler="willow" script={willowAttack(120, 300, 400, 300, 1, 1)} />
);
const WillowSuperScene: React.FC = () => (
  <Scene brawler="willow" script={willowSuper(120, 300, 400, 300, 1, 1)} />
);
const NaniAttackScene: React.FC = () => (
  <Scene brawler="nani" script={naniAttack()} />
);
const NaniSuperScene: React.FC = () => (
  <Scene brawler="nani" script={naniSuper()} />
);

export const AttackSceneRoot: React.FC = () => (
  <>
    <Composition
      id="GaleAttackScene"
      component={GaleAttackScene}
      durationInFrames={44}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="GaleSuperScene"
      component={GaleSuperScene}
      durationInFrames={85}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="AshAttackScene"
      component={AshAttackScene}
      durationInFrames={52}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="KitSuperScene"
      component={KitSuperScene}
      durationInFrames={90}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="MortisAttackScene"
      component={MortisAttackScene}
      durationInFrames={30}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="MortisSuperScene"
      component={MortisSuperScene}
      durationInFrames={58}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="HankAttackScene"
      component={HankAttackScene}
      durationInFrames={87}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="HankSuperScene"
      component={HankSuperScene}
      durationInFrames={78}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="WillowAttackScene"
      component={WillowAttackScene}
      durationInFrames={35}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="WillowSuperScene"
      component={WillowSuperScene}
      durationInFrames={30}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="NaniAttackScene"
      component={NaniAttackScene}
      durationInFrames={36}
      fps={30}
      width={540}
      height={540}
    />
    <Composition
      id="NaniSuperScene"
      component={NaniSuperScene}
      durationInFrames={83}
      fps={30}
      width={540}
      height={540}
    />
  </>
);