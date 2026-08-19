"""
YouTube Analytics & Channel Data Fetcher (Read-Only)
-----------------------------------------------------
Strictly uses READ-ONLY OAuth 2.0 scopes:
- https://www.googleapis.com/auth/yt-analytics.readonly
- https://www.googleapis.com/auth/youtube.readonly

Zero write permissions. Zero risk to your channel.
"""

import os
import sys
import json
from datetime import datetime, timedelta
from pathlib import Path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# Strictly READ-ONLY scopes
SCOPES = [
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/youtube.readonly"
]

BASE_DIR = Path(__file__).resolve().parent
CLIENT_SECRETS_FILE = BASE_DIR / "client_secrets.json"
TOKEN_FILE = BASE_DIR / "token.json"
DATA_DIR = BASE_DIR / "data"


def get_authenticated_services():
    """Authenticate with Google OAuth 2.0 using local client_secrets.json"""
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired access token...", flush=True)
            creds.refresh(Request())
        else:
            if not CLIENT_SECRETS_FILE.exists():
                raise FileNotFoundError(
                    f"Missing '{CLIENT_SECRETS_FILE.name}'!\n"
                    f"Please place your downloaded OAuth client secrets JSON file at:\n"
                    f"{CLIENT_SECRETS_FILE}"
                )
            print("\n Opening browser for one-time Google Read-Only authorization...", flush=True)
            print("Please log in with your YouTube Google account and click 'Allow'.\n", flush=True)
            
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CLIENT_SECRETS_FILE), SCOPES
            )
            # Use fixed local port with local server flow
            creds = flow.run_local_server(port=8080, open_browser=True)

        # Save credentials for subsequent runs
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())
        print(f" Credentials cached securely at: {TOKEN_FILE}", flush=True)

    youtube = build("youtube", "v3", credentials=creds)
    youtube_analytics = build("youtubeAnalytics", "v2", credentials=creds)
    return youtube, youtube_analytics


def fetch_channel_overview(youtube):
    """Fetches high-level channel metadata and lifetime statistics."""
    print("Fetching channel info...", flush=True)
    request = youtube.channels().list(
        part="snippet,contentDetails,statistics",
        mine=True
    )
    response = request.execute()
    
    if not response.get("items"):
        print("No channel found for authenticated account.", flush=True)
        return None

    channel = response["items"][0]
    stats = channel["statistics"]
    snippet = channel["snippet"]
    
    channel_info = {
        "channel_id": channel["id"],
        "title": snippet.get("title"),
        "description": snippet.get("description"),
        "custom_url": snippet.get("customUrl"),
        "published_at": snippet.get("publishedAt"),
        "subscribers": int(stats.get("subscriberCount", 0)),
        "total_views": int(stats.get("viewCount", 0)),
        "total_videos": int(stats.get("videoCount", 0)),
        "uploads_playlist_id": channel["contentDetails"]["relatedPlaylists"]["uploads"]
    }
    return channel_info


def fetch_recent_videos(youtube, uploads_playlist_id, max_results=30):
    """Fetches recent uploaded video IDs and metadata."""
    print(f"Fetching up to {max_results} recent uploads...", flush=True)
    playlist_items = []
    request = youtube.playlistItems().list(
        part="snippet,contentDetails",
        playlistId=uploads_playlist_id,
        maxResults=min(max_results, 50)
    )
    response = request.execute()
    playlist_items.extend(response.get("items", []))
    
    video_ids = [item["contentDetails"]["videoId"] for item in playlist_items]
    if not video_ids:
        return []

    # Get detailed statistics for these videos
    stats_req = youtube.videos().list(
        part="snippet,statistics,contentDetails",
        id=",".join(video_ids)
    )
    stats_resp = stats_req.execute()
    
    videos = []
    for item in stats_resp.get("items", []):
        v_stats = item.get("statistics", {})
        v_snippet = item.get("snippet", {})
        videos.append({
            "video_id": item["id"],
            "title": v_snippet.get("title"),
            "published_at": v_snippet.get("publishedAt"),
            "duration": item.get("contentDetails", {}).get("duration"),
            "tags": v_snippet.get("tags", []),
            "views": int(v_stats.get("viewCount", 0)),
            "likes": int(v_stats.get("likeCount", 0)),
            "comments": int(v_stats.get("commentCount", 0)),
        })
    return videos


def fetch_time_series_analytics(youtube_analytics, days=30):
    """Fetches daily time-series analytics for the last N days."""
    end_date = datetime.now().date() - timedelta(days=1)
    start_date = end_date - timedelta(days=days)
    
    print(f"Fetching channel analytics from {start_date} to {end_date}...", flush=True)
    try:
        response = youtube_analytics.reports().query(
            ids="channel==MINE",
            startDate=start_date.strftime("%Y-%m-%d"),
            endDate=end_date.strftime("%Y-%m-%d"),
            metrics="views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,subscribersLost,likes,shares,comments",
            dimensions="day",
            sort="day"
        ).execute()
        return response
    except Exception as e:
        print(f"Warning: Could not query detailed analytics report ({e}).", flush=True)
        return None


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60, flush=True)
    print(" YouTube Read-Only Analytics Extractor", flush=True)
    print("=" * 60, flush=True)
    
    youtube, yt_analytics = get_authenticated_services()
    
    # 1. Fetch channel overview
    channel = fetch_channel_overview(youtube)
    if not channel:
        return
    
    print(f"\n Connected Channel: {channel['title']} ({channel['subscribers']} subscribers, {channel['total_views']} views)", flush=True)
    
    # 2. Fetch recent videos
    videos = fetch_recent_videos(youtube, channel["uploads_playlist_id"], max_results=30)
    print(f" Fetched {len(videos)} videos.", flush=True)
    
    # 3. Fetch 30-day time series
    daily_analytics = fetch_time_series_analytics(yt_analytics, days=30)
    
    # 4. Save combined summary dataset
    output_data = {
        "fetched_at": datetime.now().isoformat(),
        "channel": channel,
        "recent_videos": videos,
        "daily_analytics_30d": daily_analytics
    }
    
    output_file = DATA_DIR / "youtube_channel_summary.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)
        
    print(f"\n Success! YouTube analytics summary saved to:\n  -> {output_file}", flush=True)


if __name__ == "__main__":
    main()
