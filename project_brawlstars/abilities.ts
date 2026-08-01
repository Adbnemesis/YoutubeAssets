import { FightTurn } from "./types";

/**
 * Brawl Stars ability research (verified against the game):
 *  Kenji  — attack alternates Dash / Slash; Super = two-slash dash that pulls enemies
 *  Edgar  — attack = fast scarf punches; Super = "Let's Fly" vault jump + shield
 *  Shelly — attack = shotgun blast (5 pellets); Super = Super Shell knockback
 *  Frank  — attack = Hammer Smash (heavy arc); Super = two-handed stun slam
 *
 * The fight runs one attack per beat. Voice lines are spaced apart so they
 * never overlap (the reference keeps the BGM ducked and uses sparse taunts).
 */
export const FIGHT_TURNS: FightTurn[] = [
  // normal attacks
  {
    beat: 14,
    id: "kenji",
    ability: "KATANA SLASH",
    kind: "attack",
    voiceSrc: "voice/kenji/attack.ogg",
    voiceFrom: 0.0,
    voiceTo: 1.1,
  },
  {
    beat: 15,
    id: "edgar",
    ability: "SCARF PUNCH",
    kind: "attack",
    voiceSrc: "voice/edgar/attack2.ogg",
    voiceFrom: 0.0,
    voiceTo: 1.5,
  },
  {
    beat: 16,
    id: "shelly",
    ability: "BUCKSHOT BLAST",
    kind: "attack",
    voiceSrc: "voice/shelly/attack.ogg",
    voiceFrom: 0.0,
    voiceTo: 1.3,
  },
  {
    beat: 17,
    id: "frank",
    ability: "HAMMER SMASH",
    kind: "attack",
    voiceSrc: "voice/frank/attack.ogg",
    voiceFrom: 0.0,
    voiceTo: 0.9,
  },
  // supers — climax
  {
    beat: 18,
    id: "edgar",
    ability: "LET'S FLY!",
    kind: "super",
    voiceSrc: "voice/edgar/super.ogg",
    voiceFrom: 0.0,
    voiceTo: 2.5,
  },
  {
    beat: 19,
    id: "kenji",
    ability: "SHADOW DASH!",
    kind: "super",
    voiceSrc: "voice/kenji/super.ogg",
    voiceFrom: 0.0,
    voiceTo: 2.2,
  },
  {
    beat: 20,
    id: "shelly",
    ability: "SUPER SHELL!",
    kind: "super",
    voiceSrc: "voice/shelly/super.ogg",
    voiceFrom: 0.0,
    voiceTo: 2.1,
  },
  {
    beat: 21,
    id: "frank",
    ability: "SUPER STUN!",
    kind: "super",
    voiceSrc: "voice/frank/super.ogg",
    voiceFrom: 0.0,
    voiceTo: 1.2,
  },
  // closing beatdown
  { beat: 22, id: "kenji", ability: "KATANA SLASH", kind: "attack", voiceSrc: "", voiceFrom: 0, voiceTo: 0 },
  { beat: 23, id: "edgar", ability: "SCARF PUNCH", kind: "attack", voiceSrc: "", voiceFrom: 0, voiceTo: 0 },
  { beat: 24, id: "shelly", ability: "BUCKSHOT BLAST", kind: "attack", voiceSrc: "", voiceFrom: 0, voiceTo: 0 },
  { beat: 25, id: "frank", ability: "HAMMER SMASH", kind: "attack", voiceSrc: "", voiceFrom: 0, voiceTo: 0 },
];
