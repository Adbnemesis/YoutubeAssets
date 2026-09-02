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
  const totalFrames = timelineData.total_frames || 591;

  // ─── Stage Boundaries (Strict 19.7s / 591 frames) ───
  const cutB = 130; // Nemi Diff Question -> Dark Cyber Mode
  const cutC = 181; // SHA-1 Hashing Prism
  const cutD = 281; // 1 Mutation vs 999 Reused Pointer Cables
  const cutE = 427; // DAG Tree Bloom & Nemi Smug
  const cutF = 510; // 0.01ms Merge Beam & Crossfade to Light Mode

  // ─── Smooth Background Crossfade Transition (Light <-> Dark) ───
  const darkOpacity = interpolate(
    frame,
    [cutB - 10, cutB + 8, cutF - 10, cutF + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const isDarkWorld = darkOpacity > 0.5;

  // Dynamic Theme Colors
  const titleColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);
  const hudBg = interpolateColors(darkOpacity, [0, 1], ["#FFFFFF", "#0F172A"]);
  const hudBorder = interpolateColors(darkOpacity, [0, 1], ["#E2E8F0", "rgba(255, 255, 255, 0.14)"]);
  const hudTextColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);

  // Camera Zoom Ramp (High Energy)
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "puzzled";
    nemiSpeech = "Doesn't it just save text diffs? 🤔";
  } else if (frame < cutD) {
    nemiPose = "explaining";
  } else if (frame < cutE) {
    nemiPose = "aha";
  } else if (frame < cutF) {
    nemiPose = "smug";
    nemiSpeech = "Zero duplicate copies, just a tree of hashes! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  // Laser Slash Impact Flash
  const slashImpact =
    frame >= 155 && frame < 162
      ? interpolate(frame, [155, 158, 162], [0, 0.6, 0], {
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
      <Sequence from={cutB} durationInFrames={25}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={155} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={cutC} durationInFrames={25}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutD} durationInFrames={25}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutF} durationInFrames={35}>
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
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
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
              backgroundColor: isDarkWorld ? nemiTheme.colors.brandCyan : nemiTheme.colors.brandPurple,
              boxShadow: `0 0 20px ${isDarkWorld ? "#06B6D4" : "#A855F7"}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? "#06B6D4" : "#7C3AED",
            }}
          >
            How Git Works
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
            ? "DIFF MYTH"
            : frame < cutD
            ? "SHA-1 HASH PRISM"
            : frame < cutE
            ? "999 REUSED POINTERS"
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
              Every File = <span style={{ color: nemiTheme.colors.brandCyan }}>SHA-1 Hash Blob!</span> 💎
            </>
          ) : frame < cutE ? (
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

      {/* STAGE 1: DYNAMIC FILE VORTEX COMPRESSION (0 to 130) */}
      {frame < cutB + 6 && (
        <div style={{ opacity: interpolate(frame, [cutB - 6, cutB + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Visual1_FileVortex frame={frame} />
        </div>
      )}

      {/* STAGE 2: DIFF MYTH LASER SLASH (130 to 181) */}
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
          <Visual2_DiffLaserSlash frame={frame} />
        </div>
      )}

      {/* STAGE 3: SHA-1 HASHING PRISM & BLOB CRYSTAL (181 to 281) */}
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
          <Visual3_HashingPrism frame={frame} />
        </div>
      )}

      {/* STAGE 4: 1 MUTATION vs 999 REUSED CABLES (281 to 427) */}
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
          <Visual4_PointerWeb frame={frame} />
        </div>
      )}

      {/* STAGE 5: 0.01ms MERGE BEAM & VICTORY (427 to 591) */}
      {frame >= cutE - 6 && (
        <div style={{ opacity: interpolate(frame, [cutE - 6, cutE + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Visual5_DAGVictory frame={frame} />
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
      {/* LASER IMPACT FLASH */}
      {/* ══════════════════════════════════════════════════════════ */}
      {slashImpact > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#EF4444",
            opacity: slashImpact,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. STAGE 1: DYNAMIC FILE VORTEX COMPRESSION (0 to 130)
// ═══════════════════════════════════════════════════════════════
const Visual1_FileVortex: React.FC<{ frame: number }> = ({ frame }) => {
  const rotation = frame * 2.5;
  const pulse = Math.sin(frame * 0.25);
  const sizeProgress = interpolate(frame, [0, 90], [500, 10], { extrapolateRight: "clamp" });

  const files = [
    { name: "auth.py", angle: 0, color: "#3B82F6", icon: "🐍" },
    { name: "db.ts", angle: 60, color: "#06B6D4", icon: "⚡" },
    { name: "api.go", angle: 120, color: "#10B981", icon: "🐹" },
    { name: "index.html", angle: 180, color: "#F59E0B", icon: "🌐" },
    { name: "styles.css", angle: 240, color: "#A855F7", icon: "🎨" },
    { name: "config.json", angle: 300, color: "#EC4899", icon: "⚙️" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Central High-Intensity Git Vortex SVG (top: 330px) */}
      <div style={{ position: "absolute", top: 330, left: 70, right: 70, height: 600 }}>
        <svg width="940" height="600" viewBox="0 0 940 600">
          <defs>
            <radialGradient id="vortexGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* Central Pulsating .git Repository Core */}
          <circle cx="470" cy="300" r={110 + pulse * 8} fill="url(#vortexGlow)" />
          <circle cx="470" cy="300" r="75" fill="#18181B" stroke="#A855F7" strokeWidth="4" />
          
          <text x="470" y="290" fill="#FFF" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            .git/
          </text>
          <text x="470" y="325" fill="#FFD166" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            {Math.floor(sizeProgress)} MB ⚡
          </text>

          {/* Flowing Suction Laser Rays */}
          {files.map((f, idx) => {
            const currentAngle = ((f.angle + rotation) * Math.PI) / 180;
            const dist = 240 + Math.sin(frame * 0.1 + idx) * 20;
            const fx = 470 + Math.cos(currentAngle) * dist;
            const fy = 300 + Math.sin(currentAngle) * dist;

            return (
              <g key={idx}>
                {/* Laser Suction Line */}
                <line
                  x1={fx}
                  y1={fy}
                  x2="470"
                  y2="300"
                  stroke={f.color}
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeDashoffset={-frame * 6}
                  opacity="0.8"
                />

                {/* Orbiting File Badge */}
                <g transform={`translate(${fx}, ${fy})`}>
                  <rect x="-60" y="-24" width="120" height="48" rx="14" fill="#FFFFFF" stroke={f.color} strokeWidth="2.5" />
                  <text x="-35" y="6" fontSize="18">{f.icon}</text>
                  <text x="5" y="5" fill="#0F172A" fontSize="14" fontWeight="800" fontFamily="monospace">
                    {f.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Bottom Metric Badge */}
      <div
        style={{
          position: "absolute",
          top: 940,
          left: 100,
          right: 100,
          backgroundColor: "#FFFFFF",
          padding: "16px 28px",
          borderRadius: 20,
          border: "2px solid #E2E8F0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#64748B", fontSize: 18, fontWeight: 700 }}>Compression Ratio:</span>
        <span style={{ color: "#7C3AED", fontWeight: 900, fontSize: 24, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          500 MB ➔ 10 MB (50x REDUCTION!) ⚡
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: DIFF MYTH LASER SLASH (130 to 181)
// ═══════════════════════════════════════════════════════════════
const Visual2_DiffLaserSlash: React.FC<{ frame: number }> = ({ frame }) => {
  const isSlashed = frame >= 155;
  const slashProgress = interpolate(frame, [155, 162], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Code Editor Showing Diffs (top: 360px) */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 90,
          right: 90,
          backgroundColor: "#0B1120",
          borderRadius: 26,
          border: "2.5px solid #334155",
          padding: "26px 36px",
          fontFamily: nemiTheme.typography.fontFamily.mono,
          fontSize: 24,
          lineHeight: 1.8,
          color: "#94A3B8",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div style={{ color: "#64748B", marginBottom: 8 }}># git diff --stat</div>
        <div style={{ color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.15)", padding: "4px 10px", borderRadius: 8 }}>
          - user_status = "offline"
        </div>
        <div style={{ color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 8 }}>
          + user_status = "online"
        </div>
        <div>  return render_ui()</div>

        {/* Dynamic Energy Slash Line */}
        {isSlashed && (
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <line
              x1="50"
              y1="40"
              x2={50 + 800 * slashProgress}
              y2={40 + 200 * slashProgress}
              stroke="#EF4444"
              strokeWidth="6"
              strokeLinecap="round"
              filter="drop-shadow(0 0 14px #EF4444)"
            />
          </svg>
        )}
      </div>

      {/* Massive Holographic "NO DIFFS STORED" Banner */}
      {isSlashed && (
        <div
          style={{
            position: "absolute",
            top: 580,
            left: "50%",
            transform: "translateX(-50%) rotate(-6deg)",
            backgroundColor: "#EF4444",
            color: "#FFF",
            padding: "16px 38px",
            borderRadius: 20,
            border: "3.5px solid #FFF",
            boxShadow: "0 18px 50px rgba(239, 68, 68, 0.7)",
            fontSize: 32,
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >
          ❌ GIT NEVER STORES DIFFS!
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: SHA-1 HASHING PRISM & BLOB CRYSTAL (181 to 281)
// ═══════════════════════════════════════════════════════════════
const Visual3_HashingPrism: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.3);
  const laserBeamX = interpolate(frame, [181, 210], [280, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* SVG Hashing Laser Engine (top: 360px) */}
      <div style={{ position: "absolute", top: 360, left: 70, right: 70, height: 500 }}>
        <svg width="940" height="500" viewBox="0 0 940 500">
          <defs>
            <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* 1. Input File Card */}
          <g transform="translate(140, 200)">
            <rect x="-90" y="-60" width="180" height="120" rx="18" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="-15" fill="#67E8F9" fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="monospace">📄 app.py</text>
            <text x="0" y="20" fill="#FFF" fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="monospace">print("hi")</text>
          </g>

          {/* Laser Beam into Prism */}
          <line x1="230" y1="200" x2="430" y2="200" stroke="#06B6D4" strokeWidth="4" strokeDasharray="8 6" strokeDashoffset={-frame * 10} />

          {/* 2. Central Hexagonal Hashing Prism */}
          <g transform="translate(470, 200)">
            <polygon
              points="0,-65 56,-32 56,32 0,65 -56,32 -56,-32"
              fill="url(#prismGrad)"
              opacity="0.85"
              stroke="#FFF"
              strokeWidth="3.5"
              transform={`scale(${1 + pulse * 0.05})`}
            />
            <text x="0" y="8" fill="#000" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              SHA-1
            </text>
          </g>

          {/* High Energy Laser Fired to Right */}
          <line x1="530" y1="200" x2={laserBeamX} y2="200" stroke="#A855F7" strokeWidth="5" filter="drop-shadow(0 0 10px #A855F7)" />

          {/* 3. Output Cryptographic Blob Crystal */}
          {frame >= 210 && (
            <g transform="translate(780, 200)">
              <rect x="-110" y="-60" width="220" height="120" rx="18" fill="rgba(168, 85, 247, 0.2)" stroke="#A855F7" strokeWidth="3.5" />
              <text x="0" y="-15" fill="#D8B4FE" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">🟣 SHA-1 BLOB</text>
              <text x="0" y="22" fill="#FFF" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">7a3f9e81...</text>
            </g>
          )}
        </svg>
      </div>

      {/* Floating Bottom Ledger */}
      <div
        style={{
          position: "absolute",
          top: 920,
          left: 100,
          right: 100,
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
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Content-Addressable:</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          FILE CONTENT = ITS UNIQUE HASH ID! 💎
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: 1 MUTATION vs 999 REUSED CABLES (281 to 427)
// ═══════════════════════════════════════════════════════════════
const Visual4_PointerWeb: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.3);
  const cableOffset = -frame * 12;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Dynamic Pointer Cable Web SVG (top: 360px) */}
      <div style={{ position: "absolute", top: 360, left: 70, right: 70, height: 500 }}>
        <svg width="940" height="500" viewBox="0 0 940 500">
          {/* Commit 1 (Orange) */}
          <g transform="translate(260, 60)">
            <rect x="-90" y="-30" width="180" height="60" rx="16" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" />
            <text x="0" y="8" fill="#FFD166" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              Commit 1
            </text>
          </g>

          {/* Commit 2 (Green) */}
          <g transform="translate(680, 60)">
            <rect x="-90" y="-30" width="180" height="60" rx="16" fill="#1E293B" stroke="#10B981" strokeWidth="3.5" />
            <text x="0" y="8" fill="#6EE7B7" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              Commit 2
            </text>
          </g>

          {/* Commit 2 -> 1 New Blob (Green Laser) */}
          <line x1="680" y1="90" x2="780" y2="280" stroke="#10B981" strokeWidth="4" />
          <text x="790" y="180" fill="#10B981" fontSize="16" fontWeight="900">1 New Blob! ⚡</text>

          {/* Commit 2 -> 999 Reused Old Blobs (Flowing Cyan Cables) */}
          <path
            d="M 680 90 Q 520 180 470 280"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            strokeDashoffset={cableOffset}
          />
          <path
            d="M 680 90 Q 380 180 260 280"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            strokeDashoffset={cableOffset}
          />

          {/* Blobs */}
          {/* Reused Blob 1 */}
          <g transform="translate(260, 310)">
            <circle r="42" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="6" fill="#67E8F9" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="monospace">Blob 1</text>
            <text x="0" y="65" fill="#10B981" fontSize="14" fontWeight="900" textAnchor="middle">REUSED ✓</text>
          </g>

          {/* Reused 999 Blobs Bundle */}
          <g transform="translate(470, 310)">
            <rect x="-80" y="-42" width="160" height="84" rx="20" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="8" fill="#67E8F9" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">...999 Blobs</text>
            <text x="0" y="65" fill="#10B981" fontSize="14" fontWeight="900" textAnchor="middle">REUSED ✓</text>
          </g>

          {/* Mutated New Blob */}
          <g transform="translate(780, 310)">
            <circle r="44" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="4" />
            <text x="0" y="6" fill="#6EE7B7" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="monospace">Blob 2'</text>
            <text x="0" y="65" fill="#10B981" fontSize="14" fontWeight="900" textAnchor="middle">+1 New File</text>
          </g>
        </svg>
      </div>

      {/* Floating Bottom Ledger */}
      <div
        style={{
          position: "absolute",
          top: 920,
          left: 90,
          right: 90,
          backgroundColor: "#03070D",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2.5px solid #10B981",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(16, 185, 129, 0.3)",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Efficiency Miracle:</span>
        <span style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          999 REUSED POINTERS = 0 BYTES COPIED! ⚡
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: 0.01ms MERGE BEAM & VICTORY (427 to 591)
// ═══════════════════════════════════════════════════════════════
const Visual5_DAGVictory: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* SVG Directed Acyclic Graph (DAG) (top: 360px) */}
      <div
        style={{
          position: "absolute",
          top: 360,
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
          <g transform="translate(120, 180)">
            <circle r="26" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="6" fill="#FFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">c1</text>
          </g>

          <g transform="translate(320, 180)">
            <circle r="26" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="6" fill="#FFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">c2</text>
          </g>

          <g transform="translate(580, 60)">
            <circle r="26" fill="#1E293B" stroke="#A855F7" strokeWidth="3" />
            <text x="0" y="6" fill="#FFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">c3*</text>
            <text x="0" y="-36" fill="#D8B4FE" fontSize="14" fontWeight="900" textAnchor="middle">feature</text>
          </g>

          <g transform="translate(740, 180)">
            <circle r="32" fill="#10B981" stroke="#FFF" strokeWidth="3.5" />
            <text x="0" y="7" fill="#000" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">MERGE</text>
            <text x="0" y="55" fill="#10B981" fontSize="16" fontWeight="900" textAnchor="middle">main (HEAD)</text>
          </g>
        </svg>
      </div>

      {/* Floating Complexity Scorecard (top: 820px) */}
      <div style={{ position: "absolute", top: 820, left: 70, right: 70, display: "flex", gap: 24 }}>
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
          <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>BRANCH & MERGE</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: "#0891B2" }}>0.01 ms ⚡</div>
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
          <div style={{ fontSize: 40, fontWeight: 900, color: "#059669" }}>~0.1% 🧠</div>
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
