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
DATA_DIR = BASE_DIR / "data"

def analyze_video(video_id="Z-z-AONSDJY"):
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    youtube = build("youtube", "v3", credentials=creds)
    youtube_analytics = build("youtubeAnalytics", "v2", credentials=creds)

    # 1. Video Details from YouTube Data API
    video_resp = youtube.videos().list(
        part="snippet,contentDetails,statistics,status",
        id=video_id
    ).execute()

    if not video_resp.get("items"):
        print(f"Video {video_id} not found!")
        return

    video_data = video_resp["items"][0]
    print(f"=== Video: {video_data['snippet']['title']} ({video_id}) ===")
    print(f"Published: {video_data['snippet']['publishedAt']}")
    print(f"Duration: {video_data['contentDetails']['duration']}")
    print(f"Privacy: {video_data['status']['privacyStatus']}")
    print(f"Views: {video_data['statistics'].get('viewCount', 0)}")
    print(f"Likes: {video_data['statistics'].get('likeCount', 0)}")
    print(f"Comments: {video_data['statistics'].get('commentCount', 0)}")
    print(f"Tags: {video_data['snippet'].get('tags', [])}")
    print(f"Description:\n{video_data['snippet'].get('description', '')}\n")

    # 2. Analytics Query for Video
    today = datetime.utcnow().date()
    start_date = (today - timedelta(days=14)).isoformat()
    end_date = today.isoformat()

    try:
        analytics_resp = youtube_analytics.reports().query(
            ids="channel==MINE",
            startDate=start_date,
            endDate=end_date,
            metrics="views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,shares,comments",
            filters=f"video=={video_id}"
        ).execute()
        print("=== Basic Video Metrics (Last 14 Days) ===")
        print(json.dumps(analytics_resp, indent=2))
    except Exception as e:
        print(f"Error fetching basic metrics: {e}")

    try:
        traffic_resp = youtube_analytics.reports().query(
            ids="channel==MINE",
            startDate=start_date,
            endDate=end_date,
            dimensions="insightTrafficSourceType",
            metrics="views,estimatedMinutesWatched",
            filters=f"video=={video_id}",
            sort="-views"
        ).execute()
        print("=== Traffic Sources ===")
        print(json.dumps(traffic_resp, indent=2))
    except Exception as e:
        print(f"Error fetching traffic sources: {e}")

    try:
        device_resp = youtube_analytics.reports().query(
            ids="channel==MINE",
            startDate=start_date,
            endDate=end_date,
            dimensions="deviceType",
            metrics="views,estimatedMinutesWatched",
            filters=f"video=={video_id}",
            sort="-views"
        ).execute()
        print("=== Device Breakdown ===")
        print(json.dumps(device_resp, indent=2))
    except Exception as e:
        print(f"Error fetching devices: {e}")

    # Check Channel-wide Long vs Short metrics for comparison
    try:
        top_videos_resp = youtube_analytics.reports().query(
            ids="channel==MINE",
            startDate=start_date,
            endDate=end_date,
            dimensions="video",
            metrics="views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage",
            maxResults=10,
            sort="-views"
        ).execute()
        print("=== Channel Top Videos Comparison (Last 14 Days) ===")
        print(json.dumps(top_videos_resp, indent=2))
    except Exception as e:
        print(f"Error fetching top comparison: {e}")

if __name__ == "__main__":
    vid = sys.argv[1] if len(sys.argv) > 1 else "Z-z-AONSDJY"
    analyze_video(vid)
