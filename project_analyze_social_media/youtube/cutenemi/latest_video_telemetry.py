import sys
import json
from datetime import datetime, timedelta
from pathlib import Path
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/youtube.readonly"
]

BASE_DIR = Path(__file__).resolve().parent
TOKEN_FILE = BASE_DIR / "token.json"

def fetch_latest_video_full_telemetry():
    video_id = "Z-z-AONSDJY"
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    youtube = build("youtube", "v3", credentials=creds)
    youtube_analytics = build("youtubeAnalytics", "v2", credentials=creds)

    # 1. Full Data API properties
    v_resp = youtube.videos().list(
        part="snippet,contentDetails,statistics,status,topicDetails,recordingDetails",
        id=video_id
    ).execute()

    print("=== 1. RAW YOUTUBE DATA API TELEMETRY ===")
    print(json.dumps(v_resp, indent=2))

    # 2. Try querying day-by-day analytics
    # Note: Analytics API typically has a 24-48h delay, but let's query all dates
    for start_days_ago in [30, 7, 3, 2, 1]:
        start = (datetime.now() - timedelta(days=start_days_ago)).strftime("%Y-%m-%d")
        end = datetime.now().strftime("%Y-%m-%d")
        try:
            r = youtube_analytics.reports().query(
                ids="channel==MINE",
                startDate=start,
                endDate=end,
                metrics="views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,shares,comments",
                filters=f"video=={video_id}"
            ).execute()
            if r.get("rows"):
                print(f"\n=== 2. ANALYTICS API DATA (from {start}) ===")
                print(json.dumps(r, indent=2))
                break
        except Exception as e:
            pass

    # 3. Traffic sources
    try:
        tr = youtube_analytics.reports().query(
            ids="channel==MINE",
            startDate="2026-08-01",
            endDate=datetime.now().strftime("%Y-%m-%d"),
            dimensions="insightTrafficSourceType",
            metrics="views,estimatedMinutesWatched",
            filters=f"video=={video_id}"
        ).execute()
        print("\n=== 3. TRAFFIC SOURCES ===")
        print(json.dumps(tr, indent=2))
    except Exception as e:
        print(f"Traffic error: {e}")

if __name__ == "__main__":
    fetch_latest_video_full_telemetry()
