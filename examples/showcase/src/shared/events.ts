import type { GameEvent } from '@minigame/core';
import type { GameId, GameStatus } from './meta';

export type { GameEvent };

export type Payload = Record<string, unknown>;

export interface LogEntry {
  /** Monotonic per-page counter, used as a render key. */
  seq: number;
  game: GameId;
  event: GameEvent;
  payload: Payload;
  at: number;
}

/**
 * The base class emits no lifecycle state and exposes no getter for it, so every
 * page infers the status chip from these three events plus its own commands.
 */
export const STATUS_BY_EVENT: Record<GameEvent, GameStatus | null> = {
  gameStarted: 'running',
  gameFinished: 'finished',
  gameOver: 'over',
  scoreUpdate: null,
  soundMuted: null,
  soundUnmuted: null,
};

export const EVENTS = Object.keys(STATUS_BY_EVENT) as GameEvent[];

/** `timestamp` is rendered as the row clock, so it is left out of the payload. */
export function payloadParts(payload: Payload): [string, string][] {
  return Object.entries(payload)
    .filter(([key, value]) => key !== 'timestamp' && value !== undefined && value !== null)
    .map(([key, value]) => [key, formatValue(value)]);
}

export function formatValue(value: unknown): string {
  if (typeof value === 'string') return /\s/.test(value) ? `"${value}"` : value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value) ?? String(value);
}
