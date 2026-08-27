import subprocess
import os

brawlers = ["Ash", "Kit", "Mortis", "Hank", "Willow", "Nani"]
dest_dir = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/commonassets/sound_effects"

for brawler in brawlers:
    for attack_type in ["atk", "ulti"]:
        filename = f"{brawler.lower()}_{attack_type}_01.mp3"
        filepath = os.path.join(dest_dir, filename)
        if os.path.exists(filepath):
            continue
            
        print(f"Downloading {attack_type} sound for {brawler}...")
        query = f"ytsearch1:Brawl Stars {brawler} {attack_type.replace('atk', 'attack').replace('ulti', 'super')} sound effect short"
        
        # Download as m4a first
        tmp_m4a = f"/tmp/{brawler}_{attack_type}.m4a"
        subprocess.run(["yt-dlp", "-f", "bestaudio[ext=m4a]", "-o", tmp_m4a, query], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Convert and trim to 1.5 seconds using ffmpeg
        if os.path.exists(tmp_m4a):
            subprocess.run(["ffmpeg", "-y", "-i", tmp_m4a, "-t", "1.5", filepath], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            os.remove(tmp_m4a)
            print(f"Saved {filepath}")
        else:
            print(f"Failed to download {brawler} {attack_type}")

print("Done!")
