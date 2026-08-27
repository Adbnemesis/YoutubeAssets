"""
Facebook Automated Reels Publisher
----------------------------------
Publishes Reels directly to your Facebook Page via the Meta Graph API.
"""

import os
import time
import argparse
from pathlib import Path
import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR.parent / "instagram" / ".env"

GRAPH_API_VERSION = "v19.0"
BASE_GRAPH_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
else:
    load_dotenv()


def get_credentials():
    access_token = os.getenv("INSTAGRAM_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN")
    page_id = os.getenv("FACEBOOK_PAGE_ID", "1243122028888830")
    
    if not access_token:
        raise ValueError(f"Missing access token in {ENV_FILE}!")
    return access_token, page_id


def get_page_access_token(user_access_token: str, page_id: str):
    """Fetches the Page-specific Access Token from the User token."""
    print(f" Fetching Facebook Page access token for Page ID: {page_id}...", flush=True)
    url = f"{BASE_GRAPH_URL}/{page_id}"
    params = {
        "access_token": user_access_token,
        "fields": "id,name,access_token"
    }
    resp = requests.get(url, params=params).json()
    
    if "error" in resp:
        raise RuntimeError(f"Error fetching Facebook Page token: {resp['error'].get('message')}")
        
    page_token = resp.get("access_token", user_access_token)
    print(f" Connected to Facebook Page: '{resp.get('name')}' (ID: {page_id})", flush=True)
    return page_token, page_id


def stage_local_video(local_path: str) -> str:
    """Stages a local video file to temporary CDN for fast ingestion."""
    file_path = Path(local_path)
    if not file_path.exists():
        raise FileNotFoundError(f"Local video not found at: {local_path}")
        
    print(f" Staging local video '{file_path.name}' ({file_path.stat().st_size / (1024*1024):.1f} MB)...", flush=True)
    
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
        
    with open(file_path, "rb") as f:
        resp2 = requests.post("https://tmpfiles.org/api/v1/upload", files={"file": f}, timeout=120).json()
        if resp2.get("status") == "success":
            raw_url = resp2["data"]["url"]
            direct_url = raw_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
            print(f" Staged successfully at fallback: {direct_url}", flush=True)
            return direct_url

    raise RuntimeError(f"Could not stage video: {resp.text}")


def publish_facebook_reel(video_url: str = None, video_path: str = None, description: str = "", page_id: str = None):
    user_token, env_page_id = get_credentials()
    target_page_id = page_id or env_page_id
    page_access_token, target_page_id = get_page_access_token(user_token, target_page_id)
    
    if not video_url and video_path:
        video_url = stage_local_video(video_path)
    elif not video_url:
        raise ValueError("Must provide either video_path or video_url!")

    # Step 1: Initialize Facebook Reel upload session
    print(" Initializing Facebook Reel upload session...", flush=True)
    init_url = f"{BASE_GRAPH_URL}/{target_page_id}/video_reels"
    init_payload = {
        "upload_phase": "start",
        "access_token": page_access_token
    }
    init_resp = requests.post(init_url, data=init_payload).json()
    if "error" in init_resp:
        raise RuntimeError(f"Error starting FB Reel upload: {init_resp['error'].get('message')}")
        
    video_id = init_resp["video_id"]
    upload_url = init_resp["upload_url"]
    print(f" Upload session created (Video ID: {video_id})", flush=True)

    # Step 2: Transfer Video to Meta upload URL
    print(" Ingesting video stream into Facebook servers...", flush=True)
    upload_headers = {
        "Authorization": f"OAuth {page_access_token}",
        "file_url": video_url
    }
    upload_resp = requests.post(upload_url, headers=upload_headers).json()
    if "error" in upload_resp or upload_resp.get("success") is False:
        # Fallback binary upload if file_url not supported
        if video_path and Path(video_path).exists():
            with open(video_path, "rb") as f:
                file_size = Path(video_path).stat().st_size
                bin_headers = {
                    "Authorization": f"OAuth {page_access_token}",
                    "offset": "0",
                    "file_size": str(file_size)
                }
                upload_resp = requests.post(upload_url, headers=bin_headers, data=f).json()

    print(" Video payload ingested by Facebook servers.", flush=True)

    # Step 3: Finish and Publish Live
    print(" Finalizing and publishing Reel live to Facebook Page...", flush=True)
    finish_payload = {
        "upload_phase": "finish",
        "video_id": video_id,
        "video_state": "PUBLISHED",
        "description": description,
        "access_token": page_access_token
    }
    finish_resp = requests.post(init_url, data=finish_payload).json()
    if "error" in finish_resp:
        raise RuntimeError(f"Error finalizing FB Reel: {finish_resp['error'].get('message')}")

    print(f" Success! Facebook Reel is published! (Video ID: {video_id})", flush=True)
    reel_link = f"https://www.facebook.com/reel/{video_id}"
    print(f" Link: {reel_link}", flush=True)
    return video_id, reel_link


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publish a Reel to Facebook Page")
    parser.add_argument("--video", default=None, help="Path to local video file (.mp4)")
    parser.add_argument("--video-url", default=None, help="Publicly accessible HTTPS URL to video")
    parser.add_argument("--description", default="", help="Reel caption/description")
    parser.add_argument("--page-id", default=None, help="Facebook Page ID")

    args = parser.parse_args()

    publish_facebook_reel(
        video_url=args.video_url,
        video_path=args.video,
        description=args.description,
        page_id=args.page_id
    )
