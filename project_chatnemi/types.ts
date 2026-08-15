export interface Character {
  id: string;
  name: string;
  avatarUrl?: string; // Path to avatar image in assets
  color?: string; // Username color (e.g. hex code)
}

export interface ChatMessage {
  type: "message";
  id: string;
  characterId: string;
  text: string;
  delaySeconds: number; // Delay before this message appears (since previous message)
  isTypingDuration?: number; // How long to show "typing..." before message appears
  sfx?: string; // e.g. 'ping.mp3', 'vine_boom.mp3'
}

export interface CutawayEvent {
  type: "cutaway";
  mediaUrl: string; // Filename of the meme/image in assets
  durationSeconds: number; // How long it stays on screen
  delaySeconds?: number; // Delay before the cutaway starts
  fadeIn?: boolean; // Whether it fades in
  sfx?: string; // e.g. 'vine_boom.mp3'
}

export type ScriptEvent = ChatMessage | CutawayEvent;

export interface ChatScript {
  characters: Character[];
  events: ScriptEvent[];
  bgm?: string;
}
