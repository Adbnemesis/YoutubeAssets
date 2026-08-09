import { staticFile } from "remotion";

export const DiscordCall: React.FC<{
  callerName: string;
  callerAvatarUrl?: string;
  callerId?: string;
}> = ({ callerName, callerAvatarUrl, callerId }) => {
  const needsZoom = callerId ? ["nemi", "shroot", "booger"].includes(callerId.toLowerCase()) : false;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1e1f22",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          backgroundColor: "#5865F2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 100,
          marginBottom: 40,
        }}
      >
        {callerAvatarUrl ? (
          <img
            src={staticFile(`project_chatnemi_assets/profile_pic/${callerAvatarUrl}`)}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              transform: needsZoom ? "scale(1.25)" : "none"
            }}
            alt={callerName}
          />
        ) : (
          "📞"
        )}
      </div>
      <h1 style={{ fontSize: 64, margin: 0, marginBottom: 15 }}>{callerName}</h1>
      <p style={{ fontSize: 32, color: "#b5bac1", margin: 0 }}>Incoming Voice Call...</p>
      
      <div style={{ display: "flex", gap: 40, marginTop: 80 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", backgroundColor: "#ed4245", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 40 }}>
           ❌
        </div>
        <div style={{ width: 100, height: 100, borderRadius: "50%", backgroundColor: "#3ba55c", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 40 }}>
           ✅
        </div>
      </div>
    </div>
  );
};
