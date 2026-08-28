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

  let baseHour = 6;
  let baseMinute = 1;
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
  }

  let messageCount = 0;
  for (let i = 0; i <= eventIndex; i++) {
    if (script.events[i].type === "message") {
      messageCount++;
    }
  }

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
  if (activeEvents.length === 0) return 1.8;

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
    const nameLineWidth = character ? (character.name.length * 9) + 128 : 128;

    let maxTextWidth = 0;

    // Scan forwards to find max line length in block
    for (let i = startIndex; i < script.events.length; i++) {
      const evt = script.events[i] as any;
      if (evt.type === "cutaway" || evt.characterId !== currentCharId) break;
      if (evt.type === "message" && evt.text) {
        const lines = evt.text.split("\n");
        for (const line of lines) {
          const textWidth = line.length * 9.5;
          if (textWidth > maxTextWidth) {
            maxTextWidth = textWidth;
          }
        }
      }
    }

    const contentWidth = Math.max(nameLineWidth, maxTextWidth);
    estimatedMessageWidth = 56 + contentWidth;
  }
  
  // Dynamic scale calculation bounded safely to 1520px max horizontal width
  const scaleX = 1520 / Math.max(estimatedMessageWidth, 320);
  return Math.max(1.3, Math.min(2.8, scaleX));
};

