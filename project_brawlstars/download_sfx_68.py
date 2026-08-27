import os
import subprocess

brawlers = ["ash", "kit", "mortis", "hank", "willow", "nani"]
sfx_dir = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/commonassets/sound_effects"
vo_dir = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/commonassets/brawler_voices"

os.makedirs(sfx_dir, exist_ok=True)
os.makedirs(vo_dir, exist_ok=True)

base_url = "https://raw.githubusercontent.com/tailsjs/brawl-stars-assets/master/68.250/sfx/"

def dl(filename, dest):
    path = os.path.join(dest, filename)
    if not os.path.exists(path):
        url = base_url + filename
        res = subprocess.run(["curl", "-s", "-o", path, "-w", "%{http_code}", url], capture_output=True, text=True)
        if res.stdout == "200":
            print(f"Downloaded {filename}")
        else:
            os.remove(path)
            print(f"Failed {filename}")

for b in brawlers:
    dl(f"{b}_atk_01.ogg", sfx_dir)
    dl(f"{b}_ulti_01.ogg", sfx_dir)
    dl(f"{b}_super_01.ogg", sfx_dir)
    dl(f"{b}_rats_01.ogg", sfx_dir)  # Ash special case
    dl(f"{b}_ulti_atk_01.ogg", sfx_dir)  # Kit special case
    
    dl(f"{b}_atk_vo_01.ogg", vo_dir)
    dl(f"{b}_ulti_vo_01.ogg", vo_dir)
    dl(f"{b}_super_vo_01.ogg", vo_dir)

print("Done downloading genuine SFX & Voices.")
