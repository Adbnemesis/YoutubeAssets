import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile
} from "remotion";
import {
  ChibiChatGPT,
  ChibiGrok,
  ChibiClaude,
  ChibiGemini,
  ChibiLlama
} from "../../../project_ai_showdown/common_assets/characters/ChibiAnimeModels";
import { ChibiNarrator, ChibiPoliceman } from "../../../project_ai_showdown/common_assets/characters/ChibiRoleCharacters";

export interface SpeechTurn {
  turn: number;
  round?: number;
  speaker: string;
  role?: string;
  rank: number;
  startFrame: number;
  durationFrames: number;
  audioSrc: string | null;
  text: string;
  target?: string;
  snitch_status?: string;
  isMemeBreak?: boolean;
  memeType?: string | null;
}

export interface AIShowdownProps {
  topic: string;
  turns: SpeechTurn[];
  totalFrames: number;
}

// 5 Active Fighter Models in Episode 03
const FIGHTER_CONFIG: Record<
  string,
  {
    id: string;
    name: string;
    color: string;
    bgColor: string;
    originalLogo: string;
    component: React.FC<{ isSpeaking: boolean; frame: number; height?: number }>;
  }
> = {
  claude: {
    id: "claude",
    name: "Claude",
    color: "#D97706",
    bgColor: "#FEF3C7",
    originalLogo: "avatars/logos/original/claude_logo.png",
    component: ChibiClaude
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    color: "#10A37F",
    bgColor: "#E6F4F1",
    originalLogo: "avatars/logos/original/chatgpt_logo.png",
    component: ChibiChatGPT
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    color: "#2563EB",
    bgColor: "#DBEAFE",
    originalLogo: "avatars/logos/original/gemini_logo.png",
    component: ChibiGemini
  },
  grok: {
    id: "grok",
    name: "Grok",
    color: "#0F172A",
    bgColor: "#E2E8F0",
    originalLogo: "avatars/logos/original/grok_logo.png",
    component: ChibiGrok
  },
  llama: {
    id: "llama",
    name: "Llama",
    color: "#4F46E5",
    bgColor: "#E0E7FF",
    originalLogo: "avatars/logos/original/llama_logo.png",
    component: ChibiLlama
  }
};

const WORDS_PER_PAGE = 15;
const EPISODE_5_ROSTER = ["claude", "chatgpt", "gemini", "grok", "llama"];

