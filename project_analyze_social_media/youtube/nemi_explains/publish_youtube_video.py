"""
YouTube Automated Video & Shorts Publisher (Resumable Upload)
--------------------------------------------------------------
Publishes or schedules videos/Shorts directly from your local computer.

Required OAuth Scope:
- https://www.googleapis.com/auth/youtube.upload
- https://www.googleapis.com/auth/youtube.readonly
"""

import os
import sys
import time
import argparse
from pathlib import Path
from datetime import datetime, timezone
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# Scopes needed for both reading analytics and uploading videos
SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly"
]

BASE_DIR = Path(__file__).resolve().parent
CLIENT_SECRETS_FILE = BASE_DIR / "client_secrets.json"
TOKEN_FILE = BASE_DIR / "token_uploader.json"


def get_youtube_service():
    """Authenticate and return the YouTube v3 service object."""
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired upload token...", flush=True)
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"⚠️ Refresh failed ({e}), re-authenticating with Google OAuth...", flush=True)
                creds = None

        if not creds or not creds.valid:
            if not CLIENT_SECRETS_FILE.exists():
                raise FileNotFoundError(
                    f"Missing '{CLIENT_SECRETS_FILE.name}'!\n"
                    f"Please ensure client_secrets.json is present in {BASE_DIR}"
                )
            print("\n🔑 Authorizing YouTube Uploader with Google OAuth...", flush=True)
            print("Please approve upload permissions in your browser...\n", flush=True)
            
            import webbrowser
            import subprocess
            class MacBrowserController:
                def open(self, url, new=0, autoraise=True):
                    print(f"\n👉 OPENING AUTH URL IN BROWSER:\n{url}\n", flush=True)
                    try:
                        subprocess.Popen(["open", url])
                    except Exception as e:
                        print(f"Error launching browser: {e}", flush=True)
                    return True
            try:
                webbrowser.register("mac_open", MacBrowserController, preferred=True)
            except Exception:
                pass

            flow = InstalledAppFlow.from_client_secrets_file(
                str(CLIENT_SECRETS_FILE), SCOPES
            )
            creds = flow.run_local_server(
                port=8080,
                open_browser=True,
                authorization_prompt_message="👉 Authorization URL:\n{url}\n"
            )

        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())
        print(f"Credentials cached securely at: {TOKEN_FILE}", flush=True)

    return build("youtube", "v3", credentials=creds)


def upload_video(
    video_path: str,
    title: str,
    description: str = "",
    tags: list = None,
    category_id: str = "20",  # 20 = Gaming, 22 = People & Blogs, 24 = Entertainment
    privacy_status: str = "unlisted",  # 'public', 'private', or 'unlisted'
    publish_at: str = None,  # ISO 8601 string, e.g., '2026-08-20T12:00:00Z'
    thumbnail_path: str = None,
    is_short: bool = False
):
    """
    Uploads a video to YouTube using resumable upload chunks.
    """
    video_file = Path(video_path)
    if not video_file.exists():
        raise FileNotFoundError(f"Video file not found at: {video_path}")

    # Ensure Shorts have the #Shorts tag in title/description
    if is_short:
        if "#Shorts" not in title and "#shorts" not in title:
            title = f"{title} #Shorts"
        if "#Shorts" not in description and "#shorts" not in description:
            description = f"{description}\n\n#Shorts #Tech"

    youtube = get_youtube_service()

    # Build the video metadata body
    body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags or ["tech", "coding", "nemiexplains"],
            "categoryId": category_id
        },
        "status": {
            "privacyStatus": "private" if publish_at else privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }

    if publish_at:
        # publishAt requires privacyStatus to be 'private' until the scheduled time
        body["status"]["privacyStatus"] = "private"
        body["status"]["publishAt"] = publish_at
        print(f" Scheduled for release at: {publish_at}", flush=True)

    media = MediaFileUpload(
        str(video_file),
        chunksize=5 * 1024 * 1024,  # 5MB chunks
        resumable=True
    )

    print(f"\n Initiating upload for: {video_file.name}", flush=True)
    print(f"   Title: {title}", flush=True)
    print(f"   Privacy: {privacy_status}", flush=True)
    
    insert_request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=media
    )

    # Resumable upload loop
    response = None
    while response is None:
        status, response = insert_request.next_chunk()
        if status:
            percent = int(status.progress() * 100)
            print(f"   Uploading... {percent}% complete", flush=True)

    video_id = response.get("id")
    video_url = f"https://youtu.be/{video_id}"
    print(f"\n Video upload complete!", flush=True)
    print(f"   Video ID: {video_id}", flush=True)
    print(f"   Link: {video_url}", flush=True)

    # Set Custom Thumbnail if provided
    if thumbnail_path:
        thumb_file = Path(thumbnail_path)
        if thumb_file.exists():
            print(f" Uploading custom thumbnail: {thumb_file.name}...", flush=True)
            try:
                youtube.thumbnails().set(
                    videoId=video_id,
                    media_body=MediaFileUpload(str(thumb_file))
                ).execute()
                print(" Custom thumbnail applied successfully.", flush=True)
            except Exception as e:
                print(f" Note on thumbnail: {e}", flush=True)

    return response


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload a video to YouTube")
    parser.add_argument("--video", required=True, help="Path to video file (.mp4)")
    parser.add_argument("--title", required=True, help="Video title")
    parser.add_argument("--description", default="", help="Video description")
    parser.add_argument("--tags", nargs="*", default=["tech", "coding"], help="List of tags")
    parser.add_argument("--privacy", default="unlisted", choices=["public", "unlisted", "private"], help="Privacy status")
    parser.add_argument("--schedule", default=None, help="Schedule release (ISO 8601, e.g. 2026-08-20T12:00:00Z)")
    parser.add_argument("--category", default="28", help="YouTube Category ID (28 = Science & Tech, 27 = Education, 20 = Gaming)")
    parser.add_argument("--thumbnail", default=None, help="Path to thumbnail image (.jpg/.png)")
    parser.add_argument("--is-short", action="store_true", help="Set flag if video is a Short")

    args = parser.parse_args()

    upload_video(
        video_path=args.video,
        title=args.title,
        description=args.description,
        tags=args.tags,
        category_id=args.category,
        privacy_status=args.privacy,
        publish_at=args.schedule,
        thumbnail_path=args.thumbnail,
        is_short=args.is_short
    )
