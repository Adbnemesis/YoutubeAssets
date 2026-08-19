# Social Media Analytics & Multi-Channel Publishing OS

A **100% safe, official API pipeline** for analyzing metrics, extracting audience retention data, and automating video/Reels publishing across YouTube channels and Instagram.

---

## 📁 System Architecture

```
project_analyze_social_media/
├── requirements.txt
├── .gitignore                               # Protects all secret tokens & credentials
├── .venv/                                   # Isolated Python environment
│
├── instagram/                               # 🟣 Instagram Page (@nemi.explains)
│   ├── .env                                 # Access token & Account ID (Ignored by Git)
│   ├── fetch_instagram_analytics.py         # Read-only insights extractor (Reach, interactions, Reels stats)
│   └── publish_instagram_reel.py            # Automated Reels publisher with auto-staging
│
└── youtube/
    ├── cutenemi/                            # 🎮 YouTube Gaming Channel (cutenemi)
    │   ├── client_secrets.json              # OAuth credentials (Ignored by Git)
    │   ├── token.json                       # Cached read-only analytics token
    │   ├── token_uploader.json              # Cached upload authorization token
    │   ├── fetch_youtube_analytics.py       # Channel & video analytics extractor
    │   ├── publish_youtube_video.py         # Publishes videos / Shorts / thumbnails
    │   └── data/                            # Saved analytics reports
    │
    └── nemi_explains/                       # 💻 YouTube Tech Channel (nemi explains)
        ├── client_secrets.json              # OAuth credentials (Ignored by Git)
        ├── token.json                       # Cached read-only analytics token
        ├── token_uploader.json              # Cached upload authorization token
        ├── fetch_youtube_analytics.py       # Channel & video analytics extractor
        ├── publish_youtube_video.py         # Publishes videos / Shorts / thumbnails
        └── data/                            # Saved analytics reports
```

---

## 🚀 1. Setup & Environment

All scripts use the isolated project virtual environment located in `.venv/`:

```bash
cd /Users/talus/Downloads/youtube_ai/OpenMontage/project_analyze_social_media

# Install/Update dependencies if needed:
.venv/bin/pip install -r requirements.txt
```

---

## 🎮 2. YouTube Channel: `cutenemi` (Gaming / Brawl Stars)

### A. Fetch Analytics (Read-Only)
Extracts subscriber counts, top videos, average view duration, and 30-day time series data:
```bash
.venv/bin/python youtube/cutenemi/fetch_youtube_analytics.py
```
> 📊 **Output saved to**: `youtube/cutenemi/data/youtube_channel_summary.json`

### B. Publish a Long-Form Video (with Thumbnail)
```bash
.venv/bin/python youtube/cutenemi/publish_youtube_video.py \
  --video "/Users/talus/Downloads/youtube_ai/OpenMontage/project_chatnemi/brawl_stars/episodes/lag_spike_lie_detector/lag_spike_lie_detector.mp4" \
  --title "When you blame your WiFi 😭" \
  --description "Edgar loses a Knockout match to Crow and blames lag... 🔔 Subscribe for more Brawl Stars parodies!" \
  --tags "brawlstars" "brawlstarsmemes" "edgar" "leon" "gaming" "ranked" \
  --thumbnail "/Users/talus/Downloads/youtube_ai/OpenMontage/project_chatnemi/brawl_stars/episodes/lag_spike_lie_detector/thumbnail.png" \
  --category "20" \
  --privacy "unlisted"
```

### C. Publish a YouTube Short
```bash
.venv/bin/python youtube/cutenemi/publish_youtube_video.py \
  --video "/path/to/brawlstars_short.mp4" \
  --title "Kenji x Kaze x Nori Edit 🔥 #shorts" \
  --description "Best family edit in Brawl Stars! 🎮 #BrawlStars #Shorts" \
  --tags "brawlstars" "brawlstarsmemes" "kenji" "shorts" "gaming" \
  --category "20" \
  --is-short \
  --privacy "unlisted"
```

---

## 💻 3. YouTube Channel: `nemi_explains` (Tech / Code / AI)

### A. Fetch Analytics (Read-Only)
```bash
.venv/bin/python youtube/nemi_explains/fetch_youtube_analytics.py
```
> 📊 **Output saved to**: `youtube/nemi_explains/data/youtube_channel_summary.json`

