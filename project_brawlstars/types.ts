export type TierKey = "S" | "A" | "B" | "C" | "D" | "F";

export type AbilityKind = "attack" | "super";

export interface FightTurn {
  /** Beat number when this attack fires */
  beat: number;
  /** Brawler entry id */
  id: string;
  /** Display name of the ability, e.g. "KATANA SLASH" */
  ability: string;
  kind: AbilityKind;
  /** Voice clip (seconds into the sample) to play for the line */
  voiceSrc: string;
  voiceFrom: number;
  voiceTo: number;
}

export interface FightConfig {
  start: number;
  end: number;
  /** Attack order — one brawler attacks per beat */
  turns: FightTurn[];
}

export interface TierRowConfig {
  key: TierKey;
  label: string;
  /** Fill color of the tier label strip for this row */
  color: string;
  /** Text color of the tier label */
  textColor: string;
}

export type MoveFx = "splash" | "glitch" | "domino";

export interface TierMove {
  /** Frame when the move is triggered (beat-aligned) */
  frame: number;
  tier: TierKey;
  /** FX fired at the destination (splash = B-tier, glitch = A-tier, domino = S-tier) */
  fx?: MoveFx;
  /** Optional slot index inside the target row */
  slot?: number;
  /** Override fly duration in frames (default 14) — slow drops use longer */
  duration?: number;
}

export interface BrawlerEntry {
  id: string;
  name: string;
  imageSrc: string;
  /** Frame when the entry first drops into the grid */
  dropFrame: number;
  initialTier: TierKey;
  moves: TierMove[];
  /** Frame when a dislike pin should appear (D-tier slam) */
  dislikeFrame?: number;
  /** Frame when a heart pin should appear (S-tier reveal) */
  heartFrame?: number;
  /** Frame when this brawler is defeated in the fight and their icon slides away */
  defeatFrame?: number;
  accentColor?: string;
}

export interface TierListConfig {
  rows: TierRowConfig[];
  entries: BrawlerEntry[];
  /** The tier list image (label column is cropped into the left strip) */
  labelStripSrc?: string;
}

export interface TitleWord {
  text: string;
  /** Composition frame when this word pops (synced to voiceover) */
  frame: number;
  /** Optional font-size override in px */
  fontSize?: number;
  /** Optional fill color override (Gold #FFD60A, Purple #C084FC, Mint #7FE35C) */
  color?: string;
  /** Optional 0-based line index (kept for multi-line layouts) */
  line?: number;
  /** Brawler entry to spotlight when this word pops (reference intro) */
  spotlightId?: string;
}

export interface PortraitConfig {
  id: string;
  name: string;
  imageSrc: string;
  accentColor: string;
  /** Optional tier badge shown in the intro roster header */
  tier?: TierKey;
}

export interface IntroPinConfig {
  emoji: string;
  /** Pin border/glow color */
  color: string;
}

export interface CameraEvent {
  frame: number;
  type: "punch" | "push" | "pull" | "shake" | "shakeBig";
  intensity?: number;
}

/** Camera keyframe — zoom the whole board toward a point, then pan. */
export interface CameraPathPoint {
  frame: number;
  scale: number;
  /** Transform-origin X as a percentage of the board width (0-120) */
  originX: number;
  /** Transform-origin Y as a percentage of the board height */
  originY: number;
}

export interface CameraConfig {
  baseScale?: number;
  events: CameraEvent[];
  /** Intro camera path — the whole list zooms toward each brawler card
   *  one by one, then shifts right as the dialogue completes. */
  introPath?: CameraPathPoint[];
}

export interface ColorBeat {
  /** Beat number when the background switches */
  beat: number;
  color: string;
}

export interface SfxEntry {
  frame: number;
  src: string;
  volume?: number;
  /** If set, this SFX only plays while the brawler is alive (defeated after defeatFrame) */
  brawlerId?: string;
}

export interface AudioConfig {
  bgmSrc: string;
  bgmStartSeconds: number;
  duck?: { from: number; to: number; volume: number };
  /** Fight window — BGM heavily ducked while the brawlers battle (6-12s) */
  fightDuck?: { from: number; to: number; volume: number };
  bgmVolume?: number;
  voiceSrc?: string;
  voiceVolume?: number;
  sfx: SfxEntry[];
  fadeOutFrames?: number;
}

export interface FlashEvent {
  frame: number;
  color?: string;
  maxOpacity?: number;
  duration?: number;
}

export interface WhooshTransitionEvent {
  frame: number;
  color?: string;
}

export type WinnerPhaseType = "title" | "fight" | "spin" | "outro";

export interface WinnerPhase {
  type: WinnerPhaseType;
  /** Frame when this phase starts */
  frame: number;
  /** Frame when this phase ends (next phase / fade) */
  endFrame: number;
  backgroundColor: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
  /** Portrait id to display */
  entryId?: string;
  /** Opponent entry ids (fight phase) */
  opponents?: string[];
  /** Spin rotation (deg per frame) for the spin showcase */
  spinSpeed?: number;
  /** Beats between opponent attacks (fight phase) */
  attackEvery?: number;
}

export interface WinnerConfig {
  phases: WinnerPhase[];
}

export interface RankingVideoConfig {
  fps: number;
  durationInFrames: number;

  /** Intro — words synced to the voiceover */
  titleWords: TitleWord[];
  roster: PortraitConfig[];
  introPin?: IntroPinConfig;

  /** Tier list grid */
  tierList: TierListConfig;
  /** Frame when the intro wipe transition fires */
  gridRevealFrame: number;
  /** Frame when the grid is revealed and cards may drop */
  gridSettleFrame: number;

  /** D-tier slam frame (dislike pins + shake + pop) */
  slamFrame: number;

  /** Fight window — brawler icons battle in the tier list */
  fight?: FightConfig;

  /** Fight dialogue caption */
  fightDialogue?: { text: string; from: number; to: number };

  /** Background colors switched per beat after the grid appears */
  colorCycle: ColorBeat[];
  /** Full-screen flash events (beat-aligned) */
  flashes: FlashEvent[];
  /** Whoosh wipe transitions */
  transitions: WhooshTransitionEvent[];

  /** Winner phases (title card, spin showcase, outro) */
  winner: WinnerConfig;

  camera: CameraConfig;
  /** Zoom-out envelope (zoomed tier list during the intro → full view) */
  cameraZoomOut?: { from: number; to: number; fromScale: number; toScale?: number };
  audio: AudioConfig;
}
