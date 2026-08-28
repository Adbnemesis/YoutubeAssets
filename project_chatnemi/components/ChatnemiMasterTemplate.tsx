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
  if (activeEvents.length === 0) return 2.0;

  const firstEvent = activeEvents[0];
  let currentCharId = null;

  if (firstEvent.type === "message") {
    currentCharId = (script.events[firstEvent.eventIndex] as any).characterId;
  } else if (firstEvent.type === "typing") {
    const typingEvt = script.events[firstEvent.eventIndex] as any;
    if (typingEvt && typingEvt.characterId) currentCharId = typingEvt.characterId;
  }

  let estimatedMessageWidth = 150;

  if (currentCharId) {
    let startIndex = firstEvent.eventIndex;
    while (startIndex > 0) {
      const prev = script.events[startIndex - 1] as any;
      if (prev.type === "cutaway" || prev.characterId !== currentCharId) break;
      startIndex--;
    }

    const character = script.characters.find((c) => c.id === currentCharId);
    const nameLineWidth = character ? character.name.length * 9 + 128 : 128;

    let maxTextWidth = 0;
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

  const scaleX = 1520 / Math.max(estimatedMessageWidth, 340);
  return Math.max(1.35, Math.min(2.6, scaleX));
};

export const ChatnemiMasterTemplate: React.FC<{ script: ChatScript }> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const charMap = useMemo(() => {
    return new Map(script.characters.map((c) => [c.id, c]));
  }, [script.characters]);

  // Build clean sequential timeline and multi-BGM segments
  const { timeline, sfxTracks, bgmSegments } = useMemo(() => {
    let currentFrame = 0;
    const items: {
      type: "typing" | "message" | "cutaway";
      eventIndex: number;
      startFrame: number;
      endFrame: number;
      durationFrames?: number;
      sfx?: string;
      effect?: string;
      characterId?: string;
    }[] = [];
    const computedSfx: any[] = [];
    const rawBgmSegments: { file: string; startFrame: number; endFrame: number; volume: number }[] = [];

    // Track active BGM file
    let currentBgmFile = script.bgm || "monkeys_spinning_monkeys.mp3";
    let currentBgmStartFrame = 0;

    script.events.forEach((evt, index) => {
      // Check if this event changes BGM
      if ((evt as any).bgm && (evt as any).bgm !== currentBgmFile) {
        if (currentFrame > currentBgmStartFrame) {
          rawBgmSegments.push({
            file: currentBgmFile,
            startFrame: currentBgmStartFrame,
            endFrame: currentFrame,
            volume: 0.22,
          });
        }
        currentBgmFile = (evt as any).bgm;
        currentBgmStartFrame = currentFrame;
      }

      if (evt.type === "cutaway") {
        if (evt.delaySeconds) {
          currentFrame += Math.round(evt.delaySeconds * fps);
        }
        const cutawayDurationFrames = Math.round((evt.durationSeconds || 2.5) * fps);
        items.push({
          type: "cutaway",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: currentFrame + cutawayDurationFrames,
          durationFrames: cutawayDurationFrames,
          sfx: evt.sfx,
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
      } else if (evt.type === "message") {
        if (evt.delaySeconds) {
          currentFrame += Math.round(evt.delaySeconds * fps);
        }

        if (evt.isTypingDuration && evt.isTypingDuration > 0) {
          const typingDurationFrames = Math.round(evt.isTypingDuration * fps);
          items.push({
            type: "typing",
            eventIndex: index,
            startFrame: currentFrame,
            endFrame: currentFrame + typingDurationFrames,
            durationFrames: typingDurationFrames,
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

        let msgDuration = evt.durationSeconds;
        if (!msgDuration) {
          const charLen = (evt.text || "").length;
          msgDuration = Math.max(1.8, 1.4 + charLen * 0.032);
        }
        const msgDurationFrames = Math.round(msgDuration * fps);

        items.push({
          type: "message",
          eventIndex: index,
          startFrame: currentFrame,
          endFrame: Infinity, // Resolved below
          durationFrames: msgDurationFrames,
          sfx: evt.sfx,
          effect: (evt as any).effect,
          characterId: evt.characterId,
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
      }
    });

    // Close the final BGM segment
    rawBgmSegments.push({
      file: currentBgmFile,
      startFrame: currentBgmStartFrame,
      endFrame: currentFrame + 60,
      volume: 0.22,
    });

    // Resolve endFrames: consecutive messages stay active together until a different speaker or cutaway
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === "message") {
        let nextDiffEvent = null;
        for (let j = i + 1; j < items.length; j++) {
          if (items[j].type === "cutaway") {
            nextDiffEvent = items[j];
            break;
          } else if (items[j].type === "message" || items[j].type === "typing") {
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
        } else if (i === items.length - 1) {
          items[i].endFrame = items[i].startFrame + (items[i].durationFrames || 60);
        }
      }
    }

    return { timeline: items, sfxTracks: computedSfx, bgmSegments: rawBgmSegments };
  }, [script, fps]);

  // Find active cutaway (if any)
  const activeCutaway = timeline.find(
    (t) => t.type === "cutaway" && frame >= t.startFrame && frame < t.endFrame
  );

  // Active non-cutaway events at current frame
  const activeEvents = useMemo(() => {
    // 1. Direct active events matching current frame window
    const active = timeline.filter(
      (e) => e.type !== "cutaway" && frame >= e.startFrame && frame < e.endFrame
    );
    if (active.length > 0) return active;

    // 2. Clean fallback: find the most recent event that started
    const started = timeline.filter((e) => frame >= e.startFrame);
    if (started.length > 0) {
      const last = started[started.length - 1];
      // If the last started event was a cutaway and it already ended, don't show old pre-cutaway speaker!
      if (last.type === "cutaway") {
        return [];
      }
      const lastCharId = last.characterId;
      if (lastCharId) {
        return timeline.filter(
          (e) =>
            e.type === "message" &&
            e.characterId === lastCharId &&
            frame >= e.startFrame &&
            frame < e.endFrame
        );
      }
    }

    return [];
  }, [timeline, frame]);

  const baseScale = calculateScale(activeEvents, script);

  // Smooth Cinematic Creep Zoom for dramatic / funny moments
  let creepZoom = 1.0;
  if (activeEvents.length > 0) {
    const primaryEvent = activeEvents[activeEvents.length - 1];
    const scriptEvt = script.events[primaryEvent.eventIndex] as any;
    const isDramatic =
      scriptEvt?.effect === "slow_zoom" ||
      (scriptEvt?.text &&
        (scriptEvt.text.includes("TNT") ||
          scriptEvt.text.includes("WANTED STARS") ||
          scriptEvt.text.includes("blood type") ||
          scriptEvt.text.includes("source code")));

    if (isDramatic && primaryEvent.durationFrames) {
      const elapsed = Math.max(0, frame - primaryEvent.startFrame);
      const progress = Math.min(1.0, elapsed / primaryEvent.durationFrames);
      // Smooth sinusoidal ease-in-out
      creepZoom = 1.0 + 0.08 * (1 - Math.cos(progress * Math.PI)) / 2;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* MULTI-BGM AUDIO TRACKS (DYNAMIC MOOD TRANSITIONS) */}
      {bgmSegments.map((bgmSeg, idx) => (
        <Sequence
          key={`bgm-seg-${idx}`}
          from={bgmSeg.startFrame}
          durationInFrames={Math.max(1, bgmSeg.endFrame - bgmSeg.startFrame)}
        >
          <Audio
            src={staticFile(`project_chatnemi_assets/sounds/${bgmSeg.file}`)}
            volume={(f) => {
              const globalFrame = bgmSeg.startFrame + f;
              const isCutaway = timeline.some(
                (t) => t.type === "cutaway" && globalFrame >= t.startFrame && globalFrame < t.endFrame
              );
              if (isCutaway) return 0.06;
              // Smooth 15-frame fade in / fade out
              const fadeIn = interpolate(f, [0, 15], [0, bgmSeg.volume], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const remaining = (bgmSeg.endFrame - bgmSeg.startFrame) - f;
              const fadeOut = interpolate(remaining, [0, 15], [0, bgmSeg.volume], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return Math.min(fadeIn, fadeOut);
            }}
            loop
          />
        </Sequence>
      ))}

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
          opacity: activeCutaway || activeEvents.length === 0 ? 0 : 1,
        }}
      >
        <div
          style={{
            transformOrigin: "80px center",
            transform: `scale(${baseScale * creepZoom})`,
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
              if (event.type === "typing") {
                const scriptEvent = script.events[event.eventIndex];
                const character = charMap.get(scriptEvent.characterId);
                if (!character) return null;
                return (
                  <TypingIndicator
                    key={`ui-typing-${i}-${event.eventIndex}`}
                    name={character.name}
                  />
                );
              }

              if (event.type === "message") {
                const scriptEvent = script.events[event.eventIndex];
                if (!scriptEvent) return null;

                const character = charMap.get(scriptEvent.characterId);
                if (!character) return null;

                // Group consecutive messages: Only show avatar on first message of the block
                let isFirst = true;
                for (let j = 0; j < i; j++) {
                  if (activeEvents[j].type === "message") {
                    const prevCharId = (
                      script.events[activeEvents[j].eventIndex] as any
                    ).characterId;
                    if (prevCharId === scriptEvent.characterId) {
                      isFirst = false;
                      break;
                    }
                  }
                }

                const timeString = getEventTimeString(event.eventIndex, script);
                return (
                  <DiscordMessage
                    key={`ui-msg-${i}-${event.eventIndex}`}
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

      {/* CUTAWAYS LAYER (Google Search, Voice Calls, 3D Meme Images) */}
      {timeline.map((event, i) => {
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
