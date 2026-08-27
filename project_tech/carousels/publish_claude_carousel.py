#!/usr/bin/env python3
"""
Publish Claude Code Skills Carousel to Instagram @nemi.explains
"""

import sys
from pathlib import Path

# Add project_analyze_social_media to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SOCIAL_DIR = BASE_DIR / "project_analyze_social_media" / "instagram"
sys.path.insert(0, str(SOCIAL_DIR))

from publish_instagram_carousel import publish_carousel_from_folder

CAROUSEL_FOLDER = BASE_DIR / "project_tech" / "out" / "carousels" / "claude_code_skills_v2"

CAPTION = """Top 5 Claude Code Skills (SKILL.md) You Need to Know ⚡️🤖

Did you know Anthropic's Claude Code uses an open standard called "Agent Skills" (SKILL.md)?

Unlike standard chat prompts that waste context, a Skill is a persistent, reusable Standard Operating Procedure (SOP) with progressive disclosure:

1️⃣ Code Reviewer & Security Gatekeeper 🛡️
2️⃣ Browser Automation & UI Testing (browser-act) 🌐
3️⃣ Frontend Design System Builder 🎨
4️⃣ Self-Healing Test-Debug Loop 🔄
5️⃣ Database & Infra Manager 🗄️

Swipe through the carousel to master how SKILL.md works and build your first AI skill in 30 seconds! 📲

Save this for your next coding session! 📌
Follow @nemi.explains for daily engineering & AI insights.

#claudecode #anthropic #aiagents #coding #softwareengineering #webdev #programming #ai #developer #learntocode #tech #sysadmin #devops #aitools"""

if __name__ == "__main__":
    print(f"🚀 Publishing Claude Code Skills Carousel to Instagram...")
    result = publish_carousel_from_folder(str(CAROUSEL_FOLDER), caption=CAPTION)
    print("🎉 PUBLISH COMPLETE!")
    print(f"Post Link: {result['permalink']}")
