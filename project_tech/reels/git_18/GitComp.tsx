import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { NemiMascot, NemiPose } from "../../src/components/NemiMascot";
import timelineData from "./timeline.json";

export const nemiTheme = {
  colors: {
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandGreen: "#10B981",
    brandRed: "#EF4444",
    brandAmber: "#F59E0B",
    brandPurple: "#A855F7",
    brandBlue: "#3B82F6",
    textHeadingDark: "#0F172A",
    textHeadingLight: "#F8FAFC",
    textMutedLight: "#64748B",
    textMutedDark: "#94A3B8",
    cardDark: "#0B1120",
    borderDark: "rgba(255, 255, 255, 0.12)",
    borderLight: "#E2E8F0",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
  },
};

export const GitComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 885;

  // ─── Stage Boundaries ───
  const cutB = 151; // Nemi diff myth -> dark mode
  const cutC = 239; // Truth: Content-Addressable Database
  const cutD = 369; // SHA-1 Hashing & Blob Compression
  const cutE = 552; // Commit Tree & 999 Free Reused Pointers
  const cutF = 810; // Light mode crossfade -> DAG Branch Merge Victory
  const cutG = 813; // Loop seam

  // ─── Smooth Background Crossfade Transition (Light <-> Dark) ───
  const darkOpacity = interpolate(
    frame,
    [cutB - 14, cutB + 10, cutF - 14, cutF + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const isDarkWorld = darkOpacity > 0.5;

  // Smoothly interpolated theme tokens
  const titleColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);
  const hudBg = interpolateColors(darkOpacity, [0, 1], ["#FFFFFF", "#0F172A"]);
  const hudBorder = interpolateColors(darkOpacity, [0, 1], ["#E2E8F0", "rgba(255, 255, 255, 0.14)"]);
  const hudTextColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);

  // ─── Camera Breathing ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.025], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "puzzled";
    nemiSpeech = "Doesn't Git just save a list of text diffs line-by-line? 🤔";
  } else if (frame < cutD) {
    nemiPose = "explaining";
  } else if (frame < cutE) {
    nemiPose = "aha";
  } else if (frame < 691) {
    nemiPose = "explaining";
  } else if (frame < 813) {
    nemiPose = "smug";
    nemiSpeech = "So Git never duplicates unchanged files — it's just a tree of hashes! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  // Stamp impact flash
  const mythImpact =
    frame >= 185 && frame < 192
      ? interpolate(frame, [185, 188, 192], [0, 0.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: nemiTheme.colors.canvasLight,
        fontFamily: nemiTheme.typography.fontFamily.sans,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* SMOOTH CROSSFADE DARK WORLD LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          backgroundColor: nemiTheme.colors.canvasDark,
          opacity: darkOpacity,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/git_18/voiceover.mp3")} volume={1.0} />

      {/* Synchronized SFX Layer */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutB} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={185} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={cutC} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutD} durationInFrames={25}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={cutE} durationInFrames={25}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={cutG} durationInFrames={40}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.8} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* AMBIENT BACKGROUND GLOW */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: darkOpacity }}>
        <div
          style={{
            position: "absolute",
            top: 250,
            left: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: frame < cutC
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 600,
            right: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top: 85px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 85,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: isDarkWorld
                ? (frame >= cutC ? nemiTheme.colors.brandCyan : nemiTheme.colors.brandRed)
                : nemiTheme.colors.brandPurple,
              boxShadow: `0 0 20px ${isDarkWorld ? (frame >= cutC ? "#06B6D4" : "#EF4444") : "#A855F7"}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? (frame >= cutC ? "#06B6D4" : "#EF4444") : "#7C3AED",
            }}
          >
            Ep.18 · How Git Works
          </span>
        </div>

        <div
          style={{
            backgroundColor: hudBg,
            padding: "10px 22px",
            borderRadius: 24,
            border: `2px solid ${hudBorder}`,
            fontSize: 20,
            fontWeight: 900,
            color: hudTextColor,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < cutB
            ? "10MB STORAGE MYSTERY"
            : frame < cutC
            ? "THE DIFF MYTH"
            : frame < cutD
            ? "OBJECT DATABASE"
            : frame < cutE
            ? "SHA-1 HASH BLOBS"
            : frame < cutG
            ? "TREE POINTER REUSE"
            : "DAG COMMIT VICTORY"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MAIN HEADLINE TITLE (Safe Zone: top: 165px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 165,
          left: 70,
          right: 70,
          textAlign: "center",
          zIndex: 55,
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: -1.5,
            lineHeight: 1.15,
            color: titleColor,
          }}
        >
          {frame < cutB ? (
            <>
              1,000 Files In <span style={{ color: nemiTheme.colors.brandPurple }}>Just 10MB?</span> 📦⚡
            </>
          ) : frame < cutC ? (
            <>
              Does Git Just <span style={{ color: nemiTheme.colors.brandRed }}>Save Text Diffs?</span> 🤔
            </>
          ) : frame < cutD ? (
            <>
              Git Is A <span style={{ color: nemiTheme.colors.brandCyan }}>Content-Addressable DB!</span> 🗄️
            </>
          ) : frame < cutE ? (
            <>
              Files Are <span style={{ color: nemiTheme.colors.brandPurple }}>SHA-1 Hash Blobs!</span> 💎
            </>
          ) : frame < cutG ? (
            <>
              999 Files Reused <span style={{ color: nemiTheme.colors.brandGreen }}>With 0 Copied Bytes!</span> 🚀
            </>
          ) : (
            <>
              A Tree of Hashes <span style={{ color: nemiTheme.colors.brandGreen }}>Merged in 0ms!</span> 👑
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC OPEN-CANVAS SPATIAL VISUAL STAGES */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* STAGE 1: THE MASSIVE PROJECT STORAGE PARADOX (0 to 151) */}
      {frame < cutB + 6 && (
        <div style={{ opacity: interpolate(frame, [cutB - 6, cutB + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <OpenVisual1_ProjectParadox frame={frame} />
        </div>
      )}

      {/* STAGE 2: THE DIFF MYTH DEBUNKED (151 to 239) */}
      {frame >= cutB - 6 && frame < cutC + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutB - 6, cutB + 6, cutC - 6, cutC + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <OpenVisual2_DiffMyth frame={frame} />
        </div>
      )}

      {/* STAGE 3: THE 3 HOLY GIT OBJECTS (239 to 369) */}
      {frame >= cutC - 6 && frame < cutD + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutC - 6, cutC + 6, cutD - 6, cutD + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <OpenVisual3_GitHolyTrinity frame={frame} />
        </div>
      )}

      {/* STAGE 4: SHA-1 HASHING & IMMUTABLE BLOBS (369 to 552) */}
      {frame >= cutD - 6 && frame < cutE + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutD - 6, cutD + 6, cutE - 6, cutE + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <OpenVisual4_Sha1HashingLaser frame={frame} />
        </div>
      )}

      {/* STAGE 5: THE FREE POINTER REUSE TREE (552 to 813) */}
      {frame >= cutE - 6 && frame < cutG + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutE - 6, cutE + 6, cutG - 6, cutG + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <OpenVisual5_PointerReuseTree frame={frame} />
        </div>
      )}

      {/* STAGE 6: DAG COMMIT MERGE VICTORY (813 to 885) */}
      {frame >= cutG - 6 && (
        <div style={{ opacity: interpolate(frame, [cutG - 6, cutG + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <OpenVisual6_DAGVictoryLoop frame={frame} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO MASCOT DOCK (Safe Zone: bottom: 70px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 60,
        }}
      >
        <NemiMascot pose={nemiPose} scale={1.65} />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* NEMI SPEECH BUBBLE (Strictly at bottom: 440px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            bottom: 440,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              backgroundColor: nemiTheme.colors.brandYellow,
              color: "#18181B",
              fontWeight: 900,
              fontSize: 28,
              lineHeight: 1.3,
              padding: "16px 32px",
              borderRadius: 26,
              border: "3.5px solid #18181B",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.45)",
              textAlign: "center",
            }}
          >
            {nemiSpeech}
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "14px solid #18181B",
              marginTop: -2,
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CHANNEL WATERMARK */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          fontSize: 16,
          fontWeight: 800,
          color: isDarkWorld ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.35)",
          letterSpacing: "0.5px",
          zIndex: 40,
        }}
      >
        @nemi.explains
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TACTILE MYTH IMPACT FLASH */}
      {/* ══════════════════════════════════════════════════════════ */}
      {mythImpact > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#EF4444",
            opacity: mythImpact,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. STAGE 1: THE MASSIVE PROJECT STORAGE PARADOX (0 to 151)
// ═══════════════════════════════════════════════════════════════
const OpenVisual1_ProjectParadox: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.2);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Challenge Header Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFFFF",
          border: "2px solid #7C3AED",
          borderRadius: 999,
          padding: "10px 28px",
          boxShadow: "0 8px 25px rgba(124, 58, 237, 0.18)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>📁</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#6D28D9", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PROJECT STORAGE PARADOX
        </span>
      </div>

      {/* Dual Comparative Vaults (top: 380px) */}
      <div style={{ position: "absolute", top: 380, left: 70, right: 70, display: "flex", gap: 28 }}>
        {/* Left: Your Working Project */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            border: "3px solid #E2E8F0",
            padding: "24px 28px",
            boxShadow: "0 16px 45px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 44 }}>📂</span>
            <span style={{ backgroundColor: "#F1F5F9", color: "#334155", fontSize: 16, fontWeight: 900, padding: "6px 14px", borderRadius: 12 }}>
              WORKING TREE
            </span>
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#0F172A", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            1,000 Files
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#64748B" }}>
            + 500 Commit Histories
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8" }}>
            (Total Raw Data: ~500 MB)
          </div>
        </div>

        {/* Right: .git Folder Vault */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#FEF3C7",
            borderRadius: 28,
            border: "3.5px solid #F59E0B",
            padding: "24px 28px",
            boxShadow: "0 16px 45px rgba(245, 158, 11, 0.25)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            transform: `scale(${1 + pulse * 0.02})`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 44 }}>📦</span>
            <span style={{ backgroundColor: "#F59E0B", color: "#000", fontSize: 16, fontWeight: 900, padding: "6px 14px", borderRadius: 12 }}>
              .git/ DIRECTORY
            </span>
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#B45309", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            ~10 MB! ⚡
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#92400E" }}>
            50x Space Compression
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#B45309" }}>
            How is it so ridiculously small?
          </div>
        </div>
      </div>

      {/* Flowing Question Beam (top: 680px) */}
      <div style={{ position: "absolute", top: 680, left: 70, right: 70, height: 180 }}>
        <svg width="940" height="180" viewBox="0 0 940 180">
          <path
            d="M 270 90 Q 470 20 670 90"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="4"
            strokeDasharray="8 6"
            strokeDashoffset={-frame * 8}
          />
          <circle cx="470" cy="55" r="32" fill="#7C3AED" />
          <text x="470" y="65" fill="#FFF" fontSize="28" fontWeight="900" textAnchor="middle">❓</text>
        </svg>
      </div>

      {/* Floating Bottom Ledger (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#FFFFFF",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2px solid #E2E8F0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#64748B", fontSize: 20, fontWeight: 800 }}>The Core Question:</span>
        <span style={{ color: "#7C3AED", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          HOW DOES GIT STORE 500 VERSIONS IN 10MB? 🧠
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: THE DIFF MYTH DEBUNKED (151 to 239)
// ═══════════════════════════════════════════════════════════════
const OpenVisual2_DiffMyth: React.FC<{ frame: number }> = ({ frame }) => {
  const stampScale = interpolate(frame, [185, 192], [2.2, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampOpacity = frame >= 185 ? 1 : 0;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Code Diff Display Card */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 70,
          right: 70,
          backgroundColor: "#0B1120",
          borderRadius: 26,
          border: "2.5px solid #334155",
          padding: "26px 36px",
          fontFamily: nemiTheme.typography.fontFamily.mono,
          fontSize: 22,
          lineHeight: 1.8,
          color: "#94A3B8",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ color: "#64748B", marginBottom: 8 }}># Common Misconception: Delta Patch Storage</div>
        <div>@@ -12,4 +12,4 @@ <span style={{ color: "#06B6D4" }}>class AuthEngine:</span></div>
        <div style={{ color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.15)", padding: "2px 8px", borderRadius: 6 }}>
          - def verify_user(token: str): return False
        </div>
        <div style={{ color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: 6 }}>
          + def verify_user(token: str): return True
        </div>
        <div>  def logout(): pass</div>
      </div>

      {/* Massive Holographic "DEBUNKED / MYTH" Stamp */}
      {stampOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: 480,
            left: "50%",
            transform: `translateX(-50%) rotate(-8deg) scale(${stampScale})`,
            backgroundColor: "rgba(239, 68, 68, 0.95)",
            color: "#FFFFFF",
            padding: "16px 42px",
            borderRadius: 20,
            border: "4px solid #FFFFFF",
            boxShadow: "0 20px 60px rgba(239, 68, 68, 0.65)",
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: "2px",
            textAlign: "center",
            whiteSpace: "nowrap",
            zIndex: 40,
          }}
        >
          ❌ MYTH: GIT DOES NOT STORE DIFFS!
        </div>
      )}

      {/* Floating Bottom Rule (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#0F172A",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2px solid #EF4444",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>VCS Architecture Truth:</span>
        <span style={{ color: "#FCA5A5", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SVN STORED DIFFS · GIT STORES SNAPSHOTS! 💥
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: THE 3 HOLY GIT OBJECTS (239 to 369)
// ═══════════════════════════════════════════════════════════════
const OpenVisual3_GitHolyTrinity: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.25);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* 3 Pillars of Git Database (top: 330px) */}
      <div style={{ position: "absolute", top: 330, left: 70, right: 70, display: "flex", gap: 20 }}>
        {/* 1. Commit Object */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(245, 158, 11, 0.14)",
            border: "3px solid #F59E0B",
            borderRadius: 24,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 14px 40px rgba(245, 158, 11, 0.25)",
          }}
        >
          <span style={{ fontSize: 36 }}>🟠</span>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#FFD166" }}>COMMIT</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#94A3B8", textAlign: "center" }}>
            Author + Msg + Parent Hash + Root Tree
          </div>
        </div>

        {/* 2. Tree Object */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(16, 185, 129, 0.14)",
            border: "3px solid #10B981",
            borderRadius: 24,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 14px 40px rgba(16, 185, 129, 0.25)",
          }}
        >
          <span style={{ fontSize: 36 }}>🟢</span>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#6EE7B7" }}>TREE</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#94A3B8", textAlign: "center" }}>
            Directory Map of Filenames & SHA-1s
          </div>
        </div>

        {/* 3. Blob Object */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(168, 85, 247, 0.14)",
            border: "3px solid #A855F7",
            borderRadius: 24,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 14px 40px rgba(168, 85, 247, 0.25)",
          }}
        >
          <span style={{ fontSize: 36 }}>🟣</span>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#D8B4FE" }}>BLOB</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#94A3B8", textAlign: "center" }}>
            Zlib-Compressed Raw File Content
          </div>
        </div>
      </div>

      {/* SVG Content-Addressable Storage Vault (top: 570px) */}
      <div style={{ position: "absolute", top: 570, left: 70, right: 70, height: 280 }}>
        <svg width="940" height="280" viewBox="0 0 940 280">
          <rect x="40" y="20" width="860" height="230" rx="26" fill="#0B1120" stroke="#06B6D4" strokeWidth="3" />
          
          <text x="470" y="70" fill="#67E8F9" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            CONTENT-ADDRESSABLE STORAGE ENGINE:
          </text>
          
          {/* Key-Value Mapping */}
          <rect x="80" y="100" width="360" height="60" rx="14" fill="#1E293B" stroke="#A855F7" strokeWidth="2" />
          <text x="260" y="138" fill="#D8B4FE" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            KEY: SHA-1 Hash (40 Hex)
          </text>

          <text x="470" y="140" fill="#FFD166" fontSize="30" fontWeight="900" textAnchor="middle">👉</text>

          <rect x="500" y="100" width="360" height="60" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
          <text x="680" y="138" fill="#6EE7B7" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            VALUE: Immutable Blob
          </text>

          <text x="470" y="210" fill="#94A3B8" fontSize="18" fontWeight="700" textAnchor="middle">
            (The file content itself determines its exact storage address!)
          </text>
        </svg>
      </div>

      {/* Floating Bottom Ledger (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2.5px solid #06B6D4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(6, 182, 212, 0.25)",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Database Definition:</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          GIT IS A SIMPLE KEY-VALUE STORE! 🗄️⚡
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: SHA-1 HASHING & IMMUTABLE BLOBS (369 to 552)
// ═══════════════════════════════════════════════════════════════
const OpenVisual4_Sha1HashingLaser: React.FC<{ frame: number }> = ({ frame }) => {
  const isMutated = frame >= 480;
  const pulse = Math.sin(frame * 0.4);
  const scanLaserX = 140 + 660 * (0.5 + 0.5 * Math.sin(frame * 0.15));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Telemetry Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: isMutated ? "rgba(239, 68, 68, 0.22)" : "rgba(168, 85, 247, 0.22)",
            border: `2px solid ${isMutated ? "#EF4444" : "#A855F7"}`,
            borderRadius: 999,
            padding: "10px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>{isMutated ? "⚡" : "💎"}</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: isMutated ? "#FCA5A5" : "#D8B4FE", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            {isMutated ? "1 WORD CHANGED → BRAND NEW SHA-1 HASH!" : "SHA-1 HASHING: CONTENT DEFINES THE BLOB"}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #06B6D4",
            borderRadius: 999,
            padding: "10px 24px",
            fontSize: 18,
            fontWeight: 900,
            color: "#06B6D4",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          IMMUTABLE BLOB
        </div>
      </div>

      {/* Interactive Hash Generation Canvas (top: 380px) */}
      <div style={{ position: "absolute", top: 380, left: 70, right: 70, height: 470 }}>
        <svg width="940" height="470" viewBox="0 0 940 470">
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* Source Code File Box */}
          <rect x="70" y="30" width="360" height="200" rx="20" fill="#0B1120" stroke="#475569" strokeWidth="2.5" />
          <text x="100" y="70" fill="#94A3B8" fontSize="18" fontWeight="800" fontFamily="monospace">📄 app.py</text>
          
          <text x="100" y="115" fill="#F8FAFC" fontSize="20" fontWeight="700" fontFamily="monospace">
            def calculate():
          </text>
          <text x="100" y="155" fill={isMutated ? "#EF4444" : "#10B981"} fontSize="22" fontWeight="900" fontFamily="monospace">
            {isMutated ? "  return 999 ⚠️" : "  return 100 ✓"}
          </text>

          {/* Central Hashing Processor */}
          <g transform="translate(470, 130)">
            <circle r="46" fill="#1E293B" stroke={isMutated ? "#EF4444" : "#06B6D4"} strokeWidth="3.5" />
            <text x="0" y="8" fill="#FFD166" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">SHA-1</text>
          </g>

          {/* Output Blob */}
          <rect
            x="510"
            y="30"
            width="360"
            height="200"
            rx="20"
            fill={isMutated ? "rgba(239, 68, 68, 0.15)" : "rgba(168, 85, 247, 0.15)"}
            stroke={isMutated ? "#EF4444" : "#A855F7"}
            strokeWidth="3"
          />
          <text x="540" y="70" fill={isMutated ? "#FCA5A5" : "#D8B4FE"} fontSize="18" fontWeight="800" fontFamily="monospace">
            🟣 BLOB OBJECT
          </text>
          <text x="540" y="125" fill="#FFF" fontSize="24" fontWeight="900" fontFamily="monospace">
            {isMutated ? "e69de29bb2..." : "7a3f9e81b4..."}
          </text>
          <text x="540" y="170" fill="#94A3B8" fontSize="16" fontWeight="700">
            {isMutated ? "New hash created instantly!" : "Stored in .git/objects/7a/..."}
          </text>

          {/* Animated Laser Scanning Beam */}
          <line x1={scanLaserX} y1="30" x2={scanLaserX} y2="230" stroke="url(#laserGrad)" strokeWidth="3" opacity="0.8" />
        </svg>
      </div>

      {/* Floating Bottom Ledger (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2px solid #A855F7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(168, 85, 247, 0.25)",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Immutability Principle:</span>
        <span style={{ color: "#D8B4FE", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SAME CONTENT = IDENTICAL HASH FOREVER! 🔒
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: THE FREE POINTER REUSE TREE (552 to 813)
// ═══════════════════════════════════════════════════════════════
const OpenVisual5_PointerReuseTree: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.3);
  const isSmug = frame >= 691;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Telemetry Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.22)",
            border: "2px solid #10B981",
            borderRadius: 999,
            padding: "10px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>🌳</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#6EE7B7", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            COMMIT 2 REUSES 999 EXISTING POINTERS!
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #10B981",
            borderRadius: 999,
            padding: "10px 24px",
            fontSize: 18,
            fontWeight: 900,
            color: "#10B981",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          0 DUPLICATE BYTES
        </div>
      </div>

      {/* Multi-Commit Pointer Tree Diagram (top: 380px) */}
      <div style={{ position: "absolute", top: 380, left: 70, right: 70, height: 480 }}>
        <svg width="940" height="480" viewBox="0 0 940 480">
          {/* Commit 1 (Old) */}
          <g transform="translate(240, 60)">
            <rect x="-100" y="-30" width="200" height="60" rx="16" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="0" y="8" fill="#FFD166" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              Commit 1 (Initial)
            </text>
          </g>

          {/* Commit 2 (New) */}
          <g transform="translate(700, 60)">
            <rect x="-100" y="-30" width="200" height="60" rx="16" fill="#1E293B" stroke="#10B981" strokeWidth="3" />
            <text x="0" y="8" fill="#6EE7B7" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              Commit 2 (Updated)
            </text>
          </g>

          {/* Tree Pointers */}
          {/* Line to modified File 1 (New Blob) */}
          <line x1="700" y1="90" x2="800" y2="220" stroke="#10B981" strokeWidth="3.5" />
          <text x="790" y="150" fill="#10B981" fontSize="14" fontWeight="900">New Blob! ⚡</text>

          {/* Shared Lines to 999 Unchanged Blobs */}
          <line x1="240" y1="90" x2="160" y2="220" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="240" y1="90" x2="320" y2="220" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="240" y1="90" x2="480" y2="220" stroke="#F59E0B" strokeWidth="2.5" />

          {/* Green Reused Pointer Hooking into Shared Blobs */}
          <path d="M 700 90 Q 560 140 480 220" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="6 4" />
          <path d="M 700 90 Q 440 140 320 220" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="6 4" />

          {/* Blob Nodes */}
          {/* Old Blob 1 */}
          <g transform="translate(160, 240)">
            <circle r="36" fill="#1E293B" stroke="#A855F7" strokeWidth="2.5" />
            <text x="0" y="6" fill="#D8B4FE" fontSize="14" fontWeight="800" textAnchor="middle" fontFamily="monospace">Blob 1</text>
          </g>

          {/* Reused Blob 2 */}
          <g transform="translate(320, 240)">
            <circle r="36" fill="#1E293B" stroke="#06B6D4" strokeWidth="2.5" />
            <text x="0" y="6" fill="#67E8F9" fontSize="14" fontWeight="800" textAnchor="middle" fontFamily="monospace">Blob 2</text>
            <text x="0" y="55" fill="#10B981" fontSize="14" fontWeight="900" textAnchor="middle">REUSED ✓</text>
          </g>

          {/* Reused 999 other Blobs */}
          <g transform="translate(480, 240)">
            <rect x="-60" y="-36" width="120" height="72" rx="16" fill="#1E293B" stroke="#06B6D4" strokeWidth="2.5" />
            <text x="0" y="6" fill="#67E8F9" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">...999 Blobs</text>
            <text x="0" y="55" fill="#10B981" fontSize="14" fontWeight="900" textAnchor="middle">REUSED ✓</text>
          </g>

          {/* New Blob 1' */}
          <g transform="translate(800, 240)">
            <circle r="38" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="3.5" />
            <text x="0" y="6" fill="#6EE7B7" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="monospace">Blob 1'</text>
            <text x="0" y="58" fill="#10B981" fontSize="14" fontWeight="900" textAnchor="middle">+1 New File</text>
          </g>
        </svg>
      </div>

      {/* Floating Bottom Ledger (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2px solid #10B981",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(16, 185, 129, 0.25)",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Efficiency Miracle:</span>
        <span style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ZERO DATA COPIES · ONLY NEW HASHES ADDED! ⚡
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. STAGE 6: DAG COMMIT MERGE VICTORY (813 to 885)
// ═══════════════════════════════════════════════════════════════
const OpenVisual6_DAGVictoryLoop: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Victory Header Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFFFF",
          border: "2.5px solid #10B981",
          borderRadius: 999,
          padding: "10px 32px",
          boxShadow: "0 12px 35px rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 26 }}>🏆</span>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#059669", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Git DAG Architecture Victory
        </span>
      </div>

      {/* SVG Directed Acyclic Graph (DAG) (top: 380px) */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 70,
          right: 70,
          backgroundColor: "#0B1120",
          borderRadius: 28,
          border: "3px solid #06B6D4",
          padding: "26px 36px",
          boxShadow: "0 20px 60px rgba(6, 182, 212, 0.25)",
          height: 380,
        }}
      >
        <svg width="860" height="320" viewBox="0 0 860 320">
          {/* Main branch line */}
          <line x1="120" y1="180" x2="740" y2="180" stroke="#06B6D4" strokeWidth="4" />
          
          {/* Feature branch line */}
          <path d="M 320 180 Q 450 60 580 60 L 740 180" fill="none" stroke="#A855F7" strokeWidth="4" />

          {/* Commits */}
          {/* c1 */}
          <g transform="translate(120, 180)">
            <circle r="26" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="6" fill="#FFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">c1</text>
          </g>

          {/* c2 */}
          <g transform="translate(320, 180)">
            <circle r="26" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="6" fill="#FFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">c2</text>
          </g>

          {/* c3 feature */}
          <g transform="translate(580, 60)">
            <circle r="26" fill="#1E293B" stroke="#A855F7" strokeWidth="3" />
            <text x="0" y="6" fill="#FFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">c3*</text>
            <text x="0" y="-36" fill="#D8B4FE" fontSize="14" fontWeight="900" textAnchor="middle">feature</text>
          </g>

          {/* c4 merge */}
          <g transform="translate(740, 180)">
            <circle r="30" fill="#10B981" stroke="#FFF" strokeWidth="3.5" />
            <text x="0" y="7" fill="#000" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">MERGE</text>
            <text x="0" y="55" fill="#10B981" fontSize="16" fontWeight="900" textAnchor="middle">main (HEAD)</text>
          </g>
        </svg>
      </div>

      {/* Floating Complexity Scorecard (top: 840px) */}
      <div style={{ position: "absolute", top: 840, left: 70, right: 70, display: "flex", gap: 24 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #06B6D4",
            borderRadius: 24,
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(6, 182, 212, 0.15)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>BRANCH & MERGE TIME</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#0891B2" }}>0.01 ms ⚡</div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #10B981",
            borderRadius: 24,
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(16, 185, 129, 0.15)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>STORAGE OVERHEAD</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#059669" }}>~0.1% 🧠</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px)
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number }> = ({ frame }) => {
  const subtitles = timelineData.subtitles || [];

  const currentChunk = subtitles.find((chunk: any, idx: number) => {
    const nextChunk = subtitles[idx + 1];
    const untilFrame = nextChunk ? nextChunk.start_frame : chunk.end_frame + 6;
    return frame >= chunk.start_frame && frame < untilFrame;
  });

  if (!currentChunk) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 1140,
        left: 65,
        right: 65,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 80,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(10, 15, 30, 0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "2px solid rgba(6, 182, 212, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(6, 182, 212, 0.25)",
          padding: "14px 28px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          maxWidth: 920,
        }}
      >
        {currentChunk.words.map((w: any, idx: number) => {
          const isWordActive = frame >= w.start_frame && frame <= w.end_frame + 1;
          const activeColor = idx % 2 === 0 ? "#FFD166" : "#06B6D4";

          return (
            <span
              key={`${w.word}_${idx}`}
              style={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: isWordActive ? activeColor : "#F8FAFC",
                textShadow: isWordActive
                  ? `0 0 20px ${activeColor}, 0 2px 4px #000000`
                  : "0 2px 6px rgba(0,0,0,0.8)",
                display: "inline-block",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
