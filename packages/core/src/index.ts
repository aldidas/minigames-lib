// Core classes
export { EventEmitter } from './EventEmitter';
export { BaseGame } from './BaseGame';

// Configuration
export { defaultGameConfig, mergeConfig } from './GameConfig';

// Type exports
export type {
  // Event types
  GameEvent,
  BaseEventData,
  GameOverData,
  ScoreUpdateData,
  EventCallback,
  
  // Game types
  GameState,
  GameConfig,
} from './types';
