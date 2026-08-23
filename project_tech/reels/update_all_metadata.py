import os
from pathlib import Path

REELS_DIR = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/reels")

REEL_METADATA = {
    "captcha_01": {
        "title": "Why CAPTCHAs Secretly Watch Your Mouse",
        "yt_title": "Why CAPTCHAs Watch Your Mouse 🤖🖱️ #shorts",
        "one_liner": "The checkbox didn't care about your click, it was watching how your mouse moved to get there.",
        "hashtags": ["#captcha", "#security", "#computerscience", "#tech", "#nemiexplains"],
        "tags": ["captcha", "recaptcha", "how captcha works", "bot detection", "computer science", "tech explainer", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsCaptcha",
            "- Duration: 20.00s (600 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "floating_point_01": {
        "title": "Why 0.1 + 0.2 Is NOT 0.3 In Code",
        "yt_title": "Why 0.1 + 0.2 Is NOT 0.3 in Code 🤯💻 #shorts",
        "one_liner": "Why your computer calculates 0.1 plus 0.2 as 0.30000000000000004.",
        "hashtags": ["#floatingpoint", "#math", "#coding", "#computerscience", "#nemiexplains"],
        "tags": ["floating point math", "ieee 754", "why 0.1 + 0.2 is not 0.3", "binary fractions", "coding math", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsFloatingPoint",
            "- Duration: 21.00s (630 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "google_02": {
        "title": "How Google Searches Billions of Pages in Milliseconds",
        "yt_title": "How Google Searches 100B Pages Instantly 🔍⚡ #shorts",
        "one_liner": "How Google searched billions of web pages in milliseconds before modern AI existed.",
        "hashtags": ["#google", "#pagerank", "#algorithms", "#tech", "#nemiexplains"],
        "tags": ["how google search works", "pagerank algorithm", "inverted index", "search engine architecture", "algorithms", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsGoogle",
            "- Duration: 20.50s (615 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "twosum_03": {
        "title": "FAANG's #1 Coding Question: Two Sum (LeetCode #1)",
        "yt_title": "LeetCode #1 Two Sum: The O(1) Hash Map Trick ⚡💻 #shorts",
        "one_liner": "How a simple hash map turns an O(N²) nested loop into instant O(1) lookups.",
        "hashtags": ["#leetcode", "#twosum", "#datastructures", "#algorithms", "#nemiexplains"],
        "tags": ["leetcode 1", "two sum solution", "hash map complement", "coding interview", "dsa", "algorithms", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsTwoSum",
            "- Duration: 21.00s (630 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "chatgpt_04": {
        "title": "How ChatGPT Predicts One Word at a Time",
        "yt_title": "How ChatGPT Actually Generates Words 🤖⚡ #shorts",
        "one_liner": "ChatGPT doesn't think in full sentences — it predicts one token at a time.",
        "hashtags": ["#chatgpt", "#ai", "#machinelearning", "#transformers", "#nemiexplains"],
        "tags": ["how chatgpt works", "transformer architecture", "next token prediction", "large language models", "ai explainer", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsChatGPT",
            "- Duration: 20.00s (600 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "riddle_05": {
        "title": "Can You Solve This Deadlock Riddle?",
        "yt_title": "The Deadlock Riddle: Why You Must Switch 🍜💀 #shorts",
        "one_liner": "Why switching doors doubles your mathematical chances of winning the grand prize.",
        "hashtags": ["#math", "#probability", "#puzzles", "#logic", "#nemiexplains"],
        "tags": ["monty hall problem", "probability riddle", "game theory", "math paradox", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsRiddle",
            "- Duration: 21.00s (630 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": [
            "- Instagram Reel (@nemi.explains): https://www.instagram.com/reel/DcTkaQ3AAcq/ (Media ID: 17947446531271415)",
            "- Facebook Reel: https://www.facebook.com/reel/1243122028888830 (Page ID: 1243122028888830)",
            "- YouTube Shorts: https://youtu.be/qMhPqL7eR4E (Video ID: qMhPqL7eR4E)"
        ]
    },
    "qr_06": {
        "title": "You Destroyed This QR Code. It Still Scanned.",
        "yt_title": "You Destroyed This QR Code. It Still Scanned. 🤯📱 #shorts",
        "one_liner": "You destroyed 30% of this QR code with a marker and it still scanned perfectly.",
        "hashtags": ["#qrcode", "#errorcorrection", "#math", "#tech", "#nemiexplains"],
        "tags": ["how qr codes work", "reed solomon error correction", "qr code damage repair", "computer science", "math", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsQrCode",
            "- Duration: 18.13s (544 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": [
            "- Instagram Reel (@nemi.explains): https://www.instagram.com/reel/DcWIKGngC5e/ (Media ID: 18375461539239975)",
            "- Facebook Reel: https://www.facebook.com/reel/2308269849943389 (Video ID: 2308269849943389)",
            "- YouTube Shorts: https://youtu.be/-ccCaoY1Ke4 (Video ID: -ccCaoY1Ke4)"
        ]
    },
    "shazam_07": {
        "title": "It Heard 1 Second of Noise. And Named the Song.",
        "yt_title": "How Shazam Names Any Song From 1 Second of Audio 🎵🤯 #shorts",
        "one_liner": "Shazam heard one second of noisy audio and named the exact song.",
        "hashtags": ["#shazam", "#audio", "#algorithms", "#music", "#nemiexplains"],
        "tags": ["how shazam works", "audio fingerprinting", "spectrogram", "music recognition", "dsp", "algorithms", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsShazam",
            "- Duration: 20.27s (608 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": [
            "- Instagram Reel (@nemi.explains): https://www.instagram.com/reel/DcYSPm2Akbl/ (Media ID: 18124983754837340)",
            "- Facebook Reel: https://www.facebook.com/reel/2721823171553206 (Video ID: 2721823171553206)",
            "- YouTube Shorts: https://youtu.be/DkDxOFlZi3c (Video ID: DkDxOFlZi3c)"
        ]
    },
    "tokenize_08": {
        "title": "How AI Sees Words: The Tokenizer Trap",
        "yt_title": "Why ChatGPT Can't Count Letters (The Tokenizer Trap) 🤖🤯 #shorts",
        "one_liner": "How large language models slice human language into mathematical tokens.",
        "hashtags": ["#tokenization", "#llm", "#ai", "#datascience", "#nemiexplains"],
        "tags": ["how tokenization works", "byte pair encoding", "why ai cannot count letters", "token dictionary", "transformers", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsTokenize",
            "- Duration: 22.17s (665 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "mcp_09": {
        "title": "MCP vs API: What's the Actual Difference?",
        "yt_title": "MCP vs API: The USB-C of Artificial Intelligence 🔌🤖 #shorts",
        "one_liner": "How the Model Context Protocol connects AI models directly to your tools and databases.",
        "hashtags": ["#mcp", "#ai", "#softwareengineering", "#developer", "#nemiexplains"],
        "tags": ["model context protocol", "mcp vs api", "anthropic mcp", "ai tools integration", "software architecture", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsMCP",
            "- Duration: 21.00s (630 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "gps_10": {
        "title": "How 4 Satellites Pinpoint You on Earth",
        "yt_title": "How 4 Satellites Find Your Exact Location 🛰️📍 #shorts",
        "one_liner": "Four satellites in space pinpoint your location on Earth to within three meters.",
        "hashtags": ["#gps", "#physics", "#space", "#engineering", "#nemiexplains"],
        "tags": ["how gps works", "trilateration", "gps atomic clocks", "relativity in gps", "satellite navigation", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsGPS",
            "- Duration: 22.00s (660 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "noise_11": {
        "title": "Silence Is Made of Sound: Active Noise Cancellation",
        "yt_title": "How Active Noise Cancellation Creates Pure Silence 🎧🔇 #shorts",
        "one_liner": "Your headphones play exact anti-sound to cancel airplane noise into pure silence.",
        "hashtags": ["#noisecancelling", "#audio", "#physics", "#headphones", "#nemiexplains"],
        "tags": ["how noise cancelling works", "destructive interference", "phase inversion", "anc headphones", "audio physics", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsNoise",
            "- Duration: 21.50s (645 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "trash_12": {
        "title": "POV: You Just Emptied Your Trash (Nothing Was Deleted)",
        "yt_title": "Why Emptying Trash Deletes Nothing 🗑️💾 #shorts",
        "one_liner": "Emptying the trash bin never erases your files — it only deletes the pointer.",
        "hashtags": ["#cybersecurity", "#tech", "#computerscience", "#storage", "#nemiexplains"],
        "tags": ["why deleting files does not erase data", "file recovery", "hard drive pointers", "how file deletion works", "cybersecurity", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsTrash",
            "- Duration: 21.80s (654 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    },
    "binary_13": {
        "title": "Guess 1 to 100 in 7 Guesses (Binary Search)",
        "yt_title": "Guess 1 to 100 in 7 Guesses! Binary Search Explained 🤯⚡ #shorts",
        "one_liner": "How to find any number from 1 to 100 in just 7 guesses using Binary Search.",
        "hashtags": ["#binarysearch", "#algorithms", "#computerscience", "#math", "#nemiexplains"],
        "tags": ["binary search explained", "how binary search works", "guess a number 1 to 100", "o log n time complexity", "search 1 billion items", "nemi explains", "shorts"],
        "specs": [
            "- Composition: NemiExplainsBinary",
            "- Duration: 24.73s (742 frames @ 30fps)",
            "- Aspect Ratio: 9:16 (1080x1920)"
        ],
        "links": []
    }
}

def format_metadata(data):
    lines = []
    lines.append(f"TITLE: {data['title']}")
    lines.append("")
    lines.append("DESCRIPTION:")
    lines.append(data['one_liner'])
    lines.append(".")
    lines.append(".")
    lines.append(".")
    lines.append(".")
    lines.append(".")
    lines.append(" ".join(data['hashtags']))
    lines.append("")
    lines.append("YOUTUBE SHORTS TITLE:")
    lines.append(data['yt_title'])
    lines.append("")
    lines.append("YOUTUBE SHORTS DESCRIPTION:")
    lines.append(data['one_liner'])
    lines.append(".")
    lines.append(".")
    lines.append(".")
    lines.append(".")
    lines.append(".")
    lines.append(" ".join(data['hashtags']))
    lines.append("")
    lines.append("YOUTUBE TAGS:")
    lines.append(", ".join(data['tags']))
    lines.append("")
    lines.append("TECHNICAL SPECS:")
    for spec in data['specs']:
        lines.append(spec)
    lines.append("")
    lines.append("PUBLISHED LINKS:")
    if data['links']:
        for link in data['links']:
            lines.append(link)
    else:
        lines.append("- Status: Pending publication")
    lines.append("")
    return "\n".join(lines)

def main():
    print("Updating metadata files for all reels...")
    for reel_id, data in REEL_METADATA.items():
        reel_dir = REELS_DIR / reel_id
        if not reel_dir.exists():
            print(f"Skipping {reel_id} (folder not found)")
            continue
        meta_file = reel_dir / "metadata.txt"
        content = format_metadata(data)
        meta_file.write_text(content)
        print(f"✓ Updated {reel_id}/metadata.txt")
    print("All metadata files updated successfully!")

if __name__ == "__main__":
    main()
