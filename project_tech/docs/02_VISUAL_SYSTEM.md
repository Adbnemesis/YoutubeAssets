# NEMI EXPLAINS — VISUAL DESIGN SYSTEM & DESIGN TOKENS

## 1. Color Palette Tokens

### Backgrounds
* **Warm Designer Cream (Primary Stage):** `#F8F6F0`
* **Deep Studio Dark (Technical Stage):** `#0D1117` / `#18181B`
* **Surface Glass Panels:** `rgba(24, 24, 27, 0.94)`
* **Muted Borders:** `rgba(0, 0, 0, 0.08)` (Cream) / `rgba(255, 255, 255, 0.12)` (Dark)

### Brand & Semantic Accents
* **Signature Electric Yellow:** `#FFD166` (Glow: `#FFE484`) — Key emphasis, brand badge, high-energy focal points.
* **Logic Cyan:** `#06B6D4` (Glow: `#22D3EE`) — Root objects, memory pointers, scanning laser.
* **Reachable / Success Emerald:** `#10B981` (Glow: `#34D399`) — Live memory, survived objects, valid paths.
* **Garbage / Bug Coral:** `#F43F5E` (Glow: `#FB7185`) — Unreachable nodes, memory leaks, wrong assumptions.
* **Warm Peach:** `#FFCDB2` — Nemi face, subtle highlight tags.

---

## 2. Typography Hierarchy
* **Display / Hero Headlines:** `Inter` (900 Black) / `-apple-system` — Letter spacing `-2px` to `-2.5px`, line-height `1.12`.
* **Technical Labels & Tags:** `JetBrains Mono` / `Fira Code` (Bold 800) — Letter spacing `1.5px` to `2.0px`.
* **Code Blocks & Memory Addresses:** `JetBrains Mono` (Bold 700).

---

## 3. Motion Physics & Remotion Springs
* **Snappy Pop:** `{ damping: 12, stiffness: 220, mass: 0.6 }` — Card entries, badge pops, Nemi speech bubbles.
* **Bouncy Character:** `{ damping: 9, stiffness: 190, mass: 0.8 }` — Nemi head tilts, reaction bounces.
* **Smooth Camera / Layout Transition:** `{ damping: 14, stiffness: 140, mass: 0.9 }` — Compaction sliding, scene layout shifts.

---

## 4. Canvas Geometry & Safe Zones
* **Resolution:** `1080 x 1920` (9:16 Vertical Video)
* **Frame Rate:** `30 fps`
* **Top Header Safe Zone:** Top 60px–180px
* **Center Action Canvas:** Top 320px–1380px
* **Bottom Character & Watermark Zone:** Top 1400px–1860px
