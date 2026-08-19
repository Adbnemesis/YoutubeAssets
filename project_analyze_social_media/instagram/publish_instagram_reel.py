"""
Instagram Automated Reels Publisher
-----------------------------------
Publishes or schedules Reels to Instagram via Meta Graph API.

Features:
- Supports direct local video files (--video) with automatic fast staging
- Supports remote HTTPS video URLs (--video-url)
- Monitors Meta video encoding container status in real-time
- Publishes live to Instagram (@nemi.explains)
"""

import os
import time
import argparse
from pathlib import Path
import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

GRAPH_API_VERSION = "v19.0"
BASE_GRAPH_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
else:
    load_dotenv()


def get_credentials():
    access_token = os.getenv("INSTAGRAM_ACCESS_TOKEN")
    account_id = os.getenv("INSTAGRAM_ACCOUNT_ID")
    
    if not access_token:
        raise ValueError(
            f"Missing INSTAGRAM_ACCESS_TOKEN in {ENV_FILE}!\n"
            f"Ensure your token has 'instagram_content_publish' permission."
        )
    return access_token, account_id


def stage_local_video(local_path: str) -> str:
    """Stages a local video file to a temporary public CDN so Meta servers can ingest it."""
    file_path = Path(local_path)
    if not file_path.exists():
        raise FileNotFoundError(f"Local video not found at: {local_path}")
        
    print(f" Staging local video '{file_path.name}' ({file_path.stat().st_size / (1024*1024):.1f} MB) for Meta ingestion...", flush=True)
    
    # Upload to catbox CDN for direct high-speed raw mp4 stream
    with open(file_path, "rb") as f:
        resp = requests.post(
            "https://catbox.moe/user/api.php",
            data={"reqtype": "fileupload"},
            files={"fileToUpload": f},
            timeout=120
        )
        
    if resp.status_code == 200 and resp.text.startswith("http"):
        staged_url = resp.text.strip()
        print(f" Staged successfully at: {staged_url}", flush=True)
        return staged_url
        
    # Fallback to tmpfiles
    with open(file_path, "rb") as f:
        resp2 = requests.post("https://tmpfiles.org/api/v1/upload", files={"file": f}, timeout=120).json()
        if resp2.get("status") == "success":
            raw_url = resp2["data"]["url"]
            direct_url = raw_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
            print(f" Staged successfully at fallback: {direct_url}", flush=True)
            return direct_url

    raise RuntimeError(f"Could not stage video: {resp.text}")


def create_reel_container(account_id: str, access_token: str, video_url: str, caption: str = "", cover_url: str = None, share_to_feed: bool = True):
    """Step 1: Create an upload container for the Reel."""
    print(" Creating Instagram Reel container on Meta servers...", flush=True)
    url = f"{BASE_GRAPH_URL}/{account_id}/media"
    
    payload = {
        "access_token": access_token,
        "media_type": "REELS",
        "video_url": video_url,
        "caption": caption,
        "share_to_feed": share_to_feed
    }
    if cover_url:
        payload["cover_url"] = cover_url

    resp = requests.post(url, data=payload).json()
    if "error" in resp:
        raise RuntimeError(f"Error creating Reel container: {resp['error'].get('message')}")
        
    container_id = resp["id"]
    print(f" Container created successfully (ID: {container_id})", flush=True)
    return container_id


def wait_for_container_processing(container_id: str, access_token: str, max_attempts: int = 30, interval: int = 5):
    """Step 2: Wait until Meta has finished ingesting and encoding the video."""
    print(" Processing and encoding video on Instagram servers...", flush=True)
    url = f"{BASE_GRAPH_URL}/{container_id}"
    params = {
        "access_token": access_token,
        "fields": "status_code,status"
    }

    for attempt in range(max_attempts):
        resp = requests.get(url, params=params).json()
        status_code = resp.get("status_code")
        
        if status_code == "FINISHED":
            print(" Video processing complete and ready to publish!", flush=True)
            return True
        elif status_code == "ERROR":
            raise RuntimeError(f"Video processing failed: {resp.get('status')}")
        elif status_code in ["IN_PROGRESS", "PUBLISHED"]:
            print(f"   Status: {status_code} (attempt {attempt + 1}/{max_attempts})...", flush=True)
            time.sleep(interval)
        else:
            time.sleep(interval)

    raise TimeoutError("Video encoding timed out on Meta servers.")


def publish_reel_container(account_id: str, access_token: str, container_id: str):
    """Step 3: Publish the container live to Instagram."""
    print(" Publishing Reel live to Instagram...", flush=True)
    url = f"{BASE_GRAPH_URL}/{account_id}/media_publish"
    payload = {
        "access_token": access_token,
        "creation_id": container_id
    }
    
    resp = requests.post(url, data=payload).json()
    if "error" in resp:
        raise RuntimeError(f"Error publishing Reel: {resp['error'].get('message')}")
        
    published_media_id = resp["id"]
    print(f" Success! Reel is published live! (Media ID: {published_media_id})", flush=True)
    return published_media_id


def publish_reel(video_url: str = None, video_path: str = None, caption: str = "", cover_url: str = None, share_to_feed: bool = True):
    access_token, account_id = get_credentials()
    
    if not video_url and video_path:
        video_url = stage_local_video(video_path)
    elif not video_url:
        raise ValueError("Must provide either video_path or video_url!")

    # Create container
    container_id = create_reel_container(account_id, access_token, video_url, caption, cover_url, share_to_feed)
    
    # Wait for encoding
    wait_for_container_processing(container_id, access_token)
    
    # Publish live
    media_id = publish_reel_container(account_id, access_token, container_id)
    return media_id


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publish a Reel to Instagram")
    parser.add_argument("--video", default=None, help="Path to local video file (.mp4)")
    parser.add_argument("--video-url", default=None, help="Publicly accessible HTTPS URL to the video file")
    parser.add_argument("--caption", default="", help="Reel caption and hashtags")
    parser.add_argument("--cover-url", default=None, help="Public HTTPS URL to custom cover image")
    parser.add_argument("--no-feed", action="store_true", help="Do not share to profile grid (Reels tab only)")

    args = parser.parse_args()

    publish_reel(
        video_url=args.video_url,
        video_path=args.video,
        caption=args.caption,
        cover_url=args.cover_url,
        share_to_feed=not args.no_feed
    )
