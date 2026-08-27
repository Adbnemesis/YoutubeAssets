import os
import subprocess
import re
import math

audio_dir = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/commonassets/sound_effects"
fps = 30

durations = {}
for file in os.listdir(audio_dir):
    if file.endswith(".mp3") or file.endswith(".ogg"):
        path = os.path.join(audio_dir, file)
        try:
            result = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path], capture_output=True, text=True)
            duration_sec = float(result.stdout.strip())
            frames = max(30, math.ceil(duration_sec * fps))
            durations[file.split(".")[0]] = frames
        except Exception as e:
            pass

print("Calculated Durations (Frames):", durations)

# 1. Update preview_vfx.html
html_path = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/preview_vfx.html"
with open(html_path, "r") as f:
    html_content = f.read()

brawlers = ["ash", "kit", "mortis", "hank", "willow", "nani", "gale", "shelly", "crow", "edgar", "kenji", "frank", "bibi"]
for brawler in brawlers:
    atk_key = f"{brawler}_atk_01"
    ulti_key = f"{brawler}_ulti_01"
    super_key = f"{brawler}_super_01"
    
    atk_frames = durations.get(atk_key, 60)
    ulti_frames = durations.get(ulti_key, durations.get(super_key, 90))
    
    html_content = re.sub(fr"({brawler}:\s*\{{\s*atk:\s*\{{[^}}]*?duration:\s*)\d+", rf"\g<1>{atk_frames}", html_content)
    html_content = re.sub(fr"({brawler}:\s*\{{.*?super:\s*\{{[^}}]*?duration:\s*)\d+", rf"\g<1>{ulti_frames}", html_content, flags=re.DOTALL)

with open(html_path, "w") as f:
    f.write(html_content)
print("Updated preview_vfx.html")

# 2. Update AttackSceneComposition.tsx
tsx_path = "/Users/talus/Downloads/youtube_ai/OpenMontage/project_brawlstars/compositions/AttackSceneComposition.tsx"
with open(tsx_path, "r") as f:
    tsx_content = f.read()

for brawler in brawlers:
    atk_key = f"{brawler}_atk_01"
    ulti_key = f"{brawler}_ulti_01"
    super_key = f"{brawler}_super_01"
    
    atk_frames = durations.get(atk_key, 60)
    ulti_frames = durations.get(ulti_key, durations.get(super_key, 90))
    
    # Update <Composition id="BrawlerAttackScene" durationInFrames={XX} />
    Brawler = brawler.capitalize()
    tsx_content = re.sub(fr'(id="{Brawler}AttackScene"\s*[\s\S]*?durationInFrames={{)\d+', rf'\g<1>{atk_frames}', tsx_content)
    tsx_content = re.sub(fr'(id="{Brawler}SuperScene"\s*[\s\S]*?durationInFrames={{)\d+', rf'\g<1>{ulti_frames}', tsx_content)

with open(tsx_path, "w") as f:
    f.write(tsx_content)

print("Updated AttackSceneComposition.tsx")
