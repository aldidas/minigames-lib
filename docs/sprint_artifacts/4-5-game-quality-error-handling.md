# Story 4.5: Game Quality & Error Handling

**Epic:** MVP Game Implementations  
**Story ID:** 4.5  
**Story Key:** 4-5-game-quality-error-handling  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want clear error messages and helpful warnings,  
So that I can quickly debug integration issues.

---

## Acceptance Criteria

### AC1: Clear Error Messages

**Given** all three MVP games are implemented  
**When** I enhance error handling  
**Then**:

- Clear error messages for common mistakes:
  - Missing canvas element: "Canvas element required for game initialization"
  - Invalid canvas: "Provided element is not a valid HTMLCanvasElement"
  - Canvas context unavailable: "Failed to get 2D rendering context from canvas"
- Helpful console warnings for non-critical issues
- Error messages include context and suggested fixes

### AC2: Input Validation

**Given** games accept configuration  
**When** I add input validation  
**Then**:

- Validate GameConfig partial merges
- Warn on invalid color formats
- Warn on invalid font sizes or speeds
- Defensive programming in all game logic

### AC3: Graceful Degradation

**Given** games run in various environments  
**When** I add graceful degradation  
**Then**:

- Handle missing requestAnimationFrame gracefully
- Handle touch events not supported
- Handle canvas resizing edge cases
- Games don't crash on unexpected input

---

## Tasks & Subtasks

### Task 1: Enhance BaseGame Error Handling

- [ ] Add validation in constructor
- [ ] Better error messages for canvas issues
- [ ] Add null checks for critical operations
- [ ] Handle edge cases in game loop

### Task 2: Add GameConfig Validation

- [ ] Validate color format (hex, rgb, etc.)
- [ ] Validate numeric ranges (speeds, sizes)
- [ ] Provide defaults for invalid values
- [ ] Console warnings for validation issues

### Task 3: Add Defensive Programming to Games

- [ ] Null/undefined checks in update loops
- [ ] Boundary validation for positions
- [ ] Safe array access
- [ ] Handle NaN/Infinity in calculations

### Task 4: Improve Developer Experience

- [ ] Add JSDoc comments for public APIs
- [ ] Clear function/parameter names
- [ ] Helpful error context
- [ ] Document edge cases

### Task 5: Testing & Validation

- [ ] Test with invalid inputs
- [ ] Test with missing canvas
- [ ] Test with bad config values
- [ ] Verify error messages are helpful

---

## Prerequisites

**Story 4.1-4.4:** All MVP games implemented - DONE ✅

---

## Dependencies

**Blocks:**

- Epic 5 documentation
- Production readiness

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **FR36**: Clear, actionable error messages
- **FR37**: Helpful warnings for misconfigurations
- Developer experience is key for library adoption

### Error Message Examples

```typescript
// Good error messages
throw new Error(
  "Canvas element required for game initialization. Please provide a valid HTMLCanvasElement."
);

// Bad error messages
throw new Error("Invalid canvas");

// Console warnings
if (config.colors?.primary && !isValidColor(config.colors.primary)) {
  console.warn(
    `Invalid primary color "${config.colors.primary}". Using default color instead.`
  );
}
```

### BaseGame Enhancements

```typescript
constructor(canvas: HTMLCanvasElement, config?: Partial<GameConfig>) {
  super();

  // Validate canvas
  if (!canvas) {
    throw new Error('Canvas element required for game initialization. Please provide a valid HTMLCanvasElement as the first argument.');
  }

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Provided element is not a valid HTMLCanvasElement. Ensure you are passing a <canvas> element.');
  }

  this.canvas = canvas;

  // Get context with validation
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D rendering context from canvas. This may occur if canvas is already using a different context type.');
  }
  this.ctx = ctx;

  // Merge and validate config
  this.config = this.validateAndMergeConfig(config);

  // Setup canvas
  this.setupCanvas();
}

private validateAndMergeConfig(userConfig?: Partial<GameConfig>): GameConfig {
  const config = mergeConfig(userConfig);

  // Validate colors
  if (userConfig?.colors?.primary && !this.isValidColor(userConfig.colors.primary)) {
    console.warn(`Invalid primary color "${userConfig.colors.primary}". Using default.`);
  }

  // Validate numeric values
  if (userConfig?.animation?.fps && (userConfig.animation.fps < 1 || userConfig.animation.fps > 144)) {
    console.warn(`FPS ${userConfig.animation.fps} out of range (1-144). Using default.`);
  }

  return config;
}
```

### Defensive Programming Examples

```typescript
// Safe array access
const head = this.snake[0];
if (!head) {
  console.error("Snake has no segments. Resetting game.");
  this.resetGame();
  return;
}

// Boundary validation
if (isNaN(this.ball.x) || isNaN(this.ball.y)) {
  console.error("Ball position became NaN. Resetting ball.");
  this.resetBall();
  return;
}

// Safe division
const hitPos =
  this.paddle.width > 0
    ? (this.ball.x - this.paddle.x) / this.paddle.width
    : 0.5;
```

---

## Definition of Done

- [ ] BaseGame has input validation and clear errors
- [ ] GameConfig validation with helpful warnings
- [ ] All games have defensive programming
- [ ] Error messages tested and verified helpful
- [ ] Console warnings for common mistakes
- [ ] No crashes on invalid input
- [ ] JSDoc comments added to public APIs
- [ ] Git commit with quality improvements

---

## Related FRs

- **FR36**: Clear, actionable error messages
- **FR37**: Helpful warnings for common misconfigurations
- General code quality and maintainability

---

## Dev Notes

### Error Handling Strategy

**Throw errors for:**

- Missing required parameters (canvas)
- Invalid types that prevent functionality
- Critical failures that can't be recovered

**Console warnings for:**

- Invalid config values (use defaults)
- Non-critical issues
- Deprecation notices
- Performance warnings

**Silent fallbacks for:**

- Missing optional features
- Cosmetic issues
- User preference variations

### Testing Approach

Create test cases for:

1. Missing canvas element
2. Invalid canvas type
3. Invalid color formats
4. Out-of-range numeric values
5. NaN/Infinity in game state
6. Empty arrays in game logic

### Developer Experience

Good error messages include:

- **What went wrong**: Clear description
- **Why it's a problem**: Context
- **How to fix**: Actionable suggestion

Example:

```
Error: Canvas element required for game initialization.
Please provide a valid HTMLCanvasElement as the first argument.

Example:
const canvas = document.getElementById('game-canvas');
const game = new SnakeGame(canvas);
```

---

## Dev Agent Record

### Implementation Status

_To be filled by dev agent during implementation_

### Completion Notes

_To be filled by dev agent_

### Files Changed

_To be filled by dev agent_

---

## Change Log

| Date       | Version | Changes                | Author   |
| ---------- | ------- | ---------------------- | -------- |
| 2025-11-24 | 1.0     | Initial story creation | SM (Bob) |
