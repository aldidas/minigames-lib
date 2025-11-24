# Story 4.3: Pong Game Package & Implementation

**Epic:** MVP Game Implementations  
**Story ID:** 4.3  
**Story Key:** 4-3-pong-game-package-implementation  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a player,  
I want to play the classic Pong game,  
So that I can enjoy competitive paddle-and-ball gameplay.

---

## Acceptance Criteria

### AC1: Package Setup

**Given** Snake game is complete  
**When** I create pong package  
**Then**:

- packages/pong/ directory structure created
- package.json with name: "@minigame/pong", dependencies: "@minigame/core": "workspace:^"
- tsconfig.json extends root, references core
- tsup.config.ts with globalName: "MinigamePong"
- Zero runtime dependencies beyond core

### AC2: Core Game Mechanics

**Given** package setup complete  
**When** I implement PongGame class  
**Then**:

- PongGame extends BaseGame<PongGameState>
- Classic pong mechanics (FR26):
  - Two paddles (left and right)
  - Ball bounces off paddles and top/bottom walls
  - Score increments when ball passes paddle
  - AI opponent with basic difficulty
- Game modes: Player vs AI, Player vs Player
- Ball speed increases after each paddle hit
- First to score X points wins

### AC3: Controls and Rendering

**Given** game mechanics work  
**When** I implement controls and rendering  
**Then**:

- Keyboard controls:
  - Player 1 (left paddle): W/S keys
  - Player 2 (right paddle): Arrow Up/Down keys
- Touch controls for mobile (tap left/right side of screen)
- Canvas rendering with GameConfig colors
- All events emitted correctly (FR9-FR13)
- 60fps performance (FR30)
- Mobile compatibility (FR29, FR31)

---

## Tasks & Subtasks

### Task 1: Create Package Structure

- [ ] Create packages/pong/ directory
- [ ] Create packages/pong/src/ directory
- [ ] Create package.json with @minigame/core dependency
- [ ] Create tsconfig.json
- [ ] Create tsup.config.ts

### Task 2: Define Game State and Types

- [ ] Create PongGameState interface
- [ ] Define paddle, ball, and score properties
- [ ] Add game mode type (PvAI, PvP)

### Task 3: Implement Core Game Logic

- [ ] Create PongGame class extending BaseGame
- [ ] Implement init() - initialize paddles and ball
- [ ] Implement update() - ball physics, paddle movement, AI
- [ ]Implement collision detection (ball-paddle, ball-walls)
- [ ] Implement scoring logic

### Task 4: Implement AI Opponent

- [ ] Basic AI that follows ball Y position
- [ ] Add reaction delay for difficulty
- [ ] Configurable AI speed

### Task 5: Implement Controls

- [ ] Keyboard controls (W/S, Up/Down)
- [ ] Touch controls (tap zones)
- [ ] Paddle movement constraints (stay in bounds)

### Task 6: Implement Rendering

- [ ] Draw paddles using config colors
- [ ] Draw ball
- [ ] Draw center line
- [ ] Draw scores
- [ ] Draw win/lose message

### Task 7: Build and Test

- [ ] Build package
- [ ] Create test HTML file
- [ ] Test gameplay
- [ ] Test controls
- [ ] Verify events

---

## Prerequisites

**Story 4.1: Snake Game Package Setup** - DONE ✅  
**Story 4.2: Snake Game Implementation** - DONE ✅

---

## Dependencies

**Blocks:**

- Publishing @minigame/pong
- Epic 5 documentation

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **FR26**: Classic paddle-and-ball mechanics
- **FR28-FR31**: Browser and performance requirements
- **FR43**: Published as @minigame/pong

### Game State Design

```typescript
interface PongGameState {
  score: { player1: number; player2: number };
  ballSpeed: number;
  gameMode: "pvai" | "pvp";
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  vx: number; // velocity x
  vy: number; // velocity y
  speed: number;
}
```

### Ball Physics

```typescript
// Update ball position
ball.x += ball.vx * deltaTime * ball.speed;
ball.y += ball.vy * deltaTime * ball.speed;

// Bounce off top/bottom walls
if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight) {
  ball.vy *= -1;
}

// Paddle collision
if (ballHitsPaddle(ball, paddle)) {
  ball.vx *= -1;
  ball.speed *= 1.05; // Increase speed 5%

  // Angle based on where ball hits paddle
  const hitPos = (ball.y - paddle.y) / paddle.height; // 0-1
  ball.vy = (hitPos - 0.5) * 2; // -1 to 1
}

// Score point
if (ball.x < 0) {
  player2Score++;
  resetBall();
} else if (ball.x > canvasWidth) {
  player1Score++;
  resetBall();
}
```

### AI Logic

```typescript
// Simple AI that follows ball
private updateAI(deltaTime: number): void {
  const paddleCenter = this.rightPaddle.y + this.rightPaddle.height / 2;
  const ballY = this.ball.y;

  // Add reaction delay
  if (Math.abs(paddleCenter - ballY) > 10) {
    if (paddleCenter < ballY) {
      this.rightPaddle.y += this.rightPaddle.speed * deltaTime;
    } else {
      this.rightPaddle.y -= this.rightPaddle.speed * deltaTime;
    }
  }

  // Keep paddle in bounds
  this.rightPaddle.y = Math.max(0, Math.min(
    canvasHeight - this.rightPaddle.height,
    this.rightPaddle.y
  ));
}
```

---

## Definition of Done

- [ ] packages/pong/ package structure created
- [ ] PongGame class implemented
- [ ] Classic pong mechanics working
- [ ] Player vs AI mode functional
- [ ] Ball physics and collision detection
- [ ] Keyboard and touch controls
- [ ] Canvas rendering with GameConfig
- [ ] All events emitted
- [ ] 60fps performance
- [ ] Test HTML file created
- [ ] Game tested and playable
- [ ] Git commit with pong implementation

---

## Related FRs

- **FR9-FR13**: Event emissions
- **FR18-FR24**: UI customization
- **FR26**: Classic paddle-and-ball mechanics
- **FR28**: Browser compatibility
- **FR29**: Mobile browser support
- **FR30**: 60fps target
- **FR31**: 3-year-old device support
- **FR43**: Published as @minigame/pong

---

## Dev Notes

### Pong Game Design

Classic Pong rules:

1. Two paddles (left and right side)
2. Ball bounces off paddles and top/bottom walls
3. Ball passes paddle = point for opponent
4. First to X points wins (e.g., 11 points)
5. Ball speed increases with each paddle hit
6. Serve alternates after each point

### Physics Considerations

- **Ball velocity**: Normalize velocity vector for consistent speed
- **Paddle hit angle**: Ball angle depends on where it hits paddle
- **Speed increase**: Gradual speed increase keeps game challenging
- **Max speed**: Cap ball speed to keep game playable

### Controls

- **Keyboard**: W/S for left paddle, Up/Down for right paddle
- **Touch**: Tap top/bottom half of screen to move paddle
- **AI**: Follows ball with slight delay for difficulty

### Next Steps

After implementation, games can be tested together to ensure:

- Consistent UX across games
- Similar control schemes
- Event system working uniformly

---

## Dev Agent Record

### Implementation Status

_To be filled by dev agent during implementation_

### Completion Notes

_To be filled by dev agent_

### Debug Log

_To be filled by dev agent if issues encountered_

### Files Changed

_To be filled by dev agent_

---

## Change Log

| Date       | Version | Changes                | Author   |
| ---------- | ------- | ---------------------- | -------- |
| 2025-11-24 | 1.0     | Initial story creation | SM (Bob) |
