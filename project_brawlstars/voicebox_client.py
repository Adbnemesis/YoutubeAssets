import os
import sys
import json
import time
import urllib.request
from typing import Dict, List, Optional, Any

MCP_URL = 'http://127.0.0.1:17493/mcp/'
VOICEBOX_GENERATIONS_DIR = os.path.expanduser('~/Library/Application Support/sh.voicebox.app/generations')
DEFAULT_OUTPUT_DIR = "project_brawlstars/public/cloned_voices"

headers = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream, application/json'
}

class VoiceboxClient:
    """
    Unified Voicebox MCP Client for Brawler Voice Synthesis & Storytelling Pipelines.
    Automatically connects to local Voicebox MCP server, resolves brawler profiles,
    and saves generated dialogue WAVs for Remotion video compositions.
    """
    def __init__(self, mcp_url: str = MCP_URL, output_dir: str = DEFAULT_OUTPUT_DIR):
        self.mcp_url = mcp_url
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.session_id = self._initialize_session()

    def _initialize_session(self) -> str:
        payload = {
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'initialize',
            'params': {
                'protocolVersion': '2024-11-05',
                'capabilities': {},
                'clientInfo': {'name': 'AntigravityBrawlStars', 'version': '1.0'}
            }
        }
        try:
            req = urllib.request.Request(self.mcp_url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=5) as resp:
                sid = resp.headers.get('mcp-session-id')
                if not sid:
                    raise RuntimeError("Failed to obtain mcp-session-id from Voicebox server")
                
                # Send notifications/initialized as required by MCP 2024-11-05 standard
                init_notif = {'jsonrpc': '2.0', 'method': 'notifications/initialized'}
                n_headers = dict(headers)
                n_headers['mcp-session-id'] = sid
                n_req = urllib.request.Request(self.mcp_url, data=json.dumps(init_notif).encode('utf-8'), headers=n_headers, method='POST')
                urllib.request.urlopen(n_req, timeout=5)
                return sid
        except Exception as e:
            raise ConnectionError(f"Cannot connect to Voicebox MCP server at {self.mcp_url}. Ensure Voicebox app is open and MCP server is enabled in Settings -> MCP. Error: {e}")

    def _call_mcp_tool(self, tool_name: str, arguments: Dict[str, Any], request_id: int = 2) -> Dict[str, Any]:
        req_headers = dict(headers)
        req_headers['mcp-session-id'] = self.session_id
        
        payload = {
            'jsonrpc': '2.0',
            'id': request_id,
            'method': 'tools/call',
            'params': {
                'name': tool_name,
                'arguments': arguments
            }
        }
        req = urllib.request.Request(self.mcp_url, data=json.dumps(payload).encode('utf-8'), headers=req_headers, method='POST')
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw_res = resp.read().decode('utf-8')
            for line in raw_res.splitlines():
                if line.startswith("data: "):
                    return json.loads(line[6:])
            return json.loads(raw_res)

    def list_profiles(self) -> List[Dict[str, Any]]:
        """Fetch all cloned and preset voice profiles currently available in Voicebox."""
        resp = self._call_mcp_tool('voicebox.list_profiles', {})
        try:
            structured = resp.get('result', {}).get('structuredContent', {})
            if 'profiles' in structured:
                return structured['profiles']
            content_text = resp['result']['content'][0]['text']
            return json.loads(content_text).get('profiles', [])
        except Exception as e:
            print(f"⚠️ Error parsing profiles: {e}")
            return []

    def get_profile_name(self, brawler_name: str) -> Optional[str]:
        """Case-insensitive matching of brawler name to Voicebox profile name."""
        profiles = self.list_profiles()
        target = brawler_name.strip().lower()
        for p in profiles:
            p_name = p.get('name', '')
            if p_name.lower() == target:
                return p_name
        return None

    def speak(self, brawler: str, text: str, output_filename: Optional[str] = None, max_wait_seconds: int = 60) -> str:
        """
        Synthesize speech text for a brawler profile and save the WAV file.
        
        :param brawler: Brawler profile name (e.g. 'Edgar', 'Shelly', 'Kenji')
        :param text: Dialogue text to speak
        :param output_filename: Target filename inside public/cloned_voices/ (e.g. 'edgar_scene1.wav')
        :return: Absolute path to the saved audio file
        """
        profile_name = self.get_profile_name(brawler)
        if not profile_name:
            available = [p.get('name') for p in self.list_profiles()]
            raise ValueError(f"Profile '{brawler}' not found in Voicebox. Available profiles: {available}")

        if not output_filename:
            safe_name = brawler.lower().replace(" ", "_")
            output_filename = f"{safe_name}_{int(time.time())}.wav"
        
        if not output_filename.endswith(('.wav', '.mp3')):
            output_filename += '.wav'

        destination_path = os.path.join(self.output_dir, output_filename)

        print(f"🎙️ Synthesizing [{profile_name}]: \"{text}\"")
        resp = self._call_mcp_tool('voicebox.speak', {'text': text, 'profile': profile_name})
        
        try:
            structured = resp.get('result', {}).get('structuredContent', {})
            gen_id = structured.get('generation_id')
            if not gen_id:
                content_text = resp['result']['content'][0]['text']
                gen_id = json.loads(content_text).get('generation_id')
        except Exception:
            raise RuntimeError(f"Failed to get generation_id from Voicebox response: {resp}")

        # Poll status until completed
        status_url = f"http://127.0.0.1:17493/generate/{gen_id}/status"
        start_time = time.time()
        
        while time.time() - start_time < max_wait_seconds:
            try:
                s_req = urllib.request.Request(status_url, headers={'User-Agent': 'AntigravityBrawlStars'})
                with urllib.request.urlopen(s_req, timeout=3) as s_resp:
                    s_data = json.loads(s_resp.read().decode('utf-8'))
                    if s_data.get('status') == 'completed':
                        break
            except Exception:
                pass
            time.sleep(1)

        # Retrieve output audio file from Voicebox generations directory
        source_wav = os.path.join(VOICEBOX_GENERATIONS_DIR, f"{gen_id}.wav")
        if not os.path.exists(source_wav):
            for f in os.listdir(VOICEBOX_GENERATIONS_DIR):
                if f.startswith(gen_id):
                    source_wav = os.path.join(VOICEBOX_GENERATIONS_DIR, f)
                    break

        if not os.path.exists(source_wav):
            raise FileNotFoundError(f"Generation audio file not found at {source_wav}")

        # Copy to project output folder
        import shutil
        shutil.copy(source_wav, destination_path)
        print(f"  ✨ Saved: {destination_path}")
        return destination_path

    def batch_synthesize_story(self, dialogue_items: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        Synthesize an entire story / tier-ranking dialogue script in batch.
        
        Example dialogue_items:
        [
            {"brawler": "Shelly", "line": "Let's do this!", "out": "scene1_shelly.wav"},
            {"brawler": "Edgar", "line": "Whatever...", "out": "scene1_edgar.wav"}
        ]
        """
        results = []
        print(f"\n🎬 Starting Batch Synthesis of {len(dialogue_items)} Dialogue Lines...")
        for idx, item in enumerate(dialogue_items, 1):
            brawler = item['brawler']
            line = item['line']
            out_file = item.get('out', f"{brawler.lower()}_dialogue_{idx}.wav")
            
            try:
                saved_path = self.speak(brawler, line, out_file)
                results.append({
                    "brawler": brawler,
                    "line": line,
                    "file": saved_path,
                    "status": "success"
                })
            except Exception as e:
                print(f"❌ Error generating line #{idx} for {brawler}: {e}")
                results.append({
                    "brawler": brawler,
                    "line": line,
                    "status": "error",
                    "error": str(e)
                })
        print(f"✨ Batch Storyline Audio Generation Complete ({len(results)} files)!\n")
        return results

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Voicebox MCP Client for Brawl Stars Storytelling")
    parser.add_argument("--list-profiles", action="store_true", help="List all available Voicebox voice profiles")
    parser.add_argument("--brawler", type=str, help="Brawler profile name (e.g. Edgar, Shelly, Kenji)")
    parser.add_argument("--text", type=str, help="Dialogue text line to synthesize")
    parser.add_argument("--out", type=str, help="Output audio filename inside public/cloned_voices/")

    args = parser.parse_args()
    client = VoiceboxClient()

    if args.list_profiles:
        profiles = client.list_profiles()
        print("\n👤 Voicebox Available Voice Profiles:")
        for p in profiles:
            print(f"  - [{p.get('name')}] (ID: {p.get('id')}, Type: {p.get('voice_type')})")
    elif args.brawler and args.text:
        client.speak(args.brawler, args.text, args.out)
    else:
        parser.print_help()