export const ChatnemiMasterTemplate: React.FC<{ script: ChatScript }> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const charMap = useMemo(() => {
    return new Map(script.characters.map((c) => [c.id, c]));
  }, [script.characters]);

  // Build events timeline
  const { events, sfxTracks } = useMemo(() => {
    let currentFrame = 0;
    const computedEvents: any[] = [];
    const computedSfx: any[] = [];

    script.events.forEach((evt, index) => {
      // Delay before this event
      if (evt.delaySeconds && evt.delaySeconds > 0) {
        currentFrame += Math.round(evt.delaySeconds * fps);
      }

      // Typing sequence
      if (evt.type === "message" && evt.isTypingDuration && evt.isTypingDuration > 0) {
        const typingDurationFrames = Math.round(evt.isTypingDuration * fps);
        computedEvents.push({
          type: "typing",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + typingDurationFrames,
        });

        computedSfx.push({
          file: "typing.mp3",
          startFrame: currentFrame,
          durationFrames: typingDurationFrames,
          volume: 0.4,
        });

        currentFrame += typingDurationFrames;
      }

      // Message event
      if (evt.type === "message") {
        let msgDuration = evt.durationSeconds;
        if (!msgDuration) {
          const charLen = (evt.text || "").length;
          msgDuration = Math.max(2.0, 1.4 + charLen * 0.035);
        }
        const msgDurationFrames = Math.round(msgDuration * fps);

        computedEvents.push({
          type: "message",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + msgDurationFrames,
        });

        if (evt.sfx) {
          computedSfx.push({
            file: evt.sfx,
            startFrame: currentFrame,
            durationFrames: Math.round(2.5 * fps),
            volume: evt.sfx === "vine_boom.mp3" || evt.sfx === "fahhh.mp3" ? 0.9 : 0.65,
          });
        }

        currentFrame += msgDurationFrames;
      } else if (evt.type === "cutaway") {
        const cutawayDuration = evt.durationSeconds || 2.8;
        const cutawayDurationFrames = Math.round(cutawayDuration * fps);

        computedEvents.push({
          type: "cutaway",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + cutawayDurationFrames,
          durationFrames: cutawayDurationFrames,
        });

        if (evt.sfx) {
          computedSfx.push({
            file: evt.sfx,
            startFrame: currentFrame,
            durationFrames: cutawayDurationFrames,
            volume: 0.85,
          });
        }

        currentFrame += cutawayDurationFrames;
      }
    });

    return { events: computedEvents, sfxTracks: computedSfx };
  }, [script, fps]);

  // Find active cutaway
  const isCutawayActive = events.some(
    (e) => e.type === "cutaway" && frame >= e.startFrame && frame < e.endFrame
  );

  // Active non-cutaway events (maintain the most recent event during delay gaps to eliminate black screens)
  const activeEvents = useMemo(() => {
    // Currently active event in progress
    const active = events.filter(
      (e) => e.type !== "cutaway" && frame >= e.startFrame && frame < e.endFrame
    );
    if (active.length > 0) return active;

    // During delays, keep the previous non-cutaway event visible
    const previous = events.filter(
      (e) => e.type !== "cutaway" && frame >= e.startFrame
    );
    if (previous.length > 0) {
      return [previous[previous.length - 1]];
    }

    return events.filter((e) => e.type !== "cutaway").slice(0, 1);
  }, [events, frame]);

  const currentScale = calculateScale(activeEvents, script);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* BACKGROUND MUSIC */}
      {script.bgm && (
        <Audio
          src={staticFile(`project_chatnemi_assets/sounds/${script.bgm}`)}
          volume={() => (isCutawayActive ? 0.08 : 0.24)}
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

      {/* THE ICONIC DISCORD CENTER GREY BAND (ORIGINAL CHATNEMI LAYOUT) */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          opacity: isCutawayActive ? 0 : 1,
        }}
      >
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
          {/* Infinite Grey Extensions */}
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
            {activeEvents.map((event, i) => {
              const scriptEvent = script.events[event.eventIndex];
              if (!scriptEvent) return null;

              const character = charMap.get(scriptEvent.characterId);
              if (!character) return null;

              if (event.type === "typing") {
                return (
                  <TypingIndicator
                    key={`ui-typing-${i}-${event.eventIndex}`}
                    name={character.name}
                  />
                );
              }

              if (event.type === "message") {
                const timeString = getEventTimeString(event.eventIndex, script);
                return (
                  <DiscordMessage
                    key={`ui-msg-${i}-${event.eventIndex}`}
                    character={character}
                    text={scriptEvent.text}
                    timeString={timeString}
                  />
                );
              }

              return null;
            })}
          </DiscordLayout>
        </div>
      </AbsoluteFill>

      {/* CUTAWAYS LAYER (Google Search, Voice Calls, 3D Meme Images) */}
      {events.map((event, i) => {
        if (event.type !== "cutaway") return null;
        if (frame < event.startFrame || frame >= event.endFrame) return null;

        const scriptEvent = script.events[event.eventIndex];
        if (!scriptEvent || scriptEvent.type !== "cutaway") return null;

        // 1. Google Search / Maps Cutaway
        if (
          scriptEvent.mediaUrl === "GOOGLE_SEARCH_SUPERCELL" ||
          (scriptEvent.mediaUrl && scriptEvent.mediaUrl.startsWith("GOOGLE_SEARCH"))
        ) {
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
          return (
            <AbsoluteFill key={`cutaway-call-${i}`} style={{ zIndex: 100 }}>
              <DiscordCall
                callerName={caller?.name || callerId}
                callerAvatarUrl={caller?.avatarUrl}
                callerId={callerId}
              />
            </AbsoluteFill>
          );
        }

        // 3. 3D Image Cutaway
        const elapsed = frame - event.startFrame;
        const duration = event.durationFrames || 30;
        const slam = spring({
          frame: elapsed,
          fps,
          config: { damping: 14, mass: 0.5, stiffness: 220 },
        });
        const entryScale = interpolate(slam, [0, 1], [1.08, 1.0], {
          extrapolateRight: "clamp",
        });
        const panZoom = interpolate(elapsed, [0, duration], [1.0, 1.03], {
          extrapolateRight: "clamp",
        });

        return (
          <AbsoluteFill
            key={`cutaway-${i}`}
            style={{
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(
                `project_chatnemi_assets/images/${scriptEvent.mediaUrl}`
              )}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `scale(${entryScale * panZoom})`,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
