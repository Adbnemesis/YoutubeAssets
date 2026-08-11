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

    def generate(self, grid_cols: int = 5, num_samples: int = 25) -> str:
        """
        Generates a master contact sheet grid overview (contact_sheet.jpg) with burnt-in timestamps & frame numbers.
        """
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return ""

        step = max(1, self.total_frames // num_samples)
        sample_indices = list(range(0, self.total_frames, step))[:num_samples]

        thumbs = []
        thumb_w, thumb_h = 240, 360

        for frame_num in sample_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
            ret, frame = cap.read()
            if not ret:
                continue

            # Resize to thumbnail size
            img = cv2.resize(frame, (thumb_w, thumb_h))
            timestamp_sec = frame_num / self.fps
            mins = int(timestamp_sec // 60)
            secs = timestamp_sec % 60
            time_str = f"{mins:02d}:{secs:06.3f} | F{frame_num}"

            # Draw dark banner for text readability
            cv2.rectangle(img, (0, thumb_h - 35), (thumb_w, thumb_h), (0, 0, 0), -1)
            cv2.putText(img, time_str, (8, thumb_h - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1, cv2.LINE_AA)

            thumbs.append(img)

        cap.release()

        if not thumbs:
            return ""

        # Layout into grid
        rows = []
        for i in range(0, len(thumbs), grid_cols):
            row_thumbs = thumbs[i:i + grid_cols]
            if len(row_thumbs) < grid_cols:
                # Pad row with black tiles
                pad_count = grid_cols - len(row_thumbs)
                for _ in range(pad_count):
                    row_thumbs.append(np.zeros((thumb_h, thumb_w, 3), dtype=np.uint8))
            row_mat = np.hstack(row_thumbs)
            rows.append(row_mat)

        grid_mat = np.vstack(rows)
        output_path = os.path.join(self.output_dir, "contact_sheet.jpg")
        cv2.imwrite(output_path, grid_mat)

        return output_path
