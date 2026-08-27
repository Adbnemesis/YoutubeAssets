import urllib.request
import urllib.parse
import re
import os

sounds_to_find = [
    ("vine boom", "vine_boom.mp3"),
    ("discord call", "discord_call.mp3"),
    ("discord join", "discord_join.mp3"),
    ("discord leave", "discord_leave.mp3"),
    ("record scratch", "record_scratch.mp3")
]

os.makedirs("project_chatnemi/assets", exist_ok=True)

for query, filename in sounds_to_find:
    try:
        url = "https://www.myinstants.com/en/search/?name=" + urllib.parse.quote_plus(query)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # Look for the play button which contains the mp3 link
        # e.g. onclick="play('/media/sounds/vine-boom.mp3', 'loader...')"
        match = re.search(r"onclick=\"play\('([^']+)',", html)
        if match:
            mp3_path = match.group(1)
            mp3_url = "https://www.myinstants.com" + mp3_path
            print(f"Found {query} at {mp3_url}")
            
            # Download it
            save_path = os.path.join("project_chatnemi/assets", filename)
            urllib.request.urlretrieve(mp3_url, save_path)
            print(f"Downloaded {filename}")
        else:
            print(f"Could not find sound for {query}")
    except Exception as e:
        print(f"Error finding {query}: {e}")
