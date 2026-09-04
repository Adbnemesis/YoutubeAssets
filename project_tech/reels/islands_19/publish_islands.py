import os
import sys
from pathlib import Path

# Paths
VIDEO_PATH = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_Islands_4K_20260902.mp4"
BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_analyze_social_media")

# Metadata exactly as in metadata.txt
DOT_FILLER = ".\n" * 5

IG_CAPTION = (
    "How to count 100 islands in a 2D matrix in linear time by sinking each island with a DFS flood fill.\n"
    + DOT_FILLER
    + "#leetcode #dsa #programming #coding #nemiexplains"
)

YT_TITLE = "LeetCode 200: Number of Islands Solved in O(M×N)! 🏝️⚡ (Sink the Island) #shorts"

YT_DESCRIPTION = (
    "How to count 100 islands in a 2D matrix in linear time by sinking each island with a DFS flood fill.\n"
    + DOT_FILLER
    + "#leetcode #dsa #programming #coding #nemiexplains\n\n"
    + "🔔 Subscribe to @nemi.explains for weekly visual tech & AI deep-dives!"
)

YT_TAGS = [
    "leetcode 200",
    "number of islands",
    "dfs flood fill",
    "matrix traversal",
    "leetcode interview",
    "data structures",
    "algorithms",
    "coding interview",
    "nemi explains",
    "shorts"
]

print("="*60)
print("🚀 UPLOADING NEMI EXPLAINS REEL #19 (NUMBER OF ISLANDS) TO ALL PLATFORMS")
print("="*60)

# 1. Instagram & Facebook (Already published successfully!)
print("\n--- 1. INSTAGRAM & FACEBOOK STATUS ---")
ig_id = "18036227270654269"
fb_id = "1045347084975722"
print(f"✅ Instagram Already Published: ID {ig_id} (https://www.instagram.com/nemi.explains/)")
print(f"✅ Facebook Already Published: ID {fb_id} (https://www.facebook.com/reel/{fb_id})")

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
        category_id="28",  # Science & Technology
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
