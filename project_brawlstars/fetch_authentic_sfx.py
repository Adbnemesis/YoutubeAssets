import json
import os
import subprocess
import re

with open("/tmp/full_tree.json") as f:
    data = json.load(f)

tree = data.get("tree", [])

# We want the LATEST version. Versions are like "68.250/sfx/...".
# We can extract the version float from the path to find the latest.
def get_version(path):
    m = re.match(r"^(\d+\.\d+)/", path)
    if m:
        return float(m.group(1))
    return 0.0

# Build a dictionary of available files: { "filename": "best_path" }
# where best_path is the one with the highest version number.
best_paths = {}
for item in tree:
    path = item.get("path", "")
    if path.endswith(".ogg") and "/sfx/" in path:
        filename = path.split("/")[-1].lower()
        ver = get_version(path)
        
        if filename not in best_paths or ver > best_paths[filename]["ver"]:
            best_paths[filename] = {"ver": ver, "path": path}

brawlers = ["ash", "kit", "mortis", "hank", "willow", "nani"]
sfx_dir = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/commonassets/sound_effects"
vo_dir = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/commonassets/sound_effects/brawler_voices"

os.makedirs(sfx_dir, exist_ok=True)
os.makedirs(vo_dir, exist_ok=True)

# Some files might be named _super_01 instead of _ulti_01, or they might be missing.
def download_best(filename, dest_folder):
    if filename in best_paths:
        git_path = best_paths[filename]["path"]
        url = f"https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/{git_path}"
        dest_path = os.path.join(dest_folder, filename)
        if not os.path.exists(dest_path):
            print(f"Downloading {filename} from {url}...")
            subprocess.run(["curl", "-s", "-o", dest_path, url])
            print(f"Saved to {dest_path}")
        return True
    return False

for brawler in brawlers:
    # 1. SFX
    download_best(f"{brawler}_atk_01.ogg", sfx_dir)
    if not download_best(f"{brawler}_ulti_01.ogg", sfx_dir):
        download_best(f"{brawler}_super_01.ogg", sfx_dir)
        
    # 2. Voices
    download_best(f"{brawler}_atk_vo_01.ogg", vo_dir)
    if not download_best(f"{brawler}_ulti_vo_01.ogg", vo_dir):
        download_best(f"{brawler}_super_vo_01.ogg", vo_dir)

print("Finished fetching authentic sounds.")
