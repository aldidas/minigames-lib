# @minigame/pong

Classic Pong game implementation with modern JavaScript/TypeScript support. Features Player vs AI, Player vs Player, and Practice modes.

## Installation

```bash
# npm
npm install @minigame/core @minigame/pong

# pnpm
pnpm add @minigame/core @minigame/pong

# yarn
yarn add @minigame/core @minigame/pong
```

## Quick Start

```typescript
import { PongGame } from "@minigame/pong";

const canvas = document.getElementById("game-canvas");
const game = new PongGame(canvas, {}, "pvai"); // Player vs AI mode

game.setPlayerName("Player");
game.start();
```

Play classic Pong in under 10 lines of code!

## Game Modes

The Pong game supports three different modes:

| Mode           | Description      | Players                                    |
| -------------- | ---------------- | ------------------------------------------ |
| **`pvai`**     | Player vs AI     | Single player competes against AI opponent |
| **`pvp`**      | Player vs Player | Two players compete locally                |
| **`practice`** | Practice Mode    | Single player practice with no opponent    |

```typescript
// Player vs AI (default)
const game = new PongGame(canvas, {}, "pvai");

// Player vs Player
const game = new PongGame(canvas, {}, "pvp");

// Practice mode
const game = new PongGame(canvas, {}, "practice");
```

## Game Controls

### Desktop Controls

| Player       | Keys  | Action                                |
| ------------ | ----- | ------------------------------------- |
| **Player 1** | W / S | Move paddle up / down                 |
| **Player 2** | ↑ / ↓ | Move paddle up / down (PvP mode only) |

### Mobile Controls

| Action          | Control                                   |
| --------------- | ----------------------------------------- |
| **Move Paddle** | Touch and drag on your side of the screen |

## API Reference

### Constructor

```typescript
new PongGame(
  canvas: HTMLCanvasElement,
  config?: GameConfig,
  mode?: 'pvai' | 'pvp' | 'practice'
)
```

Creates a new Pong game instance.

**Parameters:**

- `canvas` - HTML canvas element for rendering
- `config` (optional) - Game configuration object
- `mode` (optional) - Game mode: `'pvai'` (default), `'pvp'`, or `'practice'`

### Methods

#### Game Control Methods

```typescript
game.start(): void
```

Starts the game. Initializes paddles, ball, and starts the game loop.

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
game.getGameState(): PongGameState
```

Returns the current game state including scores, paddle positions, and ball position.

**Returns:**

```typescript
{
  score: {
    player1: number;
    player2: number;
  }
  isPaused: boolean;
  isGameOver: boolean;
  playerName: string;
  mode: "pvai" | "pvp" | "practice";
  ball: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  }
  paddles: {
    player1: {
      x: number;
      y: number;
      height: number;
    }
    player2: {
      x: number;
      y: number;
      height: number;
    }
  }
}
```

## Event Handling

The Pong game emits events at key moments. Subscribe to events using the `.on()` method:

```typescript
import { PongGame } from "@minigame/pong";

const game = new PongGame(canvas, {}, "pvai");

// Game started event
game.on("gameStarted", (data) => {
  console.log("Game started!", data);
  // { timestamp: 1234567890, playerName: 'Player' }
});

// Score updated event
game.on("scoreUpdate", (data) => {
  console.log("Score updated:", data);
  // { score: 5, timestamp: 1234567890, playerName: 'Player' }

  const state = game.getGameState();
  document.getElementById(
    "score"
  ).textContent = `Player: ${state.score.player1} | Opponent: ${state.score.player2}`;
});

// Game over event
game.on("gameOver", (data) => {
  console.log("Game Over!", data);
  // {
  //   reason: 'Player 1 wins!' | 'Player 2 wins!' | 'AI wins!',
  //   finalScore: 11,
  //   timestamp: 1234567890,
  //   playerName: 'Player'
  // }
  alert(`${data.reason}\nFinal Score: ${data.finalScore}`);
});

// Game finished event (when player stops the game)
game.on("gameFinished", (data) => {
  console.log("Game finished", data);
  // { finalScore: 8, duration: 120000, timestamp: 1234567890 }
});

// Sound muted/unmuted events
game.on("soundMuted", () => console.log("Sound muted"));
game.on("soundUnmuted", () => console.log("Sound unmuted"));
```

### Available Events

| Event          | Data                                            | Description                     |
| -------------- | ----------------------------------------------- | ------------------------------- |
| `gameStarted`  | `{ timestamp, playerName }`                     | Fired when game starts          |
| `scoreUpdate`  | `{ score, timestamp, playerName }`              | Fired when either player scores |
| `gameOver`     | `{ reason, finalScore, timestamp, playerName }` | Fired when game ends            |
| `gameFinished` | `{ finalScore, duration, timestamp }`           | Fired when player stops game    |
| `soundMuted`   | `{ timestamp }`                                 | Fired when sound is muted       |
| `soundUnmuted` | `{ timestamp }`                                 | Fired when sound is unmuted     |

## Customization

Customize the game appearance and behavior using the `GameConfig` object:

### Colors

```typescript
const game = new PongGame(
  canvas,
  {
    colors: {
      primary: "#10b981", // Paddle and ball color
      secondary: "#f59e0b", // Accent color
      background: "#1f2937", // Canvas background
      text: "#f9fafb", // Text color
    },
  },
  "pvai"
);
```

### Typography

```typescript
const game = new PongGame(
  canvas,
  {
    fonts: {
      family: "Inter, system-ui, sans-serif",
      size: {
        small: 12,
        medium: 16,
        large: 24,
      },
    },
  },
  "pvai"
);
```

### Audio

```typescript
const game = new PongGame(
  canvas,
  {
    audio: {
      volume: 0.7, // 0.0 to 1.0
      muted: false,
    },
  },
  "pvai"
);
```

### Complete Customization Example

```typescript
const game = new PongGame(
  canvas,
  {
    colors: {
      primary: "#ec4899",
      secondary: "#8b5cf6",
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
  },
  "pvp"
);
```

## TypeScript Usage

Full TypeScript support with exported types:

```typescript
import { PongGame } from "@minigame/pong";
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
    primary: "#10b981",
    secondary: "#f59e0b",
    background: "#1f2937",
    text: "#f9fafb",
  },
};

