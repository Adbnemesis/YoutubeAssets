import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { BrawlerEntry, WinnerPhase, ColorBeat } from "../types";
import { popIn } from "../motion";
import { resolveBackgroundColor } from "./Background";
import { FONT_FAMILY } from "../fonts";
import { KenjiCharacter, KenjiCharacterProps } from "./characters/KenjiCharacter";

export interface WinnerRevealProps {
  phases: WinnerPhase[];
  entries: BrawlerEntry[];
  /** Per-beat colors used by the spin showcase background */
  colorCycle: ColorBeat[];
}

const DoubleBorderFrame: React.FC<{ inset: number }> = ({ inset }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset,
        border: "6px solid #FFFFFF",
        borderRadius: 28,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: inset + 22,
        border: "3px solid rgba(255,255,255,0.45)",
        borderRadius: 20,
      }}
    />
  </>
);

const Confetti: React.FC<{ rel: number }> = ({ rel }) => {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: (i * 37.7) % 100,
        delay: (i % 12) * 2,
        size: 6 + (i % 5) * 4,
        color: ["#FFD60A", "#FF2D55", "#38BDF8", "#A78BFA", "#34D399"][i % 5],
        w: 0.6 + (i % 4) * 0.25,
      })),
    []
  );
  return (
    <>
      {pieces.map((p, i) => {
        const y = ((rel - p.delay) * p.w) % 130;
        const opacity = interpolate(rel, [p.delay, p.delay + 45], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (y < 0 || opacity <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${y - 15}%`,
              width: p.size,
              height: p.size * 0.4,
              backgroundColor: p.color,
              opacity: opacity * 0.4,
              transform: `rotate(${rel * 6 + i * 40}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

const Portrait: React.FC<{
  entry?: BrawlerEntry;
  size: number;
  accent: string;
  rotation: number;
  rel: number;
  x?: number;
  y?: number;
}> = ({ entry, size, accent, rotation, rel, x = 50, y = 43 }) => {
  const scale = popIn(Math.max(0, rel - 5), 30, 0, { damping: 10, stiffness: 150 });
  return (
    <div
      style={{
        position: "absolute",
        top: `${y}%`,
        left: `${x}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.11,
          overflow: "hidden",
          border: "6px solid #FFFFFF",
          boxShadow: [
            `0 0 50px ${accent}`,
            `0 0 110px ${accent}77`,
            "0 26px 60px rgba(0,0,0,0.6)",
          ].join(", "),
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {entry ? (
          <Img
            src={staticFile(entry.imageSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>
    </div>
  );
};

const TitleText: React.FC<{
  title: string;
  fontSize: number;
  color: string;
  topPct: number;
  rel: number;
}> = ({ title, fontSize, color, topPct, rel }) => {
  const scale = popIn(Math.max(0, rel - 10), 30, 0, { damping: 10, stiffness: 190 });
  return (
    <div
      style={{
        position: "absolute",
        top: `${topPct}%`,
        left: 0,
        right: 0,
        textAlign: "center",
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize,
          color,
          WebkitTextStroke: "8px #000000",
          paintOrder: "stroke fill",
          textShadow: [
            "0 8px 0 #000000",
            `0 0 40px ${color}`,
            `0 0 80px ${color}aa`,
          ].join(", "),
        }}
      >
        {title}
      </span>
    </div>
  );
};

/** HP bar (brawl-stars style) */
const HpBar: React.FC<{
  value: number;
  label: string;
  x: number;
  y: number;
}> = ({ value, label, x, y }) => {
  const color = value > 0.5 ? "#30D158" : value > 0.25 ? "#FF9F0A" : "#FF453A";
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translateX(-50%)",
        width: 340,
        zIndex: 10,
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#FFFFFF",
          fontFamily: "'Space Grotesk','Montserrat',sans-serif",
          fontSize: 24,
          fontWeight: 900,
          textShadow: "0 2px 4px rgba(0,0,0,0.9)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 22,
          borderRadius: 11,
          backgroundColor: "#3A3F47",
          border: "3px solid #FFFFFF",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.max(0, value * 100)}%`,
            backgroundColor: color,
            transition: "width 0.1s linear",
            background: `linear-gradient(180deg, ${color}, ${color}99)`,
          }}
        />
      </div>
    </div>
  );
};

/** Battle-slash FX */
const SlashFx: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 8], [0.4, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 3, 8], [1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: 130,
        height: 40,
        opacity,
        transform: `translate(-50%,-50%) rotate(-20deg) scale(${scale})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 20,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          filter: `blur(2px) drop-shadow(0 0 10px ${color})`,
        }}
      />
    </div>
  );
};

/**
 * Brawl-stars-style fight: the winner card battles opponent cards —
 * HP bars, lunge attacks on the beat, slash FX, and defeat at the end.
 */
const FightScene: React.FC<{
  winner?: BrawlerEntry;
  opponents: BrawlerEntry[];
  phase: WinnerPhase;
  rel: number;
}> = ({ winner, opponents, phase, rel }) => {
  const frame = useCurrentFrame();
  const attackEvery = phase.attackEvery ?? 6;
  const attackCount = Math.max(1, Math.floor(rel / attackEvery));
  const progress = Math.min(1, rel / Math.max(1, phase.endFrame - phase.frame));

  const winnerHp = 1;
  const oppHp = Math.max(0, 1 - progress * 1.15);
  const defeated = oppHp <= 0;
  const oppDefeatRel = rel - (phase.endFrame - phase.frame) + 4;

  // Winner lunges forward on each attack beat
  const attackPhase = (frame % attackEvery);
  const lunge = attackPhase < 3 ? Math.sin((attackPhase / 3) * Math.PI) * 46 : 0;

  return (
    <>
      {/* Winner (left) */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "30%",
          transform: `translate(-50%,-50%) translateX(${lunge}px)`,
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 32,
            overflow: "hidden",
            border: "6px solid #FFD60A",
            boxShadow: "0 0 60px #FFD60A, 0 0 120px #FFD60A66, 0 26px 60px rgba(0,0,0,0.6)",
            transform: `rotate(${Math.sin(frame * 0.1) * 3}deg)`,
          }}
        >
          {winner && (
            <Img
              src={staticFile(winner.imageSrc)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      </div>

      {/* Opponent (right) — falls when defeated */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "72%",
          transform: `translate(-50%,-50%) rotate(${defeated ? 90 + Math.max(0, oppDefeatRel) * 2 : 0}deg)`,
          opacity: defeated ? Math.max(0.15, 1 - oppDefeatRel * 0.06) : 1,
          filter: defeated ? "grayscale(1)" : "none",
        }}
      >
        {opponents[0] && (
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 28,
              overflow: "hidden",
              border: "5px solid #FF453A",
              boxShadow: "0 0 40px #FF453A88, 0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            <Img
              src={staticFile(opponents[0].imageSrc)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* VS */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "51%",
          transform: "translate(-50%,-50%)",
          fontFamily: FONT_FAMILY,
          fontSize: 84,
          color: "#FFD60A",
          WebkitTextStroke: "5px #000000",
          paintOrder: "stroke fill",
          textShadow: "0 0 30px #FFD60A",
          zIndex: 8,
        }}
      >
        VS
      </div>

      {/* HP bars */}
      <HpBar value={winnerHp} label={winner?.name ?? "WINNER"} x={30} y={20} />
      <HpBar value={oppHp} label={opponents[0]?.name ?? "?"} x={72} y={20} />

      {/* Slash FX on each attack beat */}
      {attackCount > 0 && (
        <SlashFx x={58} y={44} color="#FFD60A" />
      )}
      {defeated && (
        <SlashFx x={70} y={44} color="#FF453A" />
      )}
    </>
  );
};

export const WinnerReveal: React.FC<WinnerRevealProps> = ({
  phases,
  entries,
  colorCycle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase = phases.find((p) => frame >= p.frame && frame < p.endFrame);
  if (!phase) return null;

  const entry = entries.find((e) => e.id === phase.entryId);
  const rel = frame - phase.frame;
  const accent = phase.accentColor ?? "#FFD60A";

  if (phase.type === "title") {
    return (
      <AbsoluteFill style={{ zIndex: 60, pointerEvents: "none" }}>
        <AbsoluteFill style={{ backgroundColor: phase.backgroundColor }}>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 30%, ${accent}44 0%, rgba(0,0,0,0) 60%)`,
            }}
          />
          <DoubleBorderFrame inset={36} />
        </AbsoluteFill>
        <Confetti rel={rel} />
        <Portrait entry={entry} size={380} accent={accent} rotation={0} rel={rel} />
        {phase.title && (
          <TitleText title={phase.title} fontSize={170} color={accent} topPct={68} rel={rel} />
        )}
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: interpolate(rel, [0, 2, 6], [0, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>
    );
  }

  if (phase.type === "fight") {
    const bg = resolveBackgroundColor(frame, colorCycle, phase.backgroundColor, fps);
    const opponents = (phase.opponents ?? [])
      .map((id) => entries.find((e) => e.id === id))
      .filter((e): e is BrawlerEntry => !!e);
    return (
      <AbsoluteFill style={{ zIndex: 60, pointerEvents: "none" }}>
        <AbsoluteFill style={{ backgroundColor: bg }}>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 42%, ${accent}33 0%, rgba(0,0,0,0) 55%)`,
            }}
          />
          <DoubleBorderFrame inset={36} />
        </AbsoluteFill>
        <FightScene winner={entry} opponents={opponents} phase={phase} rel={rel} />
        {phase.title && (
          <TitleText title={phase.title} fontSize={120} color={accent} topPct={72} rel={rel} />
        )}
      </AbsoluteFill>
    );
  }

  if (phase.type === "spin") {
    const bg = resolveBackgroundColor(frame, colorCycle, phase.backgroundColor, fps);
    // Beat len for the showcase — reference has very fast cuts
    const beatLen = Math.round((60 / 126) * fps); // ~14 frames
    const beatIdx = Math.floor(rel * 0.7 / beatLen); // faster cycle (0.5x duration)
    const inBeat = rel * 0.7 - beatIdx * beatLen;
    // More varied pose cycle (14 poses — cool/sit/stand/sword/run/win/attack/sushi/sheath)
    const poses: KenjiCharacterProps["pose"][] = [
      "victorious",
      "slash",
      "cool",
      "sushi_slice",
      "run",
      "win",
      "sheathe",
      "attack",
      "sit",
      "cool",
      "victorious",
      "slash",
      "sheathe",
      "cool",
      "win",
      "attack",
    ];
    const exprs: KenjiCharacterProps["expression"][] = [
      "excited",
      "angry",
      "happy",
      "excited",
      "shocked",
      "happy",
      "normal",
      "excited",
      "happy",
      "excited",
      "happy",
      "angry",
      "normal",
      "excited",
      "happy",
      "angry",
    ];
    const pose = poses[beatIdx % poses.length] ?? "victorious";
    const expression = exprs[beatIdx % exprs.length] ?? "excited";

    // Real Brawl Stars Kenji emotes popping in on each beat (authentic game assets)
    const emoteFiles = [
      "brawl/portraits/kenji_dialogue.png",
      "brawl/expressions/kenji/happy.png",
      "brawl/expressions/kenji/excited.png",
      "brawl/expressions/kenji/angry.png",
      "brawl/expressions/kenji/shocked.png",
      "brawl/expressions/kenji/sad.png",
      "brawl/portraits/kenji_dialogue.png",
      "brawl/expressions/kenji/happy.png",
    ];
    const emoteFile = emoteFiles[beatIdx % emoteFiles.length] ?? emoteFiles[0];
    const emoteIn = interpolate(inBeat, [0, 5], [0.4, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.6)),
    });
    const emoteOut = interpolate(inBeat, [beatLen - 5, beatLen], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const emoteOpacity = Math.min(1, emoteIn) * emoteOut;
    const emoteRot = (beatIdx % 2 === 0 ? 1 : -1) * 8;
    const emoteSide = beatIdx % 2 === 0 ? 1 : -1;

    // Transition curve at each beat boundary (quick snap, then settle)
    const beatT = (inBeat % beatLen) / beatLen; // normalize
    const snapIn = 1 + 0.42 * Math.max(0, 1 - beatT * 3.5);
    const snapRot = (beatIdx % 2 === 0 ? 1 : -1) * 12 * Math.max(0, 1 - beatT * 3);
    const flash = interpolate(inBeat, [0, 1, 4], [0.95, 0.45, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const attackPulse = Math.max(0, 1 - inBeat / beatLen);
    const superPhase = pose === "sushi_slice" ? Math.sin(Math.PI * Math.min(1, inBeat / 10)) : 0;

    // Per-beat camera punch + character motion
    const punch = attackPulse * 0.22;
    const bob = Math.sin(frame * 0.18) * 12;
    const strafe = Math.sin(frame * 0.11) * 16;
    const tilt = Math.sin(frame * 0.08) * 5;

    const kenjiProps: KenjiCharacterProps = {
      superHosomaki: superPhase,
      attackProgress: pose === "slash" ? Math.min(1, inBeat / 12) : 0,
      pose,
      expression,
      height: 760,
    };

    return (
      <AbsoluteFill style={{ zIndex: 60, pointerEvents: "none" }}>
        <AbsoluteFill style={{ backgroundColor: bg }}>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 42%, ${accent}66 0%, rgba(0,0,0,0) 65%)`,
            }}
          />
          <DoubleBorderFrame inset={36} />
        </AbsoluteFill>

        {/* Spinning Sunburst Rays behind Kenji */}
        <AbsoluteFill style={{ opacity: 0.35, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "45%",
              width: 1400,
              height: 1400,
              transform: `translate(-50%,-50%) rotate(${frame * 1.5}deg)`,
              background: `conic-gradient(from 0deg, ${accent}AA 0deg 15deg, transparent 15deg 30deg, ${accent}AA 30deg 45deg, transparent 45deg 60deg, ${accent}AA 60deg 75deg, transparent 75deg 90deg, ${accent}AA 90deg 105deg, transparent 105deg 120deg, ${accent}AA 120deg 135deg, transparent 135deg 150deg, ${accent}AA 150deg 165deg, transparent 165deg 180deg, ${accent}AA 180deg 195deg, transparent 195deg 210deg, ${accent}AA 210deg 225deg, transparent 225deg 240deg, ${accent}AA 240deg 255deg, transparent 255deg 270deg, ${accent}AA 270deg 285deg, transparent 285deg 300deg, ${accent}AA 300deg 315deg, transparent 315deg 330deg, ${accent}AA 330deg 345deg, transparent 345deg 360deg)`,
              maskImage: "radial-gradient(circle, rgba(0,0,0,1) 15%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 15%, transparent 70%)",
            }}
          />
        </AbsoluteFill>

        {/* Per-beat white flash transition (the "cut" between poses) */}
        {flash > 0 && (
          <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: flash }} />
        )}

        {/* Per-beat radial burst */}
        <AbsoluteFill style={{ opacity: 0.25 * attackPulse }}>
          <div
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              width: 860,
              height: 860,
              transform: `translate(-50%,-50%) scale(${1 + attackPulse * 0.5})`,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}66 0%, transparent 65%)`,
              boxShadow: `0 0 ${60 + attackPulse * 80}px ${accent}`,
            }}
          />
        </AbsoluteFill>

        {/* Slash FX per beat */}
        {attackPulse > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              opacity: attackPulse * 0.4,
              transform: `translate(-50%,-50%) rotate(${(beatIdx % 4) * 90}deg)`,
              zIndex: 4,
            }}
          >
            <div
              style={{
                width: 480,
                height: 100,
                borderRadius: 50,
                background: `linear-gradient(90deg, transparent, ${accent}, #FFFFFF, ${accent}, transparent)`,
                filter: `blur(2px) drop-shadow(0 0 16px ${accent})`,
                transform: `scaleX(${0.6 + attackPulse * 0.7})`,
              }}
            />
          </div>
        )}

        {/* Speed lines radiating on beats */}
        {attackPulse > 0 &&
          Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 4,
                  height: 70 + attackPulse * 100,
                  background: `linear-gradient(180deg, ${accent}00, ${accent}${Math.round(100 * attackPulse)}`,
                  transform: `translate(-50%,-50%) rotate(${ang}rad) translateY(${-(360 + attackPulse * 40)}px)`,
                  transformOrigin: "50% 50%",
                  opacity: attackPulse * 0.3,
                }}
              />
            );
          })}

        {/* Winner character model — animated per beat with snap transition */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%,-50%) translateX(${strafe}px) translateY(${bob + (pose === "sit" ? 70 : 0)}px) scale(${(1 + punch) * snapIn}) rotate(${tilt + snapRot}deg)`,
            zIndex: 5,
          }}
        >
          {entry?.id === "kenji" ? (
            <KenjiCharacter frame={frame} {...kenjiProps} />
          ) : (
            <Portrait entry={entry} size={440} accent={accent} rotation={0} rel={rel} />
          )}
        </div>

        {/* Real Brawl Stars Kenji emote popping in per beat */}
        {emoteOpacity > 0.02 && (
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: `${emoteSide === 1 ? 68 : 32}%`,
              width: 210,
              height: 210,
              opacity: emoteOpacity,
              transform: `translate(-50%,-50%) scale(${emoteIn}) rotate(${emoteRot}deg)`,
              zIndex: 8,
              pointerEvents: "none",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))",
            }}
          >
            <Img
              src={staticFile(emoteFile)}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        {/* Falling confetti through the showcase */}
        <Confetti rel={rel} />
        <TitleText title={phase.title ?? "KENJI"} fontSize={140} color="#FFD60A" topPct={78} rel={rel} />
      </AbsoluteFill>
    );
  }

  // outro
  const fadeOut = interpolate(frame, [phase.endFrame - 30, phase.endFrame - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Reference: on the outro beat the winner slides right, then settles
  const strafeRight = interpolate(rel, [0, 8, 22], [0, 150, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Entrance pop like the reference's white flash into the outro
  const outroPop = popIn(Math.max(0, rel - 4), 30, 0, { damping: 11, stiffness: 200 });
  const outroRotate = interpolate(rel, [0, 10, 22], [10, -4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ zIndex: 60, opacity: fadeOut, pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: phase.backgroundColor, overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 35%, ${accent}22 0%, rgba(0,0,0,0) 55%)`,
          }}
        />
        {/* Dynamic zooming/panning grid background */}
        <div
          style={{
            position: "absolute",
            inset: -400,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
            transform: `scale(${1 + (rel % 60) * 0.01}) rotate(${rel * 0.1}deg)`,
            opacity: 0.5,
          }}
        />
        <DoubleBorderFrame inset={36} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: interpolate(rel, [0, 2, 7], [0, 0.3, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateX(${strafeRight}px)`,
        }}
      >
        {entry?.id === "kenji" ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%,-52%) scale(${outroPop * (1 + (Math.sin(rel * 0.1) * 0.05))}) rotate(${outroRotate}deg)`,
            }}
          >
            {/* Speed lines just behind Kenji in the outro */}
            {Array.from({ length: 16 }).map((_, i) => {
              const ang = (i / 16) * Math.PI * 2 + rel * 0.05;
              return (
                <div
                  key={`outro-lines-${i}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 6,
                    height: 800,
                    background: `linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.4))`,
                    transform: `translate(-50%,-50%) rotate(${ang}rad) translateY(-400px)`,
                    transformOrigin: "50% 50%",
                    zIndex: -1,
                  }}
                />
              );
            })}
            {/* Real Brawl Stars Kenji emote above the character */}
            <div
              style={{
                position: "absolute",
                bottom: "92%",
                left: "50%",
                width: 190,
                height: 190,
                transform: `translateX(-50%) scale(${outroPop})`,
                zIndex: 5,
                filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.65))",
              }}
            >
              <Img
                src={staticFile("brawl/portraits/kenji_dialogue.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <KenjiCharacter
              frame={frame}
              pose="win"
              expression="happy"
              height={640}
            />
          </div>
        ) : (
          <Portrait entry={entry} size={320} accent={accent} rotation={0} rel={rel} />
        )}
      </div>
      {phase.title && (
        <TitleText title={phase.title} fontSize={120} color={accent} topPct={62} rel={rel} />
      )}
      {phase.subtitle && (
        <div
          style={{
            position: "absolute",
            top: "76%",
            left: 0,
            right: 0,
            textAlign: "center",
            transform: `scale(${popIn(Math.max(0, rel - 12), 30)})`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 62,
              color: "#FFFFFF",
              WebkitTextStroke: "5px #000000",
              paintOrder: "stroke fill",
              textShadow: "0 6px 0 #000000, 0 0 30px rgba(255,255,255,0.6)",
            }}
          >
            {phase.subtitle}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
