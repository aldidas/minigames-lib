import { BaseGame } from '@minigame/core';
import type { ScoreUpdateData, GameOverData } from '@minigame/core';

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
  vx: number;  // velocity x
  vy: number;  // velocity y
  speed: number;
}

/**
 * Pong game state
 */
export interface PongGameState {
  score: {
    player1: number;
    player2: number;
  };
  ballSpeed: number;
  gameMode: 'pvai' | 'pvp';
}

/**
 * Classic Pong game implementation
 * Player vs AI paddle-and-ball gameplay
 */
export class PongGame extends BaseGame<PongGameState> {
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private ball: Ball;
  private player1Score: number = 0;
  private player2Score: number = 0;
  private gameMode: 'pvai' | 'pvp' = 'pvai';
  private readonly WIN_SCORE = 11;

  // Paddle movement
  private leftPaddleUp = false;
  private leftPaddleDown = false;
  private rightPaddleUp = false;
  private rightPaddleDown = false;

  // Canvas dimensions
  private canvasWidth = 0;
  private canvasHeight = 0;

  // Constants 
  private readonly PADDLE_WIDTH = 10;
  private readonly PADDLE_HEIGHT = 80;
  private readonly BALL_RADIUS = 8;
  private readonly PADDLE_SPEED = 400;
  private readonly INITIAL_BALL_SPEED = 300;

  constructor(canvas: HTMLCanvasElement, config?: any, gameMode: 'pvai' | 'pvp' = 'pvai') {
    super(canvas, config);
    this.gameMode = gameMode;

    // Initialize entities (will be properly set in init())
    this.leftPaddle = this.createPaddle(0, 0);
    this.rightPaddle = this.createPaddle(0, 0);
    this.ball = this.createBall();
  }

  protected init(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvasWidth = rect.width;
    this.canvasHeight = rect.height;

    // Initialize paddles
    this.leftPaddle = this.createPaddle(20, this.canvasHeight / 2 - this.PADDLE_HEIGHT / 2);
    this.rightPaddle = this.createPaddle(
      this.canvasWidth - 20 - this.PADDLE_WIDTH,
      this.canvasHeight / 2 - this.PADDLE_HEIGHT / 2
    );

    // Initialize ball
    this.ball = this.createBall();
    this.resetBall();

    // Reset scores
    this.player1Score = 0;
    this.player2Score = 0;

    // Setup controls
    this.setupControls();
  }

  protected update(deltaTime: number): void {
    // Update left paddle (player 1)
    if (this.leftPaddleUp) {
      this.leftPaddle.y -= this.PADDLE_SPEED * deltaTime;
    }
    if (this.leftPaddleDown) {
      this.leftPaddle.y += this.PADDLE_SPEED * deltaTime;
    }

    // Update right paddle
    if (this.gameMode === 'pvai') {
      this.updateAI(deltaTime);
    } else {
      // Player 2 controls
      if (this.rightPaddleUp) {
        this.rightPaddle.y -= this.PADDLE_SPEED * deltaTime;
      }
      if (this.rightPaddleDown) {
        this.rightPaddle.y += this.PADDLE_SPEED * deltaTime;
      }
    }

    // Keep paddles in bounds
    this.leftPaddle.y = Math.max(0, Math.min(this.canvasHeight - this.PADDLE_HEIGHT, this.leftPaddle.y));
    this.rightPaddle.y = Math.max(0, Math.min(this.canvasHeight - this.PADDLE_HEIGHT, this.rightPaddle.y));

    // Update ball position
    this.ball.x += this.ball.vx * deltaTime * this.ball.speed;
    this.ball.y += this.ball.vy * deltaTime * this.ball.speed;

    // Ball collision with top/bottom walls
    if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvasHeight) {
      this.ball.vy *= -1;
      this.ball.y = Math.max(this.ball.radius, Math.min(this.canvasHeight - this.ball.radius, this.ball.y));
    }

    // Ball collision with paddles
    if (this.checkPaddleCollision(this.ball, this.leftPaddle) || 
        this.checkPaddleCollision(this.ball, this.rightPaddle)) {
      this.ball.vx *= -1;
      this.ball.speed *= 1.05; // Increase speed 5%
      
      // Calculate hit position for angle
      const paddle = this.ball.vx > 0 ? this.rightPaddle : this.leftPaddle;
      const hitPos = (this.ball.y - paddle.y) / paddle.height; // 0-1
      this.ball.vy = (hitPos - 0.5) * 2; // -1 to 1
      
      // Normalize velocity
      const magnitude = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
      this.ball.vx /= magnitude;
      this.ball.vy /= magnitude;
    }

