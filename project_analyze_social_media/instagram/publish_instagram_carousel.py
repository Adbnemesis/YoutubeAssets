"""
Instagram Automated Carousel Publisher
---------------------------------------
Publishes multi-image carousels to Instagram (@nemi.explains) using Meta's Graph API.
Reads captions, title, and tags from metadata.txt.
"""

import os
import time
import sys
import re
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
    
    if not access_token or not account_id:
        raise ValueError(
            f"Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID in {ENV_FILE}!\n"
            f"Ensure your token has 'instagram_content_publish' permission."
        )
    return access_token, account_id


def parse_metadata_file(metadata_path: Path) -> str:
    """Parses metadata.txt and formats a clean, high-engagement Instagram caption."""
    if not metadata_path.exists():
        raise FileNotFoundError(f"metadata.txt not found at: {metadata_path}")
        
    content = metadata_path.read_text(encoding="utf-8").strip()
    
    # Check if standard format (Title:, Description:, Tags:)
    title_match = re.search(r"Title:\s*\n(.*?)(?=\n\s*(?:Description|Tags|Thumbnail|$))", content, re.DOTALL | re.IGNORECASE)
    desc_match = re.search(r"Description:\s*\n(.*?)(?=\n\s*(?:Tags|Thumbnail|Title|$))", content, re.DOTALL | re.IGNORECASE)
    tags_match = re.search(r"Tags:\s*\n(.*?)(?=\n\s*(?:Thumbnail|Title|Description|$))", content, re.DOTALL | re.IGNORECASE)
    
    if title_match or desc_match:
        title = title_match.group(1).strip() if title_match else ""
        desc = desc_match.group(1).strip() if desc_match else ""
        tags = tags_match.group(1).strip() if tags_match else ""
        
        parts = []
        if title:
            parts.append(title)
        if desc:
            parts.append(desc)
        if tags:
            parts.append(tags)
            
        return "\n\n".join(parts)
        
    # If raw text, return as-is
    return content


def stage_local_image(local_path: Path) -> str:
    """Stages a local image file to a temporary public CDN so Meta servers can ingest it."""
    if not local_path.exists():
        raise FileNotFoundError(f"Local image not found at: {local_path}")
        
    print(f"  📤 Staging '{local_path.name}' ({local_path.stat().st_size / 1024:.1f} KB)...", flush=True)
    
    # 1. Catbox CDN
    try:
        with open(local_path, "rb") as f:
            resp = requests.post(
                "https://catbox.moe/user/api.php",
                data={"reqtype": "fileupload"},
                files={"fileToUpload": f},
                timeout=60
            )
        if resp.status_code == 200 and resp.text.startswith("http"):
            staged_url = resp.text.strip()
            print(f"     ✅ Staged at: {staged_url}", flush=True)
            return staged_url
    except Exception as e:
        print(f"     ⚠️ Catbox failed: {e}, trying fallback...", flush=True)
        
    # 2. Tmpfiles fallback
    with open(local_path, "rb") as f:
        resp2 = requests.post("https://tmpfiles.org/api/v1/upload", files={"file": f}, timeout=60).json()
        if resp2.get("status") == "success":
            raw_url = resp2["data"]["url"]
            direct_url = raw_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
            print(f"     ✅ Staged at fallback: {direct_url}", flush=True)
            return direct_url

    raise RuntimeError(f"Could not stage image: {local_path}")


def create_carousel_item_container(account_id: str, access_token: str, image_url: str) -> str:
    """Step 1: Create an individual carousel item container."""
    url = f"{BASE_GRAPH_URL}/{account_id}/media"
    payload = {
        "access_token": access_token,
        "image_url": image_url,
        "is_carousel_item": "true",
    }
    
    resp = requests.post(url, data=payload).json()
    if "error" in resp:
        raise RuntimeError(f"Error creating carousel item container: {resp['error'].get('message')}")
        
    item_id = resp["id"]
    return item_id


def create_carousel_container(account_id: str, access_token: str, item_ids: list, caption: str = "") -> str:
    """Step 2: Create the parent Carousel container referencing all children items."""
    print("📦 Creating parent Instagram Carousel container...", flush=True)
    url = f"{BASE_GRAPH_URL}/{account_id}/media"
    
    payload = {
        "access_token": access_token,
        "media_type": "CAROUSEL",
        "children": ",".join(item_ids),
        "caption": caption,
    }
    
    resp = requests.post(url, data=payload).json()
    if "error" in resp:
        raise RuntimeError(f"Error creating Carousel parent container: {resp['error'].get('message')}")
        
    container_id = resp["id"]
    print(f"✅ Parent Carousel container created (ID: {container_id})", flush=True)
    return container_id


