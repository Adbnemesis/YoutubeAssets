import os
import json
from typing import Dict, Any, List

class InteractiveHTMLVisualizer:
    def __init__(self, output_dir: str):
        self.output_dir = output_dir

    def generate(self, edit_analysis: Dict[str, Any]) -> Dict[str, str]:
        """
        Generates interactive timeline.html and dedicated beat_map.html.
        """
        timeline_path = os.path.join(self.output_dir, "timeline.html")
        beatmap_path = os.path.join(self.output_dir, "beat_map.html")

        analysis_json_str = json.dumps(edit_analysis)

        # 1. Generate timeline.html
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Remotion Edit Inspector & Timeline</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0b0e14;
            color: #e2e8f0;
            margin: 0;
            padding: 20px;
        }}
        h1, h2 {{ color: #38bdf8; margin-top: 0; }}
        .container {{ display: flex; gap: 20px; height: calc(100vh - 100px); }}
        .timeline-panel {{ flex: 2; background-color: #151d2a; border-radius: 8px; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }}
        .inspector-panel {{ flex: 1; background-color: #1e293b; border-radius: 8px; padding: 15px; overflow-y: auto; border: 1px solid #334155; }}
        .track {{ background: #0f172a; border-radius: 6px; padding: 10px; border: 1px solid #1e293b; position: relative; }}
        .track-title {{ font-size: 13px; font-weight: bold; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }}
        .events-container {{ display: flex; gap: 4px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; }}
        .event-node {{
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }}
        .event-node:hover {{ transform: translateY(-2px); filter: brightness(1.2); }}
        .ev-cut {{ background-color: #ef4444; color: #fff; }}
        .ev-beat {{ background-color: #8b5cf6; color: #fff; }}
        .ev-zoom {{ background-color: #3b82f6; color: #fff; }}
        .ev-shake {{ background-color: #f59e0b; color: #fff; }}
        .ev-flash {{ background-color: #ec4899; color: #fff; }}
        .ev-text {{ background-color: #10b981; color: #fff; }}
        .ev-sfx {{ background-color: #06b6d4; color: #fff; }}
        .ev-pattern {{ background-color: #eab308; color: #000; font-weight: 700; }}
        .frame-nav {{ display: flex; gap: 10px; margin-top: 15px; }}
        .btn {{ background-color: #38bdf8; color: #0f172a; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; }}
        .btn:hover {{ background-color: #7dd3fc; }}
        .prop-row {{ display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #334155; font-size: 13px; }}
        .prop-label {{ color: #94a3b8; }}
        .prop-val {{ font-weight: 600; color: #f8fafc; }}
    </style>
</head>
<body>
    <h1>🎬 Remotion Edit Inspector & Unified Timeline</h1>
    <div class="container">
        <div class="timeline-panel">
            <div class="track">
                <div class="track-title">MACRO EDITING PATTERNS</div>
                <div class="events-container" id="track-patterns"></div>
            </div>
            <div class="track">
                <div class="track-title">SCENES & HARD CUTS</div>
                <div class="events-container" id="track-cuts"></div>
            </div>
            <div class="track">
                <div class="track-title">RECONCILED AUDIO BEATS (LIBROSA + AUBIO)</div>
                <div class="events-container" id="track-beats"></div>
            </div>
            <div class="track">
                <div class="track-title">SFX & AUDIO TRANSIENTS</div>
                <div class="events-container" id="track-sfx"></div>
            </div>
            <div class="track">
                <div class="track-title">ZOOM PUNCHES & MOTION</div>
                <div class="events-container" id="track-zooms"></div>
            </div>
            <div class="track">
                <div class="track-title">CAMERA SHAKES</div>
                <div class="events-container" id="track-shakes"></div>
            </div>
            <div class="track">
                <div class="track-title">FLASHES & EXPOSURE SPIKES</div>
                <div class="events-container" id="track-flashes"></div>
            </div>
            <div class="track">
                <div class="track-title">OCR TEXT ELEMENTS</div>
                <div class="events-container" id="track-text"></div>
            </div>
        </div>

        <div class="inspector-panel" id="inspector">
            <h2>Inspector</h2>
            <p style="color: #94a3b8;">Click any event in the timeline to inspect exact frame parameters, causality, and Remotion TS code.</p>
        </div>
    </div>

    <script>
        const data = {analysis_json_str};

        function renderTracks() {{
            const timeline = data.masterTimeline || [];

            // Patterns
            const pTrack = document.getElementById('track-patterns');
            timeline.forEach(item => {{
                if (item.relationship && item.relationship !== 'isolated_event') {{
                    const el = document.createElement('div');
                    el.className = 'event-node ev-pattern';
                    el.innerText = `F${{item.frame}}: ${{item.relationship}}`;
                    el.onclick = () => inspectFrame(item.frame);
                    pTrack.appendChild(el);
                }}
            }});

            // Cuts
            const cTrack = document.getElementById('track-cuts');
            (data.scenes || []).forEach(c => {{
                const el = document.createElement('div');
                el.className = 'event-node ev-cut';
                el.innerText = `F${{c.startFrame}}: Cut`;
                el.onclick = () => inspectFrame(c.startFrame);
                cTrack.appendChild(el);
            }});

            // Beats
            const bTrack = document.getElementById('track-beats');
            (data.beats || []).forEach(b => {{
                const el = document.createElement('div');
                el.className = 'event-node ev-beat';
                el.innerText = `F${{b.frame}}: ${{b.type}} (${{b.strength}})`;
                el.onclick = () => inspectFrame(b.frame);
                bTrack.appendChild(el);
            }});

            // SFX
            const sfxTrack = document.getElementById('track-sfx');
            (data.sfxEvents || []).forEach(s => {{
                const el = document.createElement('div');
                el.className = 'event-node ev-sfx';
                el.innerText = `F${{s.frame}}: ${{s.candidate || 'transient'}}`;
                el.onclick = () => inspectFrame(s.frame);
                sfxTrack.appendChild(el);
            }});

            // Zooms
            const zTrack = document.getElementById('track-zooms');
            (data.zooms || []).concat(data.zoomPunches || []).forEach(z => {{
                const el = document.createElement('div');
                el.className = 'event-node ev-zoom';
                el.innerText = `F${{z.startFrame}}->F${{z.endFrame}}: ${{z.type}}`;
                el.onclick = () => inspectFrame(z.startFrame);
                zTrack.appendChild(el);
            }});

            // Shakes
            const sTrack = document.getElementById('track-shakes');
            (data.shakes || []).forEach(s => {{
                const el = document.createElement('div');
                el.className = 'event-node ev-shake';
                el.innerText = `F${{s.startFrame}}: Shake (${{s.intensity}})`;
                el.onclick = () => inspectFrame(s.startFrame);
                sTrack.appendChild(el);
            }});

            // Flashes
            const fTrack = document.getElementById('track-flashes');
            (data.flashes || []).forEach(f => {{
                const el = document.createElement('div');
                el.className = 'event-node ev-flash';
                el.innerText = `F${{f.startFrame}}: ${{f.type}}`;
                el.onclick = () => inspectFrame(f.startFrame);
                fTrack.appendChild(el);
            }});

            // Text
            const tTrack = document.getElementById('track-text');
            (data.textElements || []).forEach(t => {{
                const el = document.createElement('div');
                el.className = 'event-node ev-text';
                el.innerText = `F${{t.startFrame}}: "${{t.text}}"`;
                el.onclick = () => inspectFrame(t.startFrame);
                tTrack.appendChild(el);
            }});
        }}

        function inspectFrame(frameNum) {{
            const timeline = data.masterTimeline || [];
            const item = timeline.find(i => i.frame === frameNum) || {{ frame: frameNum, time: frameNum / data.metadata.fps, events: [] }};

            const ins = document.getElementById('inspector');
            ins.innerHTML = `
                <h2>Frame ${{item.frame}} (${{item.time.toFixed(3)}}s)</h2>
                <div class="prop-row"><span class="prop-label">Editing Pattern</span><span class="prop-val">${{item.relationship || 'isolated_event'}}</span></div>
                <div class="prop-row"><span class="prop-label">Events Count</span><span class="prop-val">${{item.events.length}}</span></div>
                
                <h3 style="color:#38bdf8; margin-top:20px;">Detected Events</h3>
                <pre style="background:#0f172a; padding:10px; border-radius:6px; font-size:11px; overflow-x:auto;">${{JSON.stringify(item.events, null, 2)}}</pre>
                
                <div class="frame-nav">
                    <button class="btn" onclick="inspectFrame(${{Math.max(0, item.frame - 1)}})">← Prev Frame</button>
                    <button class="btn" onclick="inspectFrame(${{item.frame + 1}})">Next Frame →</button>
                </div>
            `;
        }}

        renderTracks();
    </script>
</body>
</html>"""

        with open(timeline_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        # 2. Generate beat_map.html
        beatmap_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Beat Map Alignment Visualizer</title>
    <style>
        body {{ font-family: monospace; background: #090d16; color: #38bdf8; padding: 20px; }}
        h1 {{ color: #fbbf24; }}
        .map-grid {{ display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }}
        .map-row {{ display: flex; align-items: center; gap: 10px; background: #131c2e; padding: 10px; border-radius: 6px; }}
        .frame-badge {{ min-width: 90px; color: #94a3b8; font-weight: bold; }}
        .marker {{ padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }}
        .m-beat {{ background: #8b5cf6; color: #fff; }}
        .m-cut {{ background: #ef4444; color: #fff; }}
        .m-zoom {{ background: #3b82f6; color: #fff; }}
        .m-shake {{ background: #f59e0b; color: #fff; }}
        .m-text {{ background: #10b981; color: #fff; }}
    </style>
</head>
<body>
    <h1>🥁 Audio Beat Map Alignment Matrix</h1>
    <div class="map-grid" id="beatmap-grid"></div>

    <script>
        const data = {analysis_json_str};
        const grid = document.getElementById('beatmap-grid');
        const timeline = data.masterTimeline || [];

        timeline.forEach(item => {{
            const row = document.createElement('div');
            row.className = 'map-row';

            const badge = document.createElement('div');
            badge.className = 'frame-badge';
            badge.innerText = `F${{item.frame}} (${{item.time.toFixed(2)}}s)`;
            row.appendChild(badge);

            (item.events || []).forEach(ev => {{
                const type = ev.type || ev;
                const m = document.createElement('span');
                m.className = 'marker ';
                if (type.includes('beat')) m.className += 'm-beat';
                else if (type.includes('cut')) m.className += 'm-cut';
                else if (type.includes('zoom')) m.className += 'm-zoom';
                else if (type.includes('shake')) m.className += 'm-shake';
                else if (type.includes('text')) m.className += 'm-text';
                else m.className += 'm-beat';

                m.innerText = type;
                row.appendChild(m);
            }});

            grid.appendChild(row);
        }});
    </script>
</body>
</html>"""

        with open(beatmap_path, "w", encoding="utf-8") as f:
            f.write(beatmap_content)

        return {
            "timeline": timeline_path,
            "beatmap": beatmap_path
        }
