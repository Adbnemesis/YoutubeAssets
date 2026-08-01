#!/usr/bin/env python3
"""
voicebox_generate.py — Generic Voicebox MCP HTTP Client

A reusable CLI script for generating voice audio via the locally-running
Voicebox MCP server (http://127.0.0.1:17493/mcp/).

Usage:
    # List all available voice profiles
    python voicebox_generate.py list-profiles

    # Generate a single voice clip
    python voicebox_generate.py speak --profile Edgar --text "Whatever!" --out edgar_test.wav

    # Batch generate from a JSON config
    python voicebox_generate.py batch --config samples.json --output-dir voices/

    # Batch with custom log file
    python voicebox_generate.py batch --config samples.json --output-dir voices/ --log my_log.md

Requirements:
    - Voicebox app must be open with MCP server enabled (Settings → MCP)
    - Voicebox MCP server listens on http://127.0.0.1:17493/mcp/
    - No external Python dependencies required (stdlib only)

JSON config format for batch mode:
    [
        {
            "profile": "Edgar",
            "text": "Whatever, don't touch my scarf!",
            "out": "edgar_sample.wav"
        },
        ...
    ]
"""

import os
import sys
import json
import time
import shutil
import argparse
import urllib.request
import urllib.error
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple


# ─────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────

MCP_URL = "http://127.0.0.1:17493/mcp/"
VOICEBOX_GENERATIONS_DIR = os.path.expanduser(
    "~/Library/Application Support/sh.voicebox.app/generations"
)
DEFAULT_OUTPUT_DIR = "voices"
DEFAULT_LOG_FILE = "voice_generation_log.md"
POLL_INTERVAL_SECONDS = 1.5
MAX_WAIT_SECONDS = 120

HTTP_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "text/event-stream, application/json",
}


# ─────────────────────────────────────────────────────────────────────
# MCP Session & Tool Calls
# ─────────────────────────────────────────────────────────────────────


def _post_mcp(
    payload: Dict[str, Any],
    session_id: Optional[str] = None,
    timeout: int = 15,
) -> Tuple[Dict[str, Any], Optional[str]]:
    """
    Send a JSON-RPC 2.0 POST to the Voicebox MCP endpoint.

    Returns (parsed_response, session_id).
    The response is extracted from SSE `data:` lines if present.
    """
    hdrs = dict(HTTP_HEADERS)
    if session_id:
        hdrs["mcp-session-id"] = session_id

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(MCP_URL, data=data, headers=hdrs, method="POST")

    with urllib.request.urlopen(req, timeout=timeout) as resp:
        sid = resp.headers.get("mcp-session-id") or session_id
        raw = resp.read().decode("utf-8")

        # SSE responses come as "event: message\r\ndata: {...}\r\n"
        for line in raw.splitlines():
            stripped = line.strip()
            if stripped.startswith("data: "):
                return json.loads(stripped[6:]), sid

        # Fallback: plain JSON
        return json.loads(raw), sid


def initialize_session() -> str:
    """
    Initialize an MCP session with the Voicebox server.

    Returns the mcp-session-id string needed for all subsequent calls.
    """
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "VoiceboxGenerate", "version": "1.0"},
        },
    }

    try:
        resp, sid = _post_mcp(payload)
    except Exception as e:
        print(
            f"\n❌ Cannot connect to Voicebox MCP server at {MCP_URL}\n"
            f"   Make sure the Voicebox app is open and MCP is enabled in Settings → MCP.\n"
            f"   Error: {e}"
        )
        sys.exit(1)

    if not sid:
        print("❌ Failed to obtain mcp-session-id from Voicebox server.")
        sys.exit(1)

    # Send the required notifications/initialized acknowledgement
    notif = {"jsonrpc": "2.0", "method": "notifications/initialized"}
    try:
        _post_mcp(notif, session_id=sid, timeout=5)
    except Exception:
        pass  # Notification failures are non-fatal

    return sid


def call_tool(
    session_id: str,
    tool_name: str,
    arguments: Dict[str, Any],
    request_id: int = 2,
    timeout: int = 30,
) -> Dict[str, Any]:
    """
    Call a Voicebox MCP tool and return the parsed result.
    """
    payload = {
        "jsonrpc": "2.0",
        "id": request_id,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": arguments},
    }
    resp, _ = _post_mcp(payload, session_id=session_id, timeout=timeout)

    if "error" in resp:
        raise RuntimeError(f"MCP error: {resp['error']}")

    return resp.get("result", {})


# ─────────────────────────────────────────────────────────────────────
# Profile Operations
# ─────────────────────────────────────────────────────────────────────


