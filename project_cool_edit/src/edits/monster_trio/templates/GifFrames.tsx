import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface GifFramesProps {
  base: string;
  frameCount: number;
  gifFps: number;
  style?: React.CSSProperties;
}

export const GifFrames: React.FC<GifFramesProps> = ({ base, frameCount, gifFps, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Advance at the GIF's original speed (gifFps over the render fps). The sequence is
  // clamped so playback never loops or skips — the clip simply covers the segment duration.
  const index = Math.min(frameCount - 1, Math.floor((frame / fps) * gifFps));
  const src = staticFile(`${base}/${String(index + 1).padStart(4, "0")}.png`);

  return <Img src={src} style={style} />;
};
