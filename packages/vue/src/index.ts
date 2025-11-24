// Export components
export { default as SnakeGame } from './SnakeGame';
export { default as PongGame } from './PongGame';
export { default as BreakoutGame } from './BreakoutGame';

// Re-export types from core for convenience
export type { GameConfig, GameOverData, ScoreUpdateData } from '@minigame/core';
