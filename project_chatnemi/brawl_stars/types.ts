import { Character, ChatMessage, CutawayEvent, ScriptEvent, ChatScript } from "../types";

export type BrawlerRarity =
  | "Common"
  | "Rare"
  | "Super Rare"
  | "Epic"
  | "Mythic"
  | "Legendary"
  | "Hypercharge"
  | "System";

export type BrawlerRole =
  | "Damage Dealer"
  | "Assassin"
  | "Tank"
  | "Marksman"
  | "Artillery"
  | "Controller"
  | "Support"
  | "Bot";

export interface BrawlerCharacter extends Character {
  rarity?: BrawlerRarity;
  role?: BrawlerRole;
  archetype?: string; // e.g. "Toxic Thumbs-Down Spammer", "Bush Camper"
  catchphrase?: string;
  defaultSfx?: string; // Voice line or signature sound
}

export interface BrawlerRoster {
  brawlers: BrawlerCharacter[];
}

export interface BrawlDiscordScript extends ChatScript {
  characters: BrawlerCharacter[];
  trophyContext?: {
    mode?: "Brawl Ball" | "Solo Showdown" | "Knockout" | "Gem Grab" | "Heist" | "Bounty" | "Ranked";
    rankEloChange?: number;
    matchOutcome?: "VICTORY" | "DEFEAT" | "DRAW";
  };
}

export { Character, ChatMessage, CutawayEvent, ScriptEvent, ChatScript };
