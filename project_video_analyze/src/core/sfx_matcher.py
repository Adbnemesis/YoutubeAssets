import os
import glob
import numpy as np
import librosa
from typing import List, Dict, Any, Optional

class SFXMatcher:
    def __init__(self, sfx_dirs: Optional[List[str]] = None):
        self.sfx_dirs = sfx_dirs or [
            "public/sfx",
            "assets/sound_effects",
            "project_cool_edit/assets/sound_effects",
            "project_cool_edit/assets/audio"
        ]
        self.db: List[Dict[str, Any]] = []
        self._build_database()

    def _build_database(self):
        """
        Scans local SFX directories and builds an audio feature database.
        """
        sfx_files = []
        for s_dir in self.sfx_dirs:
            if os.path.isdir(s_dir):
                for ext in ["*.wav", "*.mp3", "*.ogg", "*.flac"]:
                    sfx_files.extend(glob.glob(os.path.join(s_dir, ext)))
                    sfx_files.extend(glob.glob(os.path.join(s_dir, "**", ext), recursive=True))

        sfx_files = list(set(sfx_files))
        if not sfx_files:
            return

        for filepath in sfx_files:
            try:
                y, sr = librosa.load(filepath, sr=22050, mono=True, duration=3.0)
                if len(y) < 512:
                    continue
                
                # Feature extraction: MFCCs, Spectral Centroid, ZCR
                mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
                mfcc_mean = np.mean(mfcc, axis=1)
                mfcc_std = np.std(mfcc, axis=1)
                cent = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
                cent_mean = float(np.mean(cent))
                
                feat_vec = np.hstack([mfcc_mean, mfcc_std, [cent_mean / 5000.0]])
                norm = np.linalg.norm(feat_vec)
                if norm > 0:
                    feat_vec = feat_vec / norm

                filename = os.path.basename(filepath)
                self.db.append({
                    "filename": filename,
                    "filepath": filepath,
                    "feat": feat_vec
                })
            except Exception:
                continue

    def match_transient(self, y_segment: np.ndarray, sr: int = 22050) -> Dict[str, Any]:
        """
        Compares an audio transient segment against the SFX database.
        Returns match candidate and confidence, or fallback audio_transient.
        """
        if not self.db or len(y_segment) < 512:
            return {"type": "audio_transient", "confidence": 0.50}

        try:
            mfcc = librosa.feature.mfcc(y=y_segment, sr=sr, n_mfcc=13)
            mfcc_mean = np.mean(mfcc, axis=1)
            mfcc_std = np.std(mfcc, axis=1)
            cent = librosa.feature.spectral_centroid(y=y_segment, sr=sr)[0]
            cent_mean = float(np.mean(cent))

            q_vec = np.hstack([mfcc_mean, mfcc_std, [cent_mean / 5000.0]])
            norm = np.linalg.norm(q_vec)
            if norm > 0:
                q_vec = q_vec / norm

            best_score = -1.0
            best_candidate = ""

            for item in self.db:
                sim = float(np.dot(q_vec, item["feat"]))
                if sim > best_score:
                    best_score = sim
                    best_candidate = item["filename"]

            # Only return sfx_match if confidence is sufficiently high (>= 0.75)
            if best_score >= 0.75:
                return {
                    "type": "sfx_match",
                    "candidate": best_candidate,
                    "confidence": round(best_score, 4)
                }
            else:
                return {
                    "type": "audio_transient",
                    "confidence": round(max(0.50, best_score), 4)
                }
        except Exception:
            return {"type": "audio_transient", "confidence": 0.50}
