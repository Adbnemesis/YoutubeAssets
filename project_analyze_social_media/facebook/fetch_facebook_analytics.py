"""
Facebook Automated Page & Reels Analytics
-----------------------------------------
Fetches real-time telemetry, views, impressions, and engagement for
Facebook Pages and published Facebook Reels.
"""

import os
import json
import argparse
from pathlib import Path
from datetime import datetime, timezone
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


def fetch_facebook_data():
    access_token = os.getenv("INSTAGRAM_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN")
    page_id = os.getenv("FACEBOOK_PAGE_ID")
    
    if not access_token:
        raise ValueError(f"Missing token in {ENV_FILE}")

    # 1. Fetch connected Pages
    print(" Fetching Facebook Page details...", flush=True)
    accounts_resp = requests.get(
        f"{BASE_GRAPH_URL}/me/accounts",
        params={"access_token": access_token, "fields": "id,name,fan_count,followers_count,access_token"}
    ).json()

    pages = accounts_resp.get("data", [])
    if not pages:
        print("⚠️ No Facebook Pages linked to this token. Ensure 'pages_show_list' permission is active.")
        return None

    target_page = next((p for p in pages if p["id"] == page_id), pages[0])
    page_token = target_page.get("access_token", access_token)
    p_id = target_page["id"]

    print(f"\n📊 Facebook Page: {target_page['name']} (ID: {p_id})", flush=True)

    # 2. Fetch Recent Reels & Videos
    print(" Fetching recent published Reels & Videos...", flush=True)
    videos_resp = requests.get(
        f"{BASE_GRAPH_URL}/{p_id}/videos",
        params={
            "access_token": page_token,
            "fields": "id,title,description,created_time,views,length,permalink_url",
            "limit": 10
        }
    ).json()

    videos = videos_resp.get("data", [])
    print(f" Found {len(videos)} recent Facebook video assets.\n")
    for v in videos:
        desc = (v.get("description") or v.get("title") or "No title")[:60]
        print(f" 🎬 [{v.get('created_time', '')[:10]}] ID: {v['id']}")
        print(f"    Title: {desc}...")
        print(f"    Link: https://www.facebook.com{v.get('permalink_url', '')}\n")

    return {
        "page": target_page,
        "recent_videos": videos,
        "fetched_at": datetime.now(timezone.utc).isoformat()
    }


if __name__ == "__main__":
    fetch_facebook_data()
