import os
import json
from typing import Dict, Any

class HTMLTimelineVisualizer:
    def __init__(self, edit_analysis: Dict[str, Any], output_dir: str):
        self.edit_analysis = edit_analysis
        self.output_dir = output_dir

    def generate(self) -> str:
        data_json_str = json.dumps(self.edit_analysis)
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Edit Analyzer - Timeline Dashboard</title>
    <style>
        :root {{
            --bg-color: #0b0f19;
            --panel-bg: rgba(22, 30, 46, 0.85);
            --panel-border: rgba(255, 255, 255, 0.1);
            --accent-purple: #7c3aed;
            --accent-blue: #3b82f6;
            --accent-pink: #ec4899;
            --accent-cyan: #06b6d4;
            --accent-gold: #f59e0b;
            --accent-red: #ef4444;
            --text-main: #f3f4f6;
            --text-dim: #9ca3af;
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }}

        body {{
            background-color: var(--bg-color);
            color: var(--text-main);
            padding: 20px;
            overflow-x: hidden;
        }}

        header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            background: var(--panel-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--panel-border);
            border-radius: 12px;
            margin-bottom: 20px;
        }}

        h1 {{
            font-size: 1.4rem;
            font-weight: 700;
            background: linear-gradient(135deg, #a78bfa, #f472b6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}

        .meta-badges {{
            display: flex;
            gap: 12px;
        }}

        .badge {{
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--panel-border);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            color: var(--text-dim);
        }}

        .badge strong {{
            color: var(--text-main);
        }}

        .timeline-container {{
            background: var(--panel-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--panel-border);
            border-radius: 12px;
            padding: 20px;
            position: relative;
            overflow-x: auto;
        }}

        .track-row {{
            display: flex;
            align-items: center;
            height: 48px;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }}

        .track-label {{
            width: 140px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-dim);
            flex-shrink: 0;
        }}

        .track-lane {{
            flex-grow: 1;
            height: 100%;
            position: relative;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 6px;
        }}

        .event-marker {{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 28px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }}

        .event-marker:hover {{
            transform: translateY(-50%) scale(1.05);
            z-index: 10;
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
        }}

        .type-cut {{ background: var(--accent-red); color: white; }}
        .type-beat {{ background: var(--accent-purple); color: white; width: 6px !important; min-width: 6px; padding: 0; }}
        .type-strong-beat {{ background: var(--accent-pink); color: white; width: 10px !important; min-width: 10px; padding: 0; }}
        .type-word {{ background: var(--accent-blue); color: white; }}
        .type-text {{ background: var(--accent-gold); color: black; }}
        .type-zoom {{ background: var(--accent-cyan); color: black; }}
        .type-shake {{ background: #10b981; color: white; }}
        .type-flash {{ background: #face15; color: black; }}

        /* Modal Preview */
        .modal-overlay {{
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 100;
            justify-content: center;
            align-items: center;
        }}

        .modal-content {{
            background: var(--panel-bg);
            border: 1px solid var(--panel-border);
            border-radius: 16px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }}

        .modal-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }}

        .modal-title {{
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--accent-pink);
        }}

        .close-btn {{
            background: none;
            border: none;
            color: var(--text-dim);
            font-size: 1.5rem;
            cursor: pointer;
        }}

        .modal-body {{
            font-size: 0.9rem;
            line-height: 1.6;
        }}

        .modal-body pre {{
            background: rgba(0, 0, 0, 0.4);
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin-top: 12px;
            font-size: 0.8rem;
        }}
    </style>
</head>
<body>
    <header>
        <h1 id="doc-title">Video Edit Analysis Dashboard</h1>
        <div class="meta-badges">
            <div class="badge">FPS: <strong id="val-fps">0</strong></div>
            <div class="badge">Duration: <strong id="val-dur">0s</strong></div>
            <div class="badge">Total Frames: <strong id="val-frames">0</strong></div>
            <div class="badge">BPM: <strong id="val-bpm">0</strong></div>
        </div>
    </header>

    <div class="timeline-container" id="timeline-app">
        <!-- Tracks rendered dynamically via JavaScript -->
    </div>

    <!-- Frame Inspector Modal -->
    <div class="modal-overlay" id="inspector-modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modal-event-title">Event Inspector</div>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body" id="modal-event-body">
                Select an event on the timeline to inspect metadata.
            </div>
        </div>
    </div>

    <script>
        const analysisData = {data_json_str};

        document.getElementById('doc-title').innerText = "Edit Analysis: " + (analysisData.metadata.fileName || "Video");
        document.getElementById('val-fps').innerText = analysisData.metadata.fps || 0;
        document.getElementById('val-dur').innerText = (analysisData.metadata.durationSeconds || 0) + "s";
        document.getElementById('val-frames').innerText = analysisData.metadata.totalFrames || 0;
        document.getElementById('val-bpm').innerText = analysisData.audioBpm || 0;

        const container = document.getElementById('timeline-app');
        const duration = analysisData.metadata.durationSeconds || 1.0;

        const tracks = [
            {{ name: 'Cuts', items: analysisData.cuts, type: 'type-cut' }},
            {{ name: 'Strong Beats', items: analysisData.strongBeats, type: 'type-strong-beat' }},
            {{ name: 'Beats', items: analysisData.beats, type: 'type-beat' }},
            {{ name: 'Speech Words', items: (analysisData.speech ? analysisData.speech.words : []), type: 'type-word' }},
            {{ name: 'OCR Text', items: analysisData.text, type: 'type-text' }},
            {{ name: 'Zooms', items: analysisData.zooms, type: 'type-zoom' }},
            {{ name: 'Shakes', items: analysisData.shakes, type: 'type-shake' }},
            {{ name: 'Flashes', items: analysisData.flashes, type: 'type-flash' }}
        ];

        tracks.forEach(track => {{
            const row = document.createElement('div');
            row.className = 'track-row';

            const label = document.createElement('div');
            label.className = 'track-label';
            label.innerText = track.name;
            row.appendChild(label);

            const lane = document.createElement('div');
            lane.className = 'track-lane';

            if (track.items && track.items.length) {{
                track.items.forEach(item => {{
                    const el = document.createElement('div');
                    el.className = 'event-marker ' + track.type;
                    
                    let startTime = item.startTime || item.time || (item.start ? item.start : 0);
                    let endTime = item.endTime || item.end || (startTime + 0.1);
                    
                    let leftPercent = (startTime / duration) * 100;
                    let widthPercent = Math.max(0.5, ((endTime - startTime) / duration) * 100);

                    el.style.left = leftPercent + '%';
                    el.style.width = widthPercent + '%';
                    el.innerText = item.text || item.type || track.name;

                    el.onclick = () => showModal(track.name, item);
                    lane.appendChild(el);
                }});
            }}

            row.appendChild(lane);
            container.appendChild(row);
        }});

        function showModal(trackName, item) {{
            document.getElementById('modal-event-title').innerText = trackName + " Event Inspector";
            document.getElementById('modal-event-body').innerHTML = `
                <p><strong>Frame:</strong> ${{item.startFrame || item.frame || 0}}</p>
                <p><strong>Time:</strong> ${{item.startTime || item.time || 0}} seconds</p>
                <p><strong>Raw Data:</strong></p>
                <pre>${{JSON.stringify(item, null, 2)}}</pre>
            `;
            document.getElementById('inspector-modal').style.display = 'flex';
        }}

        function closeModal() {{
            document.getElementById('inspector-modal').style.display = 'none';
        }}
    </script>
</body>
</html>
"""
        output_path = os.path.join(self.output_dir, "timeline.html")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        return output_path
