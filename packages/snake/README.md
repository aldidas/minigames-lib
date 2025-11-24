# @minigame/snake

Classic Snake game implementation with modern JavaScript/TypeScript support.

## Installation

```bash
# npm
npm install @minigame/core @minigame/snake

# pnpm
pnpm add @minigame/core @minigame/snake

# yarn
yarn add @minigame/core @minigame/snake
```

## Quick Start

```typescript
import { SnakeGame } from "@minigame/snake";

const canvas = document.getElementById("game-canvas");
const game = new SnakeGame(canvas);

game.setPlayerName("Player");
game.start();
```

That's it! Your Snake game is running in under 10 lines of code.

## Game Controls

| Platform    | Control        | Action                               |
| ----------- | -------------- | ------------------------------------ |
| **Desktop** | Arrow Keys     | Change snake direction (↑ ↓ ← →)     |
| **Desktop** | WASD Keys      | Alternative direction control        |
| **Mobile**  | Swipe Gestures | Swipe in any direction to move snake |

## API Reference

### Constructor

```typescript
new SnakeGame(canvas: HTMLCanvasElement, config?: GameConfig)
```

Creates a new Snake game instance.

**Parameters:**

- `canvas` - HTML canvas element for rendering
- `config` (optional) - Game configuration object

### Methods

#### Game Control Methods

```typescript
game.start(): void
```

Starts the game. Initializes the snake and starts the game loop.

```typescript
game.stop(): void
```

Stops the game completely. Resets to initial state.

```typescript
game.pause(): void
```

Pauses the game. Can be resumed later.

```typescript
game.resume(): void
```

Resumes a paused game.

#### Audio Methods

```typescript
game.mute(): void
```

Mutes all game sounds.

```typescript
game.unmute(): void
```

Unmutes game sounds.

#### Player Methods

```typescript
game.setPlayerName(name: string): void
```

Sets the player name for events and scoring.

#### State Methods

```typescript
game.getGameState(): SnakeGameState
```

Returns the current game state including score, snake position, and status.

**Returns:**

```typescript
{
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
  playerName: string;
  snake: Position[];
  food: Position;
}
```

## Event Handling

The Snake game emits events at key moments. Subscribe to events using the `.on()` method:

```typescript
import { SnakeGame } from "@minigame/snake";

const game = new SnakeGame(canvas);

// Game started event
game.on("gameStarted", (data) => {
  console.log("Game started!", data);
  // { timestamp: 1234567890, playerName: 'Player' }
});

// Score updated event
game.on("scoreUpdate", (data) => {
  console.log("Score:", data.score);
  // { score: 10, timestamp: 1234567890, playerName: 'Player' }
  document.getElementById("score").textContent = `Score: ${data.score}`;
});

// Game over event
game.on("gameOver", (data) => {
  console.log("Game Over!", data);
  // {
  //   reason: 'wall-collision' | 'self-collision',
  //   finalScore: 10,
  //   timestamp: 1234567890,
  //   playerName: 'Player'
  // }
  alert(`Game Over! Final Score: ${data.finalScore}`);
});

// Game finished event (when player stops the game)
game.on("gameFinished", (data) => {
  console.log("Game finished", data);
  // { finalScore: 10, duration: 60000, timestamp: 1234567890 }
});

// Sound muted/unmuted events
game.on("soundMuted", () => console.log("Sound muted"));
game.on("soundUnmuted", () => console.log("Sound unmuted"));
```

### Available Events

| Event          | Data                                            | Description                  |
| -------------- | ----------------------------------------------- | ---------------------------- |
| `gameStarted`  | `{ timestamp, playerName }`                     | Fired when game starts       |
| `scoreUpdate`  | `{ score, timestamp, playerName }`              | Fired when score changes     |
| `gameOver`     | `{ reason, finalScore, timestamp, playerName }` | Fired when game ends         |
| `gameFinished` | `{ finalScore, duration, timestamp }`           | Fired when player stops game |
| `soundMuted`   | `{ timestamp }`                                 | Fired when sound is muted    |
| `soundUnmuted` | `{ timestamp }`                                 | Fired when sound is unmuted  |

## Customization

Customize the game appearance and behavior using the `GameConfig` object:

### Colors

```typescript
const game = new SnakeGame(canvas, {
  colors: {
    primary: "#3b82f6", // Snake body color
    secondary: "#8b5cf6", // Accent color
    background: "#1f2937", // Canvas background
    text: "#f9fafb", // Text color
  },
});
```

### Typography

```typescript
const game = new SnakeGame(canvas, {
  fonts: {
    family: "Inter, system-ui, sans-serif",
    size: {
      small: 12,
      medium: 16,
      large: 24,
    },
  },
});
```

### Audio

```typescript
const game = new SnakeGame(canvas, {
  audio: {
    volume: 0.7, // 0.0 to 1.0
    muted: false,
  },
});
```

### Complete Customization Example

```typescript
const game = new SnakeGame(canvas, {
  colors: {
    primary: "#10b981",
    secondary: "#f59e0b",
    background: "#0f172a",
    text: "#f1f5f9",
  },
  fonts: {
    family: "Roboto, sans-serif",
    size: {
      small: 14,
      medium: 18,
      large: 28,
    },
  },
  audio: {
    volume: 0.5,
    muted: false,
  },
});
```

## TypeScript Usage

Full TypeScript support with exported types:

