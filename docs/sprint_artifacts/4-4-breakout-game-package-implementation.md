# Story 4.4: Breakout Game Package & Implementation

**Epic:** MVP Game Implementations  
**Story ID:** 4.4  
**Story Key:** 4-4-breakout-game-package-implementation  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a player,  
I want to play the classic Breakout game,  
So that I can break bricks with a paddle and ball.

---

## Acceptance Criteria

### AC1: Package Setup

**Given** Pong game is complete  
**When** I create breakout package  
**Then**:

- packages/breakout/ directory structure created
- package.json with name: "@minigame/breakout", dependencies: "@minigame/core": "workspace:^"
- tsconfig.json extends root, references core
- tsup.config.ts with globalName: "MinigameBreakout"
- Zero runtime dependencies beyond core

### AC2: Core Game Mechanics

**Given** package setup complete  
**When** I implement BreakoutGame class  
**Then**:

- BreakoutGame extends BaseGame<BreakoutGameState>
- Classic breakout mechanics (FR27):
  - Grid of destructible bricks at top
  - Paddle at bottom controlled by player
  - Ball bounces off paddle, walls, and bricks
  - Bricks destroy on contact
  - Score increases with each brick destroyed
- Lives system (start with 3 lives)
- Ball respawns when lost
- All bricks destroyed = level complete

### AC3: Controls and Rendering

**Given** game mechanics work  
**When** I implement controls and rendering  
**Then**:

- Keyboard controls: Arrow Left/Right or A/D keys
- Touch controls for mobile (touch/drag or tap zones)
- Canvas rendering with GameConfig colors
- Different brick colors or types
- All events emitted correctly (FR9-FR13)
- 60fps performance (FR30)
- Mobile compatibility (FR29, FR31)

---

## Tasks & Subtasks

### Task 1: Create Package Structure

- [ ] Create packages/breakout/ directory
- [ ] Create packages/breakout/src/ directory
- [ ] Create package.json with @minigame/core dependency
- [ ] Create tsconfig.json
- [ ] Create tsup.config.ts

### Task 2: Define Game State and Types

- [ ] Create BreakoutGameState interface
- [ ] Define brick, paddle, ball, and lives properties
- [ ] Add brick types (optional: different strengths/colors)

### Task 3: Implement Core Game Logic

- [ ] Create BreakoutGame class extending BaseGame
- [ ] Implement init() - initialize paddle, ball, bricks, lives
- [ ] Implement update() - ball physics, collision detection
- [ ] Implement brick collision and destruction
- [ ] Implement lives system and ball respawn

### Task 4: Implement Ball Physics

- [ ] Ball movement with velocity
- [ ] Bounce off paddle (angle based on hit position)
- [ ] Bounce off walls (top, left, right)
- [ ] Bounce off bricks
- [ ] Ball lost detection (bottom boundary)

### Task 5: Implement Brick System

- [ ] Create brick grid (e.g., 8 columns x 6 rows)
- [ ] Different brick colors for visual appeal
- [ ] Brick destruction on collision
- [ ] Score calculation based on bricks destroyed
- [ ] Level complete detection (all bricks gone)

### Task 6: Implement Controls

- [ ] Keyboard controls (Arrow Left/Right, A/D)
- [ ] Touch controls (drag or tap zones)
- [ ] Paddle movement constraints (stay in bounds)

### Task 7: Implement Rendering

- [ ] Draw bricks using config colors
- [ ] Draw paddle
- [ ] Draw ball
- [ ] Draw score and lives display
- [ ] Draw level complete message

### Task 8: Build and Test

- [ ] Build package
- [ ] Create test HTML file
- [ ] Test gameplay
- [ ] Test controls
- [ ] Verify events

---

## Prerequisites

**Story 4.1: Snake Game Package Setup** - DONE ✅  
**Story 4.2: Snake Game Implementation** - DONE ✅  
**Story 4.3: Pong Game Package & Implementation** - DONE ✅

---

## Dependencies

