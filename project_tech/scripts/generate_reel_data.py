#!/usr/bin/env python3
"""
Reel Data Generator for Project Tech
Saves and formats JSON configurations for the first 30 launch Reels.
"""
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

REELS = [
    {
        "id": "reel-01",
        "compositionId": "OutputPredictor",
        "seriesTitle": "WHAT DOES THIS PRINT?",
        "difficulty": "MEDIUM",
        "language": "JavaScript",
        "hookQuestion": "Why Does [1, 2, 3] + [4, 5, 6] Equal This?",
        "subHook": "90% of JS Developers Guess Wrong",
        "codeLines": [
            {"number": 1, "code": "const a = [1, 2, 3];"},
            {"number": 2, "code": "const b = [4, 5, 6];"},
            {"number": 3, "code": "console.log(a + b);"}
        ],
        "countdownSeconds": 5,
        "options": [
            {"id": "A", "label": "[1,2,3,4,5,6]", "isCorrect": False},
            {"id": "B", "label": "\"1,2,34,5,6\"", "isCorrect": True},
            {"id": "C", "label": "TypeError", "isCorrect": False},
            {"id": "D", "label": "NaN", "isCorrect": False}
        ],
        "correctOptionId": "B",
        "explanationHeading": "Result: \"1,2,34,5,6\"",
        "explanationPoints": [
            "The + operator triggers String coercion on both arrays via .toString()",
            "[1,2,3].toString() evaluates to '1,2,3'",
            "[4,5,6].toString() evaluates to '4,5,6'",
            "Concatenation yields '1,2,3' + '4,5,6' = '1,2,34,5,6'"
        ],
        "complexityTime": "O(N)",
        "complexitySpace": "O(N)",
        "callToAction": "Save this JS interview trap 📌",
        "brandTag": "@codemind.dev"
    },
    {
        "id": "reel-02",
        "compositionId": "SpotTheBug",
        "seriesTitle": "SPOT THE BUG",
        "difficulty": "SENIOR",
        "language": "Python",
        "hookQuestion": "Can You Spot the Memory Leak Trap?",
        "buggyCodeLines": [
            {"number": 1, "code": "def append_to(element, target=[]):"},
            {"number": 2, "code": "    target.append(element)"},
            {"number": 3, "code": "    return target"},
            {"number": 4, "code": "print(append_to(1)) # [1]"},
            {"number": 5, "code": "print(append_to(2)) # [1, 2]"}
        ],
        "fixedCodeLines": [
            {"number": 1, "code": "def append_to(element, target=None):"},
            {"number": 2, "code": "    if target is None: target = []"},
            {"number": 3, "code": "    target.append(element)"},
            {"number": 4, "code": "    return target"}
        ],
        "buggyLineNumber": 1,
        "countdownSeconds": 5,
        "bugExplanation": "Default Mutable Argument Trap",
        "whyItHappens": "Python evaluates default parameters ONCE at definition time. The list instance is reused across all subsequent invocations.",
        "callToAction": "Did you catch it? Drop your answer below 👇",
        "brandTag": "@codemind.dev"
    },
    {
        "id": "reel-03",
        "compositionId": "OutputPredictor",
        "seriesTitle": "INTERVIEW TRAP",
        "difficulty": "HARD",
        "language": "JavaScript",
        "hookQuestion": "Why Does typeof null Equal 'object'?",
        "subHook": "The 30-Year-Old Bug Still in Production",
        "codeLines": [
            {"number": 1, "code": "console.log(typeof null);"},
            {"number": 2, "code": "console.log(null instanceof Object);"}
        ],
        "countdownSeconds": 5,
        "options": [
            {"id": "A", "label": "'object', true", "isCorrect": False},
            {"id": "B", "label": "'object', false", "isCorrect": True},
            {"id": "C", "label": "'null', false", "isCorrect": False},
            {"id": "D", "label": "undefined, false", "isCorrect": False}
        ],
        "correctOptionId": "B",
        "explanationHeading": "Result: 'object' and false",
        "explanationPoints": [
            "In early JS, values were stored with a type tag in the lowest 3 bits.",
            "Object type tag was 000. null was represented as the NULL pointer (0x00).",
            "Hence typeof null returned 'object' — a legacy bug that can never be fixed without breaking the web!"
        ],
        "complexityTime": "O(1)",
        "complexitySpace": "O(1)",
        "callToAction": "Share this with a fellow developer 📤",
        "brandTag": "@codemind.dev"
    }
]

def generate_initial_data():
    for r in REELS:
        out_file = DATA_DIR / f"{r['id']}.json"
        with open(out_file, "w") as f:
            json.dump(r, f, indent=2)
        print(f"Generated {out_file.name}")

if __name__ == "__main__":
    generate_initial_data()
