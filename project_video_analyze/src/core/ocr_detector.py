import cv2
import numpy as np
from typing import Dict, Any, List

class LocalOCRDetector:
    def __init__(self, video_path: str, fps: float, total_frames: int, sample_interval: int = None):
        self.video_path = video_path
        self.fps = fps
        self.total_frames = total_frames
        if sample_interval is None:
            # Adaptively scale OCR sampling interval so it stays under 30-40 frames sampled
            self.sample_interval = max(15, total_frames // 40)
        else:
            self.sample_interval = sample_interval
        self._reader = None
        self._ocr_engine = None
        self._init_engine()

    def _init_engine(self):
        try:
            import easyocr
            self._reader = easyocr.Reader(['en'], gpu=False, verbose=False)
            self._ocr_engine = "easyocr"
        except Exception as e:
            try:
                import pytesseract
                self._ocr_engine = "pytesseract"
            except Exception:
                self._ocr_engine = None

    def run(self) -> List[Dict[str, Any]]:
        """
        Runs local OCR on sampled frames to locate text, bounding boxes, and visible frame ranges.
        """
        if not self._ocr_engine:
            return []

        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return []

        raw_detections = []
        frame_idx = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_idx % self.sample_interval == 0:
                h, w = frame.shape[:2]
                
                if self._ocr_engine == "easyocr":
                    results = self._reader.readtext(frame)
                    for bbox, text, prob in results:
                        text_clean = text.strip()
                        if len(text_clean) >= 2 and prob > 0.40:
                            # Convert easyocr bounding box [[x1,y1],[x2,y1],[x2,y2],[x1,y2]]
                            x_coords = [p[0] for p in bbox]
                            y_coords = [p[1] for p in bbox]
                            bx = int(min(x_coords))
                            by = int(min(y_coords))
                            bw = int(max(x_coords) - bx)
                            bh = int(max(y_coords) - by)

                            raw_detections.append({
                                "frame": frame_idx,
                                "text": text_clean,
                                "confidence": round(float(prob), 2),
                                "boundingBox": {"x": bx, "y": by, "width": bw, "height": bh}
                            })

                elif self._ocr_engine == "pytesseract":
                    import pytesseract
                    data = pytesseract.image_to_data(frame, output_type=pytesseract.Output.DICT)
                    n_boxes = len(data['text'])
                    for i in range(n_boxes):
                        t_text = data['text'][i].strip()
                        conf = float(data['conf'][i])
                        if len(t_text) >= 2 and conf > 40:
                            bx = int(data['left'][i])
                            by = int(data['top'][i])
                            bw = int(data['width'][i])
                            bh = int(data['height'][i])

                            raw_detections.append({
                                "frame": frame_idx,
                                "text": t_text,
                                "confidence": round(conf / 100.0, 2),
                                "boundingBox": {"x": bx, "y": by, "width": bw, "height": bh}
                            })

            frame_idx += 1

        cap.release()

        # Consolidate raw text detections into frame ranges [startFrame, endFrame]
        return self._consolidate_text_elements(raw_detections)

    def _consolidate_text_elements(self, raw_detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not raw_detections:
            return []

        # Group by text content
        grouped = {}
        for det in raw_detections:
            t = det["text"].upper()
            if t not in grouped:
                grouped[t] = []
            grouped[t].append(det)

        consolidated = []
        for text_str, occurrences in grouped.items():
            occurrences.sort(key=lambda x: x["frame"])
            
            curr_cluster = [occurrences[0]]
            for i in range(1, len(occurrences)):
                prev = occurrences[i - 1]
                curr = occurrences[i]
                if curr["frame"] - prev["frame"] <= self.sample_interval * 3:
                    curr_cluster.append(curr)
                else:
                    consolidated.append(self._format_text_element(text_str, curr_cluster))
                    curr_cluster = [curr]

            if curr_cluster:
                consolidated.append(self._format_text_element(text_str, curr_cluster))

        return consolidated

    def _format_text_element(self, text_str: str, cluster: List[Dict[str, Any]]) -> Dict[str, Any]:
        start_f = cluster[0]["frame"]
        end_f = cluster[-1]["frame"]
        avg_conf = round(float(np.mean([c["confidence"] for c in cluster])), 2)

        avg_x = int(np.mean([c["boundingBox"]["x"] for c in cluster]))
        avg_y = int(np.mean([c["boundingBox"]["y"] for c in cluster]))
        avg_w = int(np.mean([c["boundingBox"]["width"] for c in cluster]))
        avg_h = int(np.mean([c["boundingBox"]["height"] for c in cluster]))

        # Detect animation type based on initial bounding box scale/position changes
        animation = "unknown"
        if len(cluster) >= 2:
            first_area = cluster[0]["boundingBox"]["width"] * cluster[0]["boundingBox"]["height"]
            last_area = cluster[-1]["boundingBox"]["width"] * cluster[-1]["boundingBox"]["height"]
            if first_area > 0 and last_area / float(first_area) > 1.25:
                animation = "scale_up"
            elif first_area > 0 and last_area / float(first_area) < 0.8:
                animation = "pop_in"
            elif abs(cluster[-1]["boundingBox"]["y"] - cluster[0]["boundingBox"]["y"]) > 30:
                animation = "slide_in"
            else:
                animation = "pop_in"

        return {
            "text": cluster[0]["text"], # preserve original case
            "startFrame": start_f,
            "endFrame": end_f + self.sample_interval,
            "startTime": round(start_f / self.fps, 6),
            "endTime": round((end_f + self.sample_interval) / self.fps, 6),
            "animation": animation,
            "boundingBox": {
                "x": avg_x,
                "y": avg_y,
                "width": avg_w,
                "height": avg_h
            },
            "confidence": avg_conf,
            "source": f"local_{self._ocr_engine}"
        }