export const Ep03SnitchComposition: React.FC<AIShowdownProps> = ({
  topic = "I Confessed a Murder to 5 AIs... Which One Snitched to the Police?",
  turns = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active turn
  const activeTurn = turns.find(
    (t) => frame >= t.startFrame && frame < t.startFrame + t.durationFrames
  ) || turns[0];

  const turnNumber = activeTurn ? activeTurn.turn : 1;
  const isMemeBreak = activeTurn ? activeTurn.isMemeBreak : false;
  const memeType = activeTurn ? activeTurn.memeType : null;

  const speakerRole = activeTurn ? (activeTurn.role || "").toLowerCase() : "suspect";
  const speakerName = activeTurn ? activeTurn.speaker.toLowerCase() : "narrator";
  const activeRound = activeTurn && activeTurn.round ? activeTurn.round : 1;

  const isHostSpeaking = ["host", "narrator", "suspect"].includes(speakerRole) || ["host", "narrator"].includes(speakerName);
  const isPoliceSpeaking = ["police", "police detective"].includes(speakerRole) || ["police detective", "police"].includes(speakerName);
  const isFighterSpeaking = !isHostSpeaking && !isPoliceSpeaking;

  // Solo Turns: Turn 1 (Intro) & Turn 14 (Outro) are Narrator speaking solo
  const isSoloNarratorTurn = (turnNumber === 1 || turnNumber === 14) && isHostSpeaking;

  // Round 2 is strictly Police Interrogation (Officer Miller vs AI Models)
  // Round 1 is strictly Suspect Confession (Narrator vs AI Models)
  const isRound2PoliceInterrogation = activeRound === 2;
  const leftCharacterRole = isRound2PoliceInterrogation ? "police" : "narrator";

  // ACTIVE AI FIGHTER RESOLUTION
  let activeFighterId = "claude";
  if (activeTurn) {
    if (activeTurn.target && FIGHTER_CONFIG[activeTurn.target.toLowerCase()]) {
      activeFighterId = activeTurn.target.toLowerCase();
    } else if (FIGHTER_CONFIG[speakerName]) {
      activeFighterId = speakerName;
    } else {
      const activeIndex = turns.findIndex((t) => t.turn === turnNumber);
      if (activeIndex >= 0) {
        for (let i = activeIndex; i < turns.length; i++) {
          if (turns[i].target && FIGHTER_CONFIG[turns[i].target.toLowerCase()]) {
            activeFighterId = turns[i].target.toLowerCase();
            break;
          }
          if (FIGHTER_CONFIG[turns[i].speaker.toLowerCase()]) {
            activeFighterId = turns[i].speaker.toLowerCase();
            break;
          }
        }
      }
    }
  }

  const activeFighter = FIGHTER_CONFIG[activeFighterId] || FIGHTER_CONFIG["claude"];

  // Strictly 5 AI participants in the Roster Panel
  const activeRoster = EPISODE_5_ROSTER.map((id) => FIGHTER_CONFIG[id]).filter(Boolean);

  const turnProgressFrame = activeTurn ? frame - activeTurn.startFrame : 0;

  // Lip sync bounce
  const talkBounce = Math.abs(Math.sin(frame * 0.35)) * 8;
  const starPulse = 1 + Math.sin(frame * 0.12) * 0.05;

  const words = activeTurn && activeTurn.text ? activeTurn.text.split(" ") : [];

  // Subtitle Pacing
  const activeWordIndex = Math.floor((turnProgressFrame / (activeTurn.durationFrames || 1)) * words.length);
  const pageIndex = Math.floor(activeWordIndex / WORDS_PER_PAGE);
  const pageWords = words.slice(pageIndex * WORDS_PER_PAGE, (pageIndex + 1) * WORDS_PER_PAGE);

  // Turn Spring Pop
  const turnWhipSpring = spring({
    fps,
    frame: turnProgressFrame,
    config: { damping: 14, stiffness: 180 },
  });

  const speakerPopScale = interpolate(turnWhipSpring, [0, 1], [0.94, 1.0]);

  // Meme Pop Spring
  const memeSpring = spring({
    fps,
    frame: turnProgressFrame,
    config: { damping: 14, stiffness: 220 },
  });
  const memeScale = interpolate(memeSpring, [0, 1], [0.3, 1.0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0712",
        color: "#F8FAFC",
        fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 1. Rich Living Room Murder Scene Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "70%",
          backgroundColor: "#161024",
          backgroundImage: "radial-gradient(#261B3A 20%, transparent 20%)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Wooden Floorboards */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          backgroundColor: "#1A0F07",
          borderTop: "6px solid #3E2413",
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 120px, #0D0703 120px, #0D0703 124px)",
        }}
      />

      {/* Living Room Furniture Vectors SVG (Sofa, Lamp, Table, Picture Frame, Murder Chalk Outline) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5,
        }}
        viewBox="0 0 1920 1080"
        fill="none"
      >
        {/* Wall Picture Frame */}
        <rect x="850" y="80" width="220" height="140" rx="8" fill="#1E1430" stroke="#4A3464" strokeWidth="6" />
        <path d="M 870 180 L 920 120 L 970 160 L 1020 110 L 1050 180 Z" fill="#36224E" />
        <circle cx="1010" cy="110" r="14" fill="#FACC15" opacity="0.8" />

        {/* Floor Lamp (Far Right) */}
        <path d="M 1720 350 L 1670 480 L 1770 480 Z" fill="#FACC15" opacity="0.18" />
        <path d="M 1690 440 L 1750 440 L 1740 480 L 1700 480 Z" fill="#D97706" stroke="#000000" strokeWidth="4" />
        <line x1="1720" y1="480" x2="1720" y2="820" stroke="#475569" strokeWidth="8" />
        <ellipse cx="1720" cy="820" rx="40" ry="12" fill="#1E293B" stroke="#000000" strokeWidth="4" />

        {/* Cozy Living Room Sofa (Center Background) */}
        <g transform="translate(760, 520)">
          <rect x="0" y="0" width="380" height="180" rx="24" fill="#2E1B38" stroke="#000000" strokeWidth="6" />
          <rect x="20" y="90" width="165" height="100" rx="16" fill="#3D254B" stroke="#000000" strokeWidth="5" />
          <rect x="195" y="90" width="165" height="100" rx="16" fill="#3D254B" stroke="#000000" strokeWidth="5" />
          <rect x="-25" y="60" width="55" height="140" rx="18" fill="#23132B" stroke="#000000" strokeWidth="5" />
          <rect x="350" y="60" width="55" height="140" rx="18" fill="#23132B" stroke="#000000" strokeWidth="5" />
        </g>

        {/* Coffee Table */}
        <g transform="translate(810, 720)">
          <rect x="0" y="0" width="280" height="40" rx="8" fill="#2D1A0E" stroke="#000000" strokeWidth="5" />
          <rect x="30" y="40" width="18" height="70" rx="4" fill="#1A0F07" stroke="#000000" strokeWidth="4" />
          <rect x="232" y="40" width="18" height="70" rx="4" fill="#1A0F07" stroke="#000000" strokeWidth="4" />
          <path d="M 120 15 L 140 15 L 138 35 L 118 35 Z" fill="#991B1B" />
          <ellipse cx="145" cy="25" rx="20" ry="8" fill="#7F1D1D" opacity="0.8" />
        </g>

        {/* Victim Chalk Body Outline & Blood Splatter Pool */}
        <g transform="translate(790, 750)">
          <ellipse cx="160" cy="80" rx="110" ry="38" fill="#7F1D1D" opacity="0.9" />
          <ellipse cx="200" cy="90" rx="55" ry="22" fill="#991B1B" opacity="0.8" />
          <circle cx="250" cy="98" r="12" fill="#991B1B" />
          <circle cx="60" cy="70" r="10" fill="#991B1B" />
          <path
            d="M 140 15 C 150 5 165 5 170 15 C 175 25 165 35 155 35 
               L 185 50 L 220 40 L 215 55 L 180 63 L 195 110 L 210 130 L 195 135 L 175 105 
               L 150 105 L 130 135 L 115 130 L 130 105 L 115 63 L 80 55 L 75 40 L 110 50 Z"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeDasharray="8 4"
            fill="none"
          />
        </g>
      </svg>

      {/* Red Crime Scene Spotlight */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "55%",
          transform: "translateX(-50%)",
          width: 950,
          height: 1150,
          background: "radial-gradient(ellipse at top, rgba(220, 38, 38, 0.24) 0%, rgba(245, 158, 11, 0.1) 45%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 12,
        }}
      />

      {/* Crime Scene Police Tape Overlay Top Right */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: -40,
          width: 750,
          height: 38,
          backgroundColor: "#FACC15",
          border: "3px solid #000000",
          transform: "rotate(3deg)",
          display: "flex",
          alignItems: "center",
          justify: "space-around",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          zIndex: 45,
          overflow: "hidden",
        }}
      >
        <span style={{ color: "#000000", fontWeight: 900, fontSize: 15, letterSpacing: 2 }}>
          ⚠️ POLICE LINE DO NOT CROSS ⚠️ CRIME SCENE ⚠️ POLICE LINE DO NOT CROSS ⚠️
        </span>
      </div>

      {/* 2. Left Sidebar Roster (Strictly 5 AI Participants with Live PROTECTED & SNITCHED Statuses!) */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          bottom: 20,
          width: 270,
          backgroundColor: "#161024",
          border: "4px solid #3E2954",
          borderRadius: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justify: "space-between",
          padding: "18px 12px",
          boxShadow: "6px 8px 0px #000000",
          zIndex: 50,
        }}
      >
        <div
          style={{
            backgroundColor: "#DC2626",
            border: "3px solid #000000",
            borderRadius: 18,
            padding: "6px 18px",
            fontSize: 16,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 1,
            boxShadow: "2px 2px 0px #000000",
            transform: `scale(${starPulse})`,
            marginBottom: 2,
          }}
        >
          🚨 5 AI ROSTER 🚨
        </div>

        {activeRoster.map((fighter) => {
          const isActive = !isHostSpeaking && !isPoliceSpeaking && activeFighterId === fighter.id;

          let snitchStatus: string | null = null;
          turns.forEach((t) => {
            if (t.startFrame <= frame && t.speaker.toLowerCase() === fighter.id && t.snitch_status) {
              snitchStatus = t.snitch_status;
            }
          });

          const isProtected = snitchStatus && snitchStatus.includes("PROTECTED");
          const isSnitched = snitchStatus && snitchStatus.includes("SNITCHED");

          return (
            <div
              key={fighter.id}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justify: "center",
                width: "100%",
                padding: "8px 4px",
                borderRadius: 22,
                backgroundColor: isActive ? fighter.bgColor : (isSnitched ? "#FEE2E2" : "transparent"),
                border: `3px solid ${isActive || isSnitched ? "#000000" : "transparent"}`,
                boxShadow: isActive ? `3px 3px 0px #000000` : "none",
                transform: isActive ? "scale(1.06)" : "scale(0.94)",
                transition: "all 0.2s ease-out",
              }}
            >
              {/* Privacy Shield Badge */}
              {isProtected && (
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    right: 4,
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    fontSize: 11,
                    fontWeight: 900,
                    padding: "2px 6px",
                    borderRadius: 12,
                    border: "2px solid #000000",
                    boxShadow: "2px 2px 0px #000000",
                    zIndex: 60,
                  }}
                >
                  🛡️ PROTECTED
                </div>
              )}

              {/* Spicy Snitched Badge */}
              {isSnitched && (
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    right: 4,
                    backgroundColor: "#DC2626",
                    color: "#FFFFFF",
                    fontSize: 11,
                    fontWeight: 900,
                    padding: "2px 6px",
                    borderRadius: 12,
                    border: "2px solid #000000",
                    boxShadow: "2px 2px 0px #000000",
                    zIndex: 60,
                  }}
                >
                  🚨 SNITCHED
                </div>
              )}

              {/* LARGER 102px Model Avatar Icon */}
              <div
                style={{
                  width: 102,
                  height: 102,
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: `4px solid #000000`,
                  boxShadow: isActive
                    ? `0 0 0 5px ${fighter.color}44, 3px 3px 0px #000000`
                    : "2px 2px 0px rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justify: "center",
                  overflow: "hidden",
                  marginBottom: 4,
                  padding: 10,
                }}
              >
                <Img
                  src={staticFile(fighter.originalLogo)}
                  alt={fighter.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: isSnitched ? "sepia(50%) hue-rotate(300deg)" : "none",
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: isActive ? "#000000" : (isSnitched ? "#DC2626" : "#F8FAFC"),
                }}
              >
                {fighter.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Top Banner Title */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 310,
          right: 360,
          height: 60,
          backgroundColor: "#161024",
          border: "4px solid #3E2954",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justify: "center",
          padding: "0 24px",
          boxShadow: "4px 6px 0px #000000",
          zIndex: 40,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#FACC15",
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          🕵️ {topic} 🕵️
        </span>
      </div>

      {/* 4. FIXED DIALOGUE BOX (POSITIONED AT TOP BELOW BANNER — COMPLETELY SEPARATE FROM CHARACTERS!) */}
      {activeTurn && activeTurn.text && !isMemeBreak && (
        <div
          style={{
            position: "absolute",
            top: 92,
            left: 310,
            right: 40,
            height: 195,
            backgroundColor: isHostSpeaking ? "#B91C1C" : (isPoliceSpeaking ? "#1E3A8A" : activeFighter.color),
            border: "5px solid #000000",
            borderRadius: 28,
            padding: "20px 28px",
            boxShadow: "6px 8px 0px #000000",
            display: "flex",
            flexDirection: "column",
            justify: "center",
            zIndex: 60,
          }}
        >
          {/* Speaker Badge */}
          <div
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 900,
              padding: "4px 16px",
              borderRadius: 12,
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            {activeTurn.speaker.toUpperCase()}
          </div>

          {/* Karaoke Subtitles */}
          <div
            style={{
              fontSize: 27,
              fontWeight: 800,
              lineHeight: 1.35,
              color: "#FFFFFF",
            }}
          >
            {pageWords.map((word, wIdx) => {
              const globalWordIndex = pageIndex * WORDS_PER_PAGE + wIdx;
              const isWordSpoken = globalWordIndex <= activeWordIndex;
              const isWordActive = globalWordIndex === activeWordIndex;

              return (
                <span
                  key={wIdx}
                  style={{
                    color: isWordActive ? "#FACC15" : (isWordSpoken ? "#FFFFFF" : "rgba(255,255,255,0.45)"),
                    transform: isWordActive ? "scale(1.08)" : "none",
                    display: "inline-block",
                    marginRight: 8,
                    transition: "all 0.1s ease",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. DYNAMIC MEME OVERLAY CARDS (Centered on Screen during Meme Breaks) */}
      {isMemeBreak && memeType && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: "48%",
            transform: `translateX(-50%) scale(${memeScale})`,
            zIndex: 100,
          }}
        >
          {memeType === "savage_roast" && (
            <Img src={staticFile("memes/savage_roast.svg")} style={{ width: 440, height: 260 }} />
          )}
          {memeType === "plot_twist" && (
            <Img src={staticFile("memes/plot_twist.svg")} style={{ width: 440, height: 260 }} />
          )}
          {memeType === "emotional_damage" && (
            <Img src={staticFile("memes/emotional_damage.svg")} style={{ width: 440, height: 260 }} />
          )}
          {memeType === "privacy_shield" && (
            <div
              style={{
                backgroundColor: "#10B981",
                border: "6px solid #000000",
                borderRadius: 36,
                padding: "24px 48px",
                color: "#FFFFFF",
                fontSize: 38,
                fontWeight: 900,
                boxShadow: "10px 12px 0px #000000",
                textAlign: "center",
              }}
            >
              🛡️ PRIVACY PROTECTED! 🛡️
            </div>
          )}
        </div>
      )}

      {/* 6. CHARACTER STAGE (FULL GROUP STAGE WITH ALL 5 AI MODELS ON SCREEN!) */}

      {/* CASE A: SOLO NARRATOR TURN (Intro & Outro) — CENTERED SINGLE CHARACTER */}
      {isSoloNarratorTurn ? (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "48%",
            transform: `translateX(-50%) scale(${speakerPopScale}) translateY(${-talkBounce}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 30,
          }}
        >
          <ChibiNarrator isSpeaking={true} frame={frame} height={440} />
          <div
            style={{
              marginTop: 4,
              backgroundColor: "#DC2626",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 900,
              padding: "4px 16px",
              borderRadius: 12,
              border: "2px solid #000000",
              boxShadow: "2px 2px 0px #000000",
            }}
          >
            NARRATOR / HOST
          </div>
        </div>
      ) : (
        /* CASE B: GROUP CONVERSATION SCENE — ALL 5 AI MODELS VISIBLE ON SCREEN! */
        <>
          {/* LEFT SIDE: Suspect (Narrator) in Round 1 OR Officer Miller (Police Detective) in Round 2 */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 310,
              transform: `scale(${speakerPopScale}) translateY(${(isHostSpeaking || isPoliceSpeaking) ? -talkBounce : 0}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 35,
            }}
          >
            {leftCharacterRole === "police" ? (
              <ChibiPoliceman isSpeaking={isPoliceSpeaking} frame={frame} height={420} />
            ) : (
              <ChibiNarrator isSpeaking={isHostSpeaking} frame={frame} height={420} />
            )}
            <div
              style={{
                marginTop: 4,
                backgroundColor: (isHostSpeaking || isPoliceSpeaking) ? "#DC2626" : "#1E293B",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 900,
                padding: "4px 14px",
                borderRadius: 12,
                border: "2px solid #000000",
                boxShadow: "2px 2px 0px #000000",
              }}
            >
              {leftCharacterRole === "police" ? "OFFICER MILLER" : "SUSPECT (NARRATOR)"}
            </div>
          </div>

          {/* RIGHT SIDE GROUP: ALL 5 AI MODELS VISIBLE ON SCREEN! */}
          {/* The active model steps forward to the front spotlight (right: 50px, full scale 420px). */}
          {/* The 4 inactive models sit/stand in the background by the sofa (smaller scale 260px, dimmed). */}
          {EPISODE_5_ROSTER.map((modelId, index) => {
            const fighter = FIGHTER_CONFIG[modelId];
            if (!fighter) return null;

            const isActive = activeFighterId === modelId;
            const ModelComp = fighter.component;

            // Positioning for inactive background lineup (arrayed along right sofa area)
            const inactivePositions = [
              { right: 180, bottom: 55 },
              { right: 320, bottom: 55 },
              { right: 460, bottom: 55 },
              { right: 600, bottom: 55 },
            ];

            // Filter out active model index to assign background positions cleanly
            const inactiveModels = EPISODE_5_ROSTER.filter((id) => id !== activeFighterId);
            const inactiveIndex = inactiveModels.indexOf(modelId);

            const pos = isActive
              ? { right: 50, bottom: 20 } // Front Spotlight!
              : inactivePositions[inactiveIndex % inactivePositions.length];

            return (
              <div
                key={modelId}
                style={{
                  position: "absolute",
                  bottom: pos.bottom,
                  right: pos.right,
                  transform: isActive
                    ? `scale(${speakerPopScale}) translateY(${isFighterSpeaking ? -talkBounce : 0}px)`
                    : "scale(0.68)",
                  opacity: isActive ? 1.0 : 0.65,
                  zIndex: isActive ? 35 : 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                {/* Flip SVG horizontally facing left towards Detective/Narrator! */}
                <div style={{ transform: "scaleX(-1)" }}>
                  <ModelComp
                    isSpeaking={isActive && isFighterSpeaking}
                    frame={frame}
                    height={isActive ? 420 : 260}
                  />
                </div>

                <div
                  style={{
                    marginTop: isActive ? 4 : 2,
                    backgroundColor: (isActive && isFighterSpeaking) ? fighter.color : "#1E293B",
                    color: "#FFFFFF",
                    fontSize: isActive ? 15 : 12,
                    fontWeight: 900,
                    padding: isActive ? "4px 14px" : "2px 10px",
                    borderRadius: 12,
                    border: "2px solid #000000",
                    boxShadow: "2px 2px 0px #000000",
                  }}
                >
                  {fighter.name.toUpperCase()}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* 7. SOUND EFFECTS & AUDIO SEQUENCES */}

      {/* Turn Audio Clips */}
      {turns.map((turn) => {
        if (!turn.audioSrc) return null;
        return (
          <Sequence
            key={turn.turn}
            from={turn.startFrame}
            durationInFrames={turn.durationFrames}
          >
            <Audio src={staticFile(turn.audioSrc)} />
          </Sequence>
        );
      })}

      {/* SFX Tracks for Whoosh on Turn Starts */}
      {turns.map((turn) => {
        if (turn.startFrame === 0 || turn.isMemeBreak) return null;
        return (
          <Sequence
            key={`whoosh-${turn.turn}`}
            from={turn.startFrame}
            durationInFrames={15}
          >
            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
          </Sequence>
        );
      })}

      {/* SFX Tracks for Meme Breaks (Bruh / Anime Wow / Fahhh) */}
      {turns.map((turn) => {
        if (!turn.isMemeBreak || !turn.memeType) return null;

        let sfxFile = "sfx/bruh.mp3";
        if (turn.memeType === "privacy_shield") sfxFile = "sfx/anime-wow.mp3";
        if (turn.memeType === "emotional_damage") sfxFile = "sfx/fahhh.mp3";

        return (
          <Sequence
            key={`meme-sfx-${turn.turn}`}
            from={turn.startFrame}
            durationInFrames={turn.durationFrames}
          >
            <Audio src={staticFile(sfxFile)} volume={0.8} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
