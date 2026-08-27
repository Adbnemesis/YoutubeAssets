import os
import csv
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
CSV_PATH = Path("/Users/talus/Downloads/Content 2026-05-17_2026-08-15 cutenemi/Table data.csv")

def run_comprehensive_analysis():
    print("=================================================================")
    print("🚀 EXHAUSTIVE LONG-FORMAT VIDEO ANALYTICS FOR CUTENEMI")
    print("=================================================================\n")

    # 1. Analyze the Studio Export CSV
    long_form_csv = []
    short_form_csv = []

    if CSV_PATH.exists():
        with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("Content") == "Total":
                    continue
                try:
                    dur = int(row.get("Duration", 0))
                    row["dur_int"] = dur
                    row["views_int"] = int(row.get("Views", 0))
                    row["impressions_int"] = int(row.get("Impressions", 0))
                    row["ctr_float"] = float(row.get("Impressions click-through rate (%)", 0) or 0)
                    row["watch_hours"] = float(row.get("Watch time (hours)", 0) or 0)
                    row["subs"] = int(row.get("Subscribers", 0) or 0)

                    if dur >= 60:
                        long_form_csv.append(row)
                    else:
                        short_form_csv.append(row)
                except Exception as e:
                    pass

        print(f"📊 CSV Export Dataset Analysis (May 17, 2026 - Aug 15, 2026):")
        print(f" - Total Videos in export: {len(long_form_csv) + len(short_form_csv)}")
        print(f" - Long-form videos (>= 60s): {len(long_form_csv)}")
        print(f" - Short-form videos (< 60s): {len(short_form_csv)}\n")

        if long_form_csv:
            print("--- ALL LONG-FORM VIDEOS IN CSV EXPORT ---")
            for v in sorted(long_form_csv, key=lambda x: x["views_int"], reverse=True):
                print(f"• ID: {v['Content']} | Published: {v['Video publish time']} | Duration: {v['Duration']}s")
                print(f"  Title: {v['Video title']}")
                print(f"  Views: {v['views_int']:,} | Impressions: {v['impressions_int']:,} | CTR: {v['ctr_float']}% | Watch Time: {v['watch_hours']:.1f} hrs | Subs: {v['subs']}")
                print()
        else:
            print("ℹ️ Note: No long-form videos (>=60s) existed in the May-August export window. Channel was 100% Shorts during that period.")

    # 2. Query Live YouTube API for ALL Channel Long-Form Uploads
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    youtube = build("youtube", "v3", credentials=creds)
    youtube_analytics = build("youtubeAnalytics", "v2", credentials=creds)

    print("\n--- FETCHING ALL CHANNEL VIDEOS VIA API ---")
    ch_resp = youtube.channels().list(part="contentDetails", mine=True).execute()
    uploads_id = ch_resp["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

    all_videos = []
    next_page = None
    for _ in range(10): # scan up to 500 recent videos
        pl_resp = youtube.playlistItems().list(
            playlistId=uploads_id,
            part="snippet,contentDetails",
            maxResults=50,
            pageToken=next_page
        ).execute()
        
        vids = [item["contentDetails"]["videoId"] for item in pl_resp.get("items", [])]
        if not vids:
            break
            
        v_resp = youtube.videos().list(
            id=",".join(vids),
            part="snippet,contentDetails,statistics,status"
        ).execute()
        
        all_videos.extend(v_resp.get("items", []))
        next_page = pl_resp.get("nextPageToken")
        if not next_page:
            break

    print(f"Total videos scanned across channel: {len(all_videos)}")

    long_vids_api = []
    for v in all_videos:
        dur_str = v["contentDetails"]["duration"] # e.g. PT1M8S, PT20S, PT12M30S
        # parse ISO duration
        dur_seconds = 0
        s = dur_str.replace("PT", "")
        if "H" in s:
            parts = s.split("H")
            dur_seconds += int(parts[0]) * 3600
            s = parts[1]
        if "M" in s:
            parts = s.split("M")
            dur_seconds += int(parts[0]) * 60
            s = parts[1]
        if "S" in s:
            parts = s.split("S")
            dur_seconds += int(parts[0])
            
        v["dur_seconds"] = dur_seconds
        if dur_seconds >= 60:
            long_vids_api.append(v)

    print(f"Found {len(long_vids_api)} Long-Form Videos (>= 60s) on channel.")

    for lv in long_vids_api:
        vid_id = lv["id"]
        snippet = lv["snippet"]
        stats = lv["statistics"]
        print(f"\n=======================================================")
        print(f"🎬 LONG-FORM VIDEO: '{snippet['title']}' ({vid_id})")
        print(f"   Published: {snippet['publishedAt']} | Duration: {lv['dur_seconds']}s ({lv['dur_seconds']//60}m {lv['dur_seconds']%60}s)")
        print(f"   Views: {stats.get('viewCount', 0)} | Likes: {stats.get('likeCount', 0)} | Comments: {stats.get('commentCount', 0)}")
        print(f"   Description: {snippet.get('description')[:120]}...")
        
        # Fetch deep YouTube Analytics for this specific long-form video
        today = datetime.utcnow().date()
        start_date = (today - timedelta(days=60)).isoformat()
        end_date = today.isoformat()

        try:
            r = youtube_analytics.reports().query(
                ids="channel==MINE",
                startDate=start_date,
                endDate=end_date,
                metrics="views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,subscribersLost,likes,shares",
                filters=f"video=={vid_id}"
            ).execute()
            rows = r.get("rows", [])
            if rows and rows[0]:
                print(f"   📈 Core Metrics: Views={rows[0][0]}, WatchTime={rows[0][1]}m, AVD={rows[0][2]}s, Avg%Watched={rows[0][3]}%")
            else:
                print("   📈 Analytics: No aggregated rows yet (YouTube Analytics has 24-48h reporting lag for new uploads).")
        except Exception as e:
            print(f"   Error fetching metrics: {e}")

        # Fetch traffic sources
        try:
            tr = youtube_analytics.reports().query(
                ids="channel==MINE",
                startDate=start_date,
                endDate=end_date,
                dimensions="insightTrafficSourceType",
                metrics="views,estimatedMinutesWatched",
                filters=f"video=={vid_id}"
            ).execute()
            print(f"   🚦 Traffic Sources: {tr.get('rows', [])}")
        except Exception as e:
            pass

if __name__ == "__main__":
    run_comprehensive_analysis()
