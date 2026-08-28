import React from "react";
import { staticFile } from "remotion";
import { Character } from "../types";

export const DiscordMessage: React.FC<{
  character: Character;
  text: string;
  timeString?: string;
  isFirstMessageInGroup?: boolean;
}> = ({ character, text, timeString = "Today at 4:20 PM", isFirstMessageInGroup = true }) => {
  const needsZoom = ["nemi", "shroot", "booger"].includes(character.id.toLowerCase());

  // Check if this message is a file attachment card
  const isFileAttachment = text.includes(".zip") || text.includes(".rar") || text.includes("[FILE:");
  let fileName = "";
  let fileSize = "";
  let cleanText = text;

  if (isFileAttachment) {
    const lines = text.split("\n");
    if (lines.length >= 2 && (lines[0].includes(".zip") || lines[1].includes("GB") || lines[1].includes("MB"))) {
      fileName = lines[0].replace("[FILE:", "").trim();
      fileSize = lines[1].replace(/[\[\]]/g, "").trim();
      cleanText = "";
    } else if (text.startsWith("[FILE:")) {
      const match = text.match(/\[FILE:\s*(.+?)\s*\|\s*(.+?)\]/);
      if (match) {
        fileName = match[1];
        fileSize = match[2];
        cleanText = "";
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: isFirstMessageInGroup ? "16px 16px 2px 72px" : "2px 16px 2px 72px",
        position: "relative",
        marginTop: isFirstMessageInGroup ? 16 : 0,
      }}
    >
      {/* Avatar (only show on first message of a group) */}
      {isFirstMessageInGroup && (
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: character.color || "#5865F2",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
          }}
        >
          {character.avatarUrl ? (
            <img
              src={staticFile(`project_chatnemi_assets/profile_pic/${character.avatarUrl}`)}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                transform: needsZoom ? "scale(1.25)" : "none"
              }}
              alt={character.name}
            />
          ) : (
            character.name.charAt(0).toUpperCase()
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {isFirstMessageInGroup && (
          <div style={{ display: "flex", alignItems: "baseline", marginBottom: 4 }}>
            <span
              style={{
                color: character.color || "white",
                fontWeight: 500,
                fontSize: 16,
                marginRight: 8,
              }}
            >
              {character.name}
            </span>
            <span style={{ color: "#72767d", fontSize: 12, fontWeight: 500 }}>
              {timeString}
            </span>
          </div>
        )}

        {/* Regular Text */}
        {cleanText && (
          <div
            style={{
              color: "#dcddde",
              fontSize: 16,
              lineHeight: 1.375,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {cleanText}
          </div>
        )}

        {/* Authentic Discord Download Attachment Card */}
        {fileName && (
          <div
            style={{
              marginTop: 6,
              maxWidth: 420,
              backgroundColor: "#2b2d31",
              border: "1px solid #1e1f22",
              borderRadius: 8,
              padding: "12px 16px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* File Icon Badge */}
              <div
                style={{
                  width: 44,
                  height: 48,
                  backgroundColor: "#e03b3b",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                  boxShadow: "0 2px 6px rgba(224,59,59,0.3)",
                }}
              >
                <span style={{ fontSize: 18, color: "white" }}>📁</span>
                <span style={{ fontSize: 9, fontWeight: 800, color: "white", letterSpacing: 0.5 }}>ZIP</span>
              </div>

              {/* File Meta */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#00a8fc", fontSize: 15, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>
                  {fileName}
                </span>
                <span style={{ color: "#949ba4", fontSize: 12, marginTop: 2 }}>
                  {fileSize || "Unknown Size"}
                </span>
              </div>
            </div>

            {/* Cloud Download Icon Button */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#35373c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#dbdee1",
                fontSize: 16,
              }}
            >
              ☁️
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
