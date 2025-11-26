import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseGame } from '../BaseGame';
import type { GameConfig, GameState } from '../types';

// Mock implementation of BaseGame for testing
class TestGame extends BaseGame<{ score: number }> {
  public score = 0;

  protected init(): void {
    this.score = 0;
  }

  protected update(deltaTime: number): void {
    // Increment score based on delta time for testing
    this.score += deltaTime * 10;
  }

  protected render(): void {
    // Mock rendering
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected cleanup(): void {
    this.score = 0;
  }

  protected getCurrentState(): { score: number } {
    return { score: this.score };
  }

  // Expose protected members for testing
  public getGameStateInternal(): GameState {
    return this.gameState;
  }

  public getConfig(): GameConfig {
    return this.config;
  }
}

describe('BaseGame', () => {
  let canvas: HTMLCanvasElement;
  let game: TestGame;

  // Mock HTMLCanvasElement.prototype.getContext for jsdom
  beforeEach(() => {
    // Create a mock 2D context
    const mockContext = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      rect: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      setTransform: vi.fn(),
      canvas: null as any,
    };

    // Override getContext to return our mock
    HTMLCanvasElement.prototype.getContext = vi.fn((contextId) => {
      if (contextId === '2d') {
        mockContext.canvas = canvas;
        return mockContext as any;
      }
      return null;
    }) as any;

    // Create a canvas element for testing
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    if (game) {
      game.stop();
    }
    document.body.removeChild(canvas);
  });

  describe('Constructor', () => {
    it('should create game instance with valid canvas', () => {
      game = new TestGame(canvas);
      expect(game).toBeDefined();
      expect(game.getGameStateInternal()).toBe('idle');
    });

    it('should throw error if canvas is null', () => {
      expect(() => {
        // @ts-expect-error - testing invalid input
        new TestGame(null);
      }).toThrow(/Canvas element required/);
    });

    it('should throw error if canvas is undefined', () => {
      expect(() => {
        // @ts-expect-error - testing invalid input
        new TestGame(undefined);
      }).toThrow(/Canvas element required/);
    });

    it('should throw error if provided element is not a canvas', () => {
      const div = document.createElement('div');
      expect(() => {
        // @ts-expect-error - testing invalid input
        new TestGame(div);
      }).toThrow(/not a valid HTMLCanvasElement/);
    });

    it('should merge custom config with defaults', () => {
      const customConfig: Partial<GameConfig> = {
        colors: {
          primary: '#ff0000',
        },
      };
      game = new TestGame(canvas, customConfig);
      const config = game.getConfig();
      
      expect(config.colors.primary).toBe('#ff0000');
      // Default colors should still be present
      expect(config.colors.background).toBeDefined();
      expect(config.colors.text).toBeDefined();
    });

    it('should warn about invalid color format', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const customConfig: Partial<GameConfig> = {
        colors: {
          primary: 'not-a-valid-color-format',
        },
      };
      game = new TestGame(canvas, customConfig);

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Invalid primary color')
      );

      consoleWarn.mockRestore();
    });

    it('should warn about invalid animation speed', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      game = new TestGame(canvas, {
        animation: { speed: -1 },
      });

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Animation speed')
      );

      consoleWarn.mockRestore();
    });

    it('should warn about very high animation speed', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      game = new TestGame(canvas, {
        animation: { speed: 10 },
      });

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('very high')
      );

      consoleWarn.mockRestore();
    });
  });

  describe('start() - FR1', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should start game from idle state', () => {
      expect(game.getGameStateInternal()).toBe('idle');
      
      game.start();
      
      expect(game.getGameStateInternal()).toBe('running');
    });

    it('should emit gameStarted event', () => {
      const callback = vi.fn();
      game.on('gameStarted', callback);

      game.start();

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
    });

    it('should include playerName in gameStarted event if set', () => {
      const callback = vi.fn();
      game.setPlayerName('Test Player');
      game.on('gameStarted', callback);

      game.start();

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          playerName: 'Test Player',
        })
      );
    });

    it('should call init() method', () => {
      const initSpy = vi.spyOn(game as any, 'init');

      game.start();

      expect(initSpy).toHaveBeenCalled();
    });

    it('should not restart if already running', () => {
      const callback = vi.fn();
      game.on('gameStarted', callback);

      game.start();
      game.start(); // Try to start again

      // gameStarted should only be called once
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should be able to start again after finishing', () => {
      game.start();
      game.stop();
      
      expect(game.getGameStateInternal()).toBe('finished');
      
      game.start();
      
      expect(game.getGameStateInternal()).toBe('running');
    });
  });

  describe('stop() - FR2', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should stop running game', () => {
      game.start();
      expect(game.getGameStateInternal()).toBe('running');

      game.stop();

      expect(game.getGameStateInternal()).toBe('finished');
    });

    it('should emit gameFinished event', () => {
      const callback = vi.fn();
      game.on('gameFinished', callback);
      game.start();

      game.stop();

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
    });

    it('should call cleanup() method', () => {
      const cleanupSpy = vi.spyOn(game as any, 'cleanup');
      game.start();

      game.stop();

      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('should not stop if already idle', () => {
      const callback = vi.fn();
      game.on('gameFinished', callback);

      game.stop(); // Try to stop while idle

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not stop if already finished', () => {
      game.start();
      game.stop();
      
      const callback = vi.fn();
      game.on('gameFinished', callback);

      game.stop(); // Try to stop again

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('pause() - FR3', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should pause running game', () => {
      game.start();
      expect(game.getGameStateInternal()).toBe('running');

      game.pause();

      expect(game.getGameStateInternal()).toBe('paused');
    });

    it('should not pause if not running', () => {
      expect(game.getGameStateInternal()).toBe('idle');

      game.pause();

      expect(game.getGameStateInternal()).toBe('idle');
    });

    it('should stop game loop when paused', () => {
      game.start();
      const initialScore = game.score;

      game.pause();

      // Wait a bit and ensure score doesn't change (game  loop stopped)
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(game.score).toBe(initialScore);
          resolve();
        }, 100);
      });
    });
  });

  describe('resume() - FR4', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should resume paused game', () => {
      game.start();
      game.pause();
      expect(game.getGameStateInternal()).toBe('paused');

      game.resume();

      expect(game.getGameStateInternal()).toBe('running');
    });

    it('should not resume if not paused', () => {
      expect(game.getGameStateInternal()).toBe('idle');

      game.resume();

      expect(game.getGameStateInternal()).toBe('idle');
    });

    it('should restart game loop when resumed', () => {
      game.start();
      game.pause();
      const pausedScore = game.score;

      game.resume();

      // Wait a bit and ensure score increases (game loop running)
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(game.score).toBeGreaterThan(pausedScore);
          resolve();
        }, 100);
      });
    });
  });

  describe('mute() - FR5', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should mute game audio', () => {
      const config = game.getConfig();
      expect(config.audio.muted).toBe(false);

      game.mute();

      expect(config.audio.muted).toBe(true);
    });

    it('should emit soundMuted event', () => {
      const callback = vi.fn();
      game.on('soundMuted', callback);

      game.mute();

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
    });
  });

  describe('unmute() - FR6', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should unmute game audio', () => {
      game.mute();
      const config = game.getConfig();
      expect(config.audio.muted).toBe(true);

      game.unmute();

      expect(config.audio.muted).toBe(false);
    });

    it('should emit soundUnmuted event', () => {
      const callback = vi.fn();
      game.on('soundUnmuted', callback);

      game.unmute();

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
    });
  });

  describe('setPlayerName() - FR7', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should set player name', () => {
      game.setPlayerName('Alice');

      // Verify by checking gameStarted event
      const callback = vi.fn();
      game.on('gameStarted', callback);
      game.start();

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          playerName: 'Alice',
        })
      );
    });

    it('should update player name', () => {
      game.setPlayerName('Alice');
      game.setPlayerName('Bob');

      const callback = vi.fn();
      game.on('gameStarted', callback);
      game.start();

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          playerName: 'Bob',
        })
      );
    });
  });

  describe('getGameState() - FR8', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should return current game state', () => {
      const state = game.getGameState();

      expect(state).toEqual({ score: 0 });
    });

    it('should return updated state after game runs', () => {
      game.start();

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const state = game.getGameState();
          expect(state.score).toBeGreaterThan(0);
          resolve();
        }, 100);
      });
    });
  });

  describe('Game loop', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should call update() when running', () => {
      const updateSpy = vi.spyOn(game as any, 'update');
      game.start();

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(updateSpy).toHaveBeenCalled();
          resolve();
        }, 100);
      });
    });

    it('should call render() when running', () => {
      const renderSpy = vi.spyOn(game as any, 'render');
      game.start();

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(renderSpy).toHaveBeenCalled();
          resolve();
        }, 100);
      });
    });

    it('should not call update/render when paused', () => {
      game.start();
      game.pause();

      const updateSpy = vi.spyOn(game as any, 'update');
      const renderSpy = vi.spyOn(game as any, 'render');

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(updateSpy).not.toHaveBeenCalled();
          expect(renderSpy).not.toHaveBeenCalled();
          resolve();
        }, 100);
      });
    });
  });

  describe('Integration scenarios', () => {
    beforeEach(() => {
      game = new TestGame(canvas);
    });

    it('should handle full game lifecycle', () => {
      const startCallback = vi.fn();
      const finishCallback = vi.fn();

      game.on('gameStarted', startCallback);
      game.on('gameFinished', finishCallback);

      // Start
      game.start();
      expect(game.getGameStateInternal()).toBe('running');
      expect(startCallback).toHaveBeenCalled();

      // Pause
      game.pause();
      expect(game.getGameStateInternal()).toBe('paused');

      // Resume
      game.resume();
      expect(game.getGameStateInternal()).toBe('running');

      // Stop
      game.stop();
      expect(game.getGameStateInternal()).toBe('finished');
      expect(finishCallback).toHaveBeenCalled();
    });

    it('should handle audio mute/unmute during gameplay', () => {
      const muteCallback = vi.fn();
      const unmuteCallback = vi.fn();

      game.on('soundMuted', muteCallback);
      game.on('soundUnmuted', unmuteCallback);

      game.start();
      
      game.mute();
      expect(muteCallback).toHaveBeenCalled();
      expect(game.getConfig().audio.muted).toBe(true);

      game.unmute();
      expect(unmuteCallback).toHaveBeenCalled();
      expect(game.getConfig().audio.muted).toBe(false);
    });
  });
});
