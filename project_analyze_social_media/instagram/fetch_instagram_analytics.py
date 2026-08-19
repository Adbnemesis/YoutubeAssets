"""
Instagram Insights & Media Performance Fetcher (Read-Only)
-----------------------------------------------------------
Uses Meta's official Instagram Graph API with strictly READ-ONLY permissions:
- instagram_basic
- instagram_manage_insights
- pages_show_list
- pages_read_engagement

Zero write permissions. Zero risk to your account or posts.
"""

import os
import json
from pathlib import Path
from datetime import datetime
import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"
DATA_DIR = BASE_DIR / "data"

GRAPH_API_VERSION = "v19.0"
BASE_GRAPH_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

# Load environment variables
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
            f"Please copy '.env.example' to '.env' and add your token."
        )
    return access_token, account_id


def discover_instagram_account_id(access_token):
    """Finds the Instagram Business/Creator Account ID linked to any managed Facebook Page."""
    print("Auto-discovering Instagram Business Account ID from managed Facebook Pages...")
    url = f"{BASE_GRAPH_URL}/me/accounts"
    params = {
        "access_token": access_token,
        "fields": "id,name,instagram_business_account{id,username,name}"
    }
    resp = requests.get(url, params=params).json()
    
    if "error" in resp:
        raise RuntimeError(f"Meta Graph API Error: {resp['error'].get('message')}")
        
    for page in resp.get("data", []):
        ig_biz = page.get("instagram_business_account")
        if ig_biz and "id" in ig_biz:
            print(f" Found Instagram Account: @{ig_biz.get('username')} (ID: {ig_biz['id']}) connected via Page '{page.get('name')}'")
            return ig_biz["id"]
            
    # Fallback to debug token inspection
    debug_resp = requests.get(f"{BASE_GRAPH_URL}/debug_token", params={"input_token": access_token, "access_token": access_token}).json()
    for g in debug_resp.get("data", {}).get("granular_scopes", []):
        if g.get("scope") == "instagram_basic" and g.get("target_ids"):
            return g["target_ids"][0]

    raise RuntimeError(
        "Could not find a connected Instagram Business/Creator account.\n"
        "Ensure your Instagram account is switched to Professional/Creator and linked to a Facebook Page."
    )


def fetch_account_insights(account_id, access_token):
    """Fetches high-level account profile info and insights."""
    print(f"Fetching profile details for Instagram Account ID: {account_id}...")
    
    # 1. Profile information
    url = f"{BASE_GRAPH_URL}/{account_id}"
    params = {
        "access_token": access_token,
        "fields": "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website"
    }
    resp = requests.get(url, params=params).json()
    if "error" in resp:
        print(f"Error fetching profile: {resp['error']}")
        return None, None
    profile = resp
    
    # 2. Account insights (reach, total_interactions, accounts_engaged)
    print("Fetching account-level insights (reach, interactions, accounts engaged)...")
    insights_url = f"{BASE_GRAPH_URL}/{account_id}/insights"
    insights_params = {
        "access_token": access_token,
        "metric": "reach,total_interactions,accounts_engaged",
        "period": "day",
        "metric_type": "total_value"
    }
    insights_resp = requests.get(insights_url, params=insights_params).json()
    insights = insights_resp.get("data", [])
    
    return profile, insights


def fetch_recent_media_insights(account_id, access_token, limit=25):
    """Fetches recent posts, reels, and video performance metrics."""
    print(f"Fetching recent {limit} posts / reels...")
    url = f"{BASE_GRAPH_URL}/{account_id}/media"
    params = {
        "access_token": access_token,
        "fields": "id,caption,media_type,media_product_type,timestamp,like_count,comments_count,permalink",
        "limit": limit
    }
    resp = requests.get(url, params=params).json()
    media_list = resp.get("data", [])
    
    detailed_media = []
    for item in media_list:
        media_id = item["id"]
        media_type = item.get("media_type")
        product_type = item.get("media_product_type")
        
        # Available metrics for Reels vs standard feed media
        if media_type == "VIDEO" or product_type == "REELS":
            metrics = "views,reach,saved,shares,total_interactions,likes,comments,ig_reels_video_view_total_time,ig_reels_avg_watch_time"
        else:
            metrics = "impressions,reach,saved,shares,total_interactions,likes,comments"
            
        insights_url = f"{BASE_GRAPH_URL}/{media_id}/insights"
        i_resp = requests.get(insights_url, params={"access_token": access_token, "metric": metrics}).json()
        
        insights_data = {}
        if "data" in i_resp:
            for metric_item in i_resp["data"]:
                metric_name = metric_item["name"]
                values = metric_item.get("values", [])
                val = values[0].get("value") if values else None
                insights_data[metric_name] = val
                
        detailed_media.append({
            "id": media_id,
            "caption": item.get("caption"),
            "media_type": media_type,
            "product_type": product_type,
            "timestamp": item.get("timestamp"),
            "permalink": item.get("permalink"),
            "likes": item.get("like_count", 0),
            "comments": item.get("comments_count", 0),
            "insights": insights_data
        })
        
    return detailed_media


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print(" Instagram Read-Only Insights Extractor")
    print("=" * 60)
    
    access_token, account_id = get_credentials()
    
    if not account_id:
        account_id = discover_instagram_account_id(access_token)
        
    profile, insights = fetch_account_insights(account_id, access_token)
    if not profile:
        return
        
    print(f" Connected Account: @{profile.get('username')} ({profile.get('followers_count')} followers, {profile.get('media_count')} posts)")
    
    recent_media = fetch_recent_media_insights(account_id, access_token, limit=25)
    print(f" Fetched insights for {len(recent_media)} recent posts/reels.")
    
    output_data = {
        "fetched_at": datetime.now().isoformat(),
        "profile": profile,
        "account_insights": insights,
        "recent_media": recent_media
    }
    
    output_file = DATA_DIR / "instagram_summary.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)
        
    print(f"\n Success! Instagram summary saved to:\n  -> {output_file}")


if __name__ == "__main__":
    main()
