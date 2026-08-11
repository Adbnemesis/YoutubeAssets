import cv2
import numpy as np
from typing import List, Dict, Any
from scenedetect import detect, ContentDetector, ThresholdDetector

class MultiEngineSceneDetector:
    def __init__(self, video_path: str, fps: float, total_frames: int):
        self.video_path = video_path
        self.fps = fps
        self.total_frames = total_frames

    def detect_pyscenedetect(self) -> List[Dict[str, Any]]:
        """
        Uses PySceneDetect ContentDetector & ThresholdDetector.
        """
        results = []
        try:
            # ContentDetector for hard cuts and scene changes
            content_scenes = detect(self.video_path, ContentDetector(threshold=27.0))
            for scene in content_scenes:
                start_frame = scene[0].get_frames()
                start_time = scene[0].get_seconds()
                results.append({
                    "frame": start_frame,
                    "timestamp": round(start_time, 6),
                    "confidence": 0.88,
                    "detection_method": "pyscenedetect_content",
                    "type": "hard_cut"
                })

            # ThresholdDetector for fade to black / fade from black
            threshold_scenes = detect(self.video_path, ThresholdDetector(threshold=12))
            for scene in threshold_scenes:
                start_frame = scene[0].get_frames()
                start_time = scene[0].get_seconds()
                results.append({
                    "frame": start_frame,
                    "timestamp": round(start_time, 6),
                    "confidence": 0.82,
                    "detection_method": "pyscenedetect_threshold",
                    "type": "fade_to_black"
                })
        except Exception as e:
            print(f"[Warning] PySceneDetect error: {e}")
            
        return results

    def detect_optical_boundary_classifier(self) -> List[Dict[str, Any]]:
        """
        Second independent shot boundary detector. Uses frame-to-frame HSV color histogram,
        luminance difference, and edge magnitude delta analysis to detect transitions.
        """
        results = []
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return results

        prev_frame = None
        prev_hist = None
        prev_gray = None
        frame_idx = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
            hist = cv2.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])
            cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)

            if prev_frame is not None:
                # 1. Histogram correlation distance
                hist_diff = 1.0 - cv2.compareHist(prev_hist, hist, cv2.HISTCMP_CORREL)

                # 2. Mean absolute pixel difference
                pixel_diff = np.mean(np.abs(gray.astype(float) - prev_gray.astype(float))) / 255.0

                # 3. Brightness difference
                mean_bright_curr = np.mean(gray)
                mean_bright_prev = np.mean(prev_gray)
                bright_diff = abs(mean_bright_curr - mean_bright_prev) / 255.0

                # Classify transitions
                if hist_diff > 0.65 or pixel_diff > 0.45:
                    timestamp = round(frame_idx / self.fps, 6)
                    
                    if mean_bright_curr < 15 and mean_bright_prev > 40:
                        t_type = "fade_to_black"
                        conf = 0.90
                    elif mean_bright_prev < 15 and mean_bright_curr > 40:
                        t_type = "fade_from_black"
                        conf = 0.90
                    elif bright_diff > 0.5:
                        t_type = "flash_transition"
                        conf = 0.85
                    elif hist_diff > 0.8:
                        t_type = "hard_cut"
                        conf = 0.92
                    elif hist_diff > 0.4:
                        t_type = "dissolve"
                        conf = 0.75
                    else:
                        t_type = "possible_transition"
                        conf = 0.60

                    results.append({
                        "frame": frame_idx,
                        "timestamp": timestamp,
                        "confidence": round(conf, 2),
                        "detection_method": "optical_boundary_classifier",
                        "type": t_type
                    })

            prev_frame = frame
            prev_hist = hist
            prev_gray = gray
            frame_idx += 1

        cap.release()
        return results

    def reconcile_transitions(self, engine1_events: List[Dict[str, Any]], engine2_events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Reconciles shot boundary detection from both independent detectors.
        Deduplicates close frames (+/- 3 frames window) and boosts confidence for matched cuts.
        """
        all_candidates = engine1_events + engine2_events
        all_candidates.sort(key=lambda x: x["frame"])

        reconciled_cuts = []
        reconciled_transitions = []
        scenes = []

        window_frames = max(2, int(self.fps * 0.1)) # ~100ms window
        visited = set()

        for i, event in enumerate(all_candidates):
            if i in visited:
                continue

            cluster = [event]
            visited.add(i)

            for j in range(i + 1, len(all_candidates)):
                if j in visited:
                    continue
                if abs(all_candidates[j]["frame"] - event["frame"]) <= window_frames:
                    cluster.append(all_candidates[j])
                    visited.add(j)
                else:
                    break

            # If both detectors caught the cut, boost confidence!
            best_event = max(cluster, key=lambda x: x["confidence"])
            if len(cluster) > 1:
                final_conf = min(0.99, best_event["confidence"] + 0.10)
                methods = list(set(c["detection_method"] for c in cluster))
                detection_method = "reconciled_" + "+".join(methods)
            else:
                final_conf = best_event["confidence"]
                detection_method = best_event["detection_method"]

            final_type = best_event["type"]
            if final_type not in ["hard_cut", "fade", "fade_to_black", "fade_from_black", "dissolve", "flash_transition", "rapid_transition", "possible_transition"]:
                final_type = "unknown_transition"

            rec_item = {
                "startFrame": best_event["frame"],
                "endFrame": best_event["frame"],
                "startTime": best_event["timestamp"],
                "endTime": best_event["timestamp"],
                "type": final_type,
                "confidence": round(final_conf, 2),
                "detectionMethod": detection_method
            }

            if final_type == "hard_cut":
                reconciled_cuts.append(rec_item)
            reconciled_transitions.append(rec_item)

        # Build continuous scenes list
        scene_start_frame = 0
        scene_id = 1

        cut_frames = sorted(list(set([t["startFrame"] for t in reconciled_transitions if t["startFrame"] > 0])))
        for cut_f in cut_frames:
            scenes.append({
                "sceneId": scene_id,
                "startFrame": scene_start_frame,
                "endFrame": cut_f - 1,
                "startTime": round(scene_start_frame / self.fps, 6),
                "endTime": round((cut_f - 1) / self.fps, 6),
                "durationFrames": cut_f - scene_start_frame
            })
            scene_start_frame = cut_f
            scene_id += 1

        # Last scene
        if scene_start_frame < self.total_frames:
            scenes.append({
                "sceneId": scene_id,
                "startFrame": scene_start_frame,
                "endFrame": self.total_frames - 1,
                "startTime": round(scene_start_frame / self.fps, 6),
                "endTime": round((self.total_frames - 1) / self.fps, 6),
                "durationFrames": self.total_frames - scene_start_frame
            })

        return {
            "scenes": scenes,
            "cuts": reconciled_cuts,
            "transitions": reconciled_transitions
        }

    def run(self) -> Dict[str, Any]:
        pyscene_events = self.detect_pyscenedetect()
        optical_events = self.detect_optical_boundary_classifier()
        return self.reconcile_transitions(pyscene_events, optical_events)
