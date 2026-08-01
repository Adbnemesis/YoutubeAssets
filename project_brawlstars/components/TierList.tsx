import React from "react";
import {
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { BrawlerEntry, TierKey, TierListConfig, MoveFx, FightTurn } from "../types";
import { popIn } from "../motion";
import { FONT_FAMILY } from "../fonts";
import { beatToFrame } from "../beatGrid";

export interface TierListProps {
  config: TierListConfig;
  /** Frame when cards may begin dropping */
  settleFrame: number;
  /** Frame of the D-tier slam (pins + shake) */
  slamFrame: number;
  /** Frame when grid is revealed (prevents intro double icons) */
  gridRevealFrame?: number;
  /** Fight window — the tier-list cards battle with their abilities */
  fight?: { start: number; end: number; turns: FightTurn[] };
}

/**
 * Full-screen tier list matching the reference video:
 *  - five equal rows (S,A,B,C,D) with a smooth red→orange→yellow→green
 *    gradient label strip on the left
 *  - cards drop in, fly between tiers with FX (splash / glitch / domino)
 *  - dislike/heart pins land on drop beats
 *  - during the fight window the existing tier cards attack each other with
 *    their real Brawl Stars ability VFX flying between them
 */

const ROW_TOP: Record<TierKey, number> = {
  S: 0,
  A: 384,
  B: 768,
  C: 1152,
  D: 1536,
  F: 1536,
};

const ROW_BOTTOM: Record<TierKey, number> = {
  S: 384,
  A: 768,
  B: 1152,
  C: 1536,
  D: 1920,
  F: 1920,
};

const rowCenter = (tier: TierKey): number =>
  (ROW_TOP[tier] + ROW_BOTTOM[tier]) / 2;

const STRIP_W = 140;
const CONTENT_X = STRIP_W + 30;
const CONTENT_W = 1080 - CONTENT_X;
const CARD_SIZE = 175;
const CARD_GAP = 20;
const FLY_DURATION = 14;

const STRIP_GRADIENT = [
  "#F4598C",
  "#FF8A5C",
  "#FFB84D",
  "#FFD94F",
  "#7FE35C",
  "#3BBE5E",
];

const FIGHT_ORDER = ["kenji", "edgar", "shelly", "frank"];

const cardSlotX = (slot: number): number => {
  const total = 4 * CARD_SIZE + 3 * CARD_GAP;
  const startX = CONTENT_X + (CONTENT_W - total) / 2;
  return startX + slot * (CARD_SIZE + CARD_GAP) + CARD_SIZE / 2;
};

/** Tier of an entry at a given frame (null = not yet dropped). */
const tierAt = (entry: BrawlerEntry, frame: number): TierKey | null => {
  if (frame < entry.dropFrame) return null;
  let t = entry.initialTier;
  for (const m of entry.moves) if (frame >= m.frame) t = m.tier;
  return t;
};

const slotAt = (
  entries: BrawlerEntry[],
  id: string,
  tier: TierKey,
  frame: number
): number => {
  const members = entries
    .filter((e) => tierAt(e, frame) === tier)
    .sort((a, b) => a.dropFrame - b.dropFrame || a.id.localeCompare(b.id));
  const idx = members.findIndex((e) => e.id === id);
  return Math.max(0, idx);
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// ─── Ability VFX (fly between the attacking card and its target) ──────────
// Recreated to match the real Brawl Stars attack visuals:
//  Kenji  — crescent katana slash arc (teal/white) + spinning blade
//  Edgar  — 4 quick violet punch arcs in a fan
//  Shelly — orange shotgun pellet cone with muzzle flash
//  Frank  — orange hammer ground shockwave (elliptical wave)

const KatanaSlash: React.FC<{ rel: number; fromX: number; toX: number; y: number; isSuper?: boolean }> = ({
  rel,
  fromX,
  toX,
  y,
  isSuper
}) => {
  const prog = interpolate(rel, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const opacity = interpolate(rel, [0, 4, 12], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = lerp(fromX, toX, prog);
  const scale = (isSuper ? 1.5 : 1.0) * interpolate(prog, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  
  const path = "M 200,50 A 150,150 0 0,0 200,350 A 180,180 0 0,1 250,50 Z";
  
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `translate(-50%,-50%) scale(${scale}) rotate(${toX > fromX ? 0 : 180}deg)`,
        zIndex: 100,
      }}
    >
      <div style={{ transform: "translate(-200px, -200px)" }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          <path d={path} fill="#00FFFF" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M 190,40 L 170,80 L 190,100 L 160,150 L 180,180 L 140,250 L 180,280 L 170,330 L 210,360" fill="none" stroke="#00FFFF" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

const ScarfPunches: React.FC<{ rel: number; fromX: number; toX: number; y: number; isSuper?: boolean }> = ({
  rel,
  fromX,
  toX,
  y,
  isSuper
}) => {
  const prog = interpolate(rel, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(rel, [0, 4, 12], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = isSuper ? 1.5 : 1;
  const dir = toX > fromX ? 1 : -1;
  const x = fromX + (dir * 80);

  const punchX = interpolate(prog, [0, 1], [-100 * dir, 150 * dir]);
  const punchX2 = interpolate(prog, [0, 1], [100 * dir, -150 * dir]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `translate(-50%,-50%) scale(${scale})`,
        zIndex: 100,
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          width: 140, height: 60,
          background: "linear-gradient(90deg, #FF1C1C 33%, #FFFFFF 33%, #FFFFFF 66%, #1F1F1F 66%)",
          borderRadius: 30,
          border: "6px solid black",
          transform: `translate(${punchX}px, -50px) rotate(${-15 * dir}deg)`,
          boxShadow: "0px 0px 20px rgba(255,28,28,0.6)"
        }} />
        <div style={{
          position: "absolute",
          width: 140, height: 60,
          background: "linear-gradient(90deg, #1F1F1F 33%, #FFFFFF 33%, #FFFFFF 66%, #FF1C1C 66%)",
          borderRadius: 30,
          border: "6px solid black",
          transform: `translate(${punchX2}px, 50px) rotate(${15 * dir}deg)`,
          boxShadow: "0px 0px 20px rgba(255,28,28,0.6)"
        }} />
        
        {prog > 0.6 && [0,1,2].map(i => (
          <div key={i} style={{
            position: "absolute",
            width: 40, height: 40,
            background: "white",
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            transform: `translate(${i===0 ? 160*dir : i===1 ? -160*dir : 0}px, ${i===0 ? -60 : i===1 ? 60 : 0}px) scale(${interpolate(prog, [0.6,1], [0,1])}) rotate(${rel * 10}deg)`
          }} />
        ))}
      </div>
    </div>
  );
};

const Buckshot: React.FC<{ rel: number; fromX: number; toX: number; y: number; isSuper?: boolean }> = ({
  rel,
  fromX,
  toX,
  y,
  isSuper
}) => {
  const prog = interpolate(rel, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(rel, [0, 10, 15], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = isSuper ? 1.5 : 1;
  const dir = toX > fromX ? 1 : -1;

  const pellets = Array.from({ length: 15 }).map((_, i) => {
    // Generate deterministic randoms for pellets
    const r1 = Math.sin(i * 123.45);
    const r2 = Math.cos(i * 678.90);
    const angle = -45 + (i * 6) + (r1 * 10 - 5);
    const speed = 10 + r2 * 15;
    return { angle, speed, size: 10 + Math.abs(r1) * 15 };
  });

  return (
    <div
      style={{
        position: "absolute",
        left: fromX,
        top: y,
        opacity,
        transform: `translate(-50%,-50%) scale(${scale})`,
        zIndex: 100,
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          width: 120, height: 120,
          background: "#FFFFFF",
          borderRadius: "50%",
          border: "8px solid #B0B0B0",
          transform: `translate(${dir === 1 ? 20 : -140}px, -60px) scale(${interpolate(prog, [0, 1], [0.2, 1])})`,
          opacity: interpolate(prog, [0, 0.5, 1], [1, 1, 0])
        }} />
        
        {pellets.map((p, i) => {
          const dist = (rel * p.speed) * dir;
          const rad = (p.angle * Math.PI) / 180;
          const px = Math.cos(rad) * dist + (dir === 1 ? 60 : -60);
          const py = Math.sin(rad) * Math.abs(dist);
          return (
            <div key={i} style={{
              position: "absolute",
              width: p.size, height: p.size,
              background: i % 2 === 0 ? "#FFD700" : "#FF4500",
              borderRadius: "50%",
              boxShadow: "0 0 10px #FF4500",
              transform: `translate(${px}px, ${py}px)`
            }} />
          );
        })}
      </div>
    </div>
  );
};

const HammerShockwave: React.FC<{ rel: number; fromX: number; toX: number; y: number; isSuper?: boolean }> = ({
  rel,
  fromX,
  toX,
  y,
  isSuper
}) => {
  const prog = interpolate(rel, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const opacity = interpolate(rel, [0, 10, 15], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = isSuper ? 1.8 : 1.2;

  return (
    <div
      style={{
        position: "absolute",
        left: toX, // Centers on the target!
        top: y,
        opacity,
        transform: `translate(-50%,-50%) scale(${scale}) rotateX(45deg)`,
        zIndex: 100,
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          width: 300, height: 300,
          borderRadius: "50%",
          border: "20px solid #A020F0",
          transform: `translate(-150px, -150px) scale(${prog})`,
          boxShadow: "0 0 40px #A020F0, inset 0 0 40px #A020F0",
          opacity: interpolate(prog, [0, 1], [1, 0])
        }} />
        <div style={{
          position: "absolute",
          width: 150, height: 150,
          background: "#FF00FF",
          borderRadius: "50%",
          transform: `translate(-75px, -75px) scale(${prog * 0.8})`,
          filter: "blur(20px)",
          opacity: interpolate(prog, [0, 0.5, 1], [1, 1, 0])
        }} />
        <svg width="400" height="400" style={{ position: "absolute", transform: "translate(-200px, -200px)" }}>
          <path d="M 200,200 L 100,100 M 200,200 L 300,80 M 200,200 L 80,300 M 200,200 L 320,320" 
                stroke="#500080" strokeWidth="8" strokeDasharray="150" strokeDashoffset={interpolate(prog, [0,1], [150, 0])} strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

const AbilityVfx: React.FC<{
  id: string;
  kind: "attack" | "super";
  rel: number;
  fromX: number;
  toX: number;
  y: number;
}> = ({ id, kind, rel, fromX, toX, y }) => {
  if (rel < 0 || rel > 18) return null;
  const isSuper = kind === "super";
  return (
    <>
      {id === "kenji" && <KatanaSlash rel={rel} fromX={fromX} toX={toX} y={y} isSuper={isSuper} />}
      {id === "edgar" && <ScarfPunches rel={rel} fromX={fromX} toX={toX} y={y} isSuper={isSuper} />}
      {id === "shelly" && <Buckshot rel={rel} fromX={fromX} toX={toX} y={y} isSuper={isSuper} />}
      {id === "frank" && <HammerShockwave rel={rel} fromX={fromX} toX={toX} y={y} isSuper={isSuper} />}
    </>
  );
};

// ─── FX ────────────────────────────────────────────────────────────────────

const SplashFx: React.FC<{ rel: number; color: string }> = ({ rel, color }) => {
  const scale = interpolate(rel, [0, 14], [0.2, 3.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(rel, [0, 6, 14], [0.9, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: CARD_SIZE,
        height: CARD_SIZE,
        transform: `translate(-50%,-50%) scale(${scale})`,
        opacity,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}cc 0%, ${color}33 45%, transparent 70%)`,
        boxShadow: `0 0 60px ${color}66`,
      }}
    />
  );
};

const GlitchFx: React.FC<{ rel: number; color: string }> = ({ rel, color }) => {
  const opacity = interpolate(rel, [0, 16], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offset = Math.sin(rel * 3) * 6;
  const borderDashed = rel % 4 < 2;
  return (
    <div style={{ position: "absolute", inset: -14, opacity, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `4px ${borderDashed ? "dashed" : "solid"} ${color}`,
          borderRadius: 20,
          boxShadow: `0 0 24px ${color}66`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `2px solid ${color}88`,
          borderRadius: 20,
          transform: `translateX(${offset}px)`,
          filter: "blur(1px)",
        }}
      />
    </div>
  );
};

const DominoFx: React.FC<{ rel: number; color: string }> = ({ rel, color }) => {
  const progress = interpolate(rel, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const tiles = Array.from({ length: 16 });
  return (
    <div
      style={{
        position: "absolute",
        inset: -16,
        opacity: interpolate(rel, [0, 18], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        pointerEvents: "none",
      }}
    >
      {tiles.map((_, i) => {
        const side = i % 4;
        const pos = Math.floor(i / 4);
        const size = 26;
        let x = 0;
        let y = 0;
        if (side === 0) {
          x = -size;
          y = pos * (50 / 3) - 25;
        } else if (side === 1) {
          x = 100 + size;
          y = pos * (50 / 3) - 25;
        } else if (side === 2) {
          x = pos * (100 / 5) + 10 - 50;
          y = -size;
        } else {
          x = pos * (100 / 5) + 10 - 50;
          y = 100 + size;
        }
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              backgroundColor: color,
              border: "2px solid #FFFFFF",
              borderRadius: 6,
              transform: `translate(calc(-50% + ${x * progress}%), calc(-50% + ${y * progress}%)) rotate(${progress * 360}deg)`,
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            }}
          />
        );
      })}
    </div>
  );
};

const MoveFxLayer: React.FC<{ fx: MoveFx; rel: number }> = ({ fx, rel }) => {
  if (rel < 0 || rel > 22) return null;
  if (fx === "splash") return <SplashFx rel={rel} color="#38BDF8" />;
  if (fx === "glitch") return <GlitchFx rel={rel} color="#06B6D4" />;
  return <DominoFx rel={rel} color="#A855F7" />;
};

const ArrowBadge: React.FC<{
  src: string;
  isDrop: boolean;
  eventFrame: number;
}> = ({ src, isDrop, eventFrame }) => {
  const frame = useCurrentFrame();
  const rel = frame - eventFrame;
  if (rel < 0 || rel >= 30) return null; // Visible for 1 second only

  const bounceScale = popIn(Math.max(0, rel), 30, 0, { damping: 9, stiffness: 240 });
  const slideY = interpolate(rel, [0, 8], [isDrop ? -28 : 28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });
  const fadeOut = interpolate(rel, [20, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        right: -14,
        top: -16,
        transform: `translateY(${slideY}px) scale(${bounceScale})`,
        opacity: fadeOut,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: 68,
          height: 68,
          objectFit: "contain",
          filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.85))",
        }}
      />
    </div>
  );
};

// ─── Card ──────────────────────────────────────────────────────────────────

interface BrawlerCardProps {
  entry: BrawlerEntry;
  config: TierListConfig;
  allEntries: BrawlerEntry[];
  frame: number;
  fps: number;
  slamFrame: number;
  gridRevealFrame?: number;
  attackState: "attacker" | "target" | "none";
  attackerId?: string;
}

const BrawlerCard: React.FC<BrawlerCardProps> = ({ entry, config, allEntries, frame, fps, slamFrame, gridRevealFrame, attackState, attackerId }) => {

  const currentTier = tierAt(entry, frame);
  if (!currentTier) return null;

  const activeMove = entry.moves.find(
    (m) => {
      const dur = m.duration ?? FLY_DURATION;
      return frame >= m.frame && frame < m.frame + dur;
    }
  );

  let x: number;
  let y: number;
  let flyScale = 1;
  let rotate = 0;

  if (activeMove) {
    const dur = activeMove.duration ?? FLY_DURATION;
    const prevTier = tierAt(entry, activeMove.frame - 1) ?? entry.initialTier;
    const progress = interpolate(
      frame,
      [activeMove.frame, activeMove.frame + dur],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
    );
    const fromY = rowCenter(prevTier);
    const toY = rowCenter(activeMove.tier);
    const fromSlot = slotAt(allEntries, entry.id, prevTier, activeMove.frame - 1);
    const toSlot = slotAt(allEntries, entry.id, activeMove.tier, activeMove.frame + dur);
    x = lerp(cardSlotX(fromSlot), cardSlotX(toSlot), progress);
    y = lerp(fromY, toY, progress);
    const isDrop = toY > fromY;
    rotate = isDrop ? (1 - progress) * 24 : (1 - progress) * 8;
    flyScale = isDrop ? 1 : 1.08;
  } else {
    const slot = slotAt(allEntries, entry.id, currentTier, frame);
    x = cardSlotX(slot);
    y = rowCenter(currentTier);
  }

  const dropRel = frame - entry.dropFrame;
  let dropScale = 1;
  let dropY = 0;
  if (dropRel >= 0 && dropRel < 20 && !activeMove) {
    const s = popIn(dropRel, fps, 0, { damping: 9, stiffness: 260 });
    dropScale = s;
    dropY = interpolate(dropRel, [0, 7], [-320, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }

  let slamShake = 0;
  if (frame >= slamFrame && frame < slamFrame + 12 && currentTier === "D") {
    slamShake = Math.sin((frame - slamFrame) * 0.9) * 7 * (1 - (frame - slamFrame) / 12);
  }

  // Fight: attacker lunges, target recoils + flashes, defeated slides away
  let fightMove = 0;
  let hitFlash = 0;
  let attackFlash = 0;
  let defeatSlide = 0;
  let defeated = false;
  if (entry.defeatFrame !== undefined && frame >= entry.defeatFrame) {
    defeated = true;
    defeatSlide = interpolate(frame, [entry.defeatFrame, entry.defeatFrame + 22], [0, 560], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    if (defeatSlide >= 560) return null;
  } else if (attackState === "attacker") {
    const phase = frame % 14;
    if (phase < 7) {
      fightMove = Math.sin((phase / 7) * Math.PI) * 80; // Aggressive forward lunge
      attackFlash = Math.sin((phase / 7) * Math.PI); // 0 to 1 during lunge
    }
  } else if (attackState === "target") {
    const phase = frame % 14;
    if (phase < 7) {
      fightMove = -Math.sin((phase / 7) * Math.PI) * 32;
      hitFlash = Math.sin((phase / 7) * Math.PI); // 0 to 1 during hit
    }
  }

  const idlePulse = currentTier === "S" ? 1 + Math.sin(frame * 0.07) * 0.03 : 1;
  const accent = entry.accentColor ?? "#FFFFFF";
  const defeatOpacity = defeated
    ? Math.max(0, 1 - defeatSlide / 560)
    : 1;

  // Determine if brawler is currently moving or has an active rank arrow event
  let arrowType: "red" | "green" | undefined;
  let arrowStartFrame: number | undefined;

  if (activeMove) {
    const prevTier = tierAt(entry, activeMove.frame - 1) ?? entry.initialTier;
    const isDrop = rowCenter(activeMove.tier) > rowCenter(prevTier);
    arrowType = isDrop ? "red" : "green";
    arrowStartFrame = activeMove.frame;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${dropScale * flyScale * idlePulse * (1 + attackFlash * 0.3)}) rotate(${rotate}deg) translateX(${slamShake + fightMove + defeatSlide}px)`,
        zIndex: attackState === "attacker" ? 10 : currentTier === "S" ? 5 : 3,
        opacity: defeatOpacity,
        filter: defeated ? "grayscale(0.7)" : "none",
      }}
    >
      <div style={{ position: "relative", transform: `translateY(${dropY}px)` }}>
        <div
          style={{
            width: CARD_SIZE,
            height: CARD_SIZE,
            borderRadius: 20,
            overflow: "hidden",
            border: `4px solid ${currentTier === "S" ? "#FFD60A" : "#FFFFFF"}`,
            boxShadow: [
              `0 0 ${currentTier === "S" ? 34 : 18}px ${currentTier === "S" ? "#FFD60A" : accent}aa`,
              "0 10px 26px rgba(0,0,0,0.65)",
            ].join(", "),
            // Strong red tint + brightness bump when hit
            filter: hitFlash > 0 ? `brightness(${1 + hitFlash * 0.5}) sepia(1) hue-rotate(-50deg) saturate(${3 + hitFlash * 5})` : "none",
          }}
        >
          <Img
            src={staticFile(entry.imageSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Dynamic Attack VFX Overlay over ATTACKER (weapon flash) */}
          {attackFlash > 0 && entry.id === "kenji" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "150%",
                height: 10,
                background: "#FFFFFF",
                transform: `translate(-50%, -50%) rotate(45deg) scale(${attackFlash})`,
                opacity: attackFlash,
                filter: "drop-shadow(0 0 20px #2ED885) drop-shadow(0 0 40px #2ED885)",
              }}
            />
          )}
          {attackFlash > 0 && entry.id === "edgar" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${0.5 + attackFlash})`,
                fontSize: 100,
                opacity: attackFlash,
                filter: "drop-shadow(0 0 20px #E0245E)",
              }}
            >
              🥊
            </div>
          )}
          {attackFlash > 0 && entry.id === "frank" && (
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${0.5 + attackFlash}) rotate(-20deg)`,
                fontSize: 100,
                opacity: attackFlash,
                filter: "drop-shadow(0 0 15px #38BDF8)",
              }}
            >
              🔨
            </div>
          )}
          {/* Dynamic Attack VFX Overlay based on who attacked */}
          {hitFlash > 0 && attackerId === "kenji" && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)",
                transform: `scale(${1 + hitFlash * 1.5})`,
                opacity: hitFlash,
                filter: "drop-shadow(0 0 10px #2ED885) drop-shadow(0 0 20px #2ED885)",
              }}
            />
          )}
          {hitFlash > 0 && attackerId === "edgar" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${0.5 + hitFlash * 1.5})`,
                fontSize: 100,
                opacity: hitFlash,
                filter: "drop-shadow(0 0 20px #E0245E)",
              }}
            >
              🥊
            </div>
          )}
          {hitFlash > 0 && attackerId === "frank" && (
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: "50%",
                transform: `translateX(-50%) scale(${1 + hitFlash})`,
                width: "150%",
                height: 100,
                background: "radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 70%)",
                opacity: hitFlash,
                filter: "drop-shadow(0 0 15px #38BDF8)",
              }}
            />
          )}
        </div>
        {arrowType === "red" && arrowStartFrame !== undefined && (
          <ArrowBadge src="brawl/images/red_arrow.png" isDrop={true} eventFrame={arrowStartFrame} />
        )}
        {arrowType === "green" && arrowStartFrame !== undefined && (
          <ArrowBadge src="brawl/images/green_arrow.png" isDrop={false} eventFrame={arrowStartFrame} />
        )}
        <div
          style={{
            marginTop: 6,
            fontSize: 21,
            fontWeight: 900,
            color: "#FFFFFF",
            textAlign: "center",
            textShadow: "0 2px 6px rgba(0,0,0,0.9)",
            fontFamily: "'Space Grotesk', 'Montserrat', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {entry.name}
        </div>
      </div>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────

export const TierList: React.FC<TierListProps> = ({
  config,
  settleFrame,
  slamFrame,
  gridRevealFrame,
  fight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rel = frame - settleFrame;
  // Reference: tier list is at full brightness from frame 0 (no fade-in)
  const containerOpacity = 1;

  // Resolve the current fight turn + attacker/target positions
  let currentTurn: FightTurn | undefined;
  let attackerPos: { x: number; y: number } | undefined;
  let targetPos: { x: number; y: number } | undefined;
  if (fight && frame >= fight.start && frame < fight.end) {
    for (const t of fight.turns) {
      const bf = beatToFrame(t.beat, fps);
      if (frame >= bf && frame < bf + 18) currentTurn = t;
    }
    const turn = currentTurn;
    if (turn) {
      const aEntry = config.entries.find((e) => e.id === turn.id);
      // Defeated brawlers stop attacking — no lunge, no VFX
      if (aEntry && aEntry.defeatFrame !== undefined && frame >= aEntry.defeatFrame) {
        currentTurn = undefined;
      } else if (aEntry) {
        const aIdx = FIGHT_ORDER.indexOf(turn.id);
        const tId = FIGHT_ORDER[(aIdx + 1) % FIGHT_ORDER.length];
        const tEntry = config.entries.find((e) => e.id === tId);
        if (aEntry && tEntry) {
          const aTier = tierAt(aEntry, frame);
          const tTier = tierAt(tEntry, frame);
          if (aTier && tTier) {
            attackerPos = {
              x: cardSlotX(slotAt(config.entries, aEntry.id, aTier, frame)),
              y: rowCenter(aTier),
            };
            targetPos = {
              x: cardSlotX(slotAt(config.entries, tEntry.id, tTier, frame)),
              y: rowCenter(tTier),
            };
          }
        }
      }
    }
  }

  const vfxRel = currentTurn ? frame - beatToFrame(currentTurn.beat, fps) : -1;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: containerOpacity, zIndex: 4 }}>
      {/* Gradient label strip — clean, no stretch, no double letters */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: STRIP_W,
          height: 1920,
          background: `linear-gradient(180deg, ${STRIP_GRADIENT.join(", ")})`,
          boxShadow: "inset -10px 0 24px rgba(0,0,0,0.35)",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 384 * i,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
        ))}
      </div>

      {/* Tier letters (clean, at equal row centers) */}
      {config.rows.map((row) => {
        const center = rowCenter(row.key);
        return (
          <div
            key={row.key}
            style={{
              position: "absolute",
              left: 0,
              top: center - 70,
              width: STRIP_W,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 96,
                color: "#FFFFFF",
                WebkitTextStroke: "5px rgba(0,0,0,0.85)",
                paintOrder: "stroke fill",
                textShadow: "0 4px 0 rgba(0,0,0,0.4), 0 0 18px rgba(255,255,255,0.45)",
              }}
            >
              {row.label}
            </span>
          </div>
        );
      })}

      {/* Row separators across the body */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 384 * i,
            left: STRIP_W,
            width: 1080 - STRIP_W,
            height: 3,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />
      ))}

      {/* Fight ability VFX flying between attacker and target */}
      {currentTurn && attackerPos && targetPos && (
        <AbilityVfx
          id={currentTurn.id}
          kind={currentTurn.kind}
          rel={vfxRel}
          fromX={attackerPos.x}
          toX={targetPos.x}
          y={lerp(attackerPos.y, targetPos.y, 0.5)}
        />
      )}

      {/* Cards */}
      {config.entries.map((entry) => {
        let attackState: "attacker" | "target" | "none" = "none";
        if (currentTurn) {
          if (entry.id === currentTurn.id) attackState = "attacker";
          else {
            const aIdx = FIGHT_ORDER.indexOf(currentTurn.id);
            if (entry.id === FIGHT_ORDER[(aIdx + 1) % FIGHT_ORDER.length]) {
              attackState = "target";
            }
          }
        }
        return (
          <BrawlerCard
            key={entry.id}
            entry={entry}
            config={config}
            allEntries={config.entries}
            frame={frame}
            fps={fps}
            slamFrame={slamFrame}
            gridRevealFrame={gridRevealFrame}
            attackState={attackState}
            attackerId={attackState === "target" ? currentTurn?.id : undefined}
          />
        );
      })}

      {/* Promotion FX bursts at move destination */}
      {config.entries.flatMap((e) =>
        e.moves
          .filter((m) => m.fx && frame >= m.frame && frame < m.frame + 22)
          .map((m) => {
            const targetSlot = slotAt(config.entries, e.id, m.tier, m.frame + 20);
            return (
              <div
                key={`${e.id}-${m.frame}`}
                style={{
                  position: "absolute",
                  left: cardSlotX(targetSlot),
                  top: rowCenter(m.tier),
                  transform: "translate(-50%,-50%)",
                }}
              >
                <MoveFxLayer fx={m.fx!} rel={frame - m.frame} />
              </div>
            );
          })
      )}
    </div>
  );
};
