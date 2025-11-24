# @minigame/core

Core framework for building embeddable HTML5 arcade games. Provides base classes, event system, and TypeScript types for creating canvas-based games with consistent APIs.

## Installation

```bash
npm install @minigame/core
# or
pnpm add @minigame/core
# or
yarn add @minigame/core
```

## Quick Start

```typescript
import { BaseGame, type GameConfig } from "@minigame/core";

class MyGame extends BaseGame {
  protected init(): void {
    // Initialize game state
  }

  protected update(deltaTime: number): void {
    // Update game logic
  }

  protected render(): void {
    // Render game graphics
  }

  protected handleInput(event: KeyboardEvent | MouseEvent | TouchEvent): void {
    // Handle user input
  }

  protected cleanup(): void {
    // Clean up resources
  }
}

// Use your game
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const game = new MyGame(canvas);
game.start();
```

## Architecture Overview

The `@minigame/core` package provides:

- **BaseGame**: Abstract class that all games extend
- **Event System**: Emit and listen to game events (gameStarted, gameOver, scoreUpdate, etc.)
- **GameConfig**: Standardized configuration for colors, typography, styling, animation, and audio
- **Type Definitions**: Full TypeScript support with exported interfaces

### Design Principles

1. **Headless Architecture**: Games focus on logic and rendering; UI chrome is external
2. **Event-Driven**: Games emit events for state changes; host apps subscribe
3. **Consistent API**: All games share the same control methods and event types
4. **TypeScript-First**: Full type safety with zero `any` in public APIs

## BaseGame API

### Constructor

```typescript
constructor(canvas: HTMLCanvasElement, config?: Partial<GameConfig>)
```

Creates a new game instance.

**Parameters:**

- `canvas`: HTMLCanvasElement - The canvas element to render to
- `config`: Partial\<GameConfig\> - Optional configuration (merged with defaults)

**Throws:**

- Error if canvas is null, not an HTMLCanvasElement, or doesn't support 2D context

**Example:**

```typescript
const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = new MyGame(canvas, {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
  },
});
```

### Control Methods

#### `start(): void`

Starts or resumes the game loop. Emits `gameStarted` event.

```typescript
game.start();
```

#### `stop(): void`

Stops the game loop and cleans up resources.

```typescript
game.stop();
```

#### `pause(): void`

Pauses the game loop without cleanup.

```typescript
game.pause();
```

#### `resume(): void`

Resumes a paused game.

```typescript
game.resume();
```

#### `mute(): void`

Mutes all game audio. Emits `soundMuted` event.

```typescript
game.mute();
```

#### `unmute(): void`

Unmutes game audio. Emits `soundUnmuted` event.

```typescript
game.unmute();
```

#### `setPlayerName(name: string): void`

Sets the player name for event payloads.

```typescript
game.setPlayerName("Alice");
```

#### `getGameState(): GameState`

Returns current game state snapshot.

```typescript
const state = game.getGameState();
console.log(state.status); // 'idle' | 'running' | 'paused' | 'gameOver'
```

### Event Methods

#### `on(eventName: string, callback: EventCallback): void`

Registers an event listener.

```typescript
game.on("gameOver", (data) => {
  console.log("Game Over!", data.finalScore);
});
```

#### `off(eventName: string, callback: EventCallback): void`

Removes an event listener.

```typescript
const handler = (data) => console.log(data);
game.on("scoreUpdate", handler);
game.off("scoreUpdate", handler);
```

## Event System

### Standard Events

All games emit these events:

| Event          | Payload Type                                 | Description                              |
| -------------- | -------------------------------------------- | ---------------------------------------- |
| `gameStarted`  | `{ timestamp: string; playerName?: string }` | Emitted when game starts                 |
| `gameOver`     | `GameOverData`                               | Emitted when player loses/fails          |
| `scoreUpdate`  | `ScoreUpdateData`                            | Emitted when score changes               |
| `gameFinished` | `{ timestamp: string; playerName?: string }` | Emitted when game completes successfully |
| `soundMuted`   | `{ timestamp: string }`                      | Emitted when audio is muted              |
| `soundUnmuted` | `{ timestamp: string }`                      | Emitted when audio is unmuted            |

