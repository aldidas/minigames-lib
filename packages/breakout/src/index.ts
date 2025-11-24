import { BaseGame } from '@minigame/core';
import type { ScoreUpdateData, GameOverData } from '@minigame/core';

/**
 * Brick entity
 */
interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  color: string;
}

/**
 * Paddle entity
 */
interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

/**
 * Ball entity
 */
interface Ball {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  speed: number;
}

/**
 * Breakout game state
 */
export interface BreakoutGameState {
  score: number;
  lives: number;
  level: number;
  bricksRemaining: number;
}

/**
 * Classic Breakout game implementation
 * Brick-breaking paddle-and-ball gameplay
 */
export class BreakoutGame extends BaseGame<BreakoutGameState> {
  private paddle: Paddle;
  private ball: Ball;
  private bricks: Brick[] = [];
  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  private bricksRemaining: number = 0;

  // Paddle movement
  private paddleLeft = false;
  private paddleRight = false;

  // Canvas dimensions
  private canvasWidth = 0;
  private canvasHeight = 0;

  // Constants
  private readonly PADDLE_WIDTH = 100;
  private readonly PADDLE_HEIGHT = 15;
  private readonly BALL_RADIUS = 8;
  private readonly PADDLE_SPEED = 500;
  private readonly INITIAL_BALL_SPEED = 300;
  private readonly BRICK_ROWS = 6;
  private readonly BRICK_COLS = 8;
  private readonly BRICK_HEIGHT = 20;
  private readonly BRICK_PADDING = 40;
  private readonly BRICK_TOP_OFFSET = 60;

  constructor(canvas: HTMLCanvasElement, config?: any) {
    super(canvas, config);

    // Initialize entities (will be properly set in init())
    this.paddle = this.createPaddle();
    this.ball = this.createBall();
  }

  protected init(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvasWidth = rect.width;
    this.canvasHeight = rect.height;

    // Initialize paddle
    this.paddle = this.createPaddle();
    this.paddle.x = (this.canvasWidth - this.paddle.width) / 2;
    this.paddle.y = this.canvasHeight - 40;

    // Initialize ball
    this.ball = this.createBall();
    this.resetBall();

    // Initialize bricks
    this.createBricks();

    // Reset game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;

    // Setup controls
    this.setupControls();
  }

  protected update(deltaTime: number): void {
    // Update paddle
    if (this.paddleLeft) {
      this.paddle.x -= this.PADDLE_SPEED * deltaTime;
    }
    if (this.paddleRight) {
      this.paddle.x += this.PADDLE_SPEED * deltaTime;
    }

    // Keep paddle in bounds
    this.paddle.x = Math.max(0, Math.min(this.canvasWidth - this.paddle.width, this.paddle.x));

    // Update ball position
    this.ball.x += this.ball.vx * deltaTime * this.ball.speed;
    this.ball.y += this.ball.vy * deltaTime * this.ball.speed;

    // Ball collision with walls
    if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.canvasWidth) {
      this.ball.vx *= -1;
      this.ball.x = Math.max(this.ball.radius, Math.min(this.canvasWidth - this.ball.radius, this.ball.x));
    }

    if (this.ball.y - this.ball.radius < 0) {
      this.ball.vy *= -1;
      this.ball.y = this.ball.radius;
    }

    // Ball collision with paddle
    if (this.checkPaddleCollision(this.ball, this.paddle)) {
      // Calculate hit position (0 = left, 0.5 = center, 1 = right)
      const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;

      // Set new velocity based on hit position
      // Hit on left side → bounce left, hit on right → bounce right
      const angle = (hitPos - 0.5) * Math.PI / 3; // -60° to +60°

      this.ball.vx = Math.sin(angle);
      this.ball.vy = -Math.cos(angle); // Always upward

      // Normalize
      const magnitude = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
      this.ball.vx /= magnitude;
      this.ball.vy /= magnitude;

      // Move ball out of paddle
      this.ball.y = this.paddle.y - this.ball.radius - 1;
    }

    // Ball collision with bricks
    for (const brick of this.bricks) {
      if (!brick.active) continue;

      if (this.checkBrickCollision(this.ball, brick)) {
        brick.active = false;
        this.score += 10;
        this.bricksRemaining--;

        // Simple bounce - reverse Y velocity
        this.ball.vy *= -1;

        // Emit score update
        const scoreData: ScoreUpdateData = {
          timestamp: new Date().toISOString(),
          score: this.score,
          delta: 10,
          playerName: this.playerName || undefined,
        };
        this.emit('scoreUpdate', scoreData);

        // Check level complete
        if (this.bricksRemaining === 0) {
          this.handleLevelComplete();
        }

        break; // Only one brick per frame
      }
    }