def list_profiles(session_id: str) -> List[Dict[str, Any]]:
    """Fetch all available voice profiles from Voicebox."""
    result = call_tool(session_id, "voicebox.list_profiles", {})

    # Try structuredContent first, then content[0].text
    structured = result.get("structuredContent", {})
    if "profiles" in structured:
        return structured["profiles"]

    try:
        text = result["content"][0]["text"]
        return json.loads(text).get("profiles", [])
    except (KeyError, IndexError, json.JSONDecodeError):
        return []


def resolve_profile(session_id: str, name: str) -> str:
    """
    Case-insensitive lookup of a profile name.
    Returns the canonical profile name or raises ValueError.
    """
    profiles = list_profiles(session_id)
    target = name.strip().lower()
    for p in profiles:
        if p.get("name", "").lower() == target:
            return p["name"]

    available = [p.get("name") for p in profiles]
    raise ValueError(
        f"Profile '{name}' not found. Available profiles: {available}"
    )


# ─────────────────────────────────────────────────────────────────────
# Generation & Polling
# ─────────────────────────────────────────────────────────────────────


def poll_generation_status(
    generation_id: str,
    max_wait: int = MAX_WAIT_SECONDS,
    poll_interval: float = POLL_INTERVAL_SECONDS,
) -> Dict[str, Any]:
    """
    Poll the Voicebox generation status endpoint until completed or timeout.

    Returns the final status dict: {id, status, duration, error, source}
    """
    url = f"http://127.0.0.1:17493/generate/{generation_id}/status"
    start = time.time()

    while time.time() - start < max_wait:
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=5) as resp:
                raw = resp.read().decode("utf-8")
                # SSE format: "data: {...}\n"
                for line in raw.splitlines():
                    stripped = line.strip()
                    if stripped.startswith("data: "):
                        data = json.loads(stripped[6:])
                        if data.get("status") == "completed":
                            return data
                        if data.get("status") == "error":
                            raise RuntimeError(
                                f"Voicebox generation error: {data.get('error')}"
                            )
                        break
        except urllib.error.URLError:
            pass  # Server not ready yet
        except RuntimeError:
            raise
        except Exception:
            pass

        time.sleep(poll_interval)

    raise TimeoutError(
        f"Generation {generation_id} did not complete within {max_wait}s"
    )


def locate_generation_file(generation_id: str) -> str:
    """
    Find the WAV file produced by a generation in the Voicebox generations directory.
    """
    # Direct path
    direct = os.path.join(VOICEBOX_GENERATIONS_DIR, f"{generation_id}.wav")
    if os.path.exists(direct):
        return direct

    # Prefix search
    if os.path.isdir(VOICEBOX_GENERATIONS_DIR):
        for f in os.listdir(VOICEBOX_GENERATIONS_DIR):
            if f.startswith(generation_id):
                return os.path.join(VOICEBOX_GENERATIONS_DIR, f)

    raise FileNotFoundError(
        f"Generated audio not found for {generation_id} in {VOICEBOX_GENERATIONS_DIR}"
    )


def speak(
    session_id: str,
    profile: str,
    text: str,
    output_path: str,
    request_id: int = 2,
) -> Dict[str, Any]:
    """
    Generate speech for the given text using the specified profile.

    Returns a dict with: {profile, text, output_path, duration, generation_id, status}
    """
    # Validate profile
    canonical_name = resolve_profile(session_id, profile)

    # Normalize text
    text = _normalize_text(text)

    print(f"  🎙️  Generating [{canonical_name}]: \"{text[:80]}{'...' if len(text) > 80 else ''}\"")

    # Call voicebox.speak
    result = call_tool(
        session_id,
        "voicebox.speak",
        {"text": text, "profile": canonical_name},
        request_id=request_id,
        timeout=30,
    )

    # Extract generation_id
    gen_id = None
    structured = result.get("structuredContent", {})
    if "generation_id" in structured:
        gen_id = structured["generation_id"]

    if not gen_id:
        try:
            content_text = result["content"][0]["text"]
            gen_id = json.loads(content_text).get("generation_id")
        except (KeyError, IndexError, json.JSONDecodeError):
            pass

    if not gen_id:
        raise RuntimeError(f"No generation_id in Voicebox response: {result}")

    print(f"  ⏳ Waiting for generation {gen_id[:12]}...")

    # Poll until done
    status_data = poll_generation_status(gen_id)
    duration = status_data.get("duration", 0)

    print(f"  ✅ Generation completed ({duration:.2f}s)")

    # Locate and copy the file
    source_wav = locate_generation_file(gen_id)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    shutil.copy2(source_wav, output_path)

    # Validate output
    _validate_output(output_path)

    print(f"  💾 Saved: {output_path} ({os.path.getsize(output_path)} bytes, {duration:.2f}s)")

    return {
        "profile": canonical_name,
        "text": text,
        "output_path": output_path,
        "duration": duration,
        "generation_id": gen_id,
        "status": "success",
    }


