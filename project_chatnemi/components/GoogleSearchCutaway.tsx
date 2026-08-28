import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const GoogleSearchCutaway: React.FC<{
  searchQuery?: string;
  resultTitle?: string;
  resultAddress?: string;
  resultCategory?: string;
}> = ({
  searchQuery = "Itämerenkatu 11-13, 00180 Helsinki, Finland",
  resultTitle = "Supercell Headquarters",
  resultAddress = "Itämerenkatu 11-13, 00180 Helsinki, Finland",
  resultCategory = "Video game publisher & developer"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typing animation for search bar (takes first 1.2 seconds = ~36 frames)
  const typingProgress = interpolate(frame, [5, 35], [0, searchQuery.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayedQuery = searchQuery.slice(0, Math.floor(typingProgress));

  // Result card pop-up spring
  const cardScale = spring({
    frame: frame - 38,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#202124",
        color: "#e8eaed",
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 100,
        boxSizing: "border-box",
      }}
    >
      {/* Google Colored Logo */}
      <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1, marginBottom: 28 }}>
        <span style={{ color: "#4285F4" }}>G</span>
        <span style={{ color: "#EA4335" }}>o</span>
        <span style={{ color: "#FBBC05" }}>o</span>
        <span style={{ color: "#4285F4" }}>g</span>
        <span style={{ color: "#34A853" }}>l</span>
        <span style={{ color: "#EA4335" }}>e</span>
      </div>

      {/* Search Bar */}
      <div
        style={{
          width: 720,
          height: 56,
          backgroundColor: "#303134",
          borderRadius: 28,
          border: "1px solid #5f6368",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          marginBottom: 40,
        }}
      >
        <span style={{ fontSize: 20, marginRight: 16, color: "#9aa0a6" }}>🔍</span>
        <span style={{ fontSize: 20, color: "#e8eaed", fontWeight: 400 }}>
          {displayedQuery}
        </span>
        {frame < 36 && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 22,
              backgroundColor: "#8ab4f8",
              marginLeft: 4,
              opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
            }}
          />
        )}
      </div>

      {/* Live Map / Business Card Result */}
      {frame >= 38 && (
        <div
          style={{
            width: 820,
            backgroundColor: "#303134",
            borderRadius: 16,
            border: "1px solid #3c4043",
            padding: 24,
            transform: `scale(${cardScale})`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Supercell / Starr Park Icon Pin */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 12,
              backgroundColor: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              marginRight: 24,
              border: "2px solid #FFD700",
            }}
          >
            🏢
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#8ab4f8", marginRight: 12 }}>
                {resultTitle}
              </span>
              <span style={{ fontSize: 14, backgroundColor: "#3c4043", color: "#81c995", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                Verified Official
              </span>
            </div>

            <div style={{ fontSize: 16, color: "#9aa0a6", marginBottom: 8 }}>
              {resultCategory}
            </div>

            <div style={{ fontSize: 18, color: "#e8eaed", display: "flex", alignItems: "center" }}>
              <span style={{ color: "#ea4335", marginRight: 8, fontSize: 20 }}>📍</span>
              {resultAddress}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
              <div style={{ fontSize: 14, color: "#fbbc04", fontWeight: 600 }}>
                ⭐⭐⭐⭐⭐ 4.9 (12,480 reviews)
              </div>
              <div style={{ fontSize: 14, color: "#81c995", fontWeight: 600 }}>
                • Open 24 Hours
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
