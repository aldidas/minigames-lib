import { EventEmitter } from './EventEmitter';
import type { GameState, GameConfig } from './types';
import { mergeConfig } from './GameConfig';

/**
 * Abstract base class for all minigames
 * Provides uniform API and game loop implementation
 * @template TState - Game-specific state interface
 */
export abstract class BaseGame<TState = any> extends EventEmitter {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected gameState: GameState = 'idle';
  protected playerName: string = '';
  protected config: GameConfig;

  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  constructor(canvas: HTMLCanvasElement, config?: Partial<GameConfig>) {
    super();
    this.canvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = ctx;

    // Merge user config with defaults
    this.config = mergeConfig(config);

    // Setup high-DPI canvas
    this.setupCanvas();
  }

  // Uniform API Methods (FR1-FR8)

  /**
   * Start the game
   * Initializes game state and begins game loop
   */
  public start(): void {
    if (this.gameState !== 'idle' && this.gameState !== 'finished') return;

    this.gameState = 'running';
    this.init();
    this.emit('gameStarted', {
      timestamp: new Date().toISOString(),
      playerName: this.playerName || undefined,
    });
    this.startGameLoop();
  }

  /**
   * Stop the game
   * Stops game loop and cleans up resources
   */
  public stop(): void {
    if (this.gameState === 'idle' || this.gameState === 'finished') return;

    this.stopGameLoop();
    this.cleanup();
    this.gameState = 'finished';
    this.emit('gameFinished', {
      timestamp: new Date().toISOString(),
      playerName: this.playerName || undefined,
    });
  }

  /**
   * Pause the game
   * Stops game loop but preserves game state
   */
  public pause(): void {
    if (this.gameState !== 'running') return;
    this.gameState = 'paused';
    this.stopGameLoop();
  }

  /**
   * Resume the game
   * Resumes game loop from paused state
   */
  public resume(): void {
    if (this.gameState !== 'paused') return;
    this.gameState = 'running';
    this.startGameLoop();
  }

  /**
   * Mute game audio
   */
  public mute(): void {
    this.config.audio.muted = true;
    this.emit('soundMuted', {
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Unmute game audio
   */
  public unmute(): void {
    this.config.audio.muted = false;
    this.emit('soundUnmuted', {
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Set player name
   * @param name - Player name to set
   */
  public setPlayerName(name: string): void {
    this.playerName = name;
  }

  /**
   * Get current game state
   * @returns Game-specific state object
   */
  public getGameState(): TState {
    return this.getCurrentState();
  }

  // Abstract methods - MUST be implemented by games

  /**
   * Initialize game state
   * Called once when game starts
   */
  protected abstract init(): void;

  /**
   * Update game logic
   * Called every frame while game is running
   * @param deltaTime - Time since last frame in seconds
   */
  protected abstract update(deltaTime: number): void;

  /**
   * Render game to canvas
   * Called every frame while game is running
   */
  protected abstract render(): void;

  /**
   * Clean up game resources
   * Called when game stops
   */
  protected abstract cleanup(): void;

  /**
   * Get current game-specific state
   * @returns Current state object
   */
  protected abstract getCurrentState(): TState;

  // Game loop implementation

  private startGameLoop(): void {
    this.lastFrameTime = performance.now();
    this.gameLoop();
  }

  private stopGameLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private gameLoop = (): void => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;

    if (this.gameState === 'running') {
      this.update(deltaTime);
      this.render();
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  // Helper methods

  private setupCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    
    // Set canvas size to match CSS dimensions
    // Note: High-DPI scaling removed for now to avoid coordinate system issues
    // Can be added back later with proper rendering support
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
}
