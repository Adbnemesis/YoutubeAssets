export interface Character {
  id: string;
  name: string;
  avatarUrl?: string; // Path to avatar image in assets
  color?: string; // Username color (e.g. hex code)
}

export interface ChatMessage {
  type: "message";
  id?: string;
  characterId: string;
  text: string;
  delaySeconds?: number; // Delay before this message appears
  durationSeconds?: number; // How long it stays as the active focused message
  isTypingDuration?: number; // How long to show "typing..." before message appears
  sfx?: string; // e.g. 'ping.mp3', 'vine_boom.mp3'
  timeString?: string; // Optional custom timestamp (e.g. "Today at 5:42 PM")
  effect?: "slow_zoom" | "dramatic" | "shake" | "none"; // Visual comedic accent
  bgm?: string; // Optional BGM switch starting from this message
}

export interface CutawayEvent {
  type: "cutaway";
  mediaUrl: string; // Filename of the meme/image in assets, or "GOOGLE_SEARCH_SUPERCELL", "DISCORD_CALL_<id>"
  durationSeconds: number; // How long it stays on screen
  delaySeconds?: number; // Delay before the cutaway starts
  fadeIn?: boolean; // Whether it fades in
  effect?: "fade" | "zoom" | "slam" | "flash"; // Transition visual style
  sfx?: string; // e.g. 'vine_boom.mp3', 'anime-wow.mp3'
  bgm?: string; // Optional BGM switch starting from this cutaway
}

export type ScriptEvent = ChatMessage | CutawayEvent;

export interface BgmTrackSegment {
  file: string;
  startEventIndex?: number;
  startSeconds?: number;
  volume?: number;
}

export interface ChatScript {
  characters: Character[];
  events: ScriptEvent[];
  bgm?: string; // Default starting BGM
  bgmTracks?: BgmTrackSegment[]; // Multi-BGM track segments by mood
  startTime?: string; // e.g. "6:01 PM"
}