**Blocks:**

- Publishing @minigame/breakout
- Epic 5 documentation

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **FR27**: Classic breakout brick-breaking mechanics
- **FR28-FR31**: Browser and performance requirements
- **FR43**: Published as @minigame/breakout

### Game State Design

```typescript
interface BreakoutGameState {
  score: number;
  lives: number;
  level: number;
  bricksRemaining: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean; // false when destroyed
  color: string;
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
  vx: number;
  vy: number;
  speed: number;
}
```

### Brick Grid Setup

```typescript
private createBricks(): Brick[] {
  const bricks: Brick[] = [];
  const rows = 6;
  const cols = 8;
  const brickWidth = (canvasWidth - padding) / cols;
  const brickHeight = 20;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      bricks.push({
        x: col * brickWidth + padding,
        y: row * brickHeight + topOffset,
        width: brickWidth - 2, // 2px gap
        height: brickHeight - 2,
        active: true,
        color: colors[row]
      });
    }
  }

  return bricks;
}
```

### Ball-Brick Collision

```typescript
// Check collision with bricks
for (const brick of this.bricks) {
  if (!brick.active) continue;

  if (this.checkBrickCollision(this.ball, brick)) {
    brick.active = false;
    this.score += 10;
    this.bricksRemaining--;

    // Reverse ball Y velocity (simple bounce)
    this.ball.vy *= -1;

    // Emit score update
    this.emit("scoreUpdate", { score: this.score, delta: 10 });

    // Check level complete
    if (this.bricksRemaining === 0) {
      this.handleLevelComplete();
    }

    break; // Only one brick per frame
  }
}
```

### Lives System

```typescript
// Ball lost (went below paddle)
if (this.ball.y > this.canvasHeight) {
  this.lives--;

  if (this.lives <= 0) {
    this.handleGameOver("No lives remaining");
  } else {
    this.resetBall();
    // Optional: pause briefly before respawn
  }
}
```

---

## Definition of Done

- [ ] packages/breakout/ package structure created
- [ ] BreakoutGame class implemented
- [ ] Classic breakout mechanics working
- [ ] Brick grid with destruction
- [ ] Ball physics and collision detection
- [ ] Lives system (3 lives)
- [ ] Keyboard and touch controls
- [ ] Canvas rendering with GameConfig
- [ ] All events emitted
- [ ] 60fps performance
- [ ] Test HTML file created
- [ ] Game tested and playable
- [ ] Git commit with breakout implementation

---

## Related FRs

- **FR9-FR13**: Event emissions
- **FR18-FR24**: UI customization
- **FR27**: Classic breakout brick-breaking mechanics
- **FR28**: Browser compatibility
- **FR29**: Mobile browser support
- **FR30**: 60fps target
- **FR31**: 3-year-old device support
- **FR43**: Published as @minigame/breakout

---

## Dev Notes

### Breakout Game Design

Classic Breakout rules:

1. Grid of bricks at top of screen
2. Paddle at bottom controlled by player
3. Ball bounces off paddle, walls, and bricks
4. Brick destroyed on contact
5. Score increases with each brick
6. 3 lives - lose life when ball goes below paddle
7. All bricks destroyed = level complete
8. Game over when no lives remain

### Physics Considerations

- **Paddle bounce**: Ball angle depends on where it hits paddle (like Pong)
- **Wall bounce**: Simple reflection (vx or vy \*= -1)
- **Brick bounce**: Typically just reverse vy for simplicity
- **Ball speed**: Can increase slightly over time for difficulty

### Visual Design

- **Brick colors**: Rainbow pattern (red, orange, yellow, green, blue, purple)
- **Paddle**: Primary color from config
- **Ball**: Secondary color from config
- **Lives indicator**: Hearts or circles

### Optional Enhancements

- Power-ups (multi-ball, wider paddle, etc.) - future story
- Different brick types (2-hit bricks) - future story
- Multiple levels - current story: single level, all bricks destroyed = win

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
