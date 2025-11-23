import { BaseGame } from '@minigame/core';

/**
 * Snake game state
 */
export interface SnakeGameState {
  score: number;
  level: number;
}

/**
 * Classic Snake game implementation
 * Extends BaseGame to provide Snake-specific gameplay
 */
export class SnakeGame extends BaseGame<SnakeGameState> {
  private score: number = 0;
  private level: number = 1;

  /**
   * Initialize game state
   * Called when game starts
   */
  protected init(): void {
    this.score = 0;
    this.level = 1;
    // TODO: Implement full game initialization in Story 4.2
  }

  /**
   * Update game logic
   * Called every frame
   * @param _deltaTime - Time since last frame in seconds
   */
  protected update(_deltaTime: number): void {
    // TODO: Implement game logic in Story 4.2
  }

  /**
   * Render game to canvas
   * Called every frame
   */
  protected render(): void {
    // TODO: Implement rendering in Story 4.2
  }

  /**
   * Clean up game resources
   * Called when game stops
   */
  protected cleanup(): void {
    // TODO: Implement cleanup in Story 4.2
  }

  /**
   * Get current game state
   * @returns Current snake game state
   */
  protected getCurrentState(): SnakeGameState {
    return {
      score: this.score,
      level: this.level,
    };
  }
}
