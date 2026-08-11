import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, Video, staticFile } from "remotion";

export const MangaPhonkClip: React.FC<{
  imageSrc: string;
  clipIndex: number;
  isSilhouette?: boolean;
  silhouetteColor?: string;
  videoStartFrame?: number;
}> = ({ imageSrc, clipIndex, isSilhouette, silhouetteColor, videoStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screen shake logic based heavily on the first few frames
  const shakeIntensity = spring({
    fps,
    frame,
    config: { damping: 10, stiffness: 200 },
  });

  // Silhouette sliding from bottom
  const slideIn = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 150 },
  });
  const slideY = interpolate(slideIn, [0, 1], [1080, 0]);
  
  // Randomize pan direction based on clip index
  const panDirectionX = clipIndex % 2 === 0 ? 1 : -1;
  const panDirectionY = clipIndex % 3 === 0 ? 1 : -1;

  // Intense shake that settles down
  const shakeX = interpolate(shakeIntensity, [0, 1], [30 * panDirectionX, 0]) * Math.sin(frame * 2.5);
  const shakeY = interpolate(shakeIntensity, [0, 1], [30 * panDirectionY, 0]) * Math.cos(frame * 2.5);
  
  // Constant slow pan to make static images feel alive
  const slowPanX = interpolate(frame, [0, 30], [0, 20 * panDirectionX]);
  const slowPanY = interpolate(frame, [0, 30], [0, 15 * panDirectionY]);

  const rotation = interpolate(shakeIntensity, [0, 1], [3 * panDirectionX, 0]) * Math.sin(frame);
  
  // Aggressive Zoom: Starts at 1.2 and snaps to 1.05
  const scale = interpolate(shakeIntensity, [0, 1], [1.3, 1.05]) + interpolate(frame, [0, 30], [0, 0.05]);

  // Smooth Zoom for Videos
  const isVideo = imageSrc.endsWith('.mp4') || imageSrc.endsWith('.webm');
  const smoothZoom = interpolate(frame, [0, 30], [1.1, 1.25]);

  // Apply conditional transform based on whether it's a static image or a moving Video
  const transform = isVideo
    ? `scale(${smoothZoom}) translate(${slowPanX}px, ${slowPanY}px)`
    : `translate(${shakeX + slowPanX}px, ${shakeY + slowPanY}px) rotate(${rotation}deg) scale(${scale})`;

  // Exposure flash on cut
  const exposure = interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform,
          filter: `contrast(1.2) saturate(1.2)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {isSilhouette && silhouetteColor ? (
          // Solid Silhouette Hack using massive drop-shadow and negative translation
          <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "100%", height: "100%", transform: `translateY(${slideY}px)`, display: "flex", justifyContent: "center", alignItems: "center" }}>
              {isVideo ? (
                <Video 
                  src={staticFile(imageSrc)} 
                  startFrom={videoStartFrame || 0}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: "translateX(-5000px)", filter: `drop-shadow(5000px 0 0 ${silhouetteColor})` }} 
                />
              ) : (
                <Img 
                  src={staticFile(imageSrc)} 
                  style={{ width: "100%", height: "100%", objectFit: "contain", transform: "translateX(-5000px)", filter: `drop-shadow(5000px 0 0 ${silhouetteColor})` }} 
                />
              )}
            </div>
          </div>
        ) : isVideo ? (
          <Video 
            src={staticFile(imageSrc)} 
            startFrom={videoStartFrame || 0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        ) : (
          <>
            {/* Layer 1: Blurred Background */}
            <Img 
              src={staticFile(imageSrc)} 
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.6)", transform: "scale(1.2)" }} 
            />
            {/* Layer 2: Crisp Foreground */}
            <Img 
              src={staticFile(imageSrc)} 
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0px 0px 40px rgba(0,0,0,0.8))" }} 
            />
          </>
        )}
      </AbsoluteFill>
      
      {/* Exposure Flash Overlay */}
      <AbsoluteFill style={{ backgroundColor: `rgba(255, 255, 255, ${exposure})`, mixBlendMode: "overlay" }} />
      
      {/* Dark Vignette to focus the center */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