    // Ball lost (went below paddle)
    if (this.ball.y > this.canvasHeight) {
      this.lives--;

      if (this.lives <= 0) {
        this.handleGameOver('No lives remaining');
      } else {
        this.resetBall();
      }
    }
  }

  protected render(): void {
    const rect = this.canvas.getBoundingClientRect();

    // Clear canvas
    this.ctx.fillStyle = this.config.colors.background;
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw bricks
    for (const brick of this.bricks) {
      if (!brick.active) continue;

      this.ctx.fillStyle = brick.color;
      this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    }

    // Draw paddle
    this.ctx.fillStyle = this.config.colors.primary;
    this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

    // Draw ball
    this.ctx.fillStyle = this.config.colors.secondary;
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw score
    this.ctx.fillStyle = this.config.colors.text;
    this.ctx.font = `${this.config.typography.fontSize.large}px ${this.config.typography.fontFamily}`;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);

    // Draw lives
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Lives: ${this.lives}`, rect.width - 10, 30);
  }

  protected cleanup(): void {
    this.removeControls();
  }

  protected getCurrentState(): BreakoutGameState {
    return {
      score: this.score,
      lives: this.lives,
      level: this.level,
      bricksRemaining: this.bricksRemaining,
    };
  }

  // Helper methods

  private createPaddle(): Paddle {
    return {
      x: 0,
      y: 0,
      width: this.PADDLE_WIDTH,
      height: this.PADDLE_HEIGHT,
      speed: this.PADDLE_SPEED,
    };
  }

  private createBall(): Ball {
    return {
      x: 0,
      y: 0,
      radius: this.BALL_RADIUS,
      vx: 0,
      vy: 0,
      speed: this.INITIAL_BALL_SPEED,
    };
  }

  private resetBall(): void {
    this.ball.x = this.canvasWidth / 2;
    this.ball.y = this.canvasHeight - 100;
    this.ball.speed = this.INITIAL_BALL_SPEED;

    // Random angle between -45 and 45 degrees, always upward
    const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4);
    this.ball.vx = Math.sin(angle);
    this.ball.vy = -Math.cos(angle); // Negative = upward
  }

  private createBricks(): void {
    this.bricks = [];
    const brickWidth = (this.canvasWidth - this.BRICK_PADDING) / this.BRICK_COLS;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

    for (let row = 0; row < this.BRICK_ROWS; row++) {
      for (let col = 0; col < this.BRICK_COLS; col++) {
        this.bricks.push({
          x: col * brickWidth + this.BRICK_PADDING / 2,
          y: row * this.BRICK_HEIGHT + this.BRICK_TOP_OFFSET,
          width: brickWidth - 4, // 4px gap between bricks
          height: this.BRICK_HEIGHT - 4,
          active: true,
          color: colors[row % colors.length]!, // Modulo ensures valid index
        });
      }
    }

    this.bricksRemaining = this.bricks.length;
  }

  private checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
    return (
      ball.x + ball.radius > paddle.x &&
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.vy > 0 // Ball moving downward
    );
  }

  private checkBrickCollision(ball: Ball, brick: Brick): boolean {
    return (
      ball.x + ball.radius > brick.x &&
      ball.x - ball.radius < brick.x + brick.width &&
      ball.y + ball.radius > brick.y &&
      ball.y - ball.radius < brick.y + brick.height
    );
  }

  private handleLevelComplete(): void {
    this.stop();
    const gameOverData: GameOverData = {
      timestamp: new Date().toISOString(),
      reason: 'Level Complete! All bricks destroyed!',
      finalScore: this.score,
      playerName: this.playerName || 'Player',
    };
    this.emit('gameOver', gameOverData);
  }

  private handleGameOver(reason: string): void {
    this.stop();
    const gameOverData: GameOverData = {
      timestamp: new Date().toISOString(),
      reason,
      finalScore: this.score,
      playerName: this.playerName || 'Player',
    };
    this.emit('gameOver', gameOverData);
  }

  // Controls

  private keyDownHandler = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.paddleLeft = true;
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.paddleRight = true;
        e.preventDefault();
        break;
    }
  };

  private keyUpHandler = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.paddleLeft = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.paddleRight = false;
        break;
    }
  };

  private touchHandler = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) return;

    const rect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;

    // Move paddle to touch position
    this.paddle.x = touchX - this.paddle.width / 2;
    this.paddle.x = Math.max(0, Math.min(this.canvasWidth - this.paddle.width, this.paddle.x));
  };

  private setupControls(): void {
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
    this.canvas.addEventListener('touchmove', this.touchHandler);
    this.canvas.addEventListener('touchstart', this.touchHandler);
  }

  private removeControls(): void {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
    this.canvas.removeEventListener('touchmove', this.touchHandler);
    this.canvas.removeEventListener('touchstart', this.touchHandler);
  }
}