### Event Payload Types

#### GameOverData

```typescript
interface GameOverData {
  timestamp: string;
  reason: string;
  finalScore: number;
  playerName?: string;
}
```

#### ScoreUpdateData

```typescript
interface ScoreUpdateData {
  timestamp: string;
  score: number;
  delta: number;
  playerName?: string;
}
```

### Event Handling Examples

**TypeScript:**

```typescript
import {
  MyGame,
  type GameOverData,
  type ScoreUpdateData,
} from "@minigame/my-game";

const game = new MyGame(canvas);

game.on("gameStarted", (data) => {
  console.log("Game started at:", data.timestamp);
});

game.on("scoreUpdate", (data: ScoreUpdateData) => {
  console.log(`Score: ${data.score} (+${data.delta})`);
});

game.on("gameOver", (data: GameOverData) => {
  alert(`Game Over! Final Score: ${data.finalScore}`);
});

game.start();
```

**JavaScript:**

```javascript
const game = new MyGame(canvas);

game.on("gameOver", (data) => {
  console.log("Game Over!", data.finalScore);
});

game.on("scoreUpdate", (data) => {
  document.getElementById("score").textContent = data.score;
});

game.start();
```

## GameConfig

### Interface

```typescript
interface GameConfig {
  colors: {
    primary: string; // Main game color (default: '#3b82f6')
    secondary: string; // Accent color (default: '#8b5cf6')
    background: string; // Background color (default: '#1f2937')
    text: string; // Text color (default: '#f9fafb')
  };
  typography: {
    fontFamily: string; // Font family (default: 'Arial, sans-serif')
    fontSize: {
      small: number; // Small text (default: 14)
      medium: number; // Medium text (default: 18)
      large: number; // Large text (default: 24)
    };
  };
  styling: {
    borderRadius: number; // Border radius in px (default: 4)
    borderWidth: number; // Border width in px (default: 2)
    shadowBlur: number; // Shadow blur in px (default: 10)
  };
  animation: {
    speed: number; // Animation speed multiplier (default: 1.0)
  };
  audio: {
    volume: number; // Volume 0.0 - 1.0 (default: 0.5)
    muted: boolean; // Muted state (default: false)
  };
}
```

### Customization Examples

**TypeScript:**

```typescript
import { MyGame, type GameConfig } from "@minigame/my-game";

const config: Partial<GameConfig> = {
  colors: {
    primary: "#10b981", // Green
    secondary: "#f59e0b", // Amber
    background: "#111827", // Dark gray
    text: "#ffffff", // White
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
    },
  },
  animation: {
    speed: 1.5, // 50% faster
  },
  audio: {
    volume: 0.7,
    muted: false,
  },
};

const game = new MyGame(canvas, config);
```

**JavaScript:**

```javascript
const game = new MyGame(canvas, {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
  },
  audio: {
    volume: 0.3,
    muted: true,
  },
});
```

## Extending BaseGame

Create custom games by extending `BaseGame` and implementing abstract methods:

```typescript
import { BaseGame, type GameConfig } from "@minigame/core";

export class CustomGame extends BaseGame {
  private gameState: {
    // Your game state
  };

  /**
   * Initialize game state
   * Called once when game is created
   */
  protected init(): void {
    this.gameState = {
      // Initialize state
    };
  }

  /**
   * Update game logic
   * Called every frame
   * @param deltaTime Time since last frame in milliseconds
   */
  protected update(deltaTime: number): void {
    // Update game logic
    // Example: move objects, check collisions, update score
  }

  /**
   * Render game graphics
   * Called every frame after update
   */
  protected render(): void {
    // Clear canvas
    this.ctx.fillStyle = this.config.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw game objects
    // Use this.ctx for 2D rendering context
    // Use this.config for colors, fonts, etc.
  }

  /**
   * Handle user input
   * @param event Keyboard, Mouse, or Touch event
   */
  protected handleInput(event: KeyboardEvent | MouseEvent | TouchEvent): void {
    if (event instanceof KeyboardEvent) {
      // Handle keyboard
    } else if (event instanceof MouseEvent) {
      // Handle mouse
    } else if (event instanceof TouchEvent) {
      // Handle touch
    }
  }

  /**
   * Clean up resources
   * Called when game is stopped
   */
  protected cleanup(): void {
    // Remove event listeners, clear timers, etc.
  }
}
```

