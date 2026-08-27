import React from "react";
import { AbsoluteFill } from "remotion";
import { AdaMascot, AdaPose } from "./AdaMascot";

export interface CarouselSlideLayoutProps {
  /** Current slide number (1-based, e.g. 1) */
  slideNumber: number;
  /** Total number of slides (e.g. 6) */
  totalSlides: number;
  /** Topic/category handwritten tag (e.g. "programming basics:") */
  categoryTag?: string;
  /** Main slide headline / title */
  title?: React.ReactNode;
  /** Optional top introductory text (for content slides) */
  topText?: React.ReactNode;
  /** Main visual content / diagram / comparison panel */
  children?: React.ReactNode;
  /** Optional bottom takeaway text (for content slides) */
  bottomText?: React.ReactNode;
  /** Mascot to display on cover or content slide */
  mascotPose?: AdaPose;
  /** Custom mascot scale */
  mascotScale?: number;
  /** Whether to show Nemi sitting on Ada's shoulder */
  showNemiShoulder?: boolean;
  /** Custom background color override */
  bgOverride?: string;
}

export const CarouselSlideLayout: React.FC<CarouselSlideLayoutProps> = ({
  slideNumber,
  totalSlides,
  categoryTag = "programming basics:",
  title,
  topText,
  children,
  bottomText,
  mascotPose = "neutral",
  mascotScale,
  showNemiShoulder = true,
  bgOverride,
}) => {
  const isCover = slideNumber === 1;
  const bgColor = bgOverride || (isCover ? "#2C2F36" : "#FAF8F5");

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1350, // Standard 4:5 Instagram Portrait
        backgroundColor: bgColor,
        fontFamily: "'Plus Jakarta Sans', 'Comfortaa', -apple-system, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ─── GOOGLE & NATIVE SYSTEM FONTS ─── */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Comfortaa:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');

          .handwritten-tag {
            font-family: 'Chalkboard SE', 'Noteworthy', 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif;
          }
          .manga-header {
            font-family: 'Chalkboard SE', 'Noteworthy', 'Patrick Hand', 'Arial Rounded MT Bold', cursive, sans-serif;
          }
          .body-reading {
            font-family: 'Avenir Next', 'Comfortaa', 'Plus Jakarta Sans', -apple-system, sans-serif;
          }
        `}
      </style>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 1. COVER SLIDE LAYOUT (DARK MATTE AESTHETIC) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isCover ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "85px 60px 40px 60px",
          }}
        >
          {/* Handwritten Category Tag */}
          <div
            className="handwritten-tag"
            style={{
              fontSize: 52,
              color: "#FFFFFF",
              letterSpacing: "1.5px",
              marginBottom: 14,
              textAlign: "center",
              transform: "rotate(-1.5deg)",
              opacity: 0.95,
            }}
          >
            {categoryTag}
          </div>

          {/* Big Bold Headline */}
          <div
            style={{
              fontSize: 70,
              fontWeight: 900,
              color: "#FFFFFF",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              textShadow: "0 8px 24px rgba(0,0,0,0.6)",
              marginBottom: 20,
              maxWidth: 960,
            }}
          >
            {title}
          </div>

          {/* Cover Vector Mascot Art */}
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {children || (
              <AdaMascot
                pose={mascotPose}
                scale={mascotScale || 2.2}
                showNemiShoulder={showNemiShoulder}
              />
            )}
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════ */
        /* 2. CONTENT SLIDE LAYOUT (WARM CREAM AESTHETIC) */
        /* ══════════════════════════════════════════════════════════ */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "85px 80px 50px 80px",
          }}
        >
          {/* Top Reading Paragraph */}
          {topText && (
            <div
              className="body-reading"
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "#2D3748",
                lineHeight: 1.45,
                letterSpacing: "-0.4px",
              }}
            >
              {topText}
            </div>
          )}

          {/* Middle Visual / Diagram / Comparison Stage */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "30px 0",
              width: "100%",
            }}
          >
            {children}
          </div>

          {/* Bottom Takeaway Paragraph */}
          {bottomText && (
            <div
              className="body-reading"
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "#2D3748",
                lineHeight: 1.45,
                letterSpacing: "-0.4px",
              }}
            >
              {bottomText}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 3. PAGINATION DOTS (BOTTOM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 7,
          zIndex: 50,
        }}
      >
        {Array.from({ length: totalSlides }).map((_, idx) => {
          const isCurrent = idx + 1 === slideNumber;
          return (
            <div
              key={idx}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: isCover
                  ? isCurrent
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.3)"
                  : isCurrent
                  ? "#2D3748"
                  : "rgba(45, 55, 72, 0.2)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
