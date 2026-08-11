import os
import shutil
import json
import subprocess
import cv2
import numpy as np
from typing import Dict, Any, List, Optional

class LocalVLMAnnotator:
    def __init__(self, video_path: str, fps: float, temp_dir: str):
        self.video_path = video_path
        self.fps = fps
        self.temp_dir = temp_dir
        self.ollama_bin = shutil.which('ollama')

    def annotate_keyframes(self, sample_frames: List[int]) -> Dict[int, str]:
        """
        Takes a list of specific frame numbers (from adaptive sampling around key events),
        extracts those frames, and generates semantic visual labels using local VLM or vision classifier.
        """
        annotations = {}
        if not sample_frames:
            return annotations

        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return annotations

        for frame_num in sample_frames:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
            ret, frame = cap.read()
            if not ret:
                continue

            img_path = os.path.join(self.temp_dir, f"vlm_frame_{frame_num:06d}.jpg")
            cv2.imwrite(img_path, frame)

            description = self._describe_image(img_path, frame)
            annotations[frame_num] = description

            # Clean temp keyframe
            if os.path.exists(img_path):
                try:
                    os.remove(img_path)
                except Exception:
                    pass

        cap.release()
        return annotations

    def _describe_image(self, image_path: str, frame_mat: np.ndarray) -> str:
        """
        Uses Ollama local vision model if available, or fallback image classifier.
        """
        if self.ollama_bin:
            try:
                # Call local ollama vision model (e.g. llava, moondream, or qwen2-vl if installed)
                cmd = [
                    self.ollama_bin,
                    'run',
                    'moondream',
                    f'Describe in 1 short concise sentence what is visually shown in this image: {image_path}'
                ]
                res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=8)
                if res.returncode == 0 and res.stdout.strip():
                    return res.stdout.strip()
            except Exception:
                pass

        # Fallback local heuristic computer vision classifier
        return self._heuristic_vision_label(frame_mat)

    def _heuristic_vision_label(self, frame_mat: np.ndarray) -> str:
        """
        Fallback semantic labeling based on color distribution, edges, and object regions.
        """
        h, w, c = frame_mat.shape
        gray = cv2.cvtColor(frame_mat, cv2.COLOR_BGR2GRAY)
        mean_b = float(np.mean(gray))
        std_b = float(np.std(gray))
        
        edges = cv2.Canny(gray, 50, 150)
        edge_density = float(np.mean(edges)) / 255.0

        # Check color dominance
        hsv = cv2.cvtColor(frame_mat, cv2.COLOR_BGR2HSV)
        sat = float(np.mean(hsv[:, :, 1]))

        if mean_b < 25:
            return "Dark background or low-light scene transition"
        elif sat > 120 and edge_density > 0.12:
            return "High-contrast colorful graphic with artwork or text overlay"
        elif edge_density > 0.15:
            return "Detailed scene content with complex visual elements"
        elif std_b < 30:
            return "Clean solid or gradient background layer"
        else:
            return "Visual scene content"
