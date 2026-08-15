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
  delaySeconds: number; // Delay before this message appears (since previous message)
  isTypingDuration?: number; // How long to show "typing..." before message appears
  sfx?: string; // e.g. 'ping.mp3', 'vine_boom.mp3'
  timeString?: string; // Optional custom timestamp (e.g. "Today at 5:42 PM")
}

export interface CutawayEvent {
  type: "cutaway";
  mediaUrl: string; // Filename of the meme/image in assets
  durationSeconds: number; // How long it stays on screen (max 1.0s for memes)
  delaySeconds?: number; // Delay before the cutaway starts (reading buffer for preceding text)
  fadeIn?: boolean; // Whether it fades in
  effect?: "fade" | "zoom" | "slam" | "flash"; // Transition visual style (defaults to smooth fade)
  sfx?: string; // e.g. 'vine_boom.mp3'
}

export type ScriptEvent = ChatMessage | CutawayEvent;

export interface ChatScript {
  characters: Character[];
  events: ScriptEvent[];
  bgm?: string;
  startTime?: string; // e.g. "5:24 PM" or "8:15 AM" (defaults dynamically)
}
