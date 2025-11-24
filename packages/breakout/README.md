# @minigame/breakout

Classic Breakout game implementation with modern JavaScript/TypeScript support. Break bricks with a paddle and ball!

## Installation

```bash
# npm
npm install @minigame/core @minigame/breakout

# pnpm
pnpm add @minigame/core @minigame/breakout

# yarn
yarn add @minigame/core @minigame/breakout
```

## Quick Start

```typescript
import { BreakoutGame } from "@minigame/breakout";

const canvas = document.getElementById("game-canvas");
const game = new BreakoutGame(canvas);

game.setPlayerName("Player");
game.start();
```

Start breaking bricks in under 10 lines of code!

## Game Controls

| Platform               | Control                  | Action                               |
| ---------------------- | ------------------------ | ------------------------------------ |
| **Desktop (Keyboard)** | Arrow Left / Right (← →) | Move paddle left / right             |
| **Desktop (Mouse)**    | Mouse Movement           | Move paddle horizontally             |
| **Mobile**             | Touch & Drag             | Move paddle by touching and dragging |

## Gameplay

- **Objective:** Destroy all bricks by bouncing the ball off your paddle
- **Lives:** Start with 3 lives
- **Scoring:** Each brick destroyed increases your score
- **Level Complete:** Clear all bricks to complete the level
- **Game Over:** Lose all lives when ball passes paddle

## API Reference

### Constructor

```typescript
new BreakoutGame(canvas: HTMLCanvasElement, config?: GameConfig)
```

Creates a new Breakout game instance.

**Parameters:**

- `canvas` - HTML canvas element for rendering
- `config` (optional) - Game configuration object

### Methods

#### Game Control Methods

```typescript
game.start(): void
```

Starts the game. Initializes paddle, ball, bricks, and starts the game loop.

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
game.getGameState(): BreakoutGameState
```

Returns the current game state including score, lives, bricks, paddle, and ball positions.

**Returns:**

```typescript
{
  score: number;
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  playerName: string;
  bricks: Brick[];
  paddle: { x: number; y: number; width: number };
  ball: { x: number; y: number; vx: number; vy: number };
}
```

## Event Handling

The Breakout game emits events at key moments. Subscribe to events using the `.on()` method:

```typescript
import { BreakoutGame } from "@minigame/breakout";

const game = new BreakoutGame(canvas);

// Game started event
game.on("gameStarted", (data) => {
  console.log("Game started!", data);
  // { timestamp: 1234567890, playerName: 'Player' }
});

// Score updated event
game.on("scoreUpdate", (data) => {
  console.log("Score:", data.score);
  // { score: 10, timestamp: 1234567890, playerName: 'Player' }

  const state = game.getGameState();
  document.getElementById("score").textContent = `Score: ${data.score}`;
  document.getElementById("lives").textContent = `Lives: ${state.lives}`;
});

// Game over event
game.on("gameOver", (data) => {
  console.log("Game Over!", data);
  // {
  //   reason: 'out-of-lives' | 'level-complete',
  //   finalScore: 100,
  //   timestamp: 1234567890,
  //   playerName: 'Player'
  // }

  if (data.reason === "level-complete") {
    alert(`Level Complete! Score: ${data.finalScore}`);
  } else {
    alert(`Game Over! Final Score: ${data.finalScore}`);
  }
});

// Game finished event (when player stops the game)
game.on("gameFinished", (data) => {
  console.log("Game finished", data);
  // { finalScore: 80, duration: 180000, timestamp: 1234567890 }
});

