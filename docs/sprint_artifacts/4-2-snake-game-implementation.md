# Story 4.2: Snake Game Implementation

**Epic:** MVP Game Implementations  
**Story ID:** 4.2  
**Story Key:** 4-2-snake-game-implementation  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a player,  
I want to play the classic Snake game,  
So that I can enjoy the nostalgic arcade experience in my browser.

---

## Acceptance Criteria

### AC1: Core Game Mechanics

**Given** snake package structure exists  
**When** I implement SnakeGame class  
**Then**:

- Snake grows when eating food (FR25)
- Game over on wall collision (FR25)
- Game over on self-collision (FR25)
- Score increases with each food eaten
- Snake moves continuously in current direction
- Food spawns at random positions

### AC2: Controls and Input

**Given** game mechanics work  
**When** I implement controls  
**Then**:

- Keyboard controls: Arrow keys or WASD
- Cannot reverse direction (e.g., can't go left when moving right)
- Touch controls for mobile (swipe directions)
- Smooth, responsive input handling

### AC3: Rendering and Events

**Given** game logic complete  
**When** I implement rendering and events  
**Then**:

- Renders using canvas 2D context
- Respects GameConfig colors and styling (FR18-FR24)
- Emits all required events at correct times (FR9-FR13)
- Achieves 60fps on desktop and mobile (FR30)
- Works on 3-year-old mobile devices (FR31)

---

## Tasks & Subtasks

### Task 1: Define Game State and Constants

- [ ] Add snake position array (segments)
- [ ] Add current direction
- [ ] Add food position
- [ ] Add score tracking
- [ ] Define grid size and cell size constants

### Task 2: Implement init() Method

- [ ] Initialize snake at center (3 segments)
- [ ] Set initial direction (right)
- [ ] Spawn first food
- [ ] Reset score to 0
- [ ] Clear any existing state

### Task 3: Implement update() Method

- [ ] Move snake based on direction
- [ ] Check wall collisions → game over
- [ ] Check self-collisions → game over
- [ ] Check food collision → grow snake, spawn new food
- [ ] Update score

### Task 4: Implement render() Method

- [ ] Clear canvas
- [ ] Draw game grid (optional)
- [ ] Draw snake segments using config colors
- [ ] Draw food using config colors
- [ ] Draw score

### Task 5: Implement Controls

- [ ] Add keyboard event listeners (arrows, WASD)
- [ ] Prevent reverse direction
- [ ] Add touch event listeners for mobile
- [ ] Detect swipe directions

### Task 6: Event Emissions

- [ ] Emit gameStarted on init
- [ ] Emit scoreUpdate when eating food
- [ ] Emit gameOver on collision
- [ ] Include proper event data

### Task 7: Testing

- [ ] Test on desktop browser
- [ ] Test keyboard controls
- [ ] Test touch controls on mobile
- [ ] Verify 60fps performance
- [ ] Test game over scenarios

---

## Prerequisites

**Story 4.1: Snake Game Package Setup** - DONE ✅

---

## Dependencies

**Blocks:**

- Publishing @minigame/snake
- User adoption of snake game

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **FR25**: Classic snake gameplay mechanics
- **FR28-FR31**: Browser support and performance requirements
- **Decision 12**: Canvas rendering with requestAnimationFrame
- **FR9-FR13**: Event emission requirements

### Game State Design

```typescript
interface Position {
  x: number;
  y: number;
}

class SnakeGame {
  private snake: Position[] = []; // Array of segments (head at [0])
  private direction: Position = { x: 1, y: 0 }; // Current direction
  private food: Position = { x: 0, y: 0 };
  private score: number = 0;

  private readonly GRID_SIZE = 20; // 20x20 grid
  private readonly MOVE_SPEED = 150; // ms between moves
  private timeSinceLastMove = 0;
}
```

### Snake Movement Logic

```typescript
update(deltaTime: number): void {
  this.timeSinceLastMove += deltaTime * 1000;

  if (this.timeSinceLastMove >= this.MOVE_SPEED) {
    this.timeSinceLastMove = 0;

    // Calculate new head position
    const head = this.snake[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
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
      this.spawnFood();
      this.emit('scoreUpdate', {
        timestamp: new Date().toISOString(),
        score: this.score,
        delta: 1
      });
    } else {
      // Remove tail (snake doesn't grow)
      this.snake.pop();
    }
  }
}
```

### Touch Controls

```typescript
private setupTouchControls(): void {
  let touchStartX = 0;
  let touchStartY = 0;

  this.canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  this.canvas.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Detect primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      this.changeDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      // Vertical swipe
      this.changeDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
  });
}
```

---

## Definition of Done

- [ ] Classic snake mechanics implemented
- [ ] Snake grows when eating food
- [ ] Game over on wall/self collision
- [ ] Keyboard controls (arrows, WASD) working
- [ ] Touch controls for mobile working
- [ ] Canvas rendering with GameConfig colors
- [ ] All events emitted correctly
- [ ] 60fps performance achieved
- [ ] Tested on desktop and mobile
- [ ] Git commit with snake implementation

---

## Related FRs

- **FR9-FR13**: Event emissions (gameStarted, gameOver, scoreUpdate)
- **FR18-FR24**: UI customization (colors, typography, styling)
- **FR25**: Classic snake gameplay mechanics
- **FR28**: Browser compatibility (Chrome, Firefox, Safari, Edge)
- **FR29**: Mobile browser support (iOS Safari, Chrome)
- **FR30**: 60fps target
- **FR31**: Works on 3-year-old mobile devices

---

## Dev Notes

### Snake Game Design

Classic Snake rules:

1. Snake starts with 3 segments
2. Moves continuously in one direction
3. Player changes direction with arrow keys
4. Eating food grows snake by 1 segment
5. Collision with walls = game over
6. Collision with self = game over
7. Score = number of food eaten

### Grid-Based Movement

Using a grid system (e.g., 20x20):

- Snake positions are grid coordinates
- Food spawns at random grid cell
- Collision detection is simple (compare coords)
- Rendering scales to canvas size

### Performance Optimization

- Use fixed time step for movement (e.g., 150ms)
- Clear only dirty regions if needed
- Keep snake array size reasonable
- Efficient collision checks (O(n) for snake length)

### Next Steps

After implementation, create a test HTML page to verify:

- Game plays correctly
- Controls responsive
- Visuals look good
- Performance smooth

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
