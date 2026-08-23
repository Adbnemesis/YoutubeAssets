import os
import sys
from pathlib import Path

# Paths
VIDEO_PATH = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_OxAlpha_4K_20260823.mp4"
BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_analyze_social_media")

# Metadata exactly as in metadata.txt
IG_CAPTION = """A mystery AI model named 0x-alpha just launched for 100% free with a 1 million token context and 80% SWE-bench score.
.
.
.
.
.
#tech #algorithm #oxalpha #ai #nemiexplains"""

YT_TITLE = "A Mystery AI Just Dropped For Free (0x-alpha) 🤯⚡ #shorts"

YT_DESCRIPTION = """A stealth AI model named 0x-alpha just appeared on OpenRouter with a massive 1 Million token context window and an 80% coding benchmark score — completely free for a limited test window. Who secretly built it, and what is the one critical privacy rule you must follow? Nemi explains!

🔔 Subscribe to @nemi.explains for weekly visual tech & AI deep-dives!

#Shorts #Tech #AI #Coding #NemiExplains"""

YT_TAGS = [
    "0x-alpha",
    "ox alpha",
    "openrouter",
    "zhipu glm 5",
    "coding ai",
    "cursor ai",
    "aider",
    "swe-bench",
    "artificial intelligence",
    "nemi explains",
    "shorts"
]

print("="*60)
print("🚀 UPLOADING NEMI EXPLAINS REEL #14 (0X-ALPHA) TO ALL PLATFORMS")
print("="*60)

# 1. Instagram & Facebook Status
print("\n--- 1. INSTAGRAM & FACEBOOK STATUS ---")
print("✅ Instagram Success: ID 17957143569199101 (Already Live)")
print("✅ Facebook Success: ID 1643677223851756 | Link: https://www.facebook.com/reel/1643677223851756 (Already Live)")

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
