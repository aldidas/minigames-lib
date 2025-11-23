# Story 2.4: BaseGame Abstract Class

**Epic:** Core Package - Game Framework  
**Story ID:** 2.4  
**Story Key:** 2-4-basegame-abstract-class  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a game developer,  
I want an abstract BaseGame class with uniform API methods,  
So that all games implement the same interface and developers have a consistent API.

---

## Acceptance Criteria

### AC1: BaseGame Class Structure

**Given** EventEmitter and types exist  
**When** I implement BaseGame abstract class  
**Then**:

- src/BaseGame.ts exists
- Abstract class BaseGame<TState = any> extends EventEmitter
- Generic TState allows game-specific state typing
- Protected properties: canvas, ctx, gameState, playerName, config
- Constructor accepts canvas element and optional config
- Canvas context initialization with error handling

### AC2: Uniform API Methods

**Given** BaseGame class exists  
**When** I implement public API methods  
**Then**:

- start(): void (FR1)
- stop(): void (FR2)
- pause(): void (FR3)
- resume(): void (FR4)
- mute(): void (FR5)
- unmute(): void (FR6)
- setPlayerName(name: string): void (FR7)
- getGameState(): TState (FR8)
- All methods properly emit events

### AC3: Abstract Methods and Game Loop

**Given** BaseGame has uniform API  
**When** I define abstract methods  
**Then**:

- Abstract protected init(): void
- Abstract protected update(deltaTime: number): void
- Abstract protected render(): void
- Abstract protected cleanup(): void
- Game loop using requestAnimationFrame (60fps target, FR30)
- Delta time calculation for smooth animation
- Device pixel ratio support for high-DPI displays

---

## Tasks & Subtasks

### Task 1: Create BaseGame Class File

- [ ] Create src/BaseGame.ts
- [ ] Import EventEmitter and types
- [ ] Define abstract class BaseGame<TState> extends EventEmitter
- [ ] Add JSDoc class documentation

### Task 2: Implement Constructor and Properties

- [ ] Add protected canvas property
- [ ] Add protected ctx property (CanvasRenderingContext2D)
- [ ] Add protected gameState property (GameState)
- [ ] Add protected playerName property (string)
- [ ] Add protected config property (GameConfig)
- [ ] Implement constructor(canvas, config?)
- [ ] Initialize canvas context with DPI scaling

### Task 3: Implement Uniform API Methods

- [ ] Implement start() - starts game, emits gameStarted
- [ ] Implement stop() - stops game, emits gameFinished
- [ ] Implement pause() - pauses game loop
- [ ] Implement resume() - resumes game loop
- [ ] Implement mute() - mutes audio, emits soundMuted
- [ ] Implement unmute() - unmutes audio, emits soundUnmuted
- [ ] Implement setPlayerName(name)
- [ ] Implement getGameState()

### Task 4: Implement Game Loop

- [ ] Create private game loop method
- [ ] Use requestAnimationFrame
- [ ] Calculate delta time
- [ ] Call update(deltaTime)
- [ ] Call render()
- [ ] Handle pause state
- [ ] Target 60fps

### Task 5: Define Abstract Methods

- [ ] Declare abstract init()
- [ ] Declare abstract update(deltaTime)
- [ ] Declare abstract render()
- [ ] Declare abstract cleanup()
- [ ] Add JSDoc for each abstract method

---

## Prerequisites

**Story 2.1: Core Package Structure** - backlog  
**Story 2.2: TypeScript Type Definitions** - backlog  
**Story 2.3: Event Emitter Implementation** - backlog

---

## Dependencies

**Blocks:**

- Story 2.5: GameConfig Implementation
- All game implementations (Epic 4)

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 3**: BaseGame abstract class pattern
- **Decision 12**: Canvas & rendering architecture
- **FR1-FR8**: Uniform game control API enforced by base class
- **FR30**: 60fps target for smooth gameplay

### BaseGame Implementation Outline

