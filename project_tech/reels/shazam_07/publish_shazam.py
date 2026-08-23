import os
import sys
from pathlib import Path

# Paths
VIDEO_PATH = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_Shazam_20260822.mp4"
BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_analyze_social_media")

# Metadata
IG_CAPTION = """Shazam heard 1 second of this bar noise… and still named the song. 🎵🤯

It never records music. It draws the song's secret fingerprint instead:

1️⃣ 𝗦𝗽𝗲𝗰𝘁𝗿𝗼𝗴𝗿𝗮𝗺: The sound becomes a map of energy across time and frequency
2️⃣ 𝗣𝗲𝗮𝗸 𝗖𝗼𝗻𝘀𝘁𝗲𝗹𝗹𝗮𝘁𝗶𝗼𝗻: Only the loudest points survive as "stars"
3️⃣ 𝗦𝘁𝗮𝗿 𝗛𝗮𝘀𝗵𝗲𝘀: Pairs of stars become tiny time-offset codes — billions live in one lookup table
4️⃣ 𝗧𝗵𝗲 𝗩𝗼𝘁𝗶𝗻𝗴: Matched pairs vote on a time offset — ONE spike = your song!

So no, Shazam isn't spying on you. It's doing astronomy on sound waves 😎⚡

Tag someone who Shazams EVERYTHING 👇

#shazam #music #audioengineering #computerscience #algorithms #dsp #howitworks #sound #tech #datastructures #machinelearning #didyouknow #technology #musicians #nemiexplains"""

YT_TITLE = "How Shazam Names Any Song From 1 Second of Audio 🎵🤯 #shorts"

YT_DESCRIPTION = """Your phone hears 1 second of bar noise and names the exact song. No magic — just math! 🔍🎵
Discover how Shazam really works: spectrogram peak constellations, star-pair hash codes, and the time-offset voting trick that makes ONE bar spike above billions of songs in a lookup table.

🔔 Subscribe to @nemi.explains for weekly visual tech & AI deep-dives!

#Shazam #MusicTech #AudioEngineering #ComputerScience #Algorithms #Shorts #DSP #HowItWorks"""

YT_TAGS = [
    "how shazam works",
    "shazam algorithm",
    "audio fingerprinting",
    "spectrogram explained",
    "music recognition",
    "signal processing",
    "dsp",
    "hash lookup",
    "computer science",
    "algorithms",
    "how music recognition works",
    "tech explainer",
    "nemi explains",
    "shorts"
]

print("="*60)
print("🚀 UPLOADING NEMI EXPLAINS REEL #7 (SHAZAM) TO ALL PLATFORMS")
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
    print(f"✅ YouTube Shorts Success: {yt_res.get('id')}")
except Exception as e:
    print(f"❌ Error uploading to YouTube: {e}")

print("\n🎉 All uploads finished!")