```typescript
import { SnakeGame } from "@minigame/snake";
import type {
  GameConfig,
  GameStartedData,
  ScoreUpdateData,
  GameOverData,
  GameFinishedData,
} from "@minigame/core";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

const config: GameConfig = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    background: "#1f2937",
    text: "#f9fafb",
  },
};

const game = new SnakeGame(canvas, config);

game.on("scoreUpdate", (data: ScoreUpdateData) => {
  console.log(`Score: ${data.score}`);
});

game.on("gameOver", (data: GameOverData) => {
  console.log(`Game Over! Reason: ${data.reason}`);
});

game.setPlayerName("TypeScript Player");
game.start();
```

## Integration Examples

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Snake Game</title>
  </head>
  <body>
    <div>
      <canvas id="game-canvas" width="600" height="600"></canvas>
      <div>Score: <span id="score">0</span></div>
      <button id="start">Start</button>
      <button id="pause">Pause</button>
      <button id="resume">Resume</button>
    </div>

    <script type="module">
      import { SnakeGame } from "@minigame/snake";

      const canvas = document.getElementById("game-canvas");
      const scoreEl = document.getElementById("score");

      const game = new SnakeGame(canvas);
      game.setPlayerName("Player");

      game.on("scoreUpdate", (data) => {
        scoreEl.textContent = data.score;
      });

      game.on("gameOver", (data) => {
        alert(`Game Over! Score: ${data.finalScore}`);
      });

      document.getElementById("start").onclick = () => game.start();
      document.getElementById("pause").onclick = () => game.pause();
      document.getElementById("resume").onclick = () => game.resume();
    </script>
  </body>
</html>
```

### React Component

```tsx
import { useEffect, useRef, useState } from "react";
import { SnakeGame } from "@minigame/snake";
import type { GameConfig } from "@minigame/core";

export function SnakeGameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<SnakeGame | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const config: GameConfig = {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        background: "#1f2937",
        text: "#f9fafb",
      },
    };

    const game = new SnakeGame(canvasRef.current, config);
    game.setPlayerName("React Player");

    game.on("scoreUpdate", (data) => {
      setScore(data.score);
    });

    game.on("gameOver", (data) => {
      alert(`Game Over! Final Score: ${data.finalScore}`);
    });

    gameRef.current = game;

    return () => {
      game.stop();
    };
  }, []);

  const handleStart = () => gameRef.current?.start();
  const handlePause = () => gameRef.current?.pause();
  const handleResume = () => gameRef.current?.resume();

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={600} />
      <div>Score: {score}</div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleResume}>Resume</button>
    </div>
  );
}
```

### Vue Component

```vue
<template>
  <div>
    <canvas ref="canvasRef" width="600" height="600"></canvas>
    <div>Score: {{ score }}</div>
    <button @click="handleStart">Start</button>
    <button @click="handlePause">Pause</button>
    <button @click="handleResume">Resume</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { SnakeGame } from "@minigame/snake";
import type { GameConfig } from "@minigame/core";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const score = ref(0);
let game: SnakeGame | null = null;

onMounted(() => {
  if (!canvasRef.value) return;

  const config: GameConfig = {
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      background: "#1f2937",
      text: "#f9fafb",
    },
  };

  game = new SnakeGame(canvasRef.value, config);
  game.setPlayerName("Vue Player");

  game.on("scoreUpdate", (data) => {
    score.value = data.score;
  });

  game.on("gameOver", (data) => {
    alert(`Game Over! Final Score: ${data.finalScore}`);
  });
});

onUnmounted(() => {
  game?.stop();
});

const handleStart = () => game?.start();
const handlePause = () => game?.pause();
const handleResume = () => game?.resume();
</script>
```

## Browser Support

| Browser | Desktop | Mobile |
| ------- | ------- | ------ |
| Chrome  | ✅ 90+  | ✅ 90+ |
| Firefox | ✅ 88+  | ✅ 88+ |
| Safari  | ✅ 14+  | ✅ 14+ |
| Edge    | ✅ 90+  | ✅ 90+ |

**Performance:** Runs at 60fps on desktop and modern mobile devices (last 3 years).

## Troubleshooting

### Canvas is blank / Game doesn't render

**Problem:** Canvas element not found or invalid.

**Solution:**

- Ensure canvas element exists before creating game instance
- Check canvas ID matches your HTML
- Verify canvas has width and height attributes

```typescript
// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game-canvas");
  if (canvas) {
    const game = new SnakeGame(canvas);
    game.start();
  }
});
```

### Game controls not working

**Problem:** Event listeners not attached or conflicting.

**Solution:**

- Ensure canvas has focus (click on it first)
- Check browser console for JavaScript errors
- Verify no other scripts are preventing default keyboard behavior

### Performance issues on mobile

**Problem:** Game runs slowly or stutters.

**Solution:**

- Reduce canvas size for mobile devices
- Ensure device is not in low power mode
- Close other browser tabs to free up resources

```typescript
// Responsive canvas sizing
const isMobile = window.innerWidth < 768;
const size = isMobile ? 400 : 600;
canvas.width = size;
canvas.height = size;
```

### Score not updating in UI

**Problem:** Event listener not properly subscribed.

**Solution:**

- Subscribe to `scoreUpdate` event before calling `start()`
- Verify callback function is updating the correct DOM element

```typescript
const game = new SnakeGame(canvas);

// Subscribe BEFORE starting
game.on("scoreUpdate", (data) => {
  document.getElementById("score").textContent = data.score;
});

game.start();
```

## License

Licensed under the MIT License. See the root repository for full license information.

## Links

- [Core Package Documentation](../core/README.md)
- [Full API Reference](../core/README.md#api-reference)
- [Repository](https://github.com/scraperapi/minigames-lib)