```typescript
import { EventEmitter } from "./EventEmitter";
import type { GameState, GameConfig } from "./types";

/**
 * Abstract base class for all minigames
 * Provides uniform API and game loop implementation
 * @template TState - Game-specific state interface
 */
export abstract class BaseGame<TState = any> extends EventEmitter {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected gameState: GameState = "idle";
  protected playerName: string = "";
  protected config: GameConfig;

  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  constructor(canvas: HTMLCanvasElement, config?: Partial<GameConfig>) {
    super();
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.ctx = ctx;

    // Merge user config with defaults
    this.config = this.mergeConfig(config);

    // Setup high-DPI canvas
    this.setupCanvas();
  }

  // Uniform API Methods (FR1-FR8)

  public start(): void {
    if (this.gameState !== "idle" && this.gameState !== "finished") return;

    this.gameState = "running";
    this.init();
    this.emit("gameStarted", {
      timestamp: new Date().toISOString(),
      playerName: this.playerName,
    });
    this.startGameLoop();
  }

  public stop(): void {
    if (this.gameState === "idle" || this.gameState === "finished") return;

    this.stopGameLoop();
    this.cleanup();
    this.gameState = "finished";
    this.emit("gameFinished", {
      timestamp: new Date().toISOString(),
      playerName: this.playerName,
    });
  }

  public pause(): void {
    if (this.gameState !== "running") return;
    this.gameState = "paused";
    this.stopGameLoop();
  }

  public resume(): void {
    if (this.gameState !== "paused") return;
    this.gameState = "running";
    this.startGameLoop();
  }

  public mute(): void {
    this.config.audio.muted = true;
    this.emit("soundMuted", {
      timestamp: new Date().toISOString(),
    });
  }

  public unmute(): void {
    this.config.audio.muted = false;
    this.emit("soundUnmuted", {
      timestamp: new Date().toISOString(),
    });
  }

  public setPlayerName(name: string): void {
    this.playerName = name;
  }

  public getGameState(): TState {
    return this.getCurrentState();
  }

  // Abstract methods - MUST be implemented by games

  protected abstract init(): void;
  protected abstract update(deltaTime: number): void;
  protected abstract render(): void;
  protected abstract cleanup(): void;
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

    if (this.gameState === "running") {
      this.update(deltaTime);
      this.render();
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  // Helper methods

  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private mergeConfig(userConfig?: Partial<GameConfig>): GameConfig {
    // Deep merge with default config (implemented in Story 2.5)
    return { ...defaultGameConfig, ...userConfig } as GameConfig;
  }
}
```

---

## Definition of Done

- [ ] src/BaseGame.ts created
- [ ] BaseGame<TState> abstract class implemented
- [ ] All 8 uniform API methods implemented (FR1-FR8)
- [ ] Game loop with requestAnimationFrame
- [ ] Delta time calculation
- [ ] Abstract methods declared
- [ ] Event emissions working
- [ ] High-DPI canvas support
- [ ] Comprehensive JSDoc documentation
- [ ] TypeScript compiles without errors
- [ ] Export from src/index.ts
- [ ] Git commit with BaseGame implementation

---

## Related FRs

- **FR1**: start() method starts the game
- **FR2**: stop() method stops the game
- **FR3**: pause() method pauses the game
- **FR4**: resume() method resumes the game
- **FR5**: mute() method mutes audio
- **FR6**: unmute() method unmutes audio
- **FR7**: setPlayerName() method sets player name
- **FR8**: getGameState() method returns current state
- **FR30**: 60fps target for smooth gameplay

---

## Dev Notes

### Why Abstract Class?

Abstract class provides:

- **Contract enforcement**: Games MUST implement abstract methods
- **Code reuse**: Common game loop logic shared
- **Type safety**: Generic TState for game-specific state
- **Event system**: Inherited from EventEmitter

### Game Loop Design

requestAnimationFrame provides:

- **Smooth rendering**: Synced with browser refresh rate
- **Performance**: Automatic pause when tab inactive
- **Delta time**: Frame-rate independent movement

### High-DPI Support

Device pixel ratio scaling ensures:

- **Sharp rendering**: On retina and 4K displays
- **Correct sizing**: Logical vs physical pixels
- **Better UX**: Crisp graphics on modern screens

### Next Story Context

After this story, Story 2.5 will implement the GameConfig with default values and merge utilities that BaseGame constructor uses.

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
