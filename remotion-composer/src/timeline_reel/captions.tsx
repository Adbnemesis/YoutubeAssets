import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { FONT_DISPLAY, FPS, TENSION, WordTimestamp, ZONES } from "./types";

/**
 * Pure Cinematic Floating Kinetic Typography.
 * NO boxes, NO borders, NO rectangular backgrounds.
 * Clean, high-contrast floating typography with glowing active-word pop.
 */
export const Captions: React.FC<{
    vo: string;
    words?: WordTimestamp[];
    beatDurationSec: number;
    relief?: boolean;
}> = ({ vo, words, beatDurationSec, relief = false }) => {
    const frame = useCurrentFrame();
    const currentSec = frame / FPS;

    const wordList = useMemo(() => {
        if (words && words.length > 0) return words;
        const raw = vo.split(" ").filter((w) => w.length > 0);
        const durPerWord = beatDurationSec / raw.length;
        return raw.map((w, i) => ({
            word: w,
            start: i * durPerWord,
            end: (i + 1) * durPerWord,
        }));
    }, [vo, words, beatDurationSec]);

    // Find exact active word index
    let activeIndex = wordList.findIndex(
        (w) => currentSec >= w.start && currentSec <= w.end
    );
    if (activeIndex === -1) {
        if (currentSec < wordList[0].start) {
            activeIndex = 0;
        } else {
            for (let i = wordList.length - 1; i >= 0; i--) {
                if (currentSec >= wordList[i].start) {
                    activeIndex = i;
                    break;
                }
            }
        }
    }
    activeIndex = Math.max(0, Math.min(wordList.length - 1, activeIndex));

    // Display chunks of 3 words
    const CHUNK_SIZE = 3;
    const chunkIndex = Math.floor(activeIndex / CHUNK_SIZE);
    const currentChunk = wordList.slice(
        chunkIndex * CHUNK_SIZE,
        (chunkIndex + 1) * CHUNK_SIZE
    );
    const activeWordInChunk = activeIndex % CHUNK_SIZE;

    const activeColor = relief ? "#FFD666" : TENSION.accent;
    const glowColor = relief ? "rgba(255, 214, 102, 0.85)" : "rgba(255, 122, 24, 0.85)";

    return (
        <div
            style={{
                position: "absolute",
                bottom: ZONES.captionBottom - 30,
                left: 40,
                right: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
                zIndex: 50,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "14px 24px",
                }}
            >
                {currentChunk.map((item, i) => {
                    const isCurrent = i === activeWordInChunk;
                    const isPast = i < activeWordInChunk;

                    return (
                        <span
                            key={`${chunkIndex}-${i}`}
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 90,
                                fontWeight: 900,
                                lineHeight: 1.05,
                                letterSpacing: -0.5,
                                color: isCurrent ? activeColor : isPast ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                                transform: isCurrent ? "scale(1.14)" : "scale(1)",
                                display: "inline-block",
                                WebkitTextStroke: "5px rgba(0, 8, 14, 0.98)",
                                paintOrder: "stroke fill",
                                textShadow: isCurrent
                                    ? `0 0 35px ${glowColor}, 0 8px 25px rgba(0,0,0,0.95)`
                                    : "0 6px 20px rgba(0,0,0,0.95)",
                                transition: "transform 0.08s ease, color 0.08s ease",
                            }}
                        >
                            {item.word}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};
