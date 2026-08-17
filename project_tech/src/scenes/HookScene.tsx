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
 * HOOK SCENE — Objects flood the screen rapidly, creating urgency.
 * Full-screen object cascade. No panel. Nemi looks overwhelmed.
 */

interface HookObj {
  id: number;
  label: string;
  x: number;
  y: number;
  enterDelay: number;
}

interface HookSceneProps {
  startFrame: number;
  endFrame: number;
  objects: HookObj[];
  nemiSpeech?: string;
}

export const HookScene: React.FC<HookSceneProps> = ({
  startFrame,
  endFrame,
  objects,
  nemiSpeech,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0) return null;

  const progress = (frame - startFrame) / (endFrame - startFrame);

  return (
    <>
      {/* Full-screen cream with heavier dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: NEMI_THEME.colors.bg.cream,
          backgroundImage: "radial-gradient(#C4C8CC 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          opacity: 0.5,
        }}
      />

      {/* Objects flooding in from all directions */}
      {objects.map((obj, i) => {
        const objLocal = local - obj.enterDelay;
        if (objLocal < 0) return null;

        const popIn = spring({
          frame: objLocal,
          fps,
          config: { damping: 8, stiffness: 300, mass: 0.4 },
        });

        // Slight wobble after landing
        const wobble = objLocal > 10 ? Math.sin(objLocal * 0.3) * 2 : 0;

        return (
          <div
            key={obj.id}
            style={{
              position: "absolute",
              left: obj.x - 62,
              top: obj.y - 32,
              width: 124,
              height: 64,
              borderRadius: 14,
              backgroundColor: "rgba(24, 24, 27, 0.88)",
              border: "1.5px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${popIn}) rotate(${wobble}deg)`,
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              zIndex: 5,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#E2E8F0",
                fontFamily: NEMI_THEME.typography.fontCode,
              }}
            >
              {obj.label}
            </span>
          </div>
        );
      })}

      {/* Nemi at bottom-right, looking overwhelmed */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 60,
          zIndex: 30,
          transform: `scale(${spring({ frame: Math.max(0, local - 15), fps, config: NEMI_THEME.springs.bouncy })})`,
          transformOrigin: "bottom right",
        }}
      >
        <NemiMascot pose="shocked" scale={1.3} />
      </div>

      {/* Speech bubble for Nemi if present */}
      {nemiSpeech && local > 20 && (
        <div
          style={{
            position: "absolute",
            bottom: 320,
            right: 50,
            zIndex: 31,
            padding: "12px 20px",
            borderRadius: "18px 18px 4px 18px",
            backgroundColor: "#FFF",
            border: `2px solid ${NEMI_THEME.colors.bg.borderMuted}`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            opacity: interpolate(local, [20, 28], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 800, color: NEMI_THEME.colors.text.headingDark }}>
            {nemiSpeech}
          </span>
        </div>
      )}
    </>
  );
};
