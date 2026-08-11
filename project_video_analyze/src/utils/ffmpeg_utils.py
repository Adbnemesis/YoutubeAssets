import json
import os
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional

def get_video_metadata(video_path: str) -> Dict[str, Any]:
    """
    Executes ffprobe to extract accurate metadata from an MP4 file.
    Includes FPS, duration, resolution, frame count, audio stream details.
    """
    cmd = [
        'ffprobe',
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        video_path
    ]
    
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    probe_data = json.loads(result.stdout)
    
    video_stream = None
    audio_stream = None
    
    for stream in probe_data.get('streams', []):
        if stream.get('codec_type') == 'video' and not video_stream:
            video_stream = stream
        elif stream.get('codec_type') == 'audio' and not audio_stream:
            audio_stream = stream
            
    if not video_stream:
        raise ValueError(f"No video stream found in {video_path}")

    # Calculate exact FPS from r_frame_rate or avg_frame_rate
    fps_str = video_stream.get('r_frame_rate', '30/1')
    if '/' in fps_str:
        num, den = map(float, fps_str.split('/'))
        fps = num / den if den != 0 else 30.0
    else:
        fps = float(fps_str)
        
    duration = float(probe_data.get('format', {}).get('duration', video_stream.get('duration', 0.0)))
    width = int(video_stream.get('width', 0))
    height = int(video_stream.get('height', 0))
    
    # Calculate exact frame count
    if 'nb_frames' in video_stream:
        total_frames = int(video_stream['nb_frames'])
    else:
        total_frames = int(round(duration * fps))

    metadata = {
        "filePath": os.path.abspath(video_path),
        "fileName": os.path.basename(video_path),
        "durationSeconds": round(duration, 6),
        "fps": round(fps, 4),
        "width": width,
        "height": height,
        "totalFrames": total_frames,
        "videoCodec": video_stream.get('codec_name', 'unknown'),
        "pixFmt": video_stream.get('pix_fmt', 'unknown'),
        "hasAudio": audio_stream is not None
    }
    
    if audio_stream:
        metadata["audioDetails"] = {
            "codec": audio_stream.get('codec_name', 'unknown'),
            "sampleRate": int(audio_stream.get('sample_rate', 44100)),
            "channels": int(audio_stream.get('channels', 2)),
            "bitrate": int(audio_stream.get('bit_rate', 0)) if audio_stream.get('bit_rate') else None
        }
    else:
        metadata["audioDetails"] = None
        
    return metadata

def extract_audio(video_path: str, output_wav_path: str, sample_rate: int = 22050) -> str:
    """
    Extracts audio track from video file into 16-bit mono WAV for Librosa & Whisper.
    """
    os.makedirs(os.path.dirname(output_wav_path), exist_ok=True)
    cmd = [
        'ffmpeg',
        '-y',
        '-i', video_path,
        '-vn',
        '-acodec', 'pcm_s16le',
        '-ar', str(sample_rate),
        '-ac', '1',
        output_wav_path
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    return output_wav_path

def extract_frame_at_time(video_path: str, timestamp_sec: float, output_img_path: str) -> str:
    """
    Extracts a high-precision single frame image at given timestamp.
    """
    os.makedirs(os.path.dirname(output_img_path), exist_ok=True)
    cmd = [
        'ffmpeg',
        '-y',
        '-ss', str(timestamp_sec),
        '-i', video_path,
        '-vframes', '1',
        '-q:v', '2',
        output_img_path
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    return output_img_path

def extract_frames_range(video_path: str, output_dir: str, start_frame: int, end_frame: int, fps: float) -> List[str]:
    """
    Extracts a range of frames from video to JPEG images in output_dir.
    """
    os.makedirs(output_dir, exist_ok=True)
    start_time = start_frame / fps
    duration = (end_frame - start_frame + 1) / fps
    output_pattern = os.path.join(output_dir, "frame_%06d.jpg")
    
    cmd = [
        'ffmpeg',
        '-y',
        '-ss', str(start_time),
        '-i', video_path,
        '-t', str(duration),
        '-q:v', '2',
        output_pattern
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    
    extracted = sorted([os.path.join(output_dir, f) for f in os.listdir(output_dir) if f.endswith('.jpg')])
    return extracted
