import os
import json
import urllib.request

brawlers = ['Shelly', 'Edgar', 'Kenji', 'Melodie', 'Frank']
base_dir = "project_brawlstars/expressions"

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# The 6 required expression states
EXPRESSION_KEYS = ['normal', 'happy', 'angry', 'sad', 'excited', 'shocked']

print("🎭 Building Brawler Expression Asset Library (normal, happy, angry, sad, excited, shocked)...")

for brawler in brawlers:
    brawler_dir = os.path.join(base_dir, brawler.lower())
    os.makedirs(brawler_dir, exist_ok=True)
    print(f"\n📂 Fetching Pin & Expression Emotes for [{brawler}] -> {brawler_dir}")

    # MediaWiki API image query targeting official Pin Emotes
    url = f"https://brawlstars.fandom.com/api.php?action=query&list=allimages&aifrom={brawler}_Pin&ailimit=100&format=json"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            
        all_imgs = data.get('query', {}).get('allimages', [])
        
        # Categorize by expression keywords
        expression_mapping = {
            'normal': ['neutral', 'default', 'pin-neutral', 'portrait'],
            'happy': ['happy', 'smile', 'laugh', 'clap', 'pin-happy'],
            'angry': ['angry', 'mad', 'furious', 'pin-angry'],
            'sad': ['sad', 'cry', 'defeat', 'pin-sad'],
            'excited': ['gg', 'phew', 'special', 'hypercharge', 'pin-gg', 'pin-special'],
            'shocked': ['shocked', 'surprised', 'sweat', 'gasp', 'pin-phew']
        }
        
        found_expressions = set()
        
        for img in all_imgs:
            name = img['name'].lower()
            if name.endswith(('.png', '.jpg', '.webp')):
                for exp, keywords in expression_mapping.items():
                    if any(kw in name for kw in keywords) and exp not in found_expressions:
                        out_path = os.path.join(brawler_dir, f"{exp}.png")
                        try:
                            dl_req = urllib.request.Request(img['url'], headers=headers)
                            with urllib.request.urlopen(dl_req) as r, open(out_path, 'wb') as f:
                                f.write(r.read())
                            found_expressions.add(exp)
                            print(f"  ✅ [{brawler}] Saved expression [{exp}]: {img['name']}")
                        except Exception as ex:
                            pass
                            
        # Ensure fallbacks if any specific pin is missing
        for exp in EXPRESSION_KEYS:
            out_path = os.path.join(brawler_dir, f"{exp}.png")
            if not os.path.exists(out_path) and all_imgs:
                # Copy first available pin as placeholder fallback
                try:
                    dl_req = urllib.request.Request(all_imgs[0]['url'], headers=headers)
                    with urllib.request.urlopen(dl_req) as r, open(out_path, 'wb') as f:
                        f.write(r.read())
                    print(f"  📌 [{brawler}] Created fallback for [{exp}]")
                except Exception:
                    pass

        print(f"✨ Expressive states ready for {brawler}: {len(found_expressions)}/6 fetched.")
    except Exception as e:
        print(f"❌ Error fetching expressions for {brawler}: {e}")
