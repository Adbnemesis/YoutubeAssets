# NEMI EXPLAINS — REMOTION ARCHITECTURE & COMPONENT SYSTEM

## 1. Architectural Principles
* **Continuous Camera Navigation:** The Remotion canvas represents a single continuous coordinate system. Camera movement is achieved by applying `scale(cameraZoom) translateY(cameraPanY)` to the virtual memory/network stage:
  - `CameraPush` (Zoom `1.0 → 1.2` into URL input bar / Global Root)
  - `FollowRequest` (Pan and track packet racing across 3D network nodes)
  - `ZoomThrough` (Zoom through server edge into rendered browser viewport)
* **Deterministic Speaker Timeline:** Audio is orchestrated through `nemi_v11_cues.json`, generated with zero accidental overlap and validated prior to rendering.
* **Vector-First Assets:** Nemi mascot, cards, connectors, routing paths, and badges are rendered using pure SVG and React components for infinite resolution scalability (1080x1920 to 4K).

---

## 2. Component Hierarchy
```text
src/
├── Root.tsx                       # Master composition registry
├── compositions/
│   ├── NemiExplainsV11Comp.tsx     # V11 Master Composition (Google.com Continuous World Journey)
│   ├── NemiExplainsV10Comp.tsx     # V10 Master Composition (Garbage Collection Standard)
│   └── ...
├── components/
│   ├── NemiMascot.tsx             # Vector mascot with 7 pose states
│   ├── CodeWindow.tsx             # IDE window container with line numbers
│   └── AudioEngine.tsx            # Multi-track audio synchronizer
├── constants/
│   └── nemiTheme.ts               # Unified color, typography, and spring tokens
└── data/
    └── nemi_v11_cues.json         # Source-of-truth non-overlapping timeline & semantic cues
```

---

## 3. Pixel-Perfect SVG Coordinate Rules
* All SVG connector lines connect the **exact center** of network nodes (`x: left + w/2, y: top + h/2`) to adjacent routers.
* Routing lines use animated `strokeDasharray` and cyan glow filters.