// Sound muted/unmuted events
game.on("soundMuted", () => console.log("Sound muted"));
game.on("soundUnmuted", () => console.log("Sound unmuted"));
```

### Available Events

| Event          | Data                                            | Description                   |
| -------------- | ----------------------------------------------- | ----------------------------- |
| `gameStarted`  | `{ timestamp, playerName }`                     | Fired when game starts        |
| `scoreUpdate`  | `{ score, timestamp, playerName }`              | Fired when brick is destroyed |
| `gameOver`     | `{ reason, finalScore, timestamp, playerName }` | Fired when game ends          |
| `gameFinished` | `{ finalScore, duration, timestamp }`           | Fired when player stops game  |
| `soundMuted`   | `{ timestamp }`                                 | Fired when sound is muted     |
| `soundUnmuted` | `{ timestamp }`                                 | Fired when sound is unmuted   |

## Customization

Customize the game appearance and behavior using the `GameConfig` object:

### Colors

```typescript
const game = new BreakoutGame(canvas, {
  colors: {
    primary: "#8b5cf6", // Paddle and ball color
    secondary: "#ec4899", // Brick colors
    background: "#1f2937", // Canvas background
    text: "#f9fafb", // Text color
  },
});
```

### Typography

```typescript
const game = new BreakoutGame(canvas, {
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
const game = new BreakoutGame(canvas, {
  audio: {
    volume: 0.7, // 0.0 to 1.0
    muted: false,
  },
});
```

### Complete Customization Example

```typescript
const game = new BreakoutGame(canvas, {
  colors: {
    primary: "#f59e0b",
    secondary: "#10b981",
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
import { BreakoutGame } from "@minigame/breakout";
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
    primary: "#8b5cf6",
    secondary: "#ec4899",
    background: "#1f2937",
    text: "#f9fafb",
  },
};

const game = new BreakoutGame(canvas, config);

game.on("scoreUpdate", (data: ScoreUpdateData) => {
  const state = game.getGameState();
  console.log(`Score: ${data.score}, Lives: ${state.lives}`);
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
    <title>Breakout Game</title>
  </head>
  <body>
    <div>
      <canvas id="game-canvas" width="800" height="600"></canvas>
      <div>
        Score: <span id="score">0</span> | Lives: <span id="lives">3</span>
      </div>
      <div>
        <button id="start">Start</button>
        <button id="pause">Pause</button>
        <button id="resume">Resume</button>
      </div>
    </div>

    <script type="module">
      import { BreakoutGame } from "@minigame/breakout";

      const canvas = document.getElementById("game-canvas");
      const scoreEl = document.getElementById("score");
      const livesEl = document.getElementById("lives");

      const game = new BreakoutGame(canvas);
      game.setPlayerName("Player");

      game.on("scoreUpdate", (data) => {
        const state = game.getGameState();
        scoreEl.textContent = data.score;
        livesEl.textContent = state.lives;
      });

      game.on("gameOver", (data) => {
        if (data.reason === "level-complete") {
          alert(`Level Complete! Score: ${data.finalScore}`);
        } else {
          alert(`Game Over! Final Score: ${data.finalScore}`);
        }
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
import { BreakoutGame } from "@minigame/breakout";
import type { GameConfig } from "@minigame/core";

export function BreakoutGameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<BreakoutGame | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    if (!canvasRef.current) return;

    const config: GameConfig = {
      colors: {
        primary: "#8b5cf6",
        secondary: "#ec4899",
        background: "#1f2937",
        text: "#f9fafb",
      },
    };

    const game = new BreakoutGame(canvasRef.current, config);
    game.setPlayerName("React Player");

    game.on("scoreUpdate", (data) => {
      const state = game.getGameState();
      setScore(data.score);
      setLives(state.lives);
    });

    game.on("gameOver", (data) => {
      if (data.reason === "level-complete") {
        alert(`Level Complete! Score: ${data.finalScore}`);
      } else {
        alert(`Game Over! Final Score: ${data.finalScore}`);
      }
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
      <canvas ref={canvasRef} width={800} height={600} />
      <div>
        Score: {score} | Lives: {lives}
      </div>
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
    <canvas ref="canvasRef" width="800" height="600"></canvas>
    <div>Score: {{ score }} | Lives: {{ lives }}</div>
    <button @click="handleStart">Start</button>
    <button @click="handlePause">Pause</button>
    <button @click="handleResume">Resume</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { BreakoutGame } from "@minigame/breakout";
import type { GameConfig } from "@minigame/core";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const score = ref(0);
const lives = ref(3);
let game: BreakoutGame | null = null;

onMounted(() => {
  if (!canvasRef.value) return;

  const config: GameConfig = {
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      background: "#1f2937",
      text: "#f9fafb",
    },
  };

  game = new BreakoutGame(canvasRef.value, config);
  game.setPlayerName("Vue Player");

  game.on("scoreUpdate", (data) => {
    const state = game!.getGameState();
    score.value = data.score;
    lives.value = state.lives;
  });

  game.on("gameOver", (data) => {
    if (data.reason === "level-complete") {
      alert(`Level Complete! Score: ${data.finalScore}`);
    } else {
      alert(`Game Over! Final Score: ${data.finalScore}`);
    }
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
    const game = new BreakoutGame(canvas);
    game.start();
  }
});
```

### Paddle controls not working

**Problem:** Input events not properly captured.

**Solution:**

- Ensure canvas or window has focus
- Check browser console for JavaScript errors
- For mouse control, ensure mouse is over canvas
- For touch, verify touch events are supported

### Ball moves too fast/slow

**Problem:** Game speed feels wrong.

**Solution:**

- Current ball speed is fixed and balanced for gameplay
- Ensure browser is running at 60fps (check with browser dev tools)
- Close resource-intensive applications if performance is slow

### Lives or score not updating in UI

**Problem:** Event listener not properly subscribed.

**Solution:**

- Subscribe to `scoreUpdate` event before calling `start()`
- Use `getGameState()` to retrieve both score and lives

```typescript
const game = new BreakoutGame(canvas);

// Subscribe BEFORE starting
game.on("scoreUpdate", (data) => {
  const state = game.getGameState();
  document.getElementById("score").textContent = data.score;
  document.getElementById("lives").textContent = state.lives;
});

game.start();
```

### Bricks not breaking on collision

**Problem:** Collision detection issue or game state problem.

**Solution:**

- Ensure game is properly started with `game.start()`
- Check browser console for errors
- Verify canvas size is sufficient (minimum 600x400 recommended)
- Try refreshing the page and restarting the game

### Performance issues on mobile

**Problem:** Game runs slowly or stutters.

**Solution:**

- Reduce canvas size for mobile devices
- Ensure device is not in low power mode
- Close other browser tabs

```typescript
// Responsive canvas sizing
const isMobile = window.innerWidth < 768;
const width = isMobile ? 400 : 800;
const height = isMobile ? 600 : 600;
canvas.width = width;
canvas.height = height;
```

## License

Licensed under the MIT License. See the root repository for full license information.

## Links

- [Core Package Documentation](../core/README.md)
- [Full API Reference](../core/README.md#api-reference)
- [Repository](https://github.com/scraperapi/minigames-lib)
