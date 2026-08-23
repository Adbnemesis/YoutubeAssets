const NumberWall: React.FC<{
  frame: number;
  sliceAt: number;
  killLeftAt: number;
  killRightAt: number;
  restoreAt: number;
  highlightMid: boolean;
}> = ({ frame, sliceAt, killLeftAt, killRightAt, restoreAt, highlightMid }) => {
  const cellW = 1080 / COLS;
  const cellH = 1500 / ROWS;
  const top = 330;

  const cellOpacity = (col: number, row: number) => {
    if (restoreAt > 0 && frame >= restoreAt) return 1;
    if (sliceAt > 0 && frame >= sliceAt && col >= COLS / 2) {
      const d = frame - sliceAt - col * 1.5;
      if (d > 0) return interpolate(d, [0, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
    if (killLeftAt > 0 && frame >= killLeftAt && row >= ROWS / 2) {
      const d = frame - killLeftAt - (row - ROWS / 2) * 1.5;
      if (d > 0) return interpolate(d, [0, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
    if (killRightAt > 0 && frame >= killRightAt && row < ROWS / 2) {
      const d = frame - killRightAt - (ROWS / 2 - row) * 1.5;
      if (d > 0) return interpolate(d, [0, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
    return 1;
  };

  return (
    <AbsoluteFill>
      {WALL_VALUES.map((row, ri) => (
        <div key={`wr${ri}`} style={{ position: "absolute", top: top + ri * cellH, left: 0, display: "flex" }}>
          {row.map((v, ci) => {
            const op = cellOpacity(ci, ri);
            const isMid = highlightMid && ri === Math.floor(ROWS / 2) && ci === Math.floor(COLS / 2);
            return (
              <div key={`wc${ri}-${ci}`} style={{ width: cellW, height: cellH, display: "flex", alignItems: "center", justifyContent: "center", opacity: op * (isMid ? 1 : 0.85) }}>
                <span style={{ fontSize: 26, fontWeight: isMid ? 900 : 700, fontFamily: nemiTheme.typography.fontFamily.mono, color: isMid ? "#0B1120" : op > 0 ? (ri < ROWS / 2 ? "#22D3EE" : "#334155") : "transparent", backgroundColor: isMid ? nemiTheme.colors.brandYellow : "transparent", padding: isMid ? "6px 10px" : 0, borderRadius: isMid ? 10 : 0, textShadow: isMid ? "none" : "0 0 12px rgba(34,211,238,0.25)", transform: isMid ? `scale(${interpolate(frame % 30, [0, 15, 30], [1, 1.12, 1])})` : "none" }}>
                  {v}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};