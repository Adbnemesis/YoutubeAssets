import React from "react";

export const DiscordLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: "#dcddde",
        overflow: "hidden",
        width: "max-content",
        padding: "20px 40px 20px 0", // Padding around the text block
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {children}
      </div>
    </div>
  );
};
