/**
 * All possible game events that can be emitted
 */
export type GameEvent =
  | 'gameStarted'
  | 'gameFinished'
  | 'gameOver'
  | 'scoreUpdate'
  | 'soundMuted'
  | 'soundUnmuted';

/**
 * Base event data included with every event emission
 */
export interface BaseEventData {
  /** ISO 8601 timestamp of when the event occurred */
  timestamp: string;
  /** Optional player name */
  playerName?: string;
  /** Optional unique game instance ID */
  gameId?: string;
}

/**
 * Data emitted with gameOver event
 */
export interface GameOverData extends BaseEventData {
  /** Reason for game over (e.g., 'collision', 'timeout') */
  reason: string;
  /** Final score at game over */
  finalScore: number;
}

/**
 * Data emitted with scoreUpdate event
 */
export interface ScoreUpdateData extends BaseEventData {
  /** Current score */
  score: number;
  /** Change in score since last update */
  delta: number;
}

/**
 * Type for event callback functions
 */
export type EventCallback<TData = BaseEventData> = (data: TData) => void;
