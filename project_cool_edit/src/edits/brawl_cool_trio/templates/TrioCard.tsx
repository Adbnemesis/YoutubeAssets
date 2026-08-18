import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, OffthreadVideo as Video, staticFile, random } from "remotion";
import { GifFrames } from "../../../legacy/GifFrames";

interface BrawlerGifMetadata {
  base: string;
  frameCount: number;
  gifFps: number;
}

const BRAWLER_GIF_MAP: Record<string, BrawlerGifMetadata> = {
  "brawler_gifs/surge_win.gif": { base: "brawler_gif_frames/surge", frameCount: 97, gifFps: 24 },
  "brawler_gifs/max_win.gif": { base: "brawler_gif_frames/max", frameCount: 143, gifFps: 24 },
  "brawler_gifs/meg_win.gif": { base: "brawler_gif_frames/meg", frameCount: 149, gifFps: 24 },
  "brawler_gifs/edgar_win.gif": { base: "brawler_gif_frames/edgar", frameCount: 121, gifFps: 24 },
  "brawler_gifs/mortis_win.gif": { base: "brawler_gif_frames/mortis", frameCount: 76, gifFps: 24 },
  "brawler_gifs/kenji_win.gif": { base: "brawler_gif_frames/kenji", frameCount: 360, gifFps: 24 },
  "brawler_gifs/crow_win.gif": { base: "brawler_gif_frames/crow", frameCount: 117, gifFps: 24 },
  "brawler_gifs/leon_win.gif": { base: "brawler_gif_frames/leon", frameCount: 74, gifFps: 24 },
  "brawler_gifs/tara_win.gif": { base: "brawler_gif_frames/tara", frameCount: 64, gifFps: 24 },
  "brawler_gifs/bibi_win.gif": { base: "brawler_gif_frames/bibi", frameCount: 153, gifFps: 24 },
  "brawler_gifs/frank_win.gif": { base: "brawler_gif_frames/frank", frameCount: 12, gifFps: 10 },
  "brawler_gifs/hank_win.gif": { base: "brawler_gif_frames/hank", frameCount: 249, gifFps: 24 },
  "brawler_gifs/kaze_win.gif": { base: "brawler_gif_frames/kaze", frameCount: 500, gifFps: 24 },
};

export interface TrioImage {
  src: string;
  auraColor?: string;
  isSilhouette?: boolean;
  silhouetteColor?: string;
  videoStartFrame?: number;
  zoomDirection?: "in" | "out";
}

export type TrioLayout = "trio" | "pair" | "single";

export type VisualEffect = "glitch" | "heavy_glitch" | "rgb_shift" | "sustained_rgb_shift" | "dark_fade" | "flash";

export interface TrioCard {
  startTime: number;
  endTime: number;
  layout: TrioLayout;
  images: TrioImage[];
  backgroundImage?: string;
  text?: string;
  textPosition?: "bottom" | "center";
  tint?: string;
  effects?: VisualEffect[];
}

// Solid-color silhouette that slides up from the bottom over the card duration.
const SilhouetteImg: React.FC<{
  src: string;
  color: string;
  videoStartFrame?: number;
  durationFrames: number;
  style: React.CSSProperties;
}> = ({ src, color, videoStartFrame, durationFrames, style }) => {
  const frame = useCurrentFrame();
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
  const gifMeta = BRAWLER_GIF_MAP[src];
  const isGifSequence = !!gifMeta;

  // Deterministic slide: bottom (1080) -> top (0) across the whole card
  const slideY = interpolate(frame, [0, durationFrames], [1080, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "translateX(-5000px)",
    filter: `drop-shadow(5000px 0 0 ${color})`,
  };
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", ...style, transform: `translateY(${slideY}px)` }}>
      {isVideo ? (
        <Video src={staticFile(src)} startFrom={videoStartFrame || 0} style={{ ...mediaStyle, filter: `drop-shadow(5000px 0 0 ${color}) contrast(1.15) saturate(1.2)` }} />
      ) : isGifSequence ? (
        <GifFrames
          base={gifMeta.base}
          frameCount={gifMeta.frameCount}
          gifFps={gifMeta.gifFps}
          startFrom={videoStartFrame || 0}
          style={{ ...mediaStyle, filter: `drop-shadow(5000px 0 0 ${color}) contrast(1.15) saturate(1.2)` }}
        />
      ) : (
        <Img src={staticFile(src)} style={{ ...mediaStyle, filter: `drop-shadow(5000px 0 0 ${color}) contrast(1.15) saturate(1.2)` }} />
      )}
    </div>
  );
};

