# ManimCE Usage for OpenMontage & Nemi Explains

> Sources: ManimCE documentation, 3Blue1Brown conventions, OpenMontage Hybrid Remotion Pipeline,
> existing Layer 3 skill at `.agents/skills/manimce-best-practices/`

## Quick Reference Card

```
RENDER QUALITY:   -qh (1080p60) / 30fps for Shorts  |  -qm (720p30) for drafts
BACKGROUND:       Dark (#070B12, #0F172A, or BLACK)
MAX ELEMENTS:     3-4 new visual elements revealed simultaneously
PACING:           One concept per scene, build incrementally
EQUATION WRITE:   1.2-1.8s run_time
SHAPE CREATE:     0.6-1.0s run_time
WAIT AFTER:       0.8-1.5s (calibrated for 25s short-form retention)
2D vs 3D:         Default to 2D. 3D only when spatial relationship IS the concept.
```

---

## Render Settings for OpenMontage & Nemi Explains

### 1. Landscape 16:9 (Standard YouTube)
| Flag | Resolution | FPS | Use Case |
|---|---|---|---|
| `-ql` | 480x360 | 15 | Quick logic check |
| `-qm` | 1280x720 | 30 | Draft review |
| `-qh` | 1920x1080 | 60 | Standard YouTube upload |

### 2. Vertical 9:16 & Card Insets (Nemi Explains Reels & Shorts)
For Nemi Explains Reels, Manim is primarily used to render **embedded card cutaways** inside Remotion:

| Format | Width | Height | FPS | CLI Command |
|---|---|---|---|---|
| **Main Card Inset** | 1080 | 540 | 30 | `manim -qh -r 1080,540 --fps 30 scene.py MainCard -o card.mp4` |
| **Square Inset (1:1)** | 1080 | 1080 | 30 | `manim -qh -r 1080,1080 --fps 30 scene.py SquareScene -o square.mp4` |
| **Full 9:16 Vertical** | 1080 | 1920 | 30 | `manim -qh -r 1080,1920 --fps 30 scene.py VerticalScene -o full_916.mp4` |

---

## 🧮 Remotion Hybrid Integration Workflow

```tsx
// Embedding a rendered Manim animation into a Nemi Explains Remotion Composition
import { OffthreadVideo, staticFile } from "remotion";

export const ManimCardVisual: React.FC = () => {
  return (
    <div style={{
      width: "100%",
      height: 520,
      borderRadius: 28,
      overflow: "hidden",
      border: "3px solid #38BDF8",
      boxShadow: "0 20px 60px rgba(56, 189, 248, 0.35)"
    }}>
      <OffthreadVideo
        src={staticFile("reels/my_reel/manim/attention_weights.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
```

---

## Animation Timing for Short-Form (<25s)

| Animation Type | `run_time` | Rate Function | Short-Form Note |
|---|---|---|---|
| Equation write (`Write`) | 1.2-1.6s | `smooth` (default) | Fast enough for shorts retention |
| Equation transform | 1.0-1.2s | `smooth` | Use `TransformMatchingTex` |
| Shape creation (`Create`) | 0.6-0.8s | `smooth` | `Create()` or `DrawBorderThenFill()` |
| Color highlight | 0.4s | `smooth` | Call attention to key variable |
| Graph/Tree traversal | 0.5-0.8s per node | `ease_in_out_sine` | Trace pointers / visited nodes |
| Staggered reveals | `lag_ratio=0.1` | — | `LaggedStart` for matrices/lists |
| Wait after reveal | 0.8-1.2s | — | Paced with narrator voice track |

---

## When to Use Manim vs. Native Remotion Components

| Scenario / Visual Requirement | Recommended Engine | Rationale |
|---|---|---|
| **App UI, Chat interfaces, Web mockups** | **Remotion** | Native CSS, flexbox, pixel-perfect modern web cards |
| **Nemi Mascot, Reactions, Speech Bubbles** | **Remotion** | SVG spring physics, eye-tracking, dialogue sync |
| **Viral Karaoke Captions & Safe-Zone HUDs** | **Remotion** | Dynamic text layout, viewport constraints, backdrop blurs |
| **Vector Space Projections & Embeddings** | **Manim** | High-dimensional geometric transforms, cosine distances |
| **Self-Attention Heatmaps & Dot Products** | **Manim** | Smooth matrix multiplication animations ($QK^T / \sqrt{d}$) |
| **Graph & Tree Algorithms (Trees, Pointers)** | **Manim** | Graph node traversals, pointer shifting, edge weighting |
| **LaTeX Equation Transformations** | **Manim** | `TransformMatchingTex` morphing symbols dynamically |
| **Big-O Growth Curves & Asymptotics** | **Manim** | Mathematical plotting ($O(1)$ vs $O(N)$ vs $O(N^2)$) |

---

## Color Palette Alignment (Nemi Explains Theme)

When authoring Manim scripts for Nemi Explains, match the channel's official design system tokens:

```python
# Nemi Explains Official Manim Color Palette
BRAND_YELLOW = "#FFD166"   # Variables being solved / highlights
BRAND_CYAN   = "#06B6D4"   # Secondary highlights / pointers
BRAND_PURPLE = "#A855F7"   # Neural weights / operators / headers
BRAND_GREEN  = "#10B981"   # Correct path / optimal solutions
BRAND_PINK   = "#EC4899"   # Attention scores / dynamic connections
CANVAS_DARK  = "#070B12"   # Canvas background
CARD_DARK    = "#0F172A"   # Card background
TEXT_LIGHT   = "#F8FAFC"   # Primary text / equations
```

---

## Execution Checklist for Manim-Powered Reels

1. **Keep clips modular**: 1 concept per 3–5s Manim clip.
2. **Match aspect ratio**: Use `-r 1080,540` for Remotion card slots.
3. **Use Dark Background**: Set `self.camera.background_color = "#070B12"`.
4. **Sync Duration**: Ensure `run_time` totals match the narrator voice block in `_cues.json`.
5. **Export & Embed**: Place output `.mp4` into `public/reels/<reel_id>/manim/` and mount via `<OffthreadVideo>`.
