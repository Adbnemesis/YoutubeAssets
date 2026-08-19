"""
Instagram Reels Audience Retention & Performance Diagnostic Tool
----------------------------------------------------------------
Analyzes watch time, retention percentages, repeat view velocity, 
save-to-reach ratios, and algorithmic engagement benchmarks.
"""

import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "instagram_summary.json"

def analyze_retention():
    if not DATA_FILE.exists():
        print(f"Error: {DATA_FILE} not found.")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    profile = data.get("profile", {})
    media_list = data.get("recent_media", [])
    account_reach = data.get("account_insights", [{}])[0].get("total_value", {}).get("value", "N/A")

    print("=" * 85)
    print(f" 📊 INSTAGRAM REELS AUDIENCE RETENTION & PERFORMANCE REPORT: @{profile.get('username')}")
    print(f" 👥 Total Profile Reach (24h Window): {account_reach} unique accounts | Followers: {profile.get('followers_count')}")
    print("=" * 85)

    # Durations from master catalog
    durations = {
        "18036371861827701": 24.47,  # Two Sum (734 frames @ 30fps)
        "17905302039501147": 19.72,  # Google.com (592 frames @ 30fps)
        "18003438035987870": 22.79,  # Captcha (683 frames @ 30fps)
    }

    topics = {
        "18036371861827701": "Two Sum: O(N^2) Trap vs 1-Pass Hash Map (LeetCode #1)",
        "17905302039501147": "What Actually Happens When You Type google.com? (64ms)",
        "18003438035987870": "How CAPTCHA Knows You're Human (Micro-Tremors)",
    }

    for idx, item in enumerate(media_list, 1):
        media_id = item["id"]
        ins = item.get("insights", {})
        
        views = ins.get("views", 0)
        reach = ins.get("reach", 1)
        likes = ins.get("likes", item.get("likes", 0))
        saved = ins.get("saved", 0)
        shares = ins.get("shares", 0)
        total_interactions = ins.get("total_interactions", 0)
        total_time_ms = ins.get("ig_reels_video_view_total_time", 0)
        avg_watch_ms = ins.get("ig_reels_avg_watch_time", 0)

        total_time_sec = total_time_ms / 1000.0
        avg_watch_sec = avg_watch_ms / 1000.0
        video_duration = durations.get(media_id, 20.0)
        topic_name = topics.get(media_id, item.get("caption", "")[:40])

        retention_pct = (avg_watch_sec / video_duration) * 100.0 if video_duration else 0.0
        repeat_view_ratio = (views / reach) if reach else 1.0
        save_rate = (saved / reach * 100.0) if reach else 0.0
        share_rate = (shares / reach * 100.0) if reach else 0.0
        interaction_rate = (total_interactions / reach * 100.0) if reach else 0.0

        print(f"\n🎬 REEL #{idx}: {topic_name}")
        print(f"   🔗 Permalink: {item.get('permalink')}")
        print(f"   ⏱️ Video Length: {video_duration:.2f}s | Published: {item.get('timestamp')[:10]}")
        print(f"   -------------------------------------------------------------------------")
        print(f"   👀 Total Views / Plays: {views} | 👥 Unique Reach: {reach} accounts")
        print(f"   🔁 Re-Watch Ratio: {repeat_view_ratio:.2f}x ({(repeat_view_ratio - 1.0) * 100:.1f}% repeat view rate)")
        print(f"   ⏳ Total Watch Time: {total_time_sec:.1f}s ({total_time_sec / 60.0:.2f} minutes)")
        print(f"   🎯 Average Watch Time: {avg_watch_sec:.2f}s")
        print(f"   📈 Audience Retention: {retention_pct:.1f}% of total video length")
        print(f"   -------------------------------------------------------------------------")
        print(f"   💾 Saves: {saved} ({save_rate:.2f}%) | 🚀 Shares: {shares} ({share_rate:.2f}%)")
        print(f"   ❤️ Likes: {likes} | 💬 Comments: {ins.get('comments', 0)}")
        print(f"   🔥 Total Interactions: {total_interactions} ({interaction_rate:.2f}% interaction rate)")

if __name__ == "__main__":
    analyze_retention()
