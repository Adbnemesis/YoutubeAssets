# ⚛️ NEMI EXPLAINS — REMOTION ARCHITECTURE & HYBRID COMPOSITION

> Sources: Remotion v4 documentation, OpenMontage Hybrid Pipeline, React Performance Best Practices.

---

## 1. Composition Specifications (`src/Root.tsx`)

Every reel composition adheres to strict mobile dimensions and deterministic rendering:

```tsx
<Composition
  id="NemiExplainsChatGPT"
  component={ChatGPTExplainsComp}
  durationInFrames={768} // Exactly 25.61s @ 30fps (<26s target)
  fps={30}
  width={1080}
  height={1920}
/>
```

---

## 2. Component Layer Stack

Within each reel component (`reels/<reel_id>/<ReelComp>.tsx`), layers are rendered in precise Z-index order:

```tsx
<AbsoluteFill style={{ backgroundColor: canvasBg, overflow: "hidden" }}>
  {/* Layer 1: Master Audio (TTS + Sidechained BGM) */}
  <Audio src={staticFile("reels/.../master_audio.mp3")} />

  {/* Layer 2: Synchronized SFX Sequences */}
  <Sequence from={0} durationInFrames={30}>
    <Audio src={staticFile("reels/.../sfx/whoosh.mp3")} volume={1.0} />
  </Sequence>

  {/* Layer 3: Ambient Neural Background Orbs (Z: 5) */}
  <NeuralBackground frame={frame} darkProgress={darkProgress} />

  {/* Layer 4: Top Category HUD & Topic Headline (Z: 50) */}
  <TopHUD frame={frame} />
  <TopicHeadline frame={frame} />

  {/* Layer 5: Dynamic Stages / Embedded Manim Cutaways (Z: 30) */}
  <StageWrapper frame={frame} startFrame={0} endFrame={180}>
    {/* Option A: Native Remotion React Components */}
    <InteractiveCardUI frame={frame} />
    
    {/* Option B: Embedded Manim Algorithmic Cutaway */}
    <OffthreadVideo src={staticFile("reels/.../manim/tree_traversal.mp4")} />
  </StageWrapper>

  {/* Layer 6: Mid-Screen Dynamic Badges (Z: 35) */}
  <MidScreenBadges frame={frame} />

  {/* Layer 7: Dynamic Karaoke Captions (Z: 80) */}
  {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}

  {/* Layer 8: Nemi Mascot Dock & Speech Bubble (Z: 60 - 100) */}
  <NemiMascot pose={nemiPose} scale={1.65} />
  {nemiSpeech && <SpeechBubble text={nemiSpeech} frame={frame} />}
</AbsoluteFill>
```

---

## 3. The `StageWrapper` Continuous Scene Manager

Transitions between beats avoid abrupt hard cuts. `StageWrapper` provides smooth parallax sliding:

```tsx
export const StageWrapper: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ children, frame, startFrame, endFrame }) => {
  if (frame < startFrame - 8 || frame > endFrame + 8) return null;

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const enterY = interpolate(frame, [startFrame, startFrame + 8], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const exitOpacity = interpolate(frame, [endFrame - 6, endFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitY = interpolate(frame, [endFrame - 6, endFrame], [0, -25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const opacity = Math.min(enterOpacity, exitOpacity);
  const translateY = enterY + exitY;

  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};
```

---

## 4. Performance & Determinism Rules

1. **Never use `useState` or `useEffect` for animations:** All animations are pure mathematical functions of `useCurrentFrame()`.
2. **Deterministic Interpolation:** Always specify `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }`.
3. **Audio Static File Assets:** Master audio is loaded via `staticFile()` to ensure perfect audio-video synchronization in headless renders.
