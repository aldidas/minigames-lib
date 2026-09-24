import type { GameConfig } from '@minigame/core';

export type GameId = 'snake' | 'pong' | 'breakout';

/** Lifecycle shown on each card. The library exposes no getter for this, so the
 *  demo infers it from gameStarted / gameFinished / gameOver plus its own commands. */
export type GameStatus = 'idle' | 'running' | 'paused' | 'over' | 'finished';

/**
 * The subset of GameConfig the three games actually read while rendering.
 * `styling.*`, `animation.speed` and `audio.*` are merged by the library but
 * never consumed — see the panel's "accepted but unused" block.
 */
export interface ThemeForm {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  fontFamily: string;
  fontSizeLarge: number;
  fontSizeSmall: number;
}

export interface GameMeta {
  id: GameId;
  title: string;
  pitch: string;
  accent: string;
  keys: string;
  touch: string;
  /** Game-specific state returned by getGameState(), for the inspector caption. */
  stateShape: string;
  theme: ThemeForm;
}

export const FONT_STACKS = [
  { label: 'Monospace', value: '"SFMono-Regular", Menlo, Consolas, monospace' },
  { label: 'System sans', value: 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
] as const;

const MONO = FONT_STACKS[0].value;

export const GAME_META: readonly GameMeta[] = [
  {
    id: 'snake',
    title: 'Snake',
    pitch: 'Grid-locked movement on a fixed 20 × 20 board, one step every 150 ms.',
    accent: '#4ade80',
    keys: 'Arrow keys / WASD',
    touch: 'Swipe on the canvas',
    stateShape: '{ score, level }',
    theme: {
      primary: '#4ade80',
      secondary: '#15803d',
      background: '#0a0d12',
      text: '#e8eef7',
      fontFamily: MONO,
      fontSizeLarge: 24,
      fontSizeSmall: 12,
    },
  },
  {
    id: 'pong',
    title: 'Pong',
    pitch: 'First to 11. The ball speeds up 5% on every paddle hit.',
    accent: '#7dd3fc',
    keys: 'W / S for the left paddle, arrows for the right',
    touch: 'Drag on the canvas half you want to move',
    stateShape: '{ score: { player1, player2 }, ballSpeed, gameMode }',
    theme: {
      primary: '#7dd3fc',
      secondary: '#ffb454',
      background: '#0a0d12',
      text: '#e8eef7',
      fontFamily: MONO,
      fontSizeLarge: 24,
      fontSizeSmall: 12,
    },
  },
  {
    id: 'breakout',
    title: 'Breakout',
    pitch: 'Six rows of eight bricks, three lives, one brick per frame.',
    accent: '#f472b6',
    keys: 'Arrow left / right, or A / D',
    touch: 'Drag along the bottom of the canvas',
    stateShape: '{ score, lives, level, bricksRemaining }',
    theme: {
      primary: '#f472b6',
      secondary: '#a78bfa',
      background: '#0a0d12',
      text: '#e8eef7',
      fontFamily: MONO,
      fontSizeLarge: 24,
      fontSizeSmall: 12,
    },
  },
];

export const GAME_IDS: readonly GameId[] = GAME_META.map((meta) => meta.id);

/** The uniform control surface every game inherits from BaseGame. */
export type Command = 'start' | 'pause' | 'resume' | 'stop' | 'mute' | 'unmute';

export const COMMANDS: readonly Command[] = ['start', 'pause', 'resume', 'stop', 'mute', 'unmute'];

export function metaOf(id: GameId): GameMeta {
  const found = GAME_META.find((meta) => meta.id === id);
  if (!found) throw new Error(`Unknown game "${id}"`);
  return found;
}

/** Flat form state -> the config object each game constructor accepts. */
export function toGameConfig(theme: ThemeForm): Partial<GameConfig> {
  return {
    colors: {
      primary: theme.primary,
      secondary: theme.secondary,
      background: theme.background,
      text: theme.text,
    },
    typography: {
      fontFamily: theme.fontFamily,
      fontSize: {
        small: theme.fontSizeSmall,
        medium: 16,
        large: theme.fontSizeLarge,
      },
    },
  };
}

export function cloneThemes(): Record<GameId, ThemeForm> {
  return {
    snake: { ...metaOf('snake').theme },
    pong: { ...metaOf('pong').theme },
    breakout: { ...metaOf('breakout').theme },
  };
}

/** Everything the constructor accepts that none of the three games reads. */
export const INERT_CONFIG_KEYS = [
  { key: 'styling', detail: 'borderRadius, borderWidth, shadowBlur — canvas draws raw rects and arcs.' },
  { key: 'animation.speed', detail: 'Only range-checked by the base class; each game hard-codes its own tempo.' },
  { key: 'audio', detail: 'volume and muted are stored and flagged by mute()/unmute(); no audio ships in these games.' },
] as const;
