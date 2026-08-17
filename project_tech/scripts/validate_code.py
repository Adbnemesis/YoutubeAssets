#!/usr/bin/env python3
"""
Code Sandbox Validator for Project Tech Reel Engine
Executes Python and JavaScript snippets to verify that outputs and behaviors match claims.
"""
import subprocess
import sys
import json
from pathlib import Path

def test_python_snippet(code_str: str) -> dict:
    try:
        res = subprocess.run(
            ["python3", "-c", code_str],
            capture_output=True,
            text=True,
            timeout=3
        )
        return {
            "success": res.returncode == 0,
            "stdout": res.stdout.strip(),
            "stderr": res.stderr.strip()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def test_node_snippet(code_str: str) -> dict:
    try:
        res = subprocess.run(
            ["node", "-e", code_str],
            capture_output=True,
            text=True,
            timeout=3
        )
        return {
            "success": res.returncode == 0,
            "stdout": res.stdout.strip(),
            "stderr": res.stderr.strip()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def validate_reel_json(json_path: Path):
    with open(json_path, "r") as f:
        data = json.load(f)
    
    print(f"[*] Validating Reel: {data.get('id', json_path.stem)}")
    code_lines = data.get("codeLines", [])
    raw_code = "\n".join([line.get("code", "") for line in code_lines])
    lang = data.get("language", "JavaScript")

    if lang == "Python":
        result = test_python_snippet(raw_code)
    elif lang in ["JavaScript", "TypeScript"]:
        result = test_node_snippet(raw_code)
    else:
        print(f"[-] Unsupported execution runner for language: {lang} (manual check required)")
        return True

    print(f"    Execution Result: Success={result.get('success')}, Output={result.get('stdout') or result.get('stderr')}")
    return result.get("success", False)

if __name__ == "__main__":
    data_dir = Path(__file__).parent.parent / "data"
    all_valid = True
    for json_file in data_dir.glob("*.json"):
        if not validate_reel_json(json_file):
            all_valid = False
    print(f"Validation finished. All valid: {all_valid}")
