import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NemiMascot } from "../components/NemiMascot";
import { NEMI_THEME } from "../constants/nemiTheme";

/**
 * CHALLENGE SCENE — "Which of these can be deleted?"
 * Zoomed-in view of a few objects with ambiguous connections.
 * Nemi points at one. Viewer participation moment.
 */

interface ChallengeObj {
  id: number;
  label: string;
  x: number;
  y: number;
  alive: boolean;
  isSurprise?: boolean;
}

interface ChallengeConnection {
  fromId: number;
  toId: number;
  hidden?: boolean;
}

interface ChallengeSceneProps {
  startFrame: number;
  endFrame: number;
  objects: ChallengeObj[];
  connections: ChallengeConnection[];
  nemiPointsAt?: number; // id of object Nemi points at
  nemiSpeech?: string;
}

export const ChallengeScene: React.FC<ChallengeSceneProps> = ({
  startFrame,
  endFrame,
  objects,
  connections,
  nemiPointsAt,
  nemiSpeech,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0) return null;

  return (
    <>
      {/* Dark background for focus */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: NEMI_THEME.colors.bg.cardCharcoal }} />

      {/* Question text at top */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          right: 60,
          zIndex: 20,
          opacity: interpolate(local, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <h2
          style={{
            fontSize: 42,
            fontWeight: 900,
            textAlign: "center",
            color: NEMI_THEME.colors.brand.yellow,
            letterSpacing: -1,
            margin: 0,
          }}
        >
          WHICH CAN BE DELETED?
        </h2>
      </div>

      {/* Objects displayed large, centered */}
      <div style={{ position: "absolute", top: 350, left: 0, right: 0, bottom: 500, zIndex: 10 }}>
        {/* Visible connections */}
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {connections
            .filter((c) => !c.hidden)
            .map((conn, i) => {
              const from = objects.find((o) => o.id === conn.fromId);
              const to = objects.find((o) => o.id === conn.toId);
              if (!from || !to) return null;

              const lineProgress = interpolate(local, [5 + i * 5, 15 + i * 5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={from.x + (to.x - from.x) * lineProgress}
                  y2={from.y + (to.y - from.y) * lineProgress}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              );
            })}
        </svg>

        {/* Object cards */}
        {objects.map((obj) => {
          const objSpring = spring({
            frame: Math.max(0, local - 3),
            fps,
            config: NEMI_THEME.springs.pop,
          });

          const isPointed = nemiPointsAt === obj.id && local > 30;
          const pointedGlow = isPointed
            ? interpolate(local, [30, 40], [0, 1], { extrapolateRight: "clamp" })
            : 0;

          return (
            <div
              key={obj.id}
              style={{
                position: "absolute",
                left: obj.x - 80,
                top: obj.y - 44,
                width: 160,
                height: 88,
                borderRadius: 18,
                backgroundColor: isPointed
                  ? `rgba(244, 63, 94, ${0.15 * pointedGlow})`
                  : "rgba(255,255,255,0.06)",
                border: `2px solid ${isPointed ? NEMI_THEME.colors.brand.coral : "rgba(255,255,255,0.12)"}`,
                boxShadow: isPointed
                  ? `0 0 30px rgba(244, 63, 94, ${0.4 * pointedGlow})`
                  : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                transform: `scale(${objSpring})`,
                zIndex: 15,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: "#E2E8F0", fontFamily: NEMI_THEME.typography.fontCode }}>
                {obj.label}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: NEMI_THEME.typography.fontHeading }}>
                {obj.alive ? "?" : "?"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Nemi pointing at bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: 50,
          zIndex: 30,
          transform: `scale(${spring({ frame: Math.max(0, local - 10), fps, config: NEMI_THEME.springs.bouncy })})`,
          transformOrigin: "bottom right",
        }}
      >
        <NemiMascot pose={local > 30 ? "pointing" : "thinking"} scale={1.25} />
      </div>

      {/* Nemi speech bubble */}
      {nemiSpeech && local > 30 && (
        <div
          style={{
            position: "absolute",
            bottom: 350,
            right: 40,
            zIndex: 31,
            padding: "14px 22px",
            borderRadius: "20px 20px 4px 20px",
            backgroundColor: "#FFF",
            border: `2px solid ${NEMI_THEME.colors.bg.borderMuted}`,
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            opacity: interpolate(local, [30, 38], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, color: NEMI_THEME.colors.brand.coral }}>
            {nemiSpeech}
          </span>
        </div>
      )}
    </>
  );
};
