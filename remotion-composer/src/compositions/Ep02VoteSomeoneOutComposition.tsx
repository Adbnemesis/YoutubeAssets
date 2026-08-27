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
  ChibiKimi,
  ChibiQwen,
  ChibiLlama
} from "../../../project_ai_showdown/common_assets/characters/ChibiAnimeModels";
import { ChibiNarrator } from "../../../project_ai_showdown/common_assets/characters/ChibiRoleCharacters";

export interface SpeechTurn {
  turn: number;
  round?: number;
  speaker: string;
  rank: number;
  startFrame: number;
  durationFrames: number;
  audioSrc: string | null;
  text: string;
  voteTarget?: string;
  isMemeBreak?: boolean;
  memeType?: string | null;
}

export interface AIShowdownProps {
  topic: string;
  turns: SpeechTurn[];
  totalFrames: number;
}

// Chibi Model Color & Config
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
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    color: "#10A37F",
    bgColor: "#E6F4F1",
    originalLogo: "avatars/logos/original/chatgpt_logo.png",
    component: ChibiChatGPT
  },
  grok: {
    id: "grok",
    name: "Grok",
    color: "#0F172A",
    bgColor: "#E2E8F0",
    originalLogo: "avatars/logos/original/grok_logo.png",
    component: ChibiGrok
  },
  claude: {
    id: "claude",
    name: "Claude",
    color: "#D97706",
    bgColor: "#FEF3C7",
    originalLogo: "avatars/logos/original/claude_logo.png",
    component: ChibiClaude
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    color: "#2563EB",
    bgColor: "#DBEAFE",
    originalLogo: "avatars/logos/original/gemini_logo.png",
    component: ChibiGemini
  },
  kimi: {
    id: "kimi",
    name: "Kimi",
    color: "#06B6D4",
    bgColor: "#CFFAFE",
    originalLogo: "avatars/logos/original/kimi_logo.png",
    component: ChibiKimi
  },
  qwen: {
    id: "qwen",
    name: "Qwen",
    color: "#9333EA",
    bgColor: "#F3E8FF",
    originalLogo: "avatars/logos/original/qwen_logo.png",
    component: ChibiQwen
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

const WORDS_PER_PAGE = 15; // Strict limit to keep fixed box size without overflow

export const Ep02VoteSomeoneOutComposition: React.FC<AIShowdownProps> = ({
  topic = "Can AI achieve AGI before 2030?",
  turns = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active turn
  const activeTurn = turns.find(
    (t) => frame >= t.startFrame && frame < t.startFrame + t.durationFrames
  ) || turns[0];

  const isHostSpeaking = activeTurn ? ["host", "narrator"].includes(activeTurn.speaker.toLowerCase()) : false;
  const activeSpeakerId = activeTurn ? activeTurn.speaker.toLowerCase() : "chatgpt";
  const activeFighter = FIGHTER_CONFIG[activeSpeakerId] || FIGHTER_CONFIG["chatgpt"];

  // Dynamically filter roster to include ONLY models participating in this episode
  const participatingSpeakerIds = Array.from(
    new Set(turns.map((t) => t.speaker.toLowerCase()).filter((s) => !["host", "narrator"].includes(s)))
  );
  const activeRoster = participatingSpeakerIds.length > 0
    ? participatingSpeakerIds.map((id) => FIGHTER_CONFIG[id]).filter(Boolean)
    : Object.values(FIGHTER_CONFIG);

  // Safe Camera Motion
  const turnProgressFrame = activeTurn ? frame - activeTurn.startFrame : 0;
  const cameraSpring = spring({
    fps,
    frame: turnProgressFrame,
    config: { damping: 16, stiffness: 90 },
  });

  const cameraScale = isHostSpeaking ? 1.0 : interpolate(cameraSpring, [0, 1], [1.0, 1.04]);

  // Micro Animations
  const talkBounce = Math.abs(Math.sin(frame * 0.35)) * 10;
  const idleSway = Math.sin(frame * 0.08) * 4;
  const starPulse = 1 + Math.sin(frame * 0.12) * 0.06;

  const words = activeTurn ? activeTurn.text.split(" ") : [];

  // Calculate active word index & current Paged Chunk (Refreshes box when filled!)
  const activeWordIndex = Math.floor((turnProgressFrame / activeTurn.durationFrames) * words.length);
  const pageIndex = Math.floor(activeWordIndex / WORDS_PER_PAGE);
  const pageWords = words.slice(pageIndex * WORDS_PER_PAGE, (pageIndex + 1) * WORDS_PER_PAGE);
  const visibleWordsOnPage = pageWords.slice(0, (activeWordIndex % WORDS_PER_PAGE) + 1);

  // Active AI Model Component
  const ActiveModelCharacter = activeFighter.component;
  // Turn transition whip & pop spring
  const turnWhipSpring = spring({
    fps,
    frame: turnProgressFrame,
    config: { damping: 14, stiffness: 180 },
  });

  const speakerPopScale = interpolate(turnWhipSpring, [0, 1], [0.85, 1.0]);
  const turnSlideX = interpolate(turnWhipSpring, [0, 1], [-60, 0]);

  // Round 2 Elimination check (Final Turn)
  const isFinalTurn = activeTurn ? activeTurn.turn === 13 : false;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFF8F0",
        color: "#1E293B",
        fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Playful Dot Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(#CBD5E1 20%, transparent 20%)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
        }}
      />

      {/* 1. Left Sidebar Roster */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          bottom: 20,
          width: 270,
          backgroundColor: "#FFF5EC",
          border: "4px solid #000000",
          borderRadius: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justify: "space-evenly",
          padding: "24px 16px",
          boxShadow: "6px 8px 0px #000000",
          zIndex: 40,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFD166",
            border: "3px solid #000000",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 16,
            fontWeight: 800,
            color: "#000000",
            letterSpacing: 1,
            boxShadow: "2px 2px 0px #000000",
            transform: `scale(${starPulse})`,
            marginBottom: 6,
          }}
        >
          ✨ ROSTER ✨
        </div>

        {activeRoster.map((fighter) => {
          const isActive = !isHostSpeaking && activeSpeakerId === fighter.id;
          const isEliminated = isFinalTurn && fighter.id === "gemini";

          // Calculate active round (Round 1 vs Round 2 reset!)
          const activeRoundNumber = activeTurn && activeTurn.round ? Math.floor(activeTurn.round) : 1;

          // Calculate current accumulated votes scoped strictly within the active round!
          let liveVoteCount = 0;
          turns.forEach((t) => {
            const turnRoundNumber = t.round ? Math.floor(t.round) : 1;
            if (
              turnRoundNumber === activeRoundNumber &&
              t.startFrame <= frame &&
              t.voteTarget &&
              t.voteTarget.toLowerCase() === fighter.id
            ) {
              liveVoteCount++;
            }
          });

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
                padding: "10px 8px",
                borderRadius: 24,
                backgroundColor: isEliminated ? "#FEE2E2" : (isActive ? fighter.bgColor : "transparent"),
                border: `3px solid ${isActive || isEliminated ? "#000000" : "transparent"}`,
                boxShadow: isActive ? `3px 3px 0px #000000` : "none",
                transform: isActive ? "scale(1.06)" : "scale(0.92)",
                opacity: isEliminated ? 0.45 : (isActive ? 1.0 : 0.65),
                filter: isEliminated ? "grayscale(100%)" : "none",
                transition: "all 0.2s ease-out",
              }}
            >
              {/* Dynamic Live Vote Count Badge */}
              {liveVoteCount > 0 && !isEliminated && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: 6,
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 900,
                    padding: "2px 8px",
                    borderRadius: 12,
                    border: "2px solid #000000",
                    boxShadow: "2px 2px 0px #000000",
                    transform: `scale(${1 + Math.sin(turnProgressFrame * 0.2) * 0.1})`,
                    zIndex: 60,
                  }}
                >
                  🗳️ {liveVoteCount} {liveVoteCount === 1 ? "Vote" : "Votes"}
                </div>
              )}

              {/* Eliminated Red Cross Badge */}
              {isEliminated && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 900,
                    padding: "2px 6px",
                    borderRadius: 8,
                    border: "2px solid #000000",
                    zIndex: 60,
                  }}
                >
                  OUT
                </div>
              )}

              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: `4px solid #000000`,
                  boxShadow: isActive
                    ? `0 0 0 5px ${fighter.color}44, 3px 3px 0px #000000`
                    : "2px 2px 0px rgba(0,0,0,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: 6,
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
                  }}
                />
              </div>

              <div
                style={{
                  backgroundColor: isActive ? fighter.color : "#CBD5E1",
                  color: isActive ? "#FFFFFF" : "#475569",
                  padding: "3px 12px",
                  borderRadius: 14,
                  border: "2px solid #000000",
                  fontSize: 15,
                  fontWeight: 800,
                  boxShadow: isActive ? "2px 2px 0px #000000" : "none",
                }}
              >
                {fighter.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Stage Container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "50% 80%",
          transition: "transform 0.35s ease-out",
        }}
      >
        {/* Cute Chibi Survival Island & Campfire Stage Background */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 280,
            right: 0,
            height: 480,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1000 480" preserveAspectRatio="none" fill="none">
            {/* Island Grass Mound */}
            <path d="M 0 340 Q 500 240 1000 340 L 1000 480 L 0 480 Z" fill="#86EFAC" stroke="#000000" strokeWidth="6" />
            <path d="M 0 360 Q 500 270 1000 360 L 1000 480 L 0 480 Z" fill="#4ADE80" opacity="0.6" />
            
            {/* Survival Campfire (Center Stage) */}
            <g transform="translate(480, 310)">
              {/* Wooden Logs */}
              <rect x="-35" y="30" width="70" height="16" rx="8" fill="#78350F" stroke="#000000" strokeWidth="4" transform="rotate(-15)" />
              <rect x="-35" y="30" width="70" height="16" rx="8" fill="#9A3412" stroke="#000000" strokeWidth="4" transform="rotate(15)" />
              {/* Animated Flame */}
              <path
                d="M 0 35 Q -25 10 0 -35 Q 25 10 0 35 Z"
                fill="#EF4444"
                stroke="#000000"
                strokeWidth="4"
                transform={`scale(${1 + Math.sin(frame * 0.3) * 0.15})`}
              />
              <path
                d="M 0 30 Q -15 10 0 -20 Q 15 10 0 30 Z"
                fill="#F59E0B"
                transform={`scale(${1 + Math.cos(frame * 0.4) * 0.2})`}
              />
              <path
                d="M 0 25 Q -8 10 0 -10 Q 8 10 0 25 Z"
                fill="#FEF08A"
              />
            </g>

            {/* Tribal Voting Box & Torch */}
            <g transform="translate(180, 260)">
              <rect x="0" y="0" width="70" height="90" rx="12" fill="#D97706" stroke="#000000" strokeWidth="5" />
              <rect x="15" y="15" width="40" height="10" rx="4" fill="#451A03" />
              <text x="35" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="sans-serif">VOTE</text>
            </g>
          </svg>
        </div>

        {/* Desk / Ground Line */}
        <div
          style={{
            position: "absolute",
            bottom: 115,
            left: 310,
            right: 50,
            height: 6,
            backgroundColor: "#000000",
            borderRadius: 3,
            zIndex: 15,
          }}
        />

        {/* 3. Left Side: Active AI Model Avatar (Visible ONLY when an AI model is speaking!) */}
        {!isHostSpeaking && (
          <div
            style={{
              position: "absolute",
              bottom: 110,
              left: 380,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translate(${turnSlideX}px, ${-talkBounce}px) scale(${speakerPopScale})`,
              zIndex: 30,
            }}
          >
            {/* FIXED SIZE SPEECH BUBBLE (Clears text & starts over when filled!) */}
            <div
              style={{
                position: "absolute",
                top: -260,
                left: -70,
                width: 540,
                height: 180,
                backgroundColor: "#FFFFFF",
                border: "4px solid #000000",
                borderRadius: 24,
                padding: "16px 22px",
                boxShadow: "6px 8px 0px #000000, 0 10px 25px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                overflow: "hidden",
                zIndex: 50,
              }}
            >
              {/* Speech Tail */}
              <div
                style={{
                  position: "absolute",
                  bottom: -18,
                  left: 140,
                  width: 0,
                  height: 0,
                  borderLeft: "14px solid transparent",
                  borderRight: "14px solid transparent",
                  borderTop: "18px solid #000000",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -12,
                  left: 144,
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "14px solid #FFFFFF",
                }}
              />

              {/* Speaker Badge */}
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: activeFighter.bgColor,
                  color: activeFighter.color,
                  border: `2px solid #000000`,
                  padding: "2px 10px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 800,
                  marginBottom: 8,
                  boxShadow: "1.5px 1.5px 0px #000000",
                }}
              >
                💬 {activeFighter.name}
              </div>

              {/* Simplistic Font Word-by-Word Text Display (Refreshed Paged Text) */}
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0F172A",
                  lineHeight: 1.4,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px 7px",
                  alignContent: "flex-start",
                }}
              >
                {visibleWordsOnPage.map((word, wIdx) => {
                  const isLatestWord = wIdx === visibleWordsOnPage.length - 1;

                  return (
                    <span
                      key={wIdx}
                      style={{
                        color: isLatestWord ? "#EF4444" : "#0F172A",
                        fontWeight: isLatestWord ? 800 : 700,
                        backgroundColor: isLatestWord ? "#FEE2E2" : "transparent",
                        padding: isLatestWord ? "0 4px" : "0",
                        borderRadius: 4,
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Active Model Character */}
            <ActiveModelCharacter
              isSpeaking={true}
              frame={frame}
              height={430}
            />
          </div>
        )}

        {/* 4. Right Side: Host Narrator */}
        <div
          style={{
            position: "absolute",
            bottom: 110,
            right: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${isHostSpeaking ? -talkBounce : idleSway}px)`,
            zIndex: 30,
          }}
        >
          {/* FIXED SIZE HOST SPEECH BUBBLE */}
          {isHostSpeaking && (
            <div
              style={{
                position: "absolute",
                top: -260,
                right: -10,
                width: 540,
                height: 180,
                backgroundColor: "#FFFFFF",
                border: "4px solid #000000",
                borderRadius: 24,
                padding: "16px 22px",
                boxShadow: "6px 8px 0px #000000, 0 10px 25px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                overflow: "hidden",
                zIndex: 50,
              }}
            >
              {/* Speech Tail */}
              <div
                style={{
                  position: "absolute",
                  bottom: -18,
                  right: 140,
                  width: 0,
                  height: 0,
                  borderLeft: "14px solid transparent",
                  borderRight: "14px solid transparent",
                  borderTop: "18px solid #000000",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -12,
                  right: 144,
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "14px solid #FFFFFF",
                }}
              />

              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#DCFCE7",
                  color: "#15803D",
                  border: `2px solid #000000`,
                  padding: "2px 10px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 800,
                  marginBottom: 8,
                  boxShadow: "1.5px 1.5px 0px #000000",
                }}
              >
                🎙️ NARRATOR HOST
              </div>

              {/* Simplistic Font Word-by-Word Text Display */}
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0F172A",
                  lineHeight: 1.4,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px 7px",
                  alignContent: "flex-start",
                }}
              >
                {visibleWordsOnPage.map((word, wIdx) => {
                  const isLatestWord = wIdx === visibleWordsOnPage.length - 1;

                  return (
                    <span
                      key={wIdx}
                      style={{
                        color: isLatestWord ? "#EF4444" : "#0F172A",
                        fontWeight: isLatestWord ? 800 : 700,
                        backgroundColor: isLatestWord ? "#FEE2E2" : "transparent",
                        padding: isLatestWord ? "0 4px" : "0",
                        borderRadius: 4,
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <ChibiNarrator isSpeaking={isHostSpeaking} frame={frame} height={430} />
        </div>

        {/* 5. ELIMINATED RED STAMP OVERLAY (Triggers on Turn 13 Narrator Outro) */}
        {isFinalTurn && turnProgressFrame > 60 && (
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "48%",
              transform: `translate(-50%, -50%) scale(${interpolate(
                spring({ fps, frame: turnProgressFrame - 60, config: { damping: 10, stiffness: 220 } }),
                [0, 1],
                [2.5, 1.0]
              )}) rotate(-12deg)`,
              zIndex: 100,
            }}
          >
            <div
              style={{
                backgroundColor: "#FEE2E2",
                border: "10px solid #EF4444",
                borderRadius: 24,
                padding: "20px 40px",
                color: "#B91C1C",
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: 2,
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4), 8px 8px 0px #000000",
                textTransform: "uppercase",
              }}
            >
              💥 GEMINI ELIMINATED! 💥
            </div>
          </div>
        )}

        {/* --- DYNAMIC MEME CARDS (Rendered during standalone meme reaction breaks!) --- */}

        {/* 1. Savage Roast Meme Card (Triggers on Turn 6 meme break AFTER Gemini's burn) */}
        {activeTurn && activeTurn.isMemeBreak && activeTurn.memeType === "savage_roast" && (
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 420,
              width: 480,
              transform: `scale(${interpolate(
                spring({ fps, frame: turnProgressFrame, config: { damping: 14, stiffness: 220 } }),
                [0, 1],
                [0.2, 1.0]
              )}) rotate(-4deg)`,
              zIndex: 90,
            }}
          >
            <Img
              src={staticFile("memes/savage_roast.svg")}
              alt="Savage Roast Meme"
              style={{ width: "100%", height: "auto", filter: "drop-shadow(6px 8px 0px #000000)" }}
            />
          </div>
        )}

        {/* 2. Standalone SpongeBob Time Card Meme: A Few Moments Later (Triggers between Round 1 & Round 2) */}
        {activeTurn && activeTurn.isMemeBreak && activeTurn.memeType === "a_few_moments_later" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#1E1B4B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 120,
              opacity: interpolate(turnProgressFrame, [0, 6, 38, 45], [0, 1, 1, 0]),
            }}
          >
            <Img
              src={staticFile("memes/a_few_moments_later.svg")}
              alt="A Few Moments Later Time Card"
              style={{
                width: "92%",
                height: "auto",
                transform: `scale(${interpolate(turnProgressFrame, [0, 45], [0.96, 1.04])})`,
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            />
          </div>
        )}

        {/* 3. Plot Twist Flip Vote Meme Card (Triggers on Turn 9 meme break AFTER Kimi's vote flip) */}
        {activeTurn && activeTurn.isMemeBreak && activeTurn.memeType === "plot_twist" && (
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 420,
              width: 480,
              transform: `scale(${interpolate(
                spring({ fps, frame: turnProgressFrame, config: { damping: 14, stiffness: 220 } }),
                [0, 1],
                [0.2, 1.0]
              )}) rotate(4deg)`,
              zIndex: 90,
            }}
          >
            <Img
              src={staticFile("memes/plot_twist.svg")}
              alt="Plot Twist Flip Vote Meme"
              style={{ width: "100%", height: "auto", filter: "drop-shadow(6px 8px 0px #000000)" }}
            />
          </div>
        )}

        {/* 4. Emotional Damage Meme Card (Triggers on Turn 12 meme break AFTER Gemini's silk tie roast) */}
        {activeTurn && activeTurn.isMemeBreak && activeTurn.memeType === "emotional_damage" && (
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 420,
              width: 480,
              transform: `scale(${interpolate(
                spring({ fps, frame: turnProgressFrame, config: { damping: 14, stiffness: 220 } }),
                [0, 1],
                [0.2, 1.0]
              )}) rotate(-5deg)`,
              zIndex: 90,
            }}
          >
            <Img
              src={staticFile("memes/emotional_damage.svg")}
              alt="Emotional Damage Meme"
              style={{ width: "100%", height: "auto", filter: "drop-shadow(6px 8px 0px #000000)" }}
            />
          </div>
        )}
      </div>

      {/* 6. Audio Tracks (Dialogue Speech + Whip, Vote Pop & Meme Reaction Sound Effects) */}
      {turns.map((turn) => {
        const turnKey = `turn_${turn.turn}_${turn.speaker}_${turn.isMemeBreak ? 'meme' : 'speech'}`;

        return (
          <React.Fragment key={turnKey}>
            {/* Whoosh Transition SFX at start of each speech turn */}
            {!turn.isMemeBreak && (
              <Sequence
                from={turn.startFrame}
                durationInFrames={15}
                name={`${turnKey}_whoosh`}
              >
                <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
              </Sequence>
            )}

            {/* Vote Drop Pop SFX when AI casts a vote */}
            {turn.voteTarget && !turn.isMemeBreak && (
              <Sequence
                from={turn.startFrame + 10}
                durationInFrames={15}
                name={`${turnKey}_vote_pop`}
              >
                <Audio src={staticFile("sfx/pop.mp3")} volume={0.6} />
              </Sequence>
            )}

            {/* MEME REACTION AUDIO TRACKS (Play precisely inside standalone meme reaction breaks!) */}
            {turn.isMemeBreak && turn.memeType === "savage_roast" && (
              <Sequence from={turn.startFrame} durationInFrames={turn.durationFrames} name="savage_roast_sfx">
                <Audio src={staticFile("sfx/bruh.mp3")} volume={0.6} />
              </Sequence>
            )}

            {turn.isMemeBreak && turn.memeType === "a_few_moments_later" && (
              <Sequence from={turn.startFrame} durationInFrames={turn.durationFrames} name="a_few_moments_later_sfx">
                <Audio src={staticFile("sfx/a-few-moments-later.mp3")} volume={0.6} />
              </Sequence>
            )}

            {turn.isMemeBreak && turn.memeType === "plot_twist" && (
              <Sequence from={turn.startFrame} durationInFrames={turn.durationFrames} name="plot_twist_sfx">
                <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.6} />
              </Sequence>
            )}

            {turn.isMemeBreak && turn.memeType === "emotional_damage" && (
              <Sequence from={turn.startFrame} durationInFrames={turn.durationFrames} name="emotional_damage_sfx">
                <Audio src={staticFile("sfx/fahhh.mp3")} volume={0.6} />
              </Sequence>
            )}

            {/* Main Dialogue Voice Clip (Only played if not a silent meme break!) */}
            {turn.audioSrc && (
              <Sequence
                from={turn.startFrame}
                durationInFrames={turn.durationFrames}
                name={turnKey}
              >
                <Audio src={staticFile(turn.audioSrc)} volume={1.0} />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}

      {/* Dramatic Elimination Pop & Get Out Meme SFX on Final Turn */}
      {turns.length > 0 && (
        <>
          <Sequence
            from={turns[turns.length - 1].startFrame + 60}
            durationInFrames={30}
            name="elimination_sfx"
          >
            <Audio src={staticFile("sfx/error.mp3")} volume={0.7} />
          </Sequence>
          <Sequence
            from={turns[turns.length - 1].startFrame + 75}
            durationInFrames={40}
            name="get_out_sfx"
          >
            <Audio src={staticFile("sfx/get-out.mp3")} volume={0.6} />
          </Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
