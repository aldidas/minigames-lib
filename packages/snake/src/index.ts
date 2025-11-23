import { BaseGame } from '@minigame/core';
import type { ScoreUpdateData, GameOverData } from '@minigame/core';

/**
 * Position on the game grid
 */
interface Position {
  x: number;
  y: number;
}

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
  private snake: Position[] = [];
  private direction: Position = { x: 1, y: 0 };
  private nextDirection: Position = { x: 1, y: 0 };
  private food: Position = { x: 0, y: 0 };
  private score: number = 0;
  private level: number = 1;

  private readonly GRID_SIZE = 20;
  private readonly MOVE_SPEED = 150; // ms between moves
  private timeSinceLastMove = 0;

  private cellSize = 0;

  /**
   * Initialize game state
   * Called when game starts
   */
  protected init(): void {
    // Calculate cell size based on canvas
    const rect = this.canvas.getBoundingClientRect();
    this.cellSize = Math.min(rect.width, rect.height) / this.GRID_SIZE;

    // Initialize snake at center with 3 segments
    const center = Math.floor(this.GRID_SIZE / 2);
    this.snake = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];

    // Set initial direction (right)
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    // Reset score
    this.score = 0;
    this.level = 1;
    this.timeSinceLastMove = 0;

    // Spawn first food
    this.spawnFood();

    // Setup controls
    this.setupControls();
  }

  /**
   * Update game logic
   * Called every frame
   * @param deltaTime - Time since last frame in seconds
   */
  protected update(deltaTime: number): void {
    this.timeSinceLastMove += deltaTime * 1000;

    if (this.timeSinceLastMove >= this.MOVE_SPEED) {
      this.timeSinceLastMove = 0;

      // Update direction (prevents reversing mid-frame)
      this.direction = this.nextDirection;

      // Calculate new head position
      const head = this.snake[0];
      if (!head) return; // Safety check
      
      const newHead = {
        x: head.x + this.direction.x,
        y: head.y + this.direction.y,
      };

      // Check wall collision
      if (this.isOutOfBounds(newHead)) {
        this.handleGameOver('wall collision');
        return;
      }

      // Check self collision
      if (this.isSnakeCollision(newHead)) {
        this.handleGameOver('self collision');
        return;
      }

      // Add new head
      this.snake.unshift(newHead);

      // Check food collision
      if (this.isFoodCollision(newHead)) {
        this.score++;
        const scoreData: ScoreUpdateData = {
          timestamp: new Date().toISOString(),
          score: this.score,
          delta: 1,
          playerName: this.playerName || undefined,
        };
        this.emit('scoreUpdate', scoreData);
        this.spawnFood();
      } else {
        // Remove tail (snake doesn't grow)
        this.snake.pop();
      }
    }
  }

  /**
   * Render game to canvas
   * Called every frame
   */
  protected render(): void {
    // Clear canvas
    this.ctx.fillStyle = this.config.colors.background;
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid (subtle)
    this.ctx.strokeStyle = this.adjustAlpha(this.config.colors.text, 0.1);
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.GRID_SIZE; i++) {
      // Vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.cellSize, 0);
      this.ctx.lineTo(i * this.cellSize, this.GRID_SIZE * this.cellSize);
      this.ctx.stroke();

      // Horizontal lines
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.cellSize);
      this.ctx.lineTo(this.GRID_SIZE * this.cellSize, i * this.cellSize);
      this.ctx.stroke();
    }

    // Draw snake
    this.snake.forEach((segment, index) => {
      this.ctx.fillStyle = index === 0 ? this.config.colors.primary : this.config.colors.secondary;
      this.ctx.fillRect(
        segment.x * this.cellSize + 1,
        segment.y * this.cellSize + 1,
        this.cellSize - 2,
        this.cellSize - 2
      );
    });

    // Draw food
    this.ctx.fillStyle = '#ff0000'; // Red food
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.cellSize + this.cellSize / 2,
      this.food.y * this.cellSize + this.cellSize / 2,
      this.cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw score
    this.ctx.fillStyle = this.config.colors.text;
    this.ctx.font = `${this.config.typography.fontSize.large}px ${this.config.typography.fontFamily}`;
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
  }

  /**
   * Clean up game resources
   * Called when game stops
   */
  protected cleanup(): void {
    this.removeControls();
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

  // Helper methods

  private spawnFood(): void {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.GRID_SIZE),
        y: Math.floor(Math.random() * this.GRID_SIZE),
      };
    } while (this.snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));

    this.food = newFood;
  }

  private isOutOfBounds(pos: Position): boolean {
    return pos.x < 0 || pos.x >= this.GRID_SIZE || pos.y < 0 || pos.y >= this.GRID_SIZE;
  }

  private isSnakeCollision(pos: Position): boolean {
    return this.snake.some((segment) => segment.x === pos.x && segment.y === pos.y);
  }

  private isFoodCollision(pos: Position): boolean {
    return pos.x === this.food.x && pos.y === this.food.y;
  }

  private handleGameOver(reason: string): void {
    this.stop();
    const gameOverData: GameOverData = {
      timestamp: new Date().toISOString(),
      reason,
      finalScore: this.score,
      playerName: this.playerName || undefined,
    };
    this.emit('gameOver', gameOverData);
  }

  private changeDirection(newDirection: Position): void {
    // Prevent reversing direction
    if (
      (newDirection.x === -this.direction.x && newDirection.y === 0) ||
      (newDirection.y === -this.direction.y && newDirection.x === 0)
    ) {
      return;
    }
    this.nextDirection = newDirection;
  }

  // Controls

  private keyDownHandler = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.changeDirection({ x: 0, y: -1 });
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.changeDirection({ x: 0, y: 1 });
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.changeDirection({ x: -1, y: 0 });
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.changeDirection({ x: 1, y: 0 });
        e.preventDefault();
        break;
    }
  };

  private touchStartX = 0;
  private touchStartY = 0;

  private touchStartHandler = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) return;
    
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  };

  private touchEndHandler = (e: TouchEvent): void => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const dx = touchEndX - this.touchStartX;
    const dy = touchEndY - this.touchStartY;

    // Require minimum swipe distance
    const minSwipeDistance = 30;
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
      return;
    }

    // Detect primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      this.changeDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      // Vertical swipe
      this.changeDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
  };

  private setupControls(): void {
    window.addEventListener('keydown', this.keyDownHandler);
    this.canvas.addEventListener('touchstart', this.touchStartHandler);
    this.canvas.addEventListener('touchend', this.touchEndHandler);
  }

  private removeControls(): void {
    window.removeEventListener('keydown', this.keyDownHandler);
    this.canvas.removeEventListener('touchstart', this.touchStartHandler);
    this.canvas.removeEventListener('touchend', this.touchEndHandler);
  }

  private adjustAlpha(color: string, alpha: number): string {
    // Simple alpha adjustment for hex colors
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }
}
