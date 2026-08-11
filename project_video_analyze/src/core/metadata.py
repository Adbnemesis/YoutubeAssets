from project_video_analyze.src.utils.ffmpeg_utils import get_video_metadata

class MetadataExtractor:
    def __init__(self, video_path: str):
        self.video_path = video_path

    def extract(self):
        metadata = get_video_metadata(self.video_path)
        return metadata
