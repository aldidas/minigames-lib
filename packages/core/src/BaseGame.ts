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

  /**
   * Creates a new game instance
   * @param canvas - HTMLCanvasElement to render the game on
   * @param config - Optional partial game configuration to override defaults
   * @throws {Error} If canvas is not provided or invalid
   * @throws {Error} If 2D rendering context cannot be obtained
   */
  constructor(canvas: HTMLCanvasElement, config?: Partial<GameConfig>) {
    super();

    // Validate canvas parameter
    if (!canvas) {
      throw new Error(
        'Canvas element required for game initialization. ' +
        'Please provide a valid HTMLCanvasElement as the first argument.\n\n' +
        'Example:\n' +
        '  const canvas = document.getElementById("game-canvas");\n' +
        '  const game = new SnakeGame(canvas);'
      );
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(
        'Provided element is not a valid HTMLCanvasElement. ' +
        'Ensure you are passing a <canvas> element, not a different HTML element.\n\n' +
        'Example:\n' +
        '  <canvas id="game-canvas" width="600" height="600"></canvas>\n' +
        '  const canvas = document.getElementById("game-canvas");'
      );
    }

    this.canvas = canvas;

    // Get 2D context with validation
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(
        'Failed to get 2D rendering context from canvas. ' +
        'This may occur if the canvas is already using a different context type (e.g., WebGL).'
      );
    }
    this.ctx = ctx;

    // Merge and validate user config with defaults
    this.config = mergeConfig(config);
    this.validateConfig(config);

    // Setup canvas
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

  /**
   * Validates user provided config and logs warnings for invalid values
   * @param config - User provided partial config
   */
  private validateConfig(config?: Partial<GameConfig>): void {
    if (!config) return;

    // Validate colors (basic hex format check)
    if (config.colors) {
      const colorKeys = ['primary', 'secondary', 'background', 'text'] as const;
      for (const key of colorKeys) {
        const color = config.colors[key];
        if (color && typeof color === 'string' && !this.isValidColor(color)) {
          console.warn(
            `[Minigame] Invalid ${key} color "${color}". ` +
            `Using default color instead. Colors should be in hex format (e.g., "#3b82f6") or CSS color names.`
          );
        }
      }
    }

    // Validate animation speed
    if (config.animation?.speed !== undefined) {
      const speed = config.animation.speed;
      if (speed <= 0 || !Number.isFinite(speed)) {
        console.warn(
          `[Minigame] Animation speed ${speed} is invalid. ` +
          `Speed should be a positive number (1.0 = normal speed).`
        );
      } else if (speed > 5) {
        console.warn(
          `[Minigame] Animation speed ${speed} is very high. ` +
          `This may cause performance issues or make the game unplayable.`
        );
      }
    }

    // Validate typography font sizes
    if (config.typography?.fontSize) {
      const sizes = config.typography.fontSize;
      if (sizes.small && (sizes.small < 8 || sizes.small > 72)) {
        console.warn(`[Minigame] Font size "small" (${sizes.small}) should be between 8-72px.`);
      }
      if (sizes.medium && (sizes.medium < 8 || sizes.medium > 72)) {
        console.warn(`[Minigame] Font size "medium" (${sizes.medium}) should be between 8-72px.`);
      }
      if (sizes.large && (sizes.large < 8 || sizes.large > 72)) {
        console.warn(`[Minigame] Font size "large" (${sizes.large}) should be between 8-72px.`);
      }
    }

    // Warn if canvas is very small
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 200 || rect.height < 200) {
      console.warn(
        `[Minigame] Canvas size (${rect.width}x${rect.height}) is quite small. ` +
        `Games may not render optimally. Recommended minimum: 400x400px.`
      );
    }
  }

  /**
   * Basic color format validation
   * @param color - Color string to validate
   * @returns true if color appears valid
   */
  private isValidColor(color: string): boolean {
    // Check for hex format
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      return true;
    }
    // Check for rgb/rgba format
    if (/^rgb(a)?\s*\(/.test(color)) {
      return true;
    }
    // Check for common CSS color names (not exhaustive)
    const cssColors = [
      'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
      'pink', 'gray', 'grey', 'transparent'
    ];
    return cssColors.includes(color.toLowerCase());
  }
}