# ─────────────────────────────────────────────────────────────────────
# Validation & Utilities
# ─────────────────────────────────────────────────────────────────────


def _normalize_text(text: str) -> str:
    """Normalize text before generation (strip, fix double spaces, etc.)."""
    text = text.strip()
    # Collapse multiple spaces
    while "  " in text:
        text = text.replace("  ", " ")
    return text


def _validate_output(path: str) -> None:
    """Validate that a generated audio file is valid."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Output file does not exist: {path}")

    size = os.path.getsize(path)
    if size == 0:
        os.remove(path)
        raise RuntimeError(f"Output file is empty (0 bytes): {path}")

    # Basic WAV header check
    with open(path, "rb") as f:
        header = f.read(4)
        if header != b"RIFF":
            print(f"  ⚠️  Warning: {path} does not have a standard WAV header")


def append_log(
    log_path: str,
    entry_label: str,
    profile: str,
    filename: str,
    text: str,
    status: str,
    duration: float = 0,
    error: str = "",
) -> None:
    """Append a generation entry to the markdown log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    entry = f"\n## {entry_label}\n\n"
    entry += f"Speaker: {profile}\n\n"
    entry += f"Filename: {filename}\n\n"
    entry += f"Text: \"{text}\"\n\n"

    if status == "success":
        entry += f"Duration: {duration:.2f}s\n\n"
        entry += f"Status: ✅ Success\n\n"
    else:
        entry += f"Status: ❌ Failed\n\n"
        entry += f"Error: {error}\n\n"

    entry += f"Timestamp: {timestamp}\n\n"
    entry += "---\n"

    with open(log_path, "a") as f:
        f.write(entry)


# ─────────────────────────────────────────────────────────────────────
# CLI Commands
# ─────────────────────────────────────────────────────────────────────


def cmd_list_profiles(args: argparse.Namespace) -> None:
    """Handle the list-profiles command."""
    print("\n🔌 Connecting to Voicebox MCP server...")
    sid = initialize_session()
    profiles = list_profiles(sid)

    print(f"\n👤 Available Voice Profiles ({len(profiles)}):\n")
    for p in profiles:
        voice_type = p.get("voice_type", "unknown")
        lang = p.get("language", "?")
        personality = "✓" if p.get("has_personality") else "✗"
        print(
            f"  • {p.get('name'):<15} "
            f"type={voice_type:<8} lang={lang} personality={personality} "
            f"id={p.get('id')}"
        )
    print()


def cmd_speak(args: argparse.Namespace) -> None:
    """Handle the speak command (single generation)."""
    if not args.profile:
        print("❌ --profile is required")
        sys.exit(1)
    if not args.text:
        print("❌ --text is required")
        sys.exit(1)

    output_dir = args.output_dir or DEFAULT_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)

    out_filename = args.out or f"{args.profile.lower()}_{int(time.time())}.wav"
    if not out_filename.endswith(".wav"):
        out_filename += ".wav"
    output_path = os.path.join(output_dir, out_filename)

    log_path = os.path.join(output_dir, args.log or DEFAULT_LOG_FILE)

    print("\n🔌 Connecting to Voicebox MCP server...")
    sid = initialize_session()

    print(f"\n🎬 Generating voice...\n")
    try:
        result = speak(sid, args.profile, args.text, output_path)
        append_log(
            log_path,
            out_filename,
            result["profile"],
            out_filename,
            result["text"],
            "success",
            duration=result["duration"],
        )
        print(f"\n✨ Done! Audio saved to: {output_path}")
    except Exception as e:
        append_log(
            log_path, out_filename, args.profile, out_filename, args.text, "failed", error=str(e)
        )
        print(f"\n❌ Generation failed: {e}")
        sys.exit(1)


