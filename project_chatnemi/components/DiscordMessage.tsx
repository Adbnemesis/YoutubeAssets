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
        <div
          style={{
            color: "#dcddde",
            fontSize: 16,
            lineHeight: 1.375,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
