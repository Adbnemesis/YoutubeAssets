import cv2
import numpy as np
from typing import Dict, Any, List

class OpenCVVisualAnalyzer:
    def __init__(self, video_path: str, fps: float, total_frames: int):
        self.video_path = video_path
        self.fps = fps
        self.total_frames = total_frames

    def run(self) -> Dict[str, Any]:
        """
        Executes comprehensive frame-by-frame visual forensics:
        pixel diffs, optical flow vectors, zoom punches, camera shake, flashes, pans.
        """
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return {
                "visualEvents": [],
                "zooms": [],
                "zoomPunches": [],
                "shakes": [],
                "flashes": [],
                "fades": [],
                "pans": [],
                "staticSections": []
            }

        prev_gray = None
        prev_edges = None
        frame_idx = 0

        visual_events = []
        raw_zoom_samples = []
        raw_shake_samples = []
        raw_pan_samples = []
        flashes = []
        fades = []
        static_samples = []

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            h, w = frame.shape[:2]
            scale = 360.0 / float(max(h, w)) if max(h, w) > 360 else 1.0
            small_w, small_h = int(w * scale), int(h * scale)
            small_frame = cv2.resize(frame, (small_w, small_h))

            gray = cv2.cvtColor(small_frame, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            brightness = float(np.mean(gray))

            if prev_gray is not None:
                timestamp = round(frame_idx / self.fps, 6)

                pixel_diff = float(np.mean(np.abs(gray.astype(float) - prev_gray.astype(float)))) / 255.0
                prev_bright = float(np.mean(prev_gray))
                bright_diff = brightness - prev_bright

                # 1. Flashes & Exposure Spikes
                if brightness > 235 and bright_diff > 35:
                    flashes.append({
                        "type": "white_flash",
                        "startFrame": frame_idx,
                        "endFrame": frame_idx + 1,
                        "startTime": timestamp,
                        "endTime": round((frame_idx + 1) / self.fps, 6),
                        "confidence": 0.95,
                        "source": "opencv_brightness_spike"
                    })
                elif brightness < 15 and bright_diff < -35:
                    flashes.append({
                        "type": "black_flash",
                        "startFrame": frame_idx,
                        "endFrame": frame_idx + 1,
                        "startTime": timestamp,
                        "endTime": round((frame_idx + 1) / self.fps, 6),
                        "confidence": 0.95,
                        "source": "opencv_brightness_spike"
                    })
                elif abs(bright_diff) > 45:
                    flashes.append({
                        "type": "exposure_spike",
                        "startFrame": frame_idx,
                        "endFrame": frame_idx + 1,
                        "startTime": timestamp,
                        "endTime": round((frame_idx + 1) / self.fps, 6),
                        "confidence": 0.85,
                        "source": "opencv_brightness_spike"
                    })

                # 2. Visual Diffs
                if pixel_diff > 0.35:
                    visual_events.append({
                        "type": "large_visual_change",
                        "frame": frame_idx,
                        "timestamp": timestamp,
                        "pixelDiff": round(pixel_diff, 4),
                        "confidence": 0.90,
                        "source": "opencv_pixel_diff"
                    })
                elif pixel_diff > 0.15:
                    visual_events.append({
                        "type": "visual_change",
                        "frame": frame_idx,
                        "timestamp": timestamp,
                        "pixelDiff": round(pixel_diff, 4),
                        "confidence": 0.78,
                        "source": "opencv_pixel_diff"
                    })

                # 3. Dense Optical Flow Motion Analysis
                flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
                fx, fy = flow[..., 0], flow[..., 1]
                mag, ang = cv2.cartToPolar(fx, fy)

                mean_fx, mean_fy = float(np.mean(fx)), float(np.mean(fy))
                mean_mag = float(np.mean(mag))
                std_mag = float(np.std(mag))

                # Radial Flow (Zoom)
                y_coords, x_coords = np.mgrid[0:small_h, 0:small_w]
                cx, cy = small_w / 2.0, small_h / 2.0
                rx = x_coords - cx
                ry = y_coords - cy
                r_dist = np.sqrt(rx**2 + ry**2)
                r_dist[r_dist == 0] = 1.0

                dot_radial = (fx * rx + fy * ry) / r_dist
                mean_radial = float(np.mean(dot_radial))

                if abs(mean_radial) > 0.5 and mean_mag > 0.6:
                    raw_zoom_samples.append({
                        "frame": frame_idx,
                        "time": timestamp,
                        "radial": mean_radial,
                        "mag": mean_mag
                    })

                if std_mag > 1.6 and mean_mag > 1.0:
                    raw_shake_samples.append({
                        "frame": frame_idx,
                        "time": timestamp,
                        "intensity": min(1.0, float(std_mag / 3.8)),
                        "h_intensity": min(1.0, float(np.std(fx) / 3.0)),
                        "v_intensity": min(1.0, float(np.std(fy) / 3.0))
                    })

                if mean_mag > 1.5 and abs(mean_radial) < 0.3:
                    pan_dir = "pan_right" if mean_fx > 1.0 else ("pan_left" if mean_fx < -1.0 else ("pan_down" if mean_fy > 1.0 else "pan_up"))
                    raw_pan_samples.append({
                        "frame": frame_idx,
                        "time": timestamp,
                        "direction": pan_dir,
                        "magnitude": round(mean_mag, 2)
                    })

                if mean_mag < 0.15 and pixel_diff < 0.03:
                    static_samples.append({
                        "frame": frame_idx,
                        "time": timestamp
                    })

            prev_gray = gray
            prev_edges = edges
            frame_idx += 1

        cap.release()

        # Process motion groups
        zooms = self._group_continuous_events(raw_zoom_samples, "zoom")
        shakes = self._group_continuous_events(raw_shake_samples, "shake")
        pans = self._group_continuous_events(raw_pan_samples, "pan")
        static_sections = self._group_continuous_events(static_samples, "static")

        # Detect Zoom Punches (Short, aggressive zoom bursts <= 15 frames)
        zoom_punches = []
        for z in zooms:
            dur_frames = z["endFrame"] - z["startFrame"]
            if dur_frames <= 16:
                peak_f = z["startFrame"] + dur_frames // 2
                zoom_punches.append({
                    "type": "zoom_punch",
                    "startFrame": z["startFrame"],
                    "peakFrame": peak_f,
                    "endFrame": z["endFrame"],
                    "startTime": z["startTime"],
                    "endTime": z["endTime"],
                    "estimatedScale": z.get("scaleEnd", 1.15),
                    "confidence": 0.88,
                    "estimated": True,
                    "source": "opencv_optical_flow"
                })

        return {
            "visualEvents": visual_events,
            "zooms": zooms,
            "zoomPunches": zoom_punches,
            "shakes": shakes,
            "flashes": flashes,
            "fades": fades,
            "pans": pans,
            "staticSections": static_sections
        }

    def _group_continuous_events(self, buffer: List[Dict[str, Any]], event_kind: str) -> List[Dict[str, Any]]:
        if not buffer:
            return []

        grouped = []
        current_group = [buffer[0]]

        for i in range(1, len(buffer)):
            prev = buffer[i - 1]
            curr = buffer[i]
            if curr["frame"] - prev["frame"] <= 2:
                current_group.append(curr)
            else:
                if len(current_group) >= 2:
                    grouped.append(self._format_group(current_group, event_kind))
                current_group = [curr]

        if len(current_group) >= 2:
            grouped.append(self._format_group(current_group, event_kind))

        return grouped

    def _format_group(self, group: List[Dict[str, Any]], event_kind: str) -> Dict[str, Any]:
        start_f = group[0]["frame"]
        end_f = group[-1]["frame"]
        start_t = group[0]["time"]
        end_t = group[-1]["time"]

        if event_kind == "zoom":
            avg_rad = float(np.mean([g["radial"] for g in group]))
            z_type = "zoom_out" if avg_rad > 0 else "zoom_in"
            estimated_scale_end = round(1.0 + abs(avg_rad) * 0.08, 2)
            return {
                "type": z_type,
                "startFrame": start_f,
                "endFrame": end_f,
                "startTime": start_t,
                "endTime": end_t,
                "scaleStart": 1.0,
                "scaleEnd": estimated_scale_end,
                "confidence": 0.85,
                "estimated": True,
                "source": "opencv_optical_flow"
            }
        elif event_kind == "shake":
            avg_intensity = round(float(np.mean([g["intensity"] for g in group])), 2)
            avg_h = round(float(np.mean([g["h_intensity"] for g in group])), 2)
            avg_v = round(float(np.mean([g["v_intensity"] for g in group])), 2)
            return {
                "type": "camera_shake",
                "startFrame": start_f,
                "endFrame": end_f,
                "startTime": start_t,
                "endTime": end_t,
                "intensity": avg_intensity,
                "horizontalIntensity": avg_h,
                "verticalIntensity": avg_v,
                "rotationIntensity": round(avg_intensity * 0.3, 2),
                "confidence": 0.82,
                "estimated": True,
                "source": "opencv_optical_flow"
            }
        elif event_kind == "pan":
            direction = group[0].get("direction", "pan_right")
            avg_mag = round(float(np.mean([g["magnitude"] for g in group])), 2)
            return {
                "type": direction,
                "startFrame": start_f,
                "endFrame": end_f,
                "startTime": start_t,
                "endTime": end_t,
                "magnitude": avg_mag,
                "confidence": 0.80,
                "source": "opencv_optical_flow"
            }
        elif event_kind == "static":
            return {
                "type": "static_section",
                "startFrame": start_f,
                "endFrame": end_f,
                "startTime": start_t,
                "endTime": end_t,
                "confidence": 0.95,
                "source": "opencv_motion_analysis"
            }

        return {}
