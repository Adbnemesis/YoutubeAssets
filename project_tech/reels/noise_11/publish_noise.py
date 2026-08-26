import os
import sys
from pathlib import Path

# Paths
VIDEO_PATH = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_Noise_20260822.mp4"
BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_analyze_social_media")

# Metadata exactly as in metadata.txt
IG_CAPTION = """Your headphones play exact anti-sound to cancel airplane noise into pure silence.
.
.
.
.
.
#tech #algorithm #noisecancelling #audio #nemiexplains"""

YT_TITLE = "How Active Noise Cancellation Creates Pure Silence 🎧🔇 #shorts"

YT_DESCRIPTION = """Your headphones play exact anti-sound to cancel airplane noise into pure silence.
.
.
.
.
.
#tech #algorithm #noisecancelling #audio #nemiexplains

🔔 Subscribe to @nemi.explains for weekly visual tech & AI deep-dives!"""

YT_TAGS = [
    "how noise cancelling works",
    "destructive interference",
    "phase inversion",
    "anc headphones",
    "audio physics",
    "nemi explains",
    "shorts"
]

print("="*60)
print("🚀 UPLOADING NEMI EXPLAINS REEL #11 (NOISE CANCELLATION) TO ALL PLATFORMS")
print("="*60)

# 1. Instagram & Facebook
sys.path.append(str(BASE_DIR / "instagram"))
from publish_instagram_reel import publish_reel

print("\n--- 1. UPLOADING TO INSTAGRAM & FACEBOOK ---")
try:
    ig_id, fb_id = publish_reel(
        video_path=VIDEO_PATH,
        caption=IG_CAPTION,
        share_to_feed=True,
        crosspost_fb=True
    )
    print(f"✅ Instagram Success: ID {ig_id}")
    print(f"✅ Facebook Success: ID {fb_id}")
except Exception as e:
    print(f"❌ Error uploading to Instagram/Facebook: {e}")

# 2. YouTube Shorts
sys.path.append(str(BASE_DIR / "youtube" / "nemi_explains"))
from publish_youtube_video import upload_video

print("\n--- 2. UPLOADING TO YOUTUBE SHORTS ---")
try:
    yt_res = upload_video(
        video_path=VIDEO_PATH,
        title=YT_TITLE,
        description=YT_DESCRIPTION,
        tags=YT_TAGS,
        category_id="28", # Science & Technology
        privacy_status="public",
        is_short=True
    )
    print(f"✅ YouTube Shorts Success: ID {yt_res.get('id')}")
    print(f"🔗 YouTube Link: https://www.youtube.com/shorts/{yt_res.get('id')}")
except Exception as e:
    print(f"❌ Error uploading to YouTube: {e}")

print("\n🎉 All uploads finished!")
