import os
import sys
from pathlib import Path

# Paths
VIDEO_PATH = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_Binary_4K_20260823.mp4"
BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_analyze_social_media")

# Metadata exactly as in metadata.txt
IG_CAPTION = """How to find any number from 1 to 100 in just 7 guesses using Binary Search.
.
.
.
.
.
#leetcode #dsa #placement #binarysearch #nemiexplains"""

YT_TITLE = "Guess 1 to 100 in 7 Guesses! Binary Search Explained 🤯⚡ #shorts"

YT_DESCRIPTION = """How to find any number from 1 to 100 in just 7 guesses using Binary Search.
.
.
.
.
.
#leetcode #dsa #placement #binarysearch #nemiexplains

🔔 Subscribe to @nemi.explains for weekly visual tech & AI deep-dives!"""

YT_TAGS = [
    "binary search explained",
    "how binary search works",
    "guess a number 1 to 100",
    "o log n time complexity",
    "search 1 billion items",
    "nemi explains",
    "shorts"
]

print("="*60)
print("🚀 UPLOADING NEMI EXPLAINS REEL (BINARY SEARCH) TO ALL PLATFORMS")
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
    ig_id, fb_id = None, None

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
    yt_id = yt_res.get('id')
except Exception as e:
    print(f"❌ Error uploading to YouTube: {e}")
    yt_id = None

print("\n" + "="*60)
print("📊 UPLOAD SUMMARY:")
print(f"• YouTube: {f'https://www.youtube.com/shorts/{yt_id}' if yt_id else 'Failed'}")
print(f"• Instagram ID: {ig_id}")
print(f"• Facebook ID: {fb_id}")
print("="*60)
