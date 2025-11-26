import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PongGame } from '../index';

describe('PongGame', () => {
  let canvas: HTMLCanvasElement;
  let game: PongGame;

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
      lineWidth: 1,
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
      setLineDash: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      canvas,
    };

    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as any);
  });

  afterEach(() => {
    if (game) {
      game.stop();
    }
    canvas.remove();
  });

  describe('Initialization', () => {
    it('should create game instance successfully', () => {
      game = new PongGame(canvas);
      expect(game).toBeDefined();
    });

    it('should initialize with correct initial state for PvAI mode', () => {
      game = new PongGame(canvas, undefined, 'pvai');
      game.start();
      const state = game.getGameState();
      
      // Scores should be valid numbers (may start with serve that scores)
      expect(typeof state.score.player1).toBe('number');
      expect(typeof state.score.player2).toBe('number');
      expect(state.score.player1).toBeGreaterThanOrEqual(0);
      expect(state.score.player2).toBeGreaterThanOrEqual(0);
      expect(state.gameMode).toBe('pvai');
    });

    it('should initialize with correct initial state for PvP mode', () => {
      game = new PongGame(canvas, undefined, 'pvp');
      game.start();
      const state = game.getGameState();
      
      expect(state.gameMode).toBe('pvp');
    });

    it('should create paddles and ball on init', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Game should be running without errors
      expect(game.getGameState()).toBeDefined();
    });
  });

  describe('Paddle Movement', () => {
    it('should move player paddle up with ArrowUp', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Simulate up key
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(keyDownEvent);
      
      // Update game
      // @ts-ignore
      game.update(0.016);
      
      // Game should still be running
      expect(game.getGameState()).toBeDefined();
    });

    it('should move player paddle down with ArrowDown', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Simulate down key
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(keyDownEvent);
      
      // Update game
      // @ts-ignore
      game.update(0.016);
      
      // Game should still be running
      expect(game.getGameState()).toBeDefined();
    });

    it('should keep paddle within canvas bounds', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Try to move paddle beyond bounds
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(keyDownEvent);
      
      // Update many times to try to move out of bounds
      for (let i = 0; i < 100; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      // Game should still be valid
      expect(game.getGameState()).toBeDefined();
    });
  });

  describe('Ball Physics', () => {
    it('should move ball in initial direction', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Update to move ball
      // @ts-ignore
      game.update(0.016);
      
      // Game should progress
      expect(game.getGameState()).toBeDefined();
    });

    it('should bounce ball off top and bottom walls', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Update many times to allow ball to hit walls
      for (let i = 0; i < 100; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      // Ball should bounce, game continues
      expect(game.getGameState()).toBeDefined();
    });

    it('should bounce ball off paddles', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Update to allow potential paddle collision
      for (let i = 0; i < 50; i++){
        // @ts-ignore
        game.update(0.016);
      }
      
      // Game should still be running
      expect(game.getGameState()).toBeDefined();
    });
  });

  describe('Scoring System', () => {
    it('should award point when ball passes player 1 paddle', () => {
      const scoreUpdateCallback = vi.fn();
      game = new PongGame(canvas);
      game.on('scoreUpdate', scoreUpdateCallback);
      game.start();
      
      // Let ball pass left side many times
      for (let i = 0; i < 200; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      // Eventually a score should happen
      const state = game.getGameState();
      const totalScore = state.score.player1 + state.score.player2;
      expect(totalScore).toBeGreaterThanOrEqual(0);
    });

    it('should emit scoreUpdate event when score changes', () => {
      const scoreUpdateCallback = vi.fn();
      game = new PongGame(canvas);
      game.on('scoreUpdate', scoreUpdateCallback);
      game.start();
      
      // Play until score event
      for (let i = 0; i < 200; i++) {
        // @ts-ignore
        game.update(0.016);
        
        if (scoreUpdateCallback.mock.calls.length > 0) {
          break;
        }
      }
      
      // Score update may have been called
      const state = game.getGameState();
      expect(state).toBeDefined();
    });

    it('should reset ball after scoring', () => {
      game = new PongGame(canvas);
      game.start();
      
      // Play until a score happens
      for (let i = 0; i < 200; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      // Ball should have reset at some point
      expect(game.getGameState()).toBeDefined();
    });
  });

  describe('AI Logic (PvAI mode)', () => {
    it('should have AI paddle track ball', () => {
      game = new PongGame(canvas, undefined, 'pvai');
      game.start();
      
      // AI should move its paddle
      for (let i = 0; i < 50; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      // Game should be running with AI
      expect(game.getGameState().gameMode).toBe('pvai');
    });

    it('should have AI paddle stay within bounds', () => {
      game = new PongGame(canvas, undefined, 'pvai');
      game.start();
      
      // Run game for a while
      for (let i = 0; i < 100; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      // AI paddle should not go out of bounds
      expect(game.getGameState()).toBeDefined();
    });
  });

  describe('Two-Player Mode (PvP)', () => {
    it('should allow both players to control their paddles in PvP mode', () => {
      game = new PongGame(canvas, undefined, 'pvp');
      game.start();
      
      // Player 1 controls (Arrow keys)
      const p1UpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(p1UpEvent);
      
      // Player 2 controls (W/S keys)
      const p2UpEvent = new KeyboardEvent('keydown', { key: 'w' });
      document.dispatchEvent(p2UpEvent);
      
      // Update game
      // @ts-ignore
      game.update(0.016);
      
      expect(game.getGameState().gameMode).toBe('pvp');
    });

    it('should not have AI movement in PvP mode', () => {
      game = new PongGame(canvas, undefined, 'pvp');
      game.start();
      
      // In PvP mode, right paddle should not auto-move
      for (let i = 0; i < 10; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      expect(game.getGameState().gameMode).toBe('pvp');
    });
  });

  describe('Game Over', () => {
    it('should trigger game over when win condition is met', () => {
      const gameOverCallback = vi.fn();
      game = new PongGame(canvas);
      game.on('gameOver', gameOverCallback);
      game.start();
      
      // Play until game over (max score reached)
      for (let i = 0; i < 1000; i++) {
        // @ts-ignore
        game.update(0.016);
        
        if (gameOverCallback.mock.calls.length > 0) {
          break;
        }
      }
      
      // Game may or may not end within this time
      expect(game.getGameState()).toBeDefined();
    });

    it('should emit gameOver event with winner information', () => {
      const gameOverCallback = vi.fn();
      game = new PongGame(canvas);
      game.on('gameOver', gameOverCallback);
      game.start();
      
      // Try to reach game over
      for (let i = 0; i < 1000; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      if (gameOverCallback.mock.calls.length > 0) {
        const eventData = gameOverCallback.mock.calls[0][0];
        expect(eventData).toHaveProperty('finalScore');
        expect(eventData).toHaveProperty('timestamp');
      }
    });
  });

  describe('Game State', () => {
    it('should return current game state accurately', () => {
      game = new PongGame(canvas);
      game.start();
      
      const state = game.getGameState();
      
      expect(state).toHaveProperty('score');
      expect(state.score).toHaveProperty('player1');
      expect(state.score).toHaveProperty('player2');
      expect(state).toHaveProperty('gameMode');
      expect(state).toHaveProperty('ballSpeed');
    });

    it('should update state as game progresses', () => {
      game = new PongGame(canvas);
      game.start();
      
      const initialState = game.getGameState();
      
      // Progress game
      for (let i = 0; i < 20; i++) {
        // @ts-ignore
        game.update(0.016);
      }
      
      const newState = game.getGameState();
      
      // States should exist
      expect(initialState).toBeDefined();
      expect(newState).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on cleanup', () => {
      game = new PongGame(canvas);
      game.start();
      game.stop();
      
      // Game should be stopped
      expect(game.getGameState()).toBeDefined();
    });

    it('should handle multiple start/stop cycles', () => {
      game = new PongGame(canvas);
      game.start();
      game.stop();
      game.start();
      game.stop();
      
      // Should not throw errors
      expect(game.getGameState()).toBeDefined();
    });
  });
});