const MediaImg: React.FC<{ src: string; auraColor?: string; videoStartFrame?: number; contain?: boolean; zoomDirection?: "in" | "out" }> = ({
  src,
  auraColor,
  videoStartFrame,
  contain,
  zoomDirection = "out",
}) => {
  const frame = useCurrentFrame();
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
  const gifMeta = BRAWLER_GIF_MAP[src];
  const isGifSequence = !!gifMeta;

  const panX = interpolate(frame, [0, 30], [0, 8], { extrapolateRight: "clamp" });
  const panY = interpolate(frame, [0, 30], [0, 5], { extrapolateRight: "clamp" });
  const scale = zoomDirection === "in" 
    ? interpolate(frame, [0, 20], [1.0, 1.2], { extrapolateRight: "clamp" })
    : interpolate(frame, [0, 10], [1.1, 1.0], { extrapolateRight: "clamp" });
  const exposure = interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp" });

  const renderMedia = (extraStyle?: React.CSSProperties) => {
    if (isVideo) {
      return (
        <Video
          src={staticFile(src)}
          startFrom={videoStartFrame || 0}
          style={{ width: "100%", height: "100%", objectFit: "cover", ...extraStyle }}
        />
      );
    }
    if (isGifSequence) {
      return (
        <GifFrames
          base={gifMeta.base}
          frameCount={gifMeta.frameCount}
          gifFps={gifMeta.gifFps}
          startFrom={videoStartFrame || 0}
          style={{ width: "100%", height: "100%", objectFit: "contain", ...extraStyle }}
        />
      );
    }
    return (
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: contain ? "contain" : "cover",
          filter: auraColor
            ? `drop-shadow(0 0 30px ${auraColor}) drop-shadow(0 10px 25px rgba(0,0,0,0.8))`
            : "drop-shadow(0 10px 25px rgba(0,0,0,0.8))",
          ...extraStyle,
        }}
      />
    );
  };

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${panX}px, ${panY}px) scale(${scale})` }}>
        {isVideo ? (
          <Video src={staticFile(src)} startFrom={videoStartFrame || 0} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.2) saturate(1.25) drop-shadow(0 0 10px rgba(0,0,0,0.5))" }} />
        ) : isGifSequence ? (
          renderMedia({ filter: auraColor ? `drop-shadow(0 0 30px ${auraColor}) drop-shadow(0 10px 25px rgba(0,0,0,0.8))` : "drop-shadow(0 10px 25px rgba(0,0,0,0.8))" })
        ) : (
          <>
            <Img
              src={staticFile(src)}
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.55)", transform: "scale(1.2)" }}
            />
            {renderMedia()}
          </>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: `rgba(255, 255, 255, ${exposure})`, mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

export const TrioCard: React.FC<{ card: TrioCard; clipIndex: number }> = ({ card, clipIndex }) => {
  const frame = useCurrentFrame();
  const durationFrames = Math.max(1, Math.round((card.endTime - card.startTime) * useVideoConfig().fps));

  // Glitch shake logic
  const isHeavyGlitch = card.effects?.includes("heavy_glitch");
  const isGlitch = card.effects?.includes("glitch") || isHeavyGlitch;
  const glitchDuration = isHeavyGlitch ? 8 : 5;
  const glitchIntensity = isHeavyGlitch ? 3.5 : 1.5;
  const glitchProgress = isGlitch ? interpolate(frame, [0, glitchDuration], [1, 0], { extrapolateRight: "clamp" }) : 0;
  
  const tx = (random(`tx-${clipIndex}-${frame}`) - 0.5) * 40 * glitchIntensity * glitchProgress;
  const ty = (random(`ty-${clipIndex}-${frame}`) - 0.5) * 20 * glitchIntensity * glitchProgress;
  const glitchScale = 1 + (random(`s-${clipIndex}-${frame}`) * 0.1 * glitchIntensity * glitchProgress);

  // RGB Shift logic (simulate by scaling out slightly and applying shadow, though true rgb shift is complex, a massive chromatic drop-shadow works well on the container)
  const isSustainedRgb = card.effects?.includes("sustained_rgb_shift");
  const isRgb = card.effects?.includes("rgb_shift") || isSustainedRgb;
  const rgbDuration = isSustainedRgb ? durationFrames : 8;
  const rgbIntensity = isSustainedRgb ? 12 : 25;
  const rgbProgress = isRgb ? interpolate(frame, [0, rgbDuration], [1, 0], { extrapolateRight: "clamp" }) : 0;
  const rgbShift = rgbIntensity * rgbProgress;

  const renderLayout = () => {
    if (card.layout === "single") {
      const img = card.images[0];
      if (img.isSilhouette && img.silhouetteColor) {
        return (
          <SilhouetteImg src={img.src} color={img.silhouetteColor} videoStartFrame={img.videoStartFrame} durationFrames={durationFrames} style={{ position: "absolute" }} />
        );
      }
      return <MediaImg src={img.src} auraColor={img.auraColor} videoStartFrame={img.videoStartFrame} zoomDirection={img.zoomDirection} />;
    }

    if (card.layout === "pair") {
      const [a, b] = card.images;
      return (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "50%", height: "100%", overflow: "hidden", position: "relative" }}>
            {a.isSilhouette && a.silhouetteColor ? (
              <SilhouetteImg src={a.src} color={a.silhouetteColor} videoStartFrame={a.videoStartFrame} durationFrames={durationFrames} style={{ position: "absolute" }} />
            ) : (
              <MediaImg src={a.src} auraColor={a.auraColor} videoStartFrame={a.videoStartFrame} zoomDirection={a.zoomDirection} contain />
            )}
          </div>
          <div style={{ width: "50%", height: "100%", overflow: "hidden", position: "relative" }}>
            {b.isSilhouette && b.silhouetteColor ? (
              <SilhouetteImg src={b.src} color={b.silhouetteColor} videoStartFrame={b.videoStartFrame} durationFrames={durationFrames} style={{ position: "absolute" }} />
            ) : (
              <MediaImg src={b.src} auraColor={b.auraColor} videoStartFrame={b.videoStartFrame} zoomDirection={b.zoomDirection} contain />
            )}
          </div>
        </AbsoluteFill>
      );
    }

    const w = 100 / card.images.length;
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
        {card.images.map((img, i) => (
          <div key={i} style={{ width: `${w}%`, height: "100%", overflow: "hidden", position: "relative" }}>
            {img.isSilhouette && img.silhouetteColor ? (
              <SilhouetteImg src={img.src} color={img.silhouetteColor} videoStartFrame={img.videoStartFrame} durationFrames={durationFrames} style={{ position: "absolute" }} />
            ) : (
              <MediaImg src={img.src} auraColor={img.auraColor} videoStartFrame={img.videoStartFrame} zoomDirection={img.zoomDirection} contain />
            )}
          </div>
        ))}
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor: "#000",
        transform: `translate(${tx}px, ${ty}px) scale(${glitchScale})`,
        filter: rgbShift > 0 ? `drop-shadow(${rgbShift}px 0 0 rgba(255,0,0,0.5)) drop-shadow(-${rgbShift}px 0 0 rgba(0,0,255,0.5))` : "none"
      }}
    >
      {card.backgroundImage && (
        <AbsoluteFill>
          <Img src={staticFile(card.backgroundImage)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(15px) brightness(0.5)", transform: "scale(1.15)" }} />
        </AbsoluteFill>
      )}

      {/* Render the RGB shifted layers for a true chromatic aberration feel if rgb_shift is active */}
      {rgbShift > 0 && (
        <>
          <AbsoluteFill style={{ transform: `translate(-${rgbShift}px, 0)`, opacity: 0.6, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(300deg) saturate(3)" }}>
             {renderLayout()}
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `translate(${rgbShift}px, 0)`, opacity: 0.6, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(180deg) saturate(3)" }}>
             {renderLayout()}
          </AbsoluteFill>
        </>
      )}

      {/* Main crisp layer */}
      <AbsoluteFill style={{ opacity: rgbShift > 0 ? 0.8 : 1 }}>
        {renderLayout()}
      </AbsoluteFill>

      {/* Phase tint */}
      {card.tint && <AbsoluteFill style={{ backgroundColor: card.tint, mixBlendMode: "color", opacity: 0.5 }} />}

      {/* Scanline overlay (also glitches!) */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 2px, transparent 2px, transparent 4px)`,
          pointerEvents: "none",
          mixBlendMode: "overlay",
          transform: `translateY(${(random(`scan-${frame}`) - 0.5) * 10 * glitchProgress}px)`
        }}
      />

      {/* Text Overlay */}
      {card.text && (
        <AbsoluteFill style={{ 
          justifyContent: card.textPosition === "center" ? "center" : "flex-end", 
          alignItems: "center" 
        }}>
          <div
            style={{
              fontSize: card.textPosition === "center" ? "120px" : "90px",
              fontWeight: "900",
              color: "#fff",
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1.1,
              paddingBottom: card.textPosition === "center" ? "0px" : "60px",
              paddingLeft: "20px",
              paddingRight: "20px",
              textShadow: "0 8px 16px rgba(0,0,0,0.9), 0 0 30px #a855f7, 0 0 60px #22c55e",
              fontFamily: "Impact, Arial, sans-serif",
              fontStyle: "italic",
              letterSpacing: "4px",
              opacity: interpolate(frame, [2, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {card.text}
          </div>
        </AbsoluteFill>
      )}

      {/* Dark vignette */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
