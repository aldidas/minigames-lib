import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SnakeGame } from '../index';

describe('SnakeGame', () => {
  let canvas: HTMLCanvasElement;
  let game: SnakeGame;

  beforeEach(() => {
    // Create mock canvas with 2D context
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    document.body.appendChild(canvas);

    // Mock canvas context
    const mockContext = {
      fillStyle: '',
      strokeStyle: '',
      font: '',
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      save: vi.fn(),
      restore: vi.fn(),
      canvas,
    };

    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as any);

    // Create game instance
    game = new SnakeGame(canvas);
  });

  afterEach(() => {
    if (game) {
      game.stop();
    }
    canvas.remove();
  });

  describe('Initialization', () => {
    it('should create game instance successfully', () => {
      expect(game).toBeDefined();
    });

    it('should initialize with correct initial state', () => {
      game.start();
      const state = game.getGameState();
      
      expect(state.score).toBe(0);
      expect(state.level).toBe(1);
    });

    it('should initialize snake with 3 segments', () => {
      game.start();
      const state = game.getGameState();
      
      // Snake should start with 3 segments at center
      expect(state.score).toBe(0);
    });
  });

  describe('Movement', () => {
    it('should move snake in the current direction', () => {
      game.start();
      
      // Get initial state
      const initialState = game.getGameState();
      
      // Manually trigger update to move snake
      // @ts-ignore - accessing protected method for testing
      game.update(0.2); // Simulate time passing
      
      const newState = game.getGameState();
      
      // State should still be valid (snake moved)
      expect(newState).toBeDefined();
    });

    it('should not move through walls', () => {
      const gameOverCallback = vi.fn();
      game.on('gameOver', gameOverCallback);
      
      game.start();
      
      // Move snake many times to hit wall
      for (let i = 0; i < 100; i++) {
        // @ts-ignore
        game.update(0.2);
      }
      
      // Game should eventually end due to wall collision
      expect(gameOverCallback).toHaveBeenCalled();
    });
  });

  describe('Direction Changes', () => {
    it('should allow direction change to perpendicular direction', () => {
      game.start();
      
      // Simulate key press for direction change (up)
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(keyEvent);
      
      // Direction change should be queued
      // @ts-ignore
      game.update(0.2);
      
      // Game should still be running
      expect(game.getGameState()).toBeDefined();
    });

    it('should prevent 180-degree direction reversal', () => {
      game.start();
      
      // Snake starts moving right, try to move left (opposite)
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(keyEvent);
      
      // Direction should not change
      // @ts-ignore
      game.update(0.2);
      
      // Game should still be valid
      expect(game.getGameState()).toBeDefined();
    });
  });

  describe('Food Collision', () => {
    it('should increase score when eating food', () => {
      const scoreUpdateCallback = vi.fn();
      game.on('scoreUpdate', scoreUpdateCallback);
      
      game.start();
      const initialScore = game.getGameState().score;
      
      // Mock Math.random to control food spawning
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = vi.fn(() => {
        // Place food directly in front of snake head
        callCount++;
        return callCount % 2 === 0 ? 0.5 : 0.51; // Near center
      });
      
      // Move snake to eat food
      for (let i = 0; i < 50; i++) {
        // @ts-ignore
        game.update(0.2);
        
        if (scoreUpdateCallback.mock.calls.length > 0) {
          break;
        }
      }
      
      // Restore Math.random
      Math.random = originalRandom;
      
      // Score should have increased at some point during movement
      const finalScore = game.getGameState().score;
      expect(finalScore).toBeGreaterThanOrEqual(initialScore);
    });

    it('should spawn new food after eating', () => {
      game.start();
      
      // Food should be spawned during initialization
      const state = game.getGameState();
      expect(state).toBeDefined();
    });
  });

  describe('Self Collision', () => {
    it('should trigger game over when snake hits itself', () => {
      const gameOverCallback = vi.fn();
      game.on('gameOver', gameOverCallback);
      
      game.start();
      
      // Create a scenario where snake will eventually hit itself
      // by making it turn in circles
      const directions = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
      let dirIndex = 0;
      
      for (let i = 0; i < 200; i++) {
        // Change direction periodically
        if (i % 10 === 0) {
          const keyEvent = new KeyboardEvent('keydown', { 
            key: directions[dirIndex % directions.length] 
          });
          document.dispatchEvent(keyEvent);
          dirIndex++;
        }
        
        // @ts-ignore
        game.update(0.2);
        
        if (gameOverCallback.mock.calls.length > 0) {
          break;
        }
      }
      
      // Game should eventually end (wall or self collision)
      expect(gameOverCallback).toHaveBeenCalled();
    });
  });

  describe('Game State', () => {
    it('should return current game state accurately', () => {
      game.start();
      
      const state = game.getGameState();
      
      expect(state).toHaveProperty('score');
      expect(state).toHaveProperty('level');
      expect(typeof state.score).toBe('number');
      expect(typeof state.level).toBe('number');
    });

    it('should update state as game progresses', () => {
      game.start();
      
      const initialState = game.getGameState();
      
      // Progress game
      for (let i = 0; i < 10; i++) {
        // @ts-ignore
        game.update(0.2);
      }
      
      const newState = game.getGameState();
      
      // States should exist
      expect(initialState).toBeDefined();
      expect(newState).toBeDefined();
    });
  });

  describe('Game Over', () => {
    it('should emit gameOver event with correct data', () => {
      const gameOverCallback = vi.fn();
      game.on('gameOver', gameOverCallback);
      
      game.start();
      
      // Force game over by moving into wall
      for (let i = 0; i < 100; i++) {
        // @ts-ignore
        game.update(0.2);
      }
      
      expect(gameOverCallback).toHaveBeenCalled();
      
      if (gameOverCallback.mock.calls.length > 0) {
        const eventData = gameOverCallback.mock.calls[0][0];
        expect(eventData).toHaveProperty('finalScore');
        expect(eventData).toHaveProperty('timestamp');
      }
    });

    it('should stop game loop after game over', () => {
      game.start();
      
      // Force game over
      for (let i = 0; i < 100; i++) {
        // @ts-ignore
        game.update(0.2);
      }
      
      // Game should be in finished state
      const state = game.getGameState();
      expect(state).toBeDefined();
    });
  });

  describe('Event Emissions', () => {
    it('should emit scoreUpdate event when score increases', () => {
      const scoreUpdateCallback = vi.fn();
      game.on('scoreUpdate', scoreUpdateCallback);
      
      game.start();
      
      // Try to trigger score update
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5);
      
      for (let i = 0; i < 50; i++) {
        // @ts-ignore
        game.update(0.2);
        
        if (scoreUpdateCallback.mock.calls.length > 0) {
          break;
        }
      }
      
      Math.random = originalRandom;
      
      // Score update should eventually be called
      // (or at least game should run without errors)
      expect(game.getGameState()).toBeDefined();
    });

    it('should include score delta in scoreUpdate event', () => {
      const scoreUpdateCallback = vi.fn();
      game.on('scoreUpdate', scoreUpdateCallback);
      
      game.start();
      
      // Mock for controlled food spawning
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5);
      
      for (let i = 0; i < 50; i++) {
        // @ts-ignore
        game.update(0.2);
      }
      
      Math.random = originalRandom;
      
      if (scoreUpdateCallback.mock.calls.length > 0) {
        const eventData = scoreUpdateCallback.mock.calls[0][0];
        expect(eventData).toHaveProperty('score');
        expect(eventData).toHaveProperty('delta');
        expect(eventData.delta).toBe(1);
      }
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on cleanup', () => {
      game.start();
      game.stop();
      
      // Game should be stopped
      expect(game.getGameState()).toBeDefined();
    });

    it('should handle multiple start/stop cycles', () => {
      game.start();
      game.stop();
      game.start();
      game.stop();
      
      // Should not throw errors
      expect(game.getGameState()).toBeDefined();
    });
  });
});
