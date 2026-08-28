import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
  useCurrentFrame,
  Img,
  interpolate,
  spring,
} from "remotion";
import { ChatScript } from "../types";
import { DiscordLayout } from "./DiscordLayout";
import { DiscordMessage } from "./DiscordMessage";
import { TypingIndicator } from "./TypingIndicator";
import { DiscordCall } from "./DiscordCall";
import { GoogleSearchCutaway } from "./GoogleSearchCutaway";

const getEventTimeString = (eventIndex: number, script: ChatScript): string => {
  const evt = script.events[eventIndex] as any;
  if (evt && evt.timeString) return evt.timeString;
  if (evt && evt.time) return `Today at ${evt.time}`;

  // Base starting time: use script.startTime if provided, or derive a natural start time
  let baseHour = 4;
  let baseMinute = 18;
  let isPm = true;

  if (script.startTime) {
    const match = script.startTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      baseHour = parseInt(match[1], 10);
      baseMinute = parseInt(match[2], 10);
      if (match[3]) {
        isPm = match[3].toUpperCase() === "PM";
      }
    }
  } else {
    // Seed from character names and count so each episode has a unique natural start time
    const seed = script.characters.reduce((acc, c) => acc + c.name.charCodeAt(0), 0);
    baseHour = (seed % 9) + 1; // 1 to 9
    baseMinute = (seed * 7) % 50 + 10; // 10 to 59
    isPm = (seed % 2 === 0);
  }

  // Count how many message events have occurred up to this index
  let messageCount = 0;
  for (let i = 0; i <= eventIndex; i++) {
    if (script.events[i].type === "message") {
      messageCount++;
    }
  }

  // Advance time by 1 minute after every 4 messages
  const minutesToAdd = Math.floor(messageCount / 4);
  
  let totalMinutes = baseHour * 60 + baseMinute + minutesToAdd;
  let currentHour = Math.floor(totalMinutes / 60) % 12;
  if (currentHour === 0) currentHour = 12;
  let currentMinute = totalMinutes % 60;
  const minutePadded = currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;
  const ampm = isPm ? "PM" : "AM";

  return `Today at ${currentHour}:${minutePadded} ${ampm}`;
};

const calculateScale = (activeEvents: any[], script: ChatScript) => {
  if (activeEvents.length === 0) return 1;

  const firstEvent = activeEvents[0];
  let currentCharId = null;

  if (firstEvent.type === "message") {
    currentCharId = (script.events[firstEvent.eventIndex] as any).characterId;
  } else if (firstEvent.type === "typing") {
    const typingEvt = script.events[firstEvent.eventIndex] as any;
    if (typingEvt && typingEvt.characterId) currentCharId = typingEvt.characterId;
  }

  let estimatedMessageWidth = 150; // Minimum width

  if (currentCharId) {
    let startIndex = firstEvent.eventIndex;
    
    // Scan backwards to find block start
    while (startIndex > 0) {
      const prev = script.events[startIndex - 1] as any;
      if (prev.type === "cutaway" || prev.characterId !== currentCharId) break;
      startIndex--;
    }

    // Get the character for name length calculation
    const character = script.characters.find(c => c.id === currentCharId);
    
    // The name line (Name + Date) is roughly this wide:
    // Name (approx 9px per char) + Margin (8) + Date (approx 120px for "Today at 4:20 PM")
    const nameLineWidth = character ? (character.name.length * 9) + 128 : 128;

    let maxTextWidth = 0;

    // Scan forwards to find max line length in block
    for (let i = startIndex; i < script.events.length; i++) {
      const evt = script.events[i] as any;
      if (evt.type === "cutaway" || evt.characterId !== currentCharId) break;
      if (evt.type === "message" && evt.text) {
        const lines = evt.text.split("\n");
        for (const line of lines) {
          const textWidth = line.length * 9.5; // Safe estimate including emojis/caps
          if (textWidth > maxTextWidth) {
            maxTextWidth = textWidth;
          }
        }
      }
    }

    // The content width is the max of the name line or the text itself
    const contentWidth = Math.max(nameLineWidth, maxTextWidth);
    
    // Avatar (40) + Margins (16) + Content
    estimatedMessageWidth = 56 + contentWidth;
  }

  // Single word punch zooms (e.g. "what", "no", "🔥")
  if (estimatedMessageWidth < 220) return 8.5;
  if (estimatedMessageWidth < 300) return 6.0;
  if (estimatedMessageWidth < 450) return 4.2;
  if (estimatedMessageWidth < 650) return 3.0;
  if (estimatedMessageWidth < 900) return 2.2;
  if (estimatedMessageWidth < 1200) return 1.6;

  // For very long multi-line sentences, bound scale safely so it NEVER clips off screen (safe 1520px margin)
  return Math.min(1.3, 1520 / Math.max(estimatedMessageWidth, 1200));
};

