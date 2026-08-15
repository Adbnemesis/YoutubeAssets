import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface GifFramesProps {
  base: string;
  frameCount: number;
  gifFps: number;
  startFrom?: number;
  style?: React.CSSProperties;
}

export const GifFrames: React.FC<GifFramesProps> = ({ base, frameCount, gifFps, startFrom = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Advance at the GIF's original speed plus optional startFrom frame offset (loops cleanly with modulo)
  const frameOffset = Math.floor((frame / fps) * gifFps) + startFrom;
  const index = frameCount > 0 ? (frameOffset % frameCount) : 0;
  const src = staticFile(`${base}/${String(index + 1).padStart(4, "0")}.png`);

  return <Img src={src} style={style} />;
};
