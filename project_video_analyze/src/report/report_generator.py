import os
from typing import Dict, Any

class EditReportGenerator:
    def __init__(self, edit_analysis: Dict[str, Any], output_dir: str):
        self.edit_analysis = edit_analysis
        self.output_dir = output_dir

    def generate(self) -> str:
        meta = self.edit_analysis.get("metadata", {})
        cuts = self.edit_analysis.get("cuts", [])
        transitions = self.edit_analysis.get("transitions", [])
        beats = self.edit_analysis.get("beats", [])
        strong_beats = self.edit_analysis.get("strongBeats", [])
        speech = self.edit_analysis.get("speech", {})
        words = speech.get("words", [])
        text_elements = self.edit_analysis.get("text", [])
        zooms = self.edit_analysis.get("zooms", [])
        shakes = self.edit_analysis.get("shakes", [])
        flashes = self.edit_analysis.get("flashes", [])
        master_timeline = self.edit_analysis.get("masterTimeline", [])

        lines = []
        lines.append(f"# EDIT REPORT: {meta.get('fileName', 'video.mp4')}\n")

        lines.append("## VIDEO METADATA")
        lines.append(f"- **Resolution**: {meta.get('width', 0)}x{meta.get('height', 0)}")
        lines.append(f"- **FPS**: {meta.get('fps', 0.0)}")
        lines.append(f"- **Duration**: {meta.get('durationSeconds', 0.0)} seconds")
        lines.append(f"- **Total Frames**: {meta.get('totalFrames', 0)}")
        lines.append(f"- **Video Codec**: {meta.get('videoCodec', 'unknown')}\n")

        lines.append("## AUDIO ANALYSIS")
        lines.append(f"- **BPM**: {self.edit_analysis.get('audioBpm', 0.0)}")
        lines.append(f"- **Total Beats Detected**: {len(beats)}")
        lines.append(f"- **Strong Beats**: {len(strong_beats)}\n")

        lines.append("## CUTS & TRANSITIONS")
        if not cuts and not transitions:
            lines.append("- No hard cuts detected.")
        else:
            for t in transitions[:15]: # Show first 15
                t_sec = t["startTime"]
                mins = int(t_sec // 60)
                secs = t_sec % 60
                time_str = f"{mins:02d}:{secs:06.3f}"
                lines.append(f"- `{time_str}` (Frame {t['startFrame']}) — **{t['type']}** [confidence: {t.get('confidence', 1.0)}]")
        lines.append("")

        lines.append("## SPEECH & DIALOGUE")
        transcript = speech.get("transcript", "")
        lines.append(f"- **Transcript**: \"{transcript}\"")
        if words:
            lines.append("- **Word-level Timestamps**:")
            for w in words[:10]:
                lines.append(f"  - `{w['text']}`: {w['start']:.3f}s (F{w['startFrame']}) → {w['end']:.3f}s (F{w['endFrame']})")
        lines.append("")

        lines.append("## VISUAL EVENTS & MOTION")
        if zooms:
            lines.append("### Zooms")
            for z in zooms:
                lines.append(f"- `{z['startTime']:.3f}s` (F{z['startFrame']}) → `{z['endTime']:.3f}s` (F{z['endFrame']}): **{z['type']}** (scale {z.get('scaleStart', 1.0)} → {z.get('scaleEnd', 1.15)})")
        if shakes:
            lines.append("### Camera Shakes")
            for s in shakes:
                lines.append(f"- `{s['startTime']:.3f}s` (F{s['startFrame']}) → `{s['endTime']:.3f}s` (F{s['endFrame']}): **Shake** [intensity: {s.get('intensity', 0.5)}]")
        if flashes:
            lines.append("### Flashes & Exposure")
            for f in flashes:
                lines.append(f"- `{f['startTime']:.3f}s` (F{f['startFrame']}): **{f['type']}**")
        lines.append("")

        lines.append("## DETECTED TEXT (OCR)")
        if not text_elements:
            lines.append("- No visible text detected.")
        else:
            for txt in text_elements:
                bbox = txt.get("boundingBox", {})
                lines.append(f"- `{txt['text']}` (F{txt['startFrame']} → F{txt['endFrame']}) @ box [{bbox.get('x')}, {bbox.get('y')}, {bbox.get('width')}, {bbox.get('height')}] [conf: {txt.get('confidence')}]")
        lines.append("")

        lines.append("## MASTER CHRONOLOGICAL TIMELINE (HIGHLIGHTS)")
        for item in master_timeline[:25]:
            frame = item["frame"]
            t_sec = item["time"]
            events_str = ", ".join([e.get("type", "event") for e in item["events"]])
            rel = item.get("relationship", "")
            rel_str = f" [{rel}]" if rel != "isolated_event" else ""
            lines.append(f"- `F{frame:04d}` ({t_sec:06.3f}s): {events_str}{rel_str}")

        report_content = "\n".join(lines)
        report_path = os.path.join(self.output_dir, "EDIT_REPORT.md")
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)

        return report_path
