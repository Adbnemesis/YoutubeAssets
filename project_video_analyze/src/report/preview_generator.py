import os
import subprocess
from typing import List, Dict, Any

class EventPreviewGenerator:
    def __init__(self, video_path: str, fps: float, output_dir: str):
        self.video_path = video_path
        self.fps = fps
        self.preview_dir = os.path.join(output_dir, "previews")
        os.makedirs(self.preview_dir, exist_ok=True)

    def generate_previews(self, cuts: List[Dict[str, Any]], zooms: List[Dict[str, Any]], shakes: List[Dict[str, Any]], max_per_type: int = 5) -> List[str]:
        """
        Generates short 1.5s preview MP4 clips centered around key visual events.
        """
        created_files = []

        # 1. Cut Previews
        for idx, c in enumerate(cuts[:max_per_type]):
            f_num = c.get("startFrame", 0)
            t_sec = f_num / self.fps
            start_t = max(0.0, t_sec - 0.75)
            out_file = os.path.join(self.preview_dir, f"cut_{idx+1:02d}_frame_{f_num}.mp4")
            if self._trim_clip(start_t, 1.5, out_file):
                created_files.append(out_file)

        # 2. Zoom Previews
        for idx, z in enumerate(zooms[:max_per_type]):
            f_num = z.get("startFrame", 0)
            t_sec = f_num / self.fps
            start_t = max(0.0, t_sec - 0.5)
            out_file = os.path.join(self.preview_dir, f"zoom_{idx+1:02d}_frame_{f_num}.mp4")
            if self._trim_clip(start_t, 1.5, out_file):
                created_files.append(out_file)

        # 3. Shake Previews
        for idx, s in enumerate(shakes[:max_per_type]):
            f_num = s.get("startFrame", 0)
            t_sec = f_num / self.fps
            start_t = max(0.0, t_sec - 0.5)
            out_file = os.path.join(self.preview_dir, f"shake_{idx+1:02d}_frame_{f_num}.mp4")
            if self._trim_clip(start_t, 1.5, out_file):
                created_files.append(out_file)

        return created_files

    def _trim_clip(self, start_time: float, duration: float, out_path: str) -> bool:
        cmd = [
            "ffmpeg", "-y",
            "-ss", f"{start_time:.3f}",
            "-i", self.video_path,
            "-t", f"{duration:.3f}",
            "-c:v", "libx264", "-preset", "ultrafast",
            "-an",
            out_path
        ]
        try:
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
            return res.returncode == 0 and os.path.exists(out_path)
        except Exception:
            return False
