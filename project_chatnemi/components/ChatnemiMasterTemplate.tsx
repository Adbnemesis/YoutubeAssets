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

    // Scan forwards to find max length in block
    for (let i = startIndex; i < script.events.length; i++) {
      const evt = script.events[i] as any;
      if (evt.type === "cutaway" || evt.characterId !== currentCharId) break;
      if (evt.type === "message" && evt.text) {
        // Average char width in 16px Whitney font is around 8px, not 14px!
        const textWidth = evt.text.length * 8; 
        if (textWidth > maxTextWidth) {
          maxTextWidth = textWidth;
        }
      }
    }

    // The content width is the max of the name line or the text itself
    const contentWidth = Math.max(nameLineWidth, maxTextWidth);
    
    // Avatar (40) + Margins (16) + Content
    estimatedMessageWidth = 56 + contentWidth;
  }
  
  // We scale from X=80 (center of avatar).
  // Distance from origin to end of text is approx estimatedMessageWidth.
  // We want this distance, after scaling, to reach near the right edge (1800 - 80 = 1720).
  const finalScale = 1720 / estimatedMessageWidth;
  
  // Allow massive zoom-ins for short text like Beluga (e.g. 10x-15x for "hi")
  return Math.max(1.5, Math.min(finalScale, 15));
};

export const ChatnemiMasterTemplate: React.FC<{ script: ChatScript }> = ({
  script,
}) => {
  const { fps } = useVideoConfig();

  // Pre-calculate the exact frame when each event should appear
  const events = useMemo(() => {
    let currentFrame = 0;
    const items: {
      type: "typing" | "message" | "cutaway";
      eventIndex: number;
      startFrame: number;
      endFrame: number;
      durationFrames?: number;
      sfx?: string;
    }[] = [];

    script.events.forEach((evt, index) => {
      if (evt.type === "cutaway") {
        const cutawayDurationFrames = Math.round(evt.durationSeconds * fps);
        items.push({
          type: "cutaway",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + cutawayDurationFrames,
          durationFrames: cutawayDurationFrames,
          sfx: evt.sfx,
        });
        currentFrame += cutawayDurationFrames;
      } else if (evt.type === "message") {
        currentFrame += Math.round(evt.delaySeconds * fps);

        if (evt.isTypingDuration && evt.isTypingDuration > 0) {
          const typingDurationFrames = Math.round(evt.isTypingDuration * fps);
          items.push({
            type: "typing",
            eventIndex: index,
            startFrame: currentFrame,
            endFrame: currentFrame + typingDurationFrames,
            durationFrames: typingDurationFrames,
          });
          currentFrame += typingDurationFrames;
        }

        items.push({
          type: "message",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: Infinity,
          sfx: evt.sfx,
        });
      }
    });

    // Set endFrames for messages so they disappear when a DIFFERENT character starts their turn or a cutaway happens
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === "message") {
        let nextDiffEvent = null;
        for (let j = i + 1; j < items.length; j++) {
          if (items[j].type === "cutaway") {
             nextDiffEvent = items[j];
             break;
          } else if (items[j].type === "message") {
            const charId = (script.events[items[j].eventIndex] as any).characterId;
            const myCharId = (script.events[items[i].eventIndex] as any).characterId;
            if (charId !== myCharId) {
              nextDiffEvent = items[j];
              break;
            }
          }
        }
        
        if (nextDiffEvent) {
          items[i].endFrame = nextDiffEvent.startFrame;
        }
      }
    }

    return items;
  }, [script, fps]);

  const charMap = useMemo(() => {
    const map = new Map();
    script.characters.forEach((c) => map.set(c.id, c));
    return map;
  }, [script]);

  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* GLOBAL BGM LAYER */}
      {script.bgm && (
        <Audio
          src={staticFile(`project_chatnemi_assets/sounds/${script.bgm}`)}
          volume={0.15}
          loop
        />
      )}

      {/* AUDIO LAYER */}
      {events.map((event, i) => {
        if (event.type === "typing") {
          return (
            <Sequence
              key={`audio-typing-${i}`}
              from={event.startFrame}
              layout="none"
              durationInFrames={event.durationFrames}
            >
              <Audio
                src={staticFile(`project_chatnemi_assets/sounds/typing.mp3`)}
                volume={0.5}
              />
            </Sequence>
          );
        }

        if (event.sfx) {
          return (
            <Sequence
              key={`audio-sfx-${i}`}
              from={event.startFrame}
              layout="none"
            >
              <Audio
                src={staticFile(`project_chatnemi_assets/sounds/${event.sfx}`)}
              />
            </Sequence>
          );
        }

        return null;
      })}

      {/* DISCORD UI LAYER */}
      <AbsoluteFill style={{
          justifyContent: "center", // Center vertically
      }}>
        {/* Scaled Grey Band Container */}
        <div style={{
           transformOrigin: "80px center", // Scale exactly from the center of the avatar (paddingLeft 60 + 20px half avatar)
           transform: `scale(${calculateScale(
            events.filter(e => e.type !== "cutaway" && frame >= e.startFrame && frame < e.endFrame),
            script
          )})`,
           width: "100%", // 1920px base width
           paddingLeft: 60, // Place avatar 60px from the left before scaling
           position: "relative",
           backgroundColor: "#36393f",
        }}>
          {/* Infinite Grey Extensions to prevent edges showing on scale/shift */}
          <div style={{
             position: "absolute",
             left: -10000,
             right: -10000,
             top: 0,
             bottom: 0,
             backgroundColor: "#36393f",
             zIndex: -1,
          }} />

          <DiscordLayout>
          {events.map((event, i) => {
            if (event.type === "cutaway") return null;
            if (frame < event.startFrame || frame >= event.endFrame) return null;

            const scriptEvent = script.events[event.eventIndex];
            if (scriptEvent.type !== "message") return null;

            const character = charMap.get(scriptEvent.characterId);
            if (!character) return null;

            let isFirst = true;
            // Find previous message event
            for (let j = event.eventIndex - 1; j >= 0; j--) {
                const prevEvt = script.events[j];
                if (prevEvt.type === "cutaway") break; // Cutaway breaks the group
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
              return (
                <DiscordMessage
                  key={`ui-msg-${i}`}
                  character={character}
                  text={scriptEvent.text}
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

        const opacity = scriptEvent.fadeIn
          ? interpolate(
              frame - event.startFrame,
              [0, 15], // Fade in over 15 frames (~0.5s)
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            )
          : 1;

        if (scriptEvent.mediaUrl && scriptEvent.mediaUrl.startsWith("DISCORD_CALL")) {
          const parts = scriptEvent.mediaUrl.split("_");
          const callerId = parts.length > 2 ? parts[2] : "Unknown";
          const caller = charMap.get(callerId);
          const callerName = caller ? caller.name : callerId;
          return (
            <AbsoluteFill
              key={`cutaway-${i}`}
              style={{ zIndex: 100 }}
            >
              <DiscordCall callerName={callerName} callerAvatarUrl={caller?.avatarUrl} callerId={callerId} />
            </AbsoluteFill>
          );
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
              zIndex: 100, // Always on top
            }}
          >
             <Img 
                src={staticFile(`project_chatnemi_assets/images/${scriptEvent.mediaUrl}`)} 
                style={{ width: "100%", height: "100%", objectFit: "contain" }} 
             />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