### B. Publish a YouTube Short
```bash
.venv/bin/python youtube/nemi_explains/publish_youtube_video.py \
  --video "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_TwoSum_20260818.mp4" \
  --title "How to Solve Two Sum in O(N) Time! 🧠 (LeetCode #1) #shorts" \
  --description "FAANG’s #1 most asked interview question: Two Sum. ⚡ Calculate (Target - Current) in O(1) time! #leetcode #dsa #tech #Shorts" \
  --tags "leetcode" "twosum" "dsa" "algorithms" "codinginterview" "tech" "Shorts" \
  --category "28" \
  --is-short \
  --privacy "unlisted"
```

---

## 🟣 4. Instagram Page: `@nemi.explains`

### A. Fetch Insights (Read-Only)
Extracts daily profile reach, interaction rates, and granular Reels analytics (views, watch time, shares, saves):
```bash
.venv/bin/python instagram/fetch_instagram_analytics.py
```
> 📊 **Output saved to**: `instagram/data/instagram_summary.json`

### B. Publish a Reel (Direct Local File Upload)
The script automatically stages your local video to a direct high-speed CDN stream for Meta to ingest and publish live:

```bash
.venv/bin/python instagram/publish_instagram_reel.py \
  --video "/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/out/NemiExplains_TwoSum_20260818.mp4" \
  --caption "FAANG’s #1 most asked interview question: Two Sum. 🤯⚡

If you're still using nested for-loops, testing all pairs is O(N²) time.
⚡ 1-Pass Hash Map: Calculate (Target - Current) in O(1) constant time!

Tag a developer preparing for coding interviews! 👇

#leetcode #twosum #dsa #algorithms #codinginterview #faang #tech"
```

---

## ⚙️ CLI Flags & Options Reference

### YouTube Flags (`publish_youtube_video.py`):
| Flag | Default | Description | Example |
| :--- | :--- | :--- | :--- |
| `--video` | *(Required)* | Absolute path to local `.mp4` file | `--video "/path/to/video.mp4"` |
| `--title` | *(Required)* | Video or Short title | `--title "My Video Title"` |
| `--description` | `""` | Video description with links & hashtags | `--description "Full details..."` |
| `--tags` | `["gaming"]` | Space-separated list of search tags | `--tags "brawlstars" "gaming"` |
| `--privacy` | `unlisted` | Video privacy status | `--privacy "public"` / `"unlisted"` / `"private"` |
| `--schedule` | `None` | Schedule future UTC release time | `--schedule "2026-08-25T14:00:00Z"` |
| `--thumbnail` | `None` | Path to custom `.png` / `.jpg` thumbnail | `--thumbnail "/path/to/thumb.png"` |
| `--category` | `28` / `20` | YouTube category ID (20: Gaming, 28: Science & Tech, 27: Education) | `--category "28"` |
| `--is-short` | `False` | Adds `#Shorts` formatting automatically | `--is-short` |

### Instagram Flags (`publish_instagram_reel.py`):
| Flag | Default | Description | Example |
| :--- | :--- | :--- | :--- |
| `--video` | `None` | Path to local `.mp4` video (Auto-staged) | `--video "/path/to/reel.mp4"` |
| `--video-url` | `None` | Public HTTPS link to existing hosted video | `--video-url "https://domain.com/video.mp4"` |
| `--caption` | `""` | Reel caption and hashtags | `--caption "Check this out! #tech"` |
| `--cover-url` | `None` | Public HTTPS link to custom cover frame | `--cover-url "https://domain.com/cover.jpg"` |
| `--no-feed` | `False` | If set, shows only in Reels tab (omits from profile grid) | `--no-feed` |

---

## 🛡️ Security & Performance Guarantees

1. **Zero Shadowban Risk**: Strictly uses official Google Cloud & Meta Developer APIs with verified OAuth scopes. No headless browser bots or hijacked session cookies.
2. **Local Token Safety**: All credentials (`client_secrets.json`, `.env`, and tokens) are ignored in `.gitignore` and never committed to version control.
3. **Lossless Video Quality**: Direct bit-for-bit video ingest with zero compression degradation.