    // Score points
    if (this.ball.x < 0) {
      // Player 2 scores
      this.player2Score++;
      this.handleScore('player2');
    } else if (this.ball.x > this.canvasWidth) {
      // Player 1 scores
      this.player1Score++;
      this.handleScore('player1');
    }
  }

  protected render(): void {
    const rect = this.canvas.getBoundingClientRect();

    // Clear canvas
    this.ctx.fillStyle = this.config.colors.background;
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw center line
    this.ctx.strokeStyle = this.config.colors.text;
    this.ctx.setLineDash([10, 10]);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(rect.width / 2, 0);
    this.ctx.lineTo(rect.width / 2, rect.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw paddles
    this.ctx.fillStyle = this.config.colors.primary;
    this.ctx.fillRect(this.leftPaddle.x, this.leftPaddle.y, this.leftPaddle.width, this.leftPaddle.height);
    this.ctx.fillRect(this.rightPaddle.x, this.rightPaddle.y, this.rightPaddle.width, this.rightPaddle.height);

    // Draw ball
    this.ctx.fillStyle = this.config.colors.secondary;
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw scores
    this.ctx.fillStyle = this.config.colors.text;
    this.ctx.font = `${this.config.typography.fontSize.large * 2}px ${this.config.typography.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(String(this.player1Score), rect.width / 4, 60);
    this.ctx.fillText(String(this.player2Score), (rect.width * 3) / 4, 60);

    // Draw game mode indicator
    this.ctx.font = `${this.config.typography.fontSize.small}px ${this.config.typography.fontFamily}`;
    this.ctx.fillText(this.gameMode === 'pvai' ? 'Player vs AI' : 'Player vs Player', rect.width / 2, rect.height - 20);
  }

  protected cleanup(): void {
    this.removeControls();
  }

  protected getCurrentState(): PongGameState {
    return {
      score: {
        player1: this.player1Score,
        player2: this.player2Score,
      },
      ballSpeed: this.ball.speed,
      gameMode: this.gameMode,
    };
  }

  // Helper methods

  private createPaddle(x: number, y: number): Paddle {
    return {
      x,
      y,
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

  private resetBall(towardsPlayer?: 1 | 2): void {
    this.ball.x = this.canvasWidth / 2;
    this.ball.y = this.canvasHeight / 2;
    this.ball.speed = this.INITIAL_BALL_SPEED;

    // Random angle between -45 and 45 degrees
    const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4);
    
    // Direction based on who scored (or random if not specified)
    const direction = towardsPlayer === 1 ? -1 : towardsPlayer === 2 ? 1 : Math.random() < 0.5 ? -1 : 1;
    
    this.ball.vx = Math.cos(angle) * direction;
    this.ball.vy = Math.sin(angle);
  }

  private checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
    return (
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.x + ball.radius > paddle.x &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.y + ball.radius > paddle.y
    );
  }

  private updateAI(deltaTime: number): void {
    // Simple AI that follows ball
    const paddleCenter = this.rightPaddle.y + this.rightPaddle.height / 2;
    const ballY = this.ball.y;
    
    // Add reaction delay for difficulty
    const reactionZone = 15;
    if (Math.abs(paddleCenter - ballY) > reactionZone) {
      if (paddleCenter < ballY) {
        this.rightPaddle.y += this.PADDLE_SPEED * 0.7 * deltaTime; // AI is 70% speed
      } else {
        this.rightPaddle.y -= this.PADDLE_SPEED * 0.7 * deltaTime;
      }
    }
  }

  private handleScore(scorer: 'player1' | 'player2'): void {
    const scoreData: ScoreUpdateData = {
      timestamp: new Date().toISOString(),
      score: scorer === 'player1' ? this.player1Score : this.player2Score,
      delta: 1,
      playerName: scorer,
    };
    this.emit('scoreUpdate', scoreData);

    // Check for win
    if (this.player1Score >= this.WIN_SCORE || this.player2Score >= this.WIN_SCORE) {
      this.handleGameOver(scorer);
    } else {
      // Reset ball towards the player who got scored on
      this.resetBall(scorer === 'player1' ? 2 : 1);
    }
  }

  private handleGameOver(winner: 'player1' | 'player2'): void {
    this.stop();
    const gameOverData: GameOverData = {
      timestamp: new Date().toISOString(),
      reason: `${winner} wins!`,
      finalScore: winner === 'player1' ? this.player1Score : this.player2Score,
      playerName: winner,
    };
    this.emit('gameOver', gameOverData);
  }

  // Controls

  private keyDownHandler = (e: KeyboardEvent): void => {
    switch (e.key) {
      // Player 1 (left paddle)
      case 'w':
      case 'W':
        this.leftPaddleUp = true;
        e.preventDefault();
        break;
      case 's':
      case 'S':
        this.leftPaddleDown = true;
        e.preventDefault();
        break;

      // Player 2 (right paddle) - only in PvP mode
      case 'ArrowUp':
        this.rightPaddleUp = true;
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.rightPaddleDown = true;
        e.preventDefault();
        break;
    }
  };

  private keyUpHandler = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'w':
      case 'W':
        this.leftPaddleUp = false;
        break;
      case 's':
      case 'S':
        this.leftPaddleDown = false;
        break;
      case 'ArrowUp':
        this.rightPaddleUp = false;
        break;
      case 'ArrowDown':
        this.rightPaddleDown = false;
        break;
    }
  };

  private touchHandler = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) return;

    const rect = this.canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;
    const paddleY = touchY - this.PADDLE_HEIGHT / 2;

    // Touch left side = move left paddle
    if (touch.clientX - rect.left < rect.width / 2) {
      this.leftPaddle.y = Math.max(0, Math.min(this.canvasHeight - this.PADDLE_HEIGHT, paddleY));
    } else if (this.gameMode === 'pvp') {
      // Touch right side = move right paddle (PvP only)
      this.rightPaddle.y = Math.max(0, Math.min(this.canvasHeight - this.PADDLE_HEIGHT, paddleY));
    }
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
