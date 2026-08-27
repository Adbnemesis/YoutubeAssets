import urllib.request
import re
import os

brawlers = ["Ash", "Kit", "Mortis", "Hank", "Willow", "Nani"]
os.makedirs("./commonassets/sound_effects", exist_ok=True)

for brawler in brawlers:
    url = f"https://brawlstars.fandom.com/wiki/{brawler}"
    print(f"Fetching {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        # Find all audio src links
        # Looking for src="https://static.wikia.nocookie.net/brawlstars/images/.../xxx.ogg"
        matches = re.findall(r'src="(https://static\.wikia\.nocookie\.net/brawlstars/images/[^"]+\.(?:ogg|mp3)[^"]*)"', html)
        for src in matches:
            filename = src.split('/')[-1].split('?')[0]
            if any(x in filename.lower() for x in ['atk', 'attack', 'super', 'ulti', 'skill']):
                print(f"Downloading {filename}")
                filepath = f"./commonassets/sound_effects/{brawler.lower()}_{filename}"
                urllib.request.urlretrieve(src, filepath)
    except Exception as e:
        print(f"Error for {brawler}: {e}")
