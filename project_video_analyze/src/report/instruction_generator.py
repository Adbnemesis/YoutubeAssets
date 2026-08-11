import os
import json
from typing import Dict, Any, List

class InstructionGenerator:
    def __init__(self, output_dir: str):
        self.output_dir = output_dir

    def generate(self, edit_analysis: Dict[str, Any]) -> Dict[str, str]:
        """
        Generates ANTIGRAVITY_EDIT_INSTRUCTIONS.md and EDIT_RECIPE.json.
        """
        master_timeline = edit_analysis.get("masterTimeline", [])
        video_meta = edit_analysis.get("metadata", {})
        fps = video_meta.get("fps", 30.0)

        # 1. ANTIGRAVITY_EDIT_INSTRUCTIONS.md
        md_path = os.path.join(self.output_dir, "ANTIGRAVITY_EDIT_INSTRUCTIONS.md")
        lines = [
            "# ANTIGRAVITY REMOTION RECREATION INSTRUCTIONS",
            "",
            "> **THE VIDEO ANALYSIS DATA IS THE TEMPORAL SOURCE OF TRUTH.** Never guess timing.",
            "",
            "## 📽 Video Specs",
            f"- **FPS**: {fps}",
            f"- **Total Frames**: {video_meta.get('totalFrames', 0)}",
            f"- **Duration**: {video_meta.get('durationSeconds', 0.0):.3f}s",
            "",
            "## ⏱ Frame-by-Frame Implementation Steps",
            ""
        ]

        recipe_operations = []

        for item in master_timeline:
            f = item["frame"]
            t = item["time"]
            events = item.get("events", [])
            pattern = item.get("relationship", "isolated_event")

            event_types = [e.get("type", "") if isinstance(e, dict) else str(e) for e in events]
            
            lines.append(f"### FRAME {f:03d} ({t:.3f}s)")
            lines.append(f"- **Editing Pattern**: `{pattern}`")
            lines.append(f"- **Detected Events**: {', '.join(event_types)}")
            lines.append("  **IMPLEMENTATION INSTRUCTIONS**:")

            ops = []
            for ev in events:
                e_type = ev.get("type", "") if isinstance(ev, dict) else str(ev)
                if e_type in ["hard_cut", "large_visual_change"]:
                    lines.append(f"  1. Switch video layer / brawler card at `<Sequence from={{{f}}}>`.")
                    ops.append({"type": "cut", "frame": f})
                elif e_type == "zoom_punch":
                    end_f = ev.get("endFrame", f + 14) if isinstance(ev, dict) else f + 14
                    lines.append(f"  2. Trigger scale punch `[scale: 1.0 -> {ev.get('estimatedScale', 1.15)} -> 1.0]` ending at frame {end_f}.")
                    ops.append({"type": "scale_punch", "startFrame": f, "endFrame": end_f, "scale": ev.get("estimatedScale", 1.15)})
                elif e_type in ["shake_start", "camera_shake"]:
                    lines.append("  3. Apply camera shake transform `translate(shakeX, shakeY)`.")
                    ops.append({"type": "shake", "startFrame": f, "intensity": ev.get("intensity", 0.8) if isinstance(ev, dict) else 0.8})
                elif e_type == "text_appear":
                    txt = ev.get("text", "") if isinstance(ev, dict) else ""
                    lines.append(f"  4. Render text pop `\"{txt}\"` with spring scale entrance.")
                    ops.append({"type": "text_pop", "frame": f, "text": txt})
                elif e_type == "sfx_match":
                    sfx_cand = ev.get("candidate", "impact.wav") if isinstance(ev, dict) else "impact.wav"
                    lines.append(f"  5. Play SFX audio `<Audio src={{staticFile(\"sound_effects/{sfx_cand}\")}} />`.")
                    ops.append({"type": "sfx", "frame": f, "candidate": sfx_cand})

            lines.append("")

            if ops:
                recipe_operations.append({
                    "pattern": pattern,
                    "triggerFrame": f,
                    "time": t,
                    "operations": ops
                })

        with open(md_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

        # 2. EDIT_RECIPE.json
        recipe_path = os.path.join(self.output_dir, "EDIT_RECIPE.json")
        recipe_data = {
            "metadata": video_meta,
            "recipe": recipe_operations
        }
        with open(recipe_path, "w", encoding="utf-8") as f:
            json.dump(recipe_data, f, indent=2)

        return {
            "instructions": md_path,
            "recipe": recipe_path
        }
