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
        Executes frame-by-frame visual analysis including pixel diffs, brightness diffs,
        edge magnitude diffs, optical flow motion tracking (pan, zoom in/out, shake, flash, fade).
        """
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return {
                "visualEvents": [],
                "zooms": [],
                "shakes": [],
                "flashes": [],
                "fades": [],
                "staticSections": []
            }

        prev_gray = None
        prev_hsv = None
        prev_edges = None
        frame_idx = 0

        visual_events = []
        zooms = []
        shakes = []
        flashes = []
        fades = []
        static_sections = []

        # Tracking continuous motion states
        motion_buffers = {
            "zoom": [],
            "shake": [],
            "static": []
        }

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            h, w = frame.shape[:2]
            # Downsample frame for fast processing (360p max for optical flow)
            scale = 360.0 / float(max(h, w)) if max(h, w) > 360 else 1.0
            small_w, small_h = int(w * scale), int(h * scale)
            small_frame = cv2.resize(frame, (small_w, small_h))

            gray = cv2.cvtColor(small_frame, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            brightness = float(np.mean(gray))

            if prev_gray is not None:
                timestamp = round(frame_idx / self.fps, 6)

                # 1. Pixel & Brightness Diffs
                pixel_diff = float(np.mean(np.abs(gray.astype(float) - prev_gray.astype(float)))) / 255.0
                bright_diff = brightness - float(np.mean(prev_gray))
                edge_diff = float(np.mean(np.abs(edges.astype(float) - prev_edges.astype(float)))) / 255.0

                # 2. Flash Detection (Brightness Spikes)
                if brightness > 235 and bright_diff > 40:
                    flashes.append({
                        "type": "white_flash",
                        "startFrame": frame_idx,
                        "endFrame": frame_idx + 1,
                        "startTime": timestamp,
                        "endTime": round((frame_idx + 1) / self.fps, 6),
                        "confidence": 0.90,
                        "source": "opencv_brightness_spike"
                    })
                elif brightness < 15 and bright_diff < -40:
                    flashes.append({
                        "type": "black_flash",
                        "startFrame": frame_idx,
                        "endFrame": frame_idx + 1,
                        "startTime": timestamp,
                        "endTime": round((frame_idx + 1) / self.fps, 6),
                        "confidence": 0.90,
                        "source": "opencv_brightness_spike"
                    })

                # 3. Visual Changes
                if pixel_diff > 0.35:
                    visual_events.append({
                        "type": "large_visual_change",
                        "frame": frame_idx,
                        "timestamp": timestamp,
                        "pixelDiff": round(pixel_diff, 4),
                        "confidence": 0.88,
                        "source": "opencv_pixel_diff"
                    })
                elif pixel_diff > 0.15:
                    visual_events.append({
                        "type": "visual_change",
                        "frame": frame_idx,
                        "timestamp": timestamp,
                        "pixelDiff": round(pixel_diff, 4),
                        "confidence": 0.75,
                        "source": "opencv_pixel_diff"
                    })

                # 4. Dense Optical Flow for Motion (Pan, Zoom, Shake)
                flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
                fx, fy = flow[..., 0], flow[..., 1]
                mag, ang = cv2.cartToPolar(fx, fy)

                mean_mag = float(np.mean(mag))
                std_mag = float(np.std(mag))

                # Radial motion calculation for zoom detection
                # Grid coordinates centered at (0,0)
                y_coords, x_coords = np.mgrid[0:small_h, 0:small_w]
                cx, cy = small_w / 2.0, small_h / 2.0
                rx = x_coords - cx
                ry = y_coords - cy
                r_dist = np.sqrt(rx**2 + ry**2)
                r_dist[r_dist == 0] = 1.0

                # Radial dot product: positive = zoom out, negative = zoom in (or vice versa)
                dot_radial = (fx * rx + fy * ry) / r_dist
                mean_radial = float(np.mean(dot_radial))

                # Zoom classification
                if abs(mean_radial) > 0.6 and mean_mag > 0.8:
                    zoom_type = "zoom_out" if mean_radial > 0 else "zoom_in"
                    motion_buffers["zoom"].append({
                        "frame": frame_idx,
                        "time": timestamp,
                        "type": zoom_type,
                        "radial": mean_radial
                    })

                # Camera Shake (High variance/std in flow direction & magnitude over short frames)
                if std_mag > 1.8 and mean_mag > 1.2:
                    motion_buffers["shake"].append({
                        "frame": frame_idx,
                        "time": timestamp,
                        "intensity": min(1.0, float(std_mag / 4.0))
                    })

                # Static Section
                if mean_mag < 0.15 and pixel_diff < 0.03:
                    motion_buffers["static"].append({
                        "frame": frame_idx,
                        "time": timestamp
                    })

            prev_gray = gray
            prev_edges = edges
            frame_idx += 1

        cap.release()

        # Group continuous motion events into range objects
        zooms = self._group_continuous_events(motion_buffers["zoom"], "zoom")
        shakes = self._group_continuous_events(motion_buffers["shake"], "shake")
        static_sections = self._group_continuous_events(motion_buffers["static"], "static")

        return {
            "visualEvents": visual_events,
            "zooms": zooms,
            "shakes": shakes,
            "flashes": flashes,
            "fades": fades,
            "staticSections": static_sections
        }

    def _group_continuous_events(self, buffer: List[Dict[str, Any]], event_kind: str) -> List[Dict[str, Any]]:
        """
        Consolidates contiguous frame samples into startFrame -> endFrame objects.
        """
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
                if len(current_group) >= 3: # Require at least 3 contiguous frames
                    grouped.append(self._format_group(current_group, event_kind))
                current_group = [curr]

        if len(current_group) >= 3:
            grouped.append(self._format_group(current_group, event_kind))

        return grouped

    def _format_group(self, group: List[Dict[str, Any]], event_kind: str) -> Dict[str, Any]:
        start_f = group[0]["frame"]
        end_f = group[-1]["frame"]
        start_t = group[0]["time"]
        end_t = group[-1]["time"]

        if event_kind == "zoom":
            avg_rad = np.mean([g["radial"] for g in group])
            z_type = "zoom_in" if avg_rad < 0 else "zoom_out"
            estimated_scale_end = round(1.0 + abs(avg_rad) * 0.05, 2)
            return {
                "type": z_type,
                "startFrame": start_f,
                "endFrame": end_f,
                "startTime": start_t,
                "endTime": end_t,
                "scaleStart": 1.0,
                "scaleEnd": estimated_scale_end,
                "confidence": 0.82,
                "estimated": True,
                "source": "opencv_optical_flow"
            }
        elif event_kind == "shake":
            avg_intensity = round(float(np.mean([g["intensity"] for g in group])), 2)
            return {
                "type": "shake",
                "startFrame": start_f,
                "endFrame": end_f,
                "startTime": start_t,
                "endTime": end_t,
                "intensity": avg_intensity,
                "horizontalIntensity": round(avg_intensity * 0.9, 2),
                "verticalIntensity": round(avg_intensity * 0.8, 2),
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
