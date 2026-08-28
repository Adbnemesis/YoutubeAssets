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

export const ChatnemiMasterTemplate: React.FC<{ script: ChatScript }> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const charMap = useMemo(() => {
    return new Map(script.characters.map((c) => [c.id, c]));
  }, [script.characters]);

  // Build the complete timeline with comfortable, readable pacing (2:00 - 2:30 min target)
  const { timeline, sfxTracks } = useMemo(() => {
    let currentFrame = 0;
    const computedTimeline: any[] = [];
    const computedSfx: any[] = [];

    script.events.forEach((evt, index) => {
      // Delay before this event
      if (evt.delaySeconds && evt.delaySeconds > 0) {
        currentFrame += Math.round(evt.delaySeconds * fps);
      }

      // Typing phase (0.6s to 1.0s)
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

      // Message phase (comfortable 1.8s to 2.8s reading time)
      if (evt.type === "message") {
        let msgDuration = evt.durationSeconds;
        if (!msgDuration) {
          const charLen = (evt.text || "").length;
          // Natural reading pacing formula
          msgDuration = Math.max(1.8, 1.4 + charLen * 0.032);
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
            volume: evt.sfx === "vine_boom.mp3" || evt.sfx === "fahhh.mp3" ? 0.9 : 0.65,
          });
        }

        currentFrame += msgDurationFrames;
      } else if (evt.type === "cutaway") {
        const cutawayDuration = evt.durationSeconds || 2.5;
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
            volume: 0.85,
          });
        }

        currentFrame += cutawayDurationFrames;
      }
    });

    return { timeline: computedTimeline, sfxTracks: computedSfx };
  }, [script, fps]);

  // Find active cutaway (if any)
  const activeCutaway = timeline.find(
    (t) => t.type === "cutaway" && frame >= t.startFrame && frame < t.endFrame
  );

  // Find all messages and events that have started up to the current frame
  const visibleMessages = useMemo(() => {
    // Collect all message events that started on or before current frame
    const pastMessages = timeline.filter(
      (t) => t.type === "message" && frame >= t.startFrame
    );

    // Active typing event (if currently typing)
    const activeTyping = timeline.find(
      (t) => t.type === "typing" && frame >= t.startFrame && frame < t.endFrame
    );

    // Keep the latest 4 messages for a natural Discord chat feed
    const recentMessages = pastMessages.slice(-4);

    const items: any[] = recentMessages.map((m) => ({
      type: "message",
      eventIndex: m.eventIndex,
      characterId: m.characterId,
      text: m.text,
      startFrame: m.startFrame,
    }));

    if (activeTyping) {
      items.push({
        type: "typing",
        eventIndex: activeTyping.eventIndex,
        characterId: activeTyping.characterId,
        startFrame: activeTyping.startFrame,
      });
    }

    return items;
  }, [timeline, frame]);

  // STABLE, CONSISTENT SCALE (No dizzying random zoom jumps!)
  const stableScale = 1.35;

  // Subtle punch zoom on heavy impact SFX
  let screenShakeX = 0;
  let screenShakeY = 0;
  let punchZoom = 1.0;

  for (const sfx of sfxTracks) {
    if (["vine_boom.mp3", "error.mp3", "fahhh.mp3", "brawl_hypercharge.mp3"].includes(sfx.file)) {
      const elapsed = frame - sfx.startFrame;
      if (elapsed >= 0 && elapsed <= 8) {
        const decay = (8 - elapsed) / 8;
        screenShakeX = Math.sin(elapsed * 2.5) * 4 * decay;
        screenShakeY = Math.cos(elapsed * 3.0) * 3 * decay;
        punchZoom = 1.0 + 0.02 * decay;
      }
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#313338", overflow: "hidden" }}>
      {/* BACKGROUND MUSIC */}
      {script.bgm && (
        <Audio
          src={staticFile(`project_chatnemi_assets/sounds/${script.bgm}`)}
          volume={() => (activeCutaway ? 0.08 : 0.22)}
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

      {/* DISCORD UI LAYER (STABLE 1.35x FRAMING, REAL-TIME ACCUMULATING CHAT) */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 80,
          paddingRight: 80,
          backgroundColor: "#313338",
          opacity: activeCutaway ? 0 : 1,
          transform: `translate(${screenShakeX}px, ${screenShakeY}px) scale(${punchZoom})`,
        }}
      >
        {/* Discord Header Bar */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid #232428",
            paddingBottom: 16,
            width: "calc(100% - 160px)",
          }}
        >
          <span style={{ fontSize: 28, color: "#80848e" }}>#</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#f2f3f5" }}>general-chat</span>
          <span style={{ fontSize: 16, color: "#949ba4", marginLeft: 16 }}>| Brawl Stars Starr Park Official</span>
        </div>

        {/* Discord Messages Feed */}
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            transform: `scale(${stableScale})`,
            transformOrigin: "left center",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {visibleMessages.map((item, idx) => {
            const character = charMap.get(item.characterId);
            if (!character) return null;

            if (item.type === "typing") {
              return (
                <TypingIndicator
                  key={`typing-${item.eventIndex}`}
                  name={character.name}
                />
              );
            }

            const timeString = getEventTimeString(item.eventIndex, script);
            return (
              <DiscordMessage
                key={`msg-${item.eventIndex}`}
                character={character}
                text={item.text}
                timeString={timeString}
              />
            );
          })}
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
              const entryScale = interpolate(slam, [0, 1], [1.08, 1.0], {
                extrapolateRight: "clamp",
              });
              const panZoom = interpolate(elapsed, [0, duration], [1.0, 1.03], {
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