export const ChatnemiMasterTemplate: React.FC<{ script: ChatScript }> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const charMap = useMemo(() => {
    return new Map(script.characters.map((c) => [c.id, c]));
  }, [script.characters]);

  // Build timeline
  const { events, sfxTracks } = useMemo(() => {
    let currentFrame = 0;
    const computedEvents: any[] = [];
    const computedSfx: any[] = [];

    script.events.forEach((evt, index) => {
      // 1. Initial Delay before this event
      if (evt.delaySeconds && evt.delaySeconds > 0) {
        currentFrame += Math.round(evt.delaySeconds * fps);
      }

      // 2. Typing Sequence (if requested)
      if (evt.type === "message" && evt.isTypingDuration && evt.isTypingDuration > 0) {
        const typingDurationFrames = Math.round(evt.isTypingDuration * fps);
        computedEvents.push({
          type: "typing",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + typingDurationFrames,
        });

        // Typing SFX loop
        computedSfx.push({
          file: "typing.mp3",
          startFrame: currentFrame,
          durationFrames: typingDurationFrames,
          volume: 0.4,
        });

        currentFrame += typingDurationFrames;
      }

      // 3. Main Event (Message or Cutaway)
      if (evt.type === "message") {
        // Calculate reading duration if not explicitly provided
        let msgDuration = evt.durationSeconds;
        if (!msgDuration) {
          const charLen = (evt.text || "").length;
          // Fast paced reading formula (0.8s base + 0.035s per char)
          msgDuration = Math.max(1.2, 0.8 + charLen * 0.035);
        }

        const msgDurationFrames = Math.round(msgDuration * fps);
        computedEvents.push({
          type: "message",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + msgDurationFrames,
        });

        // Message SFX (Ping, Vine boom, etc.)
        if (evt.sfx) {
          computedSfx.push({
            file: evt.sfx,
            startFrame: currentFrame,
            durationFrames: Math.round(2.5 * fps),
            volume: evt.sfx === "vine_boom.mp3" || evt.sfx === "fahhh.mp3" ? 0.9 : 0.6,
          });
        }

        currentFrame += msgDurationFrames;
      } else if (evt.type === "cutaway") {
        const cutawayDuration = evt.durationSeconds || 2.0;
        const cutawayDurationFrames = Math.round(cutawayDuration * fps);

        computedEvents.push({
          type: "cutaway",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + cutawayDurationFrames,
          durationFrames: cutawayDurationFrames,
        });

        // Cutaway SFX / Audio cue
        if (evt.sfx) {
          computedSfx.push({
            file: evt.sfx,
            startFrame: currentFrame,
            durationFrames: cutawayDurationFrames,
            volume: 0.8,
          });
        }

        currentFrame += cutawayDurationFrames;
      }
    });

    return { events: computedEvents, sfxTracks: computedSfx };
  }, [script, fps]);

  // Active event detection
  const activeEvents = events.filter(e => e.type !== "cutaway" && frame >= e.startFrame && frame < e.endFrame);
  const currentScale = calculateScale(activeEvents, script);

  // Dynamic Screen Shake & Punch Zoom calculation on punchy SFX
  let screenShakeX = 0;
  let screenShakeY = 0;
  let punchZoom = 1.0;

  for (const sfx of sfxTracks) {
    if (["vine_boom.mp3", "error.mp3", "fahhh.mp3", "brawl_hypercharge.mp3"].includes(sfx.file)) {
      const elapsed = frame - sfx.startFrame;
      if (elapsed >= 0 && elapsed <= 8) {
        const decay = (8 - elapsed) / 8;
        screenShakeX = Math.sin(elapsed * 2.5) * 6 * decay;
        screenShakeY = Math.cos(elapsed * 3.0) * 4 * decay;
        punchZoom = 1.0 + (0.04 * decay);
      }
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* BACKGROUND MUSIC */}
      {script.bgm && (
        <Audio
          src={staticFile(`project_chatnemi_assets/sounds/${script.bgm}`)}
          volume={(f) => {
            // Cut BGM completely during heavy cutaways or dramatic pauses
            const isCutawayActive = events.some(e => e.type === "cutaway" && f >= e.startFrame && f < e.endFrame);
            if (isCutawayActive) return 0.08;
            return 0.22;
          }}
          loop
        />
      )}

      {/* SOUND EFFECTS */}
      {sfxTracks.map((sfx, i) => (
        <Sequence
          key={`sfx-${i}`}
          from={sfx.startFrame}
          durationInFrames={sfx.durationFrames}
        >
          <Audio
            src={staticFile(`project_chatnemi_assets/sounds/${sfx.file}`)}
            volume={sfx.volume || 0.6}
          />
        </Sequence>
      ))}

      {/* DISCORD UI LAYER */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          opacity: activeEvents.length > 0 ? 1 : 0,
          transform: `translate(${screenShakeX}px, ${screenShakeY}px) scale(${punchZoom})`,
        }}
      >
        {/* Scaled Grey Band Container */}
        <div
          style={{
            transformOrigin: "80px center",
            transform: `scale(${currentScale})`,
            width: "100%",
            paddingLeft: 60,
            position: "relative",
            backgroundColor: "#36393f",
          }}
        >
          {/* Infinite Grey Extensions to prevent edges showing on scale/shift */}
          <div
            style={{
              position: "absolute",
              left: -10000,
              right: -10000,
              top: 0,
              bottom: 0,
              backgroundColor: "#36393f",
              zIndex: -1,
            }}
          />

          <DiscordLayout>
            {events.map((event, i) => {
              if (event.type === "cutaway") return null;
              if (frame < event.startFrame || frame >= event.endFrame) return null;

              const scriptEvent = script.events[event.eventIndex];
              if (!scriptEvent) return null;

              const character = charMap.get(scriptEvent.characterId);
              if (!character) return null;

              let isFirst = true;
              // Find previous message event
              for (let j = event.eventIndex - 1; j >= 0; j--) {
                const prevEvt = script.events[j];
                if (prevEvt.type === "cutaway") break;
                if (prevEvt.type === "message") {
                  if (prevEvt.characterId === scriptEvent.characterId) {
                    isFirst = false;
                  }
                  break;
                }
              }

              if (event.type === "typing") {
                return <TypingIndicator key={`ui-typing-${i}`} name={character.name} />;
              }

              if (event.type === "message") {
                const timeString = getEventTimeString(event.eventIndex, script);
                return (
                  <DiscordMessage
                    key={`ui-msg-${i}`}
                    character={character}
                    text={scriptEvent.text}
                    timeString={timeString}
                    isFirstMessageInGroup={isFirst}
                  />
                );
              }

              return null;
            })}
          </DiscordLayout>
        </div>
      </AbsoluteFill>

      {/* B-ROLL / CUTAWAY LAYER */}
      {events.map((event, i) => {
        if (event.type !== "cutaway") return null;
        if (frame < event.startFrame || frame >= event.endFrame) return null;

        const scriptEvent = script.events[event.eventIndex];
        if (scriptEvent.type !== "cutaway") return null;

        // 1. Google Search / Maps Reveal Cutaway
        if (scriptEvent.mediaUrl === "GOOGLE_SEARCH_SUPERCELL" || (scriptEvent.mediaUrl && scriptEvent.mediaUrl.startsWith("GOOGLE_SEARCH"))) {
          return (
            <AbsoluteFill key={`cutaway-google-${i}`} style={{ zIndex: 100 }}>
              <GoogleSearchCutaway
                searchQuery="Itämerenkatu 11-13, 00180 Helsinki, Finland"
                resultTitle="Supercell Headquarters"
                resultAddress="Itämerenkatu 11-13, 00180 Helsinki, Finland"
                resultCategory="Brawl Stars & Clash of Clans Creator"
              />
            </AbsoluteFill>
          );
        }

        // 2. Discord Voice Call Cutaway
        if (scriptEvent.mediaUrl && scriptEvent.mediaUrl.startsWith("DISCORD_CALL")) {
          const parts = scriptEvent.mediaUrl.split("_");
          const callerId = parts.length > 2 ? parts[2] : "Unknown";
          const caller = charMap.get(callerId);
          const callerName = caller ? caller.name : callerId;
          return (
            <AbsoluteFill key={`cutaway-call-${i}`} style={{ zIndex: 100 }}>
              <DiscordCall callerName={callerName} callerAvatarUrl={caller?.avatarUrl} callerId={callerId} />
            </AbsoluteFill>
          );
        }

        // 3. Image Cutaways
        const elapsed = frame - event.startFrame;
        const duration = event.durationFrames || 30;
        const effect = (scriptEvent as any).effect || (scriptEvent.fadeIn ? "fade" : "fade");

        // Fade in and out cleanly
        let opacity = 1;
        if (effect === "fade" || scriptEvent.fadeIn) {
          const fadeInOpacity = interpolate(elapsed, [0, 6], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const fadeOutOpacity = interpolate(elapsed, [Math.max(0, duration - 6), duration], [1, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          opacity = Math.min(fadeInOpacity, fadeOutOpacity);
        }

        // Scale animation based on effect
        let imageScale = 1.0;
        if (effect === "zoom" || effect === "slam") {
          const slam = spring({
            frame: elapsed,
            fps,
            config: { damping: 14, mass: 0.5, stiffness: 220 },
          });
          const entryScale = interpolate(slam, [0, 1], [1.1, 1.0], { extrapolateRight: "clamp" });
          const panZoom = interpolate(elapsed, [0, duration], [1.0, 1.04], { extrapolateRight: "clamp" });
          imageScale = entryScale * panZoom;
        }

        return (
          <AbsoluteFill
            key={`cutaway-${i}`}
            style={{
              backgroundColor: "black",
              opacity,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(`project_chatnemi_assets/images/${scriptEvent.mediaUrl}`)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `scale(${imageScale})`,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
