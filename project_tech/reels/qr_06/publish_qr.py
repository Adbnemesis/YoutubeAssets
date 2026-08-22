import os
import sys
from pathlib import Path

# Paths
VIDEO_PATH = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_QR_20260822.mp4"
BASE_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_analyze_social_media")

# Metadata
IG_CAPTION = """You destroyed this QR code. It still scanned. 🤯📱

Every QR code secretly carries backup math inside it — not spare copies, EQUATIONS. Here's how Reed–Solomon error correction actually works:

1️⃣ 𝗧𝗵𝗲 𝗚𝗿𝗶𝗱: Your data is encoded into a grid of black-and-white modules
2️⃣ 𝗧𝗵𝗲 𝗕𝗮𝗰𝗸𝘂𝗽 𝗠𝗮𝘁𝗵: Reed–Solomon equations compute hidden "parity" values woven into the pattern
3️⃣ 𝗧𝗵𝗲 𝗥𝗲𝗯𝘂𝗶𝗹𝗱: Destroy up to ~30% of the code, and any scanner reconstructs the missing blocks from whatever survives!

That's why your scratched, crumpled, sticker-stabbed UPI QR codes scan every single time. It's not luck — it's math from 1960 doing the healing! 😎⚡

Tag a friend who destroys QR codes daily 👇

#qrcode #tech #computerscience #mathematics #errorcorrection #engineering #upi #digitalpayments #technology #didyouknow #science #coding #learntocode #techie #nemiexplains"""

YT_TITLE = "You Destroyed This QR Code. It Still Scanned. 🤯📱 #shorts"

YT_DESCRIPTION = """This QR code is covered in marker scribbles… and it STILL scans perfectly. How?! 🔍📱
The secret is Reed–Solomon error correction: hidden parity equations baked into every QR code that let scanners rebuild up to 30% of the code from thin air. Invented in 1960 — powering every UPI payment and boarding pass today.

🔔 Subscribe to @nemi.explains for weekly visual tech & AI deep-dives!

#QRCode #ComputerScience #Math #Tech #Engineering #Shorts #DidYouKnow #UPI #Technology"""

YT_TAGS = [
    "how qr codes work",
    "qr code error correction",
    "reed solomon code",
    "why damaged qr codes work",
    "qr code explained",
    "error correcting codes",
    "computer science",
    "mathematics",
    "tech explainer",
    "upi qr code",
    "digital payments",
    "nemi explains",
    "shorts"
]

print("="*60)
print("🚀 UPLOADING NEMI EXPLAINS REEL #6 (QR CODE) TO ALL PLATFORMS")
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