def wait_for_container(container_id: str, access_token: str, max_attempts: int = 20, interval: int = 3):
    """Step 3: Verify container processing status."""
    print("⏳ Verifying Carousel readiness on Instagram servers...", flush=True)
    url = f"{BASE_GRAPH_URL}/{container_id}"
    params = {
        "access_token": access_token,
        "fields": "status_code,status"
    }
    
    for attempt in range(1, max_attempts + 1):
        resp = requests.get(url, params=params).json()
        if "error" in resp:
            raise RuntimeError(f"Error checking status: {resp['error'].get('message')}")
            
        status = resp.get("status_code", "UNKNOWN")
        print(f"   Status check {attempt}/{max_attempts}: {status}", flush=True)
        
        if status == "FINISHED":
            return True
        elif status in ["ERROR", "EXPIRED"]:
            raise RuntimeError(f"Meta server error during processing: {resp.get('status')}")
            
        time.sleep(interval)
        
    print("⚠️ Timeout waiting for status check, attempting publish anyway...", flush=True)
    return True


def publish_carousel(account_id: str, access_token: str, creation_id: str) -> str:
    """Step 4: Publish the finalized Carousel to Instagram."""
    print("🚀 Publishing Carousel live to Instagram @nemi.explains...", flush=True)
    url = f"{BASE_GRAPH_URL}/{account_id}/media_publish"
    payload = {
        "access_token": access_token,
        "creation_id": creation_id
    }
    
    resp = requests.post(url, data=payload).json()
    if "error" in resp:
        raise RuntimeError(f"Failed to publish Carousel: {resp['error'].get('message')}")
        
    media_id = resp["id"]
    print(f"🎉 SUCCESS! Carousel published live! (Media ID: {media_id})", flush=True)
    return media_id


def get_media_permalink(media_id: str, access_token: str) -> str:
    """Fetches the public Instagram URL of the published post."""
    url = f"{BASE_GRAPH_URL}/{media_id}"
    params = {
        "access_token": access_token,
        "fields": "permalink"
    }
    resp = requests.get(url, params=params).json()
    return resp.get("permalink", f"https://www.instagram.com/p/{media_id}")


def publish_carousel_from_folder(folder_path: str, caption: str = "", metadata_file: str = None) -> dict:
    access_token, account_id = get_credentials()
    folder = Path(folder_path)
    
    if not folder.exists() or not folder.is_dir():
        raise FileNotFoundError(f"Directory not found: {folder_path}")
        
    # Auto-resolve caption from metadata.txt if not explicitly passed
    if not caption:
        meta_candidates = []
        if metadata_file:
            meta_candidates.append(Path(metadata_file))
        meta_candidates.append(folder / "metadata.txt")
        meta_candidates.append(folder.parent / "metadata.txt")
        
        for candidate in meta_candidates:
            if candidate.exists():
                print(f"📄 Found metadata file: {candidate}")
                caption = parse_metadata_file(candidate)
                break
                
    # Get all PNG/JPG slides sorted
    slide_files = sorted(
        [f for f in folder.iterdir() if f.suffix.lower() in [".png", ".jpg", ".jpeg"]],
        key=lambda x: x.name
    )
    
    if not slide_files:
        raise ValueError(f"No image slides found in {folder_path}")
        
    print(f"\n==================================================")
    print(f"📸 PUBLISHING INSTAGRAM CAROUSEL ({len(slide_files)} SLIDES)")
    print(f"📁 Source: {folder}")
    print(f"==================================================")
    
    # 1. Stage all slides and create item containers
    item_ids = []
    for idx, slide in enumerate(slide_files, 1):
        print(f"\n[{idx}/{len(slide_files)}] Processing {slide.name}...")
        staged_url = stage_local_image(slide)
        item_id = create_carousel_item_container(account_id, access_token, staged_url)
        print(f"     ✅ Child container ID: {item_id}")
        item_ids.append(item_id)
        
    # 2. Create parent Carousel container
    print(f"\n--------------------------------------------------")
    carousel_container_id = create_carousel_container(account_id, access_token, item_ids, caption=caption)
    
    # 3. Wait for readiness
    wait_for_container(carousel_container_id, access_token)
    
    # 4. Publish
    media_id = publish_carousel(account_id, access_token, carousel_container_id)
    
    # 5. Fetch permalink
    permalink = get_media_permalink(media_id, access_token)
    print(f"🔗 View Post: {permalink}")
    print(f"==================================================\n")
    
    return {
        "media_id": media_id,
        "permalink": permalink,
        "total_slides": len(slide_files)
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publish an Instagram Carousel")
    parser.add_argument("--folder", type=str, required=True, help="Path to folder containing PNG slides")
    parser.add_argument("--caption", type=str, default="", help="Optional explicit post caption")
    parser.add_argument("--metadata", type=str, default="", help="Optional path to metadata.txt file")
    
    args = parser.parse_args()
    publish_carousel_from_folder(args.folder, caption=args.caption, metadata_file=args.metadata)