const game = new PongGame(canvas, config, "pvai");

game.on("scoreUpdate", (data: ScoreUpdateData) => {
  const state = game.getGameState();
  console.log(`Score: ${state.score.player1} - ${state.score.player2}`);
});

game.on("gameOver", (data: GameOverData) => {
  console.log(`Game Over! ${data.reason}`);
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
    <title>Pong Game</title>
  </head>
  <body>
    <div>
      <canvas id="game-canvas" width="800" height="600"></canvas>
      <div>Score: <span id="score">0 - 0</span></div>
      <div>
        <button id="start">Start</button>
        <button id="pause">Pause</button>
        <button id="resume">Resume</button>
      </div>
    </div>

    <script type="module">
      import { PongGame } from "@minigame/pong";

      const canvas = document.getElementById("game-canvas");
      const scoreEl = document.getElementById("score");

      const game = new PongGame(canvas, {}, "pvai");
      game.setPlayerName("Player");

      game.on("scoreUpdate", () => {
        const state = game.getGameState();
        scoreEl.textContent = `${state.score.player1} - ${state.score.player2}`;
      });

      game.on("gameOver", (data) => {
        alert(`${data.reason}\nFinal Score: ${data.finalScore}`);
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
import { PongGame } from "@minigame/pong";
import type { GameConfig } from "@minigame/core";

export function PongGameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<PongGame | null>(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const config: GameConfig = {
      colors: {
        primary: "#10b981",
        secondary: "#f59e0b",
        background: "#1f2937",
        text: "#f9fafb",
      },
    };

    const game = new PongGame(canvasRef.current, config, "pvai");
    game.setPlayerName("React Player");

    game.on("scoreUpdate", () => {
      const state = game.getGameState();
      setScore(state.score);
    });

    game.on("gameOver", (data) => {
      alert(`${data.reason}\nFinal Score: ${data.finalScore}`);
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
        Score: {score.player1} - {score.player2}
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
    <div>Score: {{ score.player1 }} - {{ score.player2 }}</div>
    <button @click="handleStart">Start</button>
    <button @click="handlePause">Pause</button>
    <button @click="handleResume">Resume</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { PongGame } from "@minigame/pong";
import type { GameConfig } from "@minigame/core";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const score = ref({ player1: 0, player2: 0 });
let game: PongGame | null = null;

onMounted(() => {
  if (!canvasRef.value) return;

  const config: GameConfig = {
    colors: {
      primary: "#10b981",
      secondary: "#f59e0b",
      background: "#1f2937",
      text: "#f9fafb",
    },
  };

  game = new PongGame(canvasRef.value, config, "pvai");
  game.setPlayerName("Vue Player");

  game.on("scoreUpdate", () => {
    const state = game!.getGameState();
    score.value = state.score;
  });

  game.on("gameOver", (data) => {
    alert(`${data.reason}\nFinal Score: ${data.finalScore}`);
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
    const game = new PongGame(canvas, {}, "pvai");
    game.start();
  }
});
```

### Paddle controls not responding

**Problem:** Keyboard events not properly captured.

**Solution:**

- Ensure canvas or window has focus
- Check browser console for JavaScript errors
- Verify no other scripts are preventing keyboard events

### AI opponent too difficult/easy

**Problem:** AI difficulty not balanced for your preference.

**Solution:**

- Currently AI difficulty is fixed
- Try practice mode for solo play without AI
- Future versions may include difficulty settings

### Score not updating in UI

**Problem:** Event listener not properly subscribed.

**Solution:**

- Subscribe to `scoreUpdate` event before calling `start()`
- Use `getGameState()` to retrieve full score object

```typescript
const game = new PongGame(canvas, {}, "pvai");

// Subscribe BEFORE starting
game.on("scoreUpdate", () => {
  const state = game.getGameState();
  document.getElementById(
    "score"
  ).textContent = `${state.score.player1} - ${state.score.player2}`;
});

game.start();
```

### Player 2 controls not working (PvP mode)

**Problem:** Second player controls (arrow keys) not responding.

**Solution:**

- Ensure you're in PvP mode: `new PongGame(canvas, {}, 'pvp')`
- Verify arrow keys aren't being used by browser (e.g., page scrolling)
- Check that both players aren't trying to use the same controls

## License

Licensed under the MIT License. See the root repository for full license information.

## Links

- [Core Package Documentation](../core/README.md)
- [Full API Reference](../core/README.md#api-reference)
- [Repository](https://github.com/scraperapi/minigames-lib)
