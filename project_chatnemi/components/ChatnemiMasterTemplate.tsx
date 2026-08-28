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

  const minutesToAdd = Math.floor(messageCount / 3);
  let totalMinutes = baseHour * 60 + baseMinute + minutesToAdd;
  let currentHour = Math.floor(totalMinutes / 60) % 12;
  if (currentHour === 0) currentHour = 12;
  let currentMinute = totalMinutes % 60;
  const minutePadded = currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;
  const ampm = isPm ? "PM" : "AM";

  return `Today at ${currentHour}:${minutePadded} ${ampm}`;
};

export const ChatnemiMasterTemplate: React.FC<{ script: ChatScript }> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const charMap = useMemo(() => {
    return new Map(script.characters.map((c) => [c.id, c]));
  }, [script.characters]);

  // Build the timeline sequentially without dead gaps
  const { timeline, sfxTracks } = useMemo(() => {
    let currentFrame = 0;
    const computedTimeline: any[] = [];
    const computedSfx: any[] = [];

    script.events.forEach((evt, index) => {
      // Delay before this event starts (previous message stays on screen during this time)
      if (evt.delaySeconds && evt.delaySeconds > 0) {
        currentFrame += Math.round(evt.delaySeconds * fps);
      }

      // Typing phase
      if (evt.type === "message" && evt.isTypingDuration && evt.isTypingDuration > 0) {
        const typingDurationFrames = Math.round(evt.isTypingDuration * fps);
        computedTimeline.push({
          type: "typing",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + typingDurationFrames,
          characterId: evt.characterId,
        });

        computedSfx.push({
          file: "typing.mp3",
          startFrame: currentFrame,
          durationFrames: typingDurationFrames,
          volume: 0.4,
        });

        currentFrame += typingDurationFrames;
      }

      // Message / Cutaway phase
      if (evt.type === "message") {
        let msgDuration = evt.durationSeconds;
        if (!msgDuration) {
          const charLen = (evt.text || "").length;
          msgDuration = Math.max(1.4, 0.9 + charLen * 0.038);
        }
        const msgDurationFrames = Math.round(msgDuration * fps);

        computedTimeline.push({
          type: "message",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + msgDurationFrames,
          characterId: evt.characterId,
          text: evt.text,
        });

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

        computedTimeline.push({
          type: "cutaway",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + cutawayDurationFrames,
          mediaUrl: evt.mediaUrl,
          effect: (evt as any).effect || "zoom",
        });

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

    return { timeline: computedTimeline, sfxTracks: computedSfx };
  }, [script, fps]);

  // Find what is happening at current frame
  const activeCutaway = timeline.find(
    (t) => t.type === "cutaway" && frame >= t.startFrame && frame < t.endFrame
  );

  // Find the currently active or most recently completed non-cutaway event
  const currentEvent = useMemo(() => {
    // Check if an event is actively in progress
    const active = timeline.find((t) => t.type !== "cutaway" && frame >= t.startFrame && frame < t.endFrame);
    if (active) return active;

    // Otherwise, find the last event that already started before this frame
    const started = timeline.filter((t) => t.type !== "cutaway" && frame >= t.startFrame);
    if (started.length > 0) return started[started.length - 1];

    // Fallback to first non-cutaway event
    return timeline.find((t) => t.type !== "cutaway") || null;
  }, [timeline, frame]);

  // Determine what messages to display on screen (show current message and previous context)
  const displayedMessages = useMemo(() => {
    if (!currentEvent) return [];

    const currentIndex = currentEvent.eventIndex;
    const items: any[] = [];

    // Find the latest message event up to currentEvent
    let latestMsgIndex = currentIndex;
    if (currentEvent.type === "typing") {
      // If typing, find the message before this typing event
      latestMsgIndex = currentIndex - 1;
    }

    // Include the active message (or previous message if typing)
    if (latestMsgIndex >= 0 && latestMsgIndex < script.events.length) {
      const evt = script.events[latestMsgIndex];
      if (evt.type === "message") {
        items.push({
          type: "message",
          eventIndex: latestMsgIndex,
          characterId: evt.characterId,
          text: evt.text,
        });
      }
    }

    // If currently typing, append typing indicator below
    if (currentEvent.type === "typing") {
      items.push({
        type: "typing",
        eventIndex: currentEvent.eventIndex,
        characterId: currentEvent.characterId,
      });
    }

    return items;
  }, [currentEvent, script.events]);

  // Dynamic Scale calculation based on current message text length
  const currentScale = useMemo(() => {
    if (!currentEvent || currentEvent.type === "cutaway") return 2.2;
    
    let text = "";
    if (currentEvent.type === "message") {
      text = currentEvent.text || "";
    } else {
      const char = charMap.get(currentEvent.characterId);
      text = `${char?.name || ""} is typing...`;
    }

    const lines = text.split("\n");
    let maxLineLen = 0;
    for (const l of lines) {
      if (l.length > maxLineLen) maxLineLen = l.length;
    }

    const estimatedWidth = 56 + Math.max(160, maxLineLen * 10);

    if (estimatedWidth < 220) return 7.5;
    if (estimatedWidth < 320) return 5.5;
    if (estimatedWidth < 460) return 4.0;
    if (estimatedWidth < 650) return 2.8;
    if (estimatedWidth < 900) return 2.1;
    if (estimatedWidth < 1200) return 1.6;
    return Math.min(1.3, 1500 / Math.max(estimatedWidth, 1200));
  }, [currentEvent, charMap]);

  // Screen shake calculation on impact SFX
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
        punchZoom = 1.0 + 0.04 * decay;
      }
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* BACKGROUND MUSIC */}
      {script.bgm && (
        <Audio
          src={staticFile(`project_chatnemi_assets/sounds/${script.bgm}`)}
          volume={() => (activeCutaway ? 0.08 : 0.24)}
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

      {/* DISCORD UI LAYER (ALWAYS 100% VISIBLE, NEVER GOES BLACK) */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          opacity: activeCutaway ? 0 : 1,
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
            {displayedMessages.map((item, idx) => {
              const character = charMap.get(item.characterId);
              if (!character) return null;

              if (item.type === "typing") {
                return (
                  <TypingIndicator
                    key={`typing-${idx}-${item.eventIndex}`}
                    name={character.name}
                  />
                );
              }

              const timeString = getEventTimeString(item.eventIndex, script);
              return (
                <DiscordMessage
                  key={`msg-${idx}-${item.eventIndex}`}
                  character={character}
                  text={item.text}
                  timeString={timeString}
                />
              );
            })}
          </DiscordLayout>
        </div>
      </AbsoluteFill>

      {/* CUTAWAYS / OVERLAYS (Google Search, Voice Calls, 3D Images) */}
      {activeCutaway && (
        <AbsoluteFill key={`cutaway-active-${activeCutaway.eventIndex}`} style={{ zIndex: 100 }}>
          {/* 1. Google Search / Maps Reveal Cutaway */}
          {activeCutaway.mediaUrl === "GOOGLE_SEARCH_SUPERCELL" ||
          activeCutaway.mediaUrl.startsWith("GOOGLE_SEARCH") ? (
            <GoogleSearchCutaway
              searchQuery="Itämerenkatu 11-13, 00180 Helsinki, Finland"
              resultTitle="Supercell Headquarters"
              resultAddress="Itämerenkatu 11-13, 00180 Helsinki, Finland"
              resultCategory="Brawl Stars & Clash of Clans Creator"
            />
          ) : activeCutaway.mediaUrl.startsWith("DISCORD_CALL") ? (
            /* 2. Discord Voice Call Cutaway */
            (() => {
              const parts = activeCutaway.mediaUrl.split("_");
              const callerId = parts.length > 2 ? parts[2] : "Unknown";
              const caller = charMap.get(callerId);
              return (
                <DiscordCall
                  callerName={caller?.name || callerId}
                  callerAvatarUrl={caller?.avatarUrl}
                  callerId={callerId}
                />
              );
            })()
          ) : (
            /* 3. 3D Image Cutaway */
            (() => {
              const elapsed = frame - activeCutaway.startFrame;
              const duration = activeCutaway.endFrame - activeCutaway.startFrame;
              const slam = spring({
                frame: elapsed,
                fps,
                config: { damping: 14, mass: 0.5, stiffness: 220 },
              });
              const entryScale = interpolate(slam, [0, 1], [1.1, 1.0], {
                extrapolateRight: "clamp",
              });
              const panZoom = interpolate(elapsed, [0, duration], [1.0, 1.04], {
                extrapolateRight: "clamp",
              });

              return (
                <AbsoluteFill
                  style={{
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={staticFile(
                      `project_chatnemi_assets/images/${activeCutaway.mediaUrl}`
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
            })()
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
