/**
 * TypeScript Helper Utilities for Remotion Integration
 * Loads and queries edit_analysis.json for frame-accurate Remotion animations.
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BeatEvent {
  time: number;
  frame: number;
  type: string;
  strength: number;
}

export interface CutEvent {
  startFrame: number;
  endFrame: number;
  startTime: number;
  endTime: number;
  type: string;
  confidence: number;
  detectionMethod: string;
}

export interface WordEvent {
  text: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  confidence: number;
}

export interface TextEvent {
  text: string;
  startFrame: number;
  endFrame: number;
  startTime: number;
  endTime: number;
  boundingBox: BoundingBox;
  confidence: number;
}

export interface ZoomEvent {
  type: string;
  startFrame: number;
  endFrame: number;
  startTime: number;
  endTime: number;
  scaleStart: number;
  scaleEnd: number;
  confidence: number;
}

export interface ShakeEvent {
  type: string;
  startFrame: number;
  endFrame: number;
  startTime: number;
  endTime: number;
  intensity: number;
}

export interface SceneItem {
  sceneId: number;
  startFrame: number;
  endFrame: number;
  startTime: number;
  endTime: number;
  durationFrames: number;
}

export interface EditAnalysisData {
  metadata: {
    durationSeconds: number;
    fps: number;
    width: number;
    height: number;
    totalFrames: number;
  };
  scenes: SceneItem[];
  cuts: CutEvent[];
  transitions: CutEvent[];
  beats: BeatEvent[];
  strongBeats: BeatEvent[];
  onsets: BeatEvent[];
  audioBpm: number;
  speech: {
    transcript: string;
    words: WordEvent[];
  };
  text: TextEvent[];
  zooms: ZoomEvent[];
  shakes: ShakeEvent[];
  masterTimeline: Array<{
    frame: number;
    time: number;
    events: any[];
    relationship: string;
  }>;
}

/**
 * Returns beat frame at a specific beat index.
 */
export function getBeatFrame(analysis: EditAnalysisData, index: number): number {
  if (!analysis.beats || index < 0 || index >= analysis.beats.length) {
    return 0;
  }
  return analysis.beats[index].frame;
}

/**
 * Returns nearest beat event to a target frame.
 */
export function getNearestBeat(analysis: EditAnalysisData, targetFrame: number): BeatEvent | null {
  if (!analysis.beats || analysis.beats.length === 0) return null;
  
  let nearest = analysis.beats[0];
  let minDiff = Math.abs(analysis.beats[0].frame - targetFrame);

  for (let i = 1; i < analysis.beats.length; i++) {
    const diff = Math.abs(analysis.beats[i].frame - targetFrame);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = analysis.beats[i];
    }
  }

  return nearest;
}

/**
 * Returns nearest onset event to a target frame.
 */
export function getNearestOnset(analysis: EditAnalysisData, targetFrame: number): BeatEvent | null {
  if (!analysis.onsets || analysis.onsets.length === 0) return null;

  let nearest = analysis.onsets[0];
  let minDiff = Math.abs(analysis.onsets[0].frame - targetFrame);

  for (let i = 1; i < analysis.onsets.length; i++) {
    const diff = Math.abs(analysis.onsets[i].frame - targetFrame);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = analysis.onsets[i];
    }
  }

  return nearest;
}

/**
 * Returns all timeline events occurring at exact frame.
 */
export function getEventsAtFrame(analysis: EditAnalysisData, frame: number): any[] {
  if (!analysis.masterTimeline) return [];
  const entry = analysis.masterTimeline.find(item => item.frame === frame);
  return entry ? entry.events : [];
}

/**
 * Returns all timeline events occurring between startFrame and endFrame inclusive.
 */
export function getEventsBetweenFrames(analysis: EditAnalysisData, startFrame: number, endFrame: number): any[] {
  if (!analysis.masterTimeline) return [];
  return analysis.masterTimeline
    .filter(item => item.frame >= startFrame && item.frame <= endFrame)
    .flatMap(item => item.events);
}

/**
 * Returns active scene item at target frame.
 */
export function getSceneAtFrame(analysis: EditAnalysisData, frame: number): SceneItem | null {
  if (!analysis.scenes) return null;
  const scene = analysis.scenes.find(s => frame >= s.startFrame && frame <= s.endFrame);
  return scene || null;
}
