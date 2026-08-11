import cv2
import numpy as np
import os
from typing import List, Dict, Any

class ContactSheetGenerator:
    def __init__(self, video_path: str, fps: float, total_frames: int, output_dir: str):
        self.video_path = video_path
        self.fps = fps
        self.total_frames = total_frames
        self.output_dir = output_dir

    def generate(self, grid_cols: int = 10, num_samples: int = None) -> str:
        """
        Generates a high-density master contact sheet grid overview (contact_sheet.jpg).
        """
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return ""

        if num_samples is None:
            num_samples = max(60, self.total_frames // 3)

        step = max(1, self.total_frames // num_samples)
        sample_indices = list(range(0, self.total_frames, step))[:num_samples]

        thumbs = []
        thumb_w, thumb_h = 160, 240

        for frame_num in sample_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
            ret, frame = cap.read()
            if not ret:
                continue

            img = cv2.resize(frame, (thumb_w, thumb_h))
            timestamp_sec = frame_num / self.fps
            mins = int(timestamp_sec // 60)
            secs = timestamp_sec % 60
            time_str = f"{mins:02d}:{secs:05.2f}|F{frame_num}"

            cv2.rectangle(img, (0, thumb_h - 26), (thumb_w, thumb_h), (0, 0, 0), -1)
            cv2.putText(img, time_str, (4, thumb_h - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 255), 1, cv2.LINE_AA)
            thumbs.append(img)

        cap.release()
        if not thumbs:
            return ""

        grid_mat = self._build_grid(thumbs, grid_cols, thumb_w, thumb_h)
        output_path = os.path.join(self.output_dir, "contact_sheet.jpg")
        cv2.imwrite(output_path, grid_mat)

        return output_path

    def generate_event_contact_sheet(self, key_event_frames: List[int], grid_cols: int = 8) -> str:
        """
        Generates an event-focused contact sheet (event_contact_sheet.jpg)
        extracting frame clusters (-5, -2, 0, +2, +5) around major edit events.
        """
        if not key_event_frames:
            return ""

        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return ""

        cluster_frames = []
        for ef in key_event_frames[:10]: # Up to 10 major events
            for offset in [-6, -3, 0, +3, +6]:
                f_target = max(0, min(self.total_frames - 1, ef + offset))
                cluster_frames.append(f_target)

        cluster_frames = sorted(list(set(cluster_frames)))
        thumbs = []
        thumb_w, thumb_h = 180, 270

        for f_num in cluster_frames:
            cap.set(cv2.CAP_PROP_POS_FRAMES, f_num)
            ret, frame = cap.read()
            if not ret:
                continue

            img = cv2.resize(frame, (thumb_w, thumb_h))
            timestamp_sec = f_num / self.fps
            time_str = f"EVENT | F{f_num} ({timestamp_sec:.2f}s)"

            cv2.rectangle(img, (0, thumb_h - 26), (thumb_w, thumb_h), (0, 0, 0), -1)
            cv2.putText(img, time_str, (4, thumb_h - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 255, 0), 1, cv2.LINE_AA)
            thumbs.append(img)

        cap.release()
        if not thumbs:
            return ""

        grid_mat = self._build_grid(thumbs, grid_cols, thumb_w, thumb_h)
        output_path = os.path.join(self.output_dir, "event_contact_sheet.jpg")
        cv2.imwrite(output_path, grid_mat)

        return output_path

    def _build_grid(self, thumbs: List[np.ndarray], grid_cols: int, thumb_w: int, thumb_h: int) -> np.ndarray:
        rows = []
        for i in range(0, len(thumbs), grid_cols):
            row_thumbs = thumbs[i:i + grid_cols]
            if len(row_thumbs) < grid_cols:
                pad_count = grid_cols - len(row_thumbs)
                for _ in range(pad_count):
                    row_thumbs.append(np.zeros((thumb_h, thumb_w, 3), dtype=np.uint8))
            row_mat = np.hstack(row_thumbs)
            rows.append(row_mat)
        return np.vstack(rows)