def cmd_batch(args: argparse.Namespace) -> None:
    """Handle the batch command (generate from JSON config)."""
    config_path = args.config
    if not os.path.exists(config_path):
        print(f"❌ Config file not found: {config_path}")
        sys.exit(1)

    with open(config_path, "r") as f:
        items = json.load(f)

    if not isinstance(items, list) or len(items) == 0:
        print("❌ Config must be a non-empty JSON array.")
        sys.exit(1)

    output_dir = args.output_dir or DEFAULT_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)

    log_path = os.path.join(output_dir, args.log or DEFAULT_LOG_FILE)

    print("\n🔌 Connecting to Voicebox MCP server...")
    sid = initialize_session()

    print(f"\n🎬 Batch Generation: {len(items)} items\n")
    print("=" * 60)

    results = []
    request_id = 2

    for idx, item in enumerate(items, 1):
        profile = item.get("profile", "")
        text = item.get("text", "")
        out_filename = item.get("out", f"{profile.lower()}_{idx}.wav")

        if not out_filename.endswith(".wav"):
            out_filename += ".wav"

        output_path = os.path.join(output_dir, out_filename)
        label = f"Item {idx}/{len(items)} — {profile}"

        print(f"\n[{idx}/{len(items)}] {profile}")
        print("-" * 40)

        if not profile or not text:
            print(f"  ⚠️  Skipping: missing profile or text")
            results.append({"profile": profile, "status": "skipped", "reason": "missing fields"})
            continue

        try:
            result = speak(sid, profile, text, output_path, request_id=request_id)
            append_log(
                log_path,
                label,
                result["profile"],
                out_filename,
                result["text"],
                "success",
                duration=result["duration"],
            )
            results.append(result)
            request_id += 1

            # Brief pause between generations to avoid overwhelming Voicebox
            if idx < len(items):
                print(f"  ⏸️  Cooling down (2s)...")
                time.sleep(2)

        except Exception as e:
            print(f"  ❌ FAILED: {e}")
            append_log(
                log_path, label, profile, out_filename, text, "failed", error=str(e)
            )
            results.append({"profile": profile, "status": "error", "error": str(e)})

            # Stop on error per the workflow rules
            print(f"\n⛔ Generation stopped at item {idx} due to error.")
            print(f"   Would you like to retry? Re-run with the same config.\n")
            break

    # Summary
    print("\n" + "=" * 60)
    print("📊 Batch Generation Summary\n")

    success_count = sum(1 for r in results if r.get("status") == "success")
    error_count = sum(1 for r in results if r.get("status") == "error")
    skipped_count = sum(1 for r in results if r.get("status") == "skipped")

    for r in results:
        if r.get("status") == "success":
            print(f"  ✅ [{r['profile']}] → {r['output_path']} ({r['duration']:.2f}s)")
        elif r.get("status") == "error":
            print(f"  ❌ [{r.get('profile')}] → Error: {r.get('error', 'unknown')}")
        else:
            print(f"  ⏭️  [{r.get('profile')}] → Skipped: {r.get('reason', '')}")

    print(f"\n  Total: {success_count} ✅ | {error_count} ❌ | {skipped_count} ⏭️")
    print(f"  Log:   {log_path}\n")

    if error_count > 0:
        sys.exit(1)


# ─────────────────────────────────────────────────────────────────────
# Main Entry Point
# ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Voicebox MCP Voice Generator — Generic CLI for synthesizing speech via local Voicebox",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python voicebox_generate.py list-profiles
  python voicebox_generate.py speak --profile Edgar --text "Whatever!" --out edgar.wav
  python voicebox_generate.py batch --config samples.json --output-dir voices/
        """,
    )

    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # list-profiles
    subparsers.add_parser("list-profiles", help="List all available Voicebox voice profiles")

    # speak
    speak_parser = subparsers.add_parser("speak", help="Generate a single voice clip")
    speak_parser.add_argument("--profile", required=True, help="Voice profile name (e.g. Edgar, Kenji)")
    speak_parser.add_argument("--text", required=True, help="Text to synthesize")
    speak_parser.add_argument("--out", help="Output filename (default: <profile>_<timestamp>.wav)")
    speak_parser.add_argument("--output-dir", help=f"Output directory (default: {DEFAULT_OUTPUT_DIR})")
    speak_parser.add_argument("--log", help=f"Log filename (default: {DEFAULT_LOG_FILE})")

    # batch
    batch_parser = subparsers.add_parser("batch", help="Batch generate from a JSON config file")
    batch_parser.add_argument("--config", required=True, help="Path to JSON config file")
    batch_parser.add_argument("--output-dir", help=f"Output directory (default: {DEFAULT_OUTPUT_DIR})")
    batch_parser.add_argument("--log", help=f"Log filename (default: {DEFAULT_LOG_FILE})")

    args = parser.parse_args()

    if args.command == "list-profiles":
        cmd_list_profiles(args)
    elif args.command == "speak":
        cmd_speak(args)
    elif args.command == "batch":
        cmd_batch(args)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