### Emitting Custom Events

```typescript
// Emit score update
this.emit("scoreUpdate", {
  timestamp: new Date().toISOString(),
  score: this.gameState.score,
  delta: points,
  playerName: this.playerName,
});

// Emit game over
this.emit("gameOver", {
  timestamp: new Date().toISOString(),
  reason: "collision",
  finalScore: this.gameState.score,
  playerName: this.playerName,
});
```

## Browser Support

| Browser       | Minimum Version   | Notes                     |
| ------------- | ----------------- | ------------------------- |
| Chrome        | Latest 2 versions | ✅ Fully supported        |
| Firefox       | Latest 2 versions | ✅ Fully supported        |
| Safari        | Latest 2 versions | ✅ Fully supported        |
| Edge          | Latest 2 versions | ✅ Fully supported        |
| Mobile Safari | iOS 14+           | ✅ Touch events supported |
| Mobile Chrome | Android 11+       | ✅ Touch events supported |

**Not Supported:**

- Internet Explorer (all versions)
- Browsers older than 2 major versions
- Opera Mini (limited canvas support)

### Requirements

- Canvas API support
- ES2020 JavaScript features
- TypeScript 5.0+ (for TypeScript projects)

## Troubleshooting

### Canvas Not Rendering

**Problem:** Canvas is blank or game doesn't appear

**Solutions:**

1. Check canvas element exists in DOM:

   ```javascript
   const canvas = document.getElementById("game");
   if (!canvas) {
     console.error("Canvas not found!");
   }
   ```

2. Verify canvas has dimensions:

   ```html
   <canvas id="game" width="600" height="600"></canvas>
   ```

   Or via CSS:

   ```css
   #game {
     width: 600px;
     height: 600px;
   }
   ```

3. Check console for errors - BaseGame validates canvas and throws descriptive errors

### Events Not Firing

**Problem:** Event callbacks not being called

**Solutions:**

1. Register events before calling `start()`:

   ```javascript
   game.on("gameOver", handleGameOver);
   game.start(); // ✅ Correct order
   ```

2. Check event names match exactly (case-sensitive):

   ```javascript
   game.on("gameOver", handler); // ✅ Correct
   game.on("gameover", handler); // ❌ Wrong case
   ```

3. Ensure callback is a function:
   ```javascript
   game.on("scoreUpdate", (data) => console.log(data)); // ✅ Correct
   ```

### Performance Issues

**Problem:** Game runs slowly or choppy

**Solutions:**

1. Reduce animation speed:

   ```javascript
   const game = new MyGame(canvas, {
     animation: { speed: 0.8 }, // 20% slower
   });
   ```

2. Check browser DevTools Performance tab for bottlenecks

3. Ensure canvas size isn't too large:
   ```javascript
   // Recommended: 600x600 or smaller for best performance
   ```

### TypeScript Errors

**Problem:** Type errors when using the library

**Solutions:**

1. Ensure TypeScript 5.0+:

   ```bash
   npm install -D typescript@latest
   ```

2. Import types correctly:

   ```typescript
   import type { GameConfig, GameOverData } from "@minigame/core";
   ```

3. Enable strict mode in tsconfig.json:
   ```json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

## Examples

See the official game packages for complete implementations:

- [@minigame/snake](https://www.npmjs.com/package/@minigame/snake)
- [@minigame/pong](https://www.npmjs.com/package/@minigame/pong)
- [@minigame/breakout](https://www.npmjs.com/package/@minigame/breakout)

## Framework Wrappers

Use games with your favorite framework:

- **React:** [@minigame/react](https://www.npmjs.com/package/@minigame/react) - React 18+ component wrappers
- **Vue:** [@minigame/vue](https://www.npmjs.com/package/@minigame/vue) - Vue 3+ component wrappers

## License

MIT
