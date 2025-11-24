# @minigame/react

React component wrappers for minigames-lib. Use classic arcade games as native React components.

## Installation

```bash
npm install @minigame/core @minigame/react
# or
pnpm add @minigame/core @minigame/react
# or
yarn add @minigame/core @minigame/react
```

## Quick Start

```tsx
import { SnakeGame } from "@minigame/react";

function App() {
  return (
    <SnakeGame
      config={{
        colors: {
          primary: "#3b82f6",
          secondary: "#8b5cf6",
        },
      }}
      onGameOver={(data) => {
        console.log("Game Over! Score:", data.finalScore);
      }}
    />
  );
}
```

## Components

### SnakeGame

Classic snake game where you control a growing snake.

```tsx
import { SnakeGame } from "@minigame/react";

<SnakeGame
  config={{
    colors: { primary: "#3b82f6" },
  }}
  onGameStarted={(data) => console.log("Game started")}
  onGameOver={(data) => console.log("Game over", data.finalScore)}
  onScoreUpdate={(data) => console.log("Score:", data.score)}
  width={600}
  height={600}
/>;
```

**Controls:** Arrow keys or WASD

### PongGame

Classic pong game with AI opponent.

```tsx
import { PongGame } from "@minigame/react";

<PongGame
  config={{
    colors: { primary: "#10b981" },
  }}
  onScoreUpdate={(data) => console.log("Score update:", data.score)}
  width={600}
  height={600}
/>;
```

**Controls:** Arrow Up/Down or W/S keys, or touch/drag

### BreakoutGame

Classic brick-breaking game.

```tsx
import { BreakoutGame } from "@minigame/react";

<BreakoutGame
  config={{
    colors: { primary: "#8b5cf6" },
  }}
  onGameOver={(data) => alert(`Final Score: ${data.finalScore}`)}
  width={600}
  height={600}
/>;
```

**Controls:** Arrow Left/Right or A/D keys, or touch/drag

## Props API

All game components accept the same props:

| Prop             | Type                              | Required | Description                              |
| ---------------- | --------------------------------- | -------- | ---------------------------------------- |
| `config`         | `Partial<GameConfig>`             | No       | Game configuration (colors, fonts, etc.) |
| `onGameStarted`  | `(data) => void`                  | No       | Called when game starts                  |
| `onGameOver`     | `(data: GameOverData) => void`    | No       | Called when game ends                    |
| `onScoreUpdate`  | `(data: ScoreUpdateData) => void` | No       | Called when score changes                |
| `onGameFinished` | `(data) => void`                  | No       | Called when game completes successfully  |
| `width`          | `number`                          | No       | Canvas width (default: 600)              |
| `height`         | `number`                          | No       | Canvas height (default: 600)             |

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  SnakeGameProps,
  PongGameProps,
  BreakoutGameProps,
  GameConfig,
  GameOverData,
  ScoreUpdateData,
} from "@minigame/react";

const config: Partial<GameConfig> = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    background: "#111827",
    text: "#f9fafb",
  },
};

const handleGameOver = (data: GameOverData) => {
  console.log("Game Over!", data.finalScore);
};
```

## GameConfig Options

```typescript
interface GameConfig {
  colors: {
    primary: string; // Main game color
    secondary: string; // Accent color
    background: string; // Background color
    text: string; // Text color
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: number;
      medium: number;
      large: number;
    };
  };
  styling: {
    borderRadius: number;
    borderWidth: number;
    shadowBlur: number;
  };
  animation: {
    speed: number; // Animation speed multiplier (1.0 = normal)
  };
  audio: {
    volume: number; // 0.0 - 1.0
    muted: boolean;
  };
}
```

## Event Data Types

### GameOverData

```typescript
interface GameOverData {
  timestamp: string;
  reason: string;
  finalScore: number;
  playerName?: string;
}
```

### ScoreUpdateData

```typescript
interface ScoreUpdateData {
  timestamp: string;
  score: number;
  delta: number;
  playerName?: string;
}
```

## Example: Complete Integration

```tsx
import { useState } from "react";
import { SnakeGame, type GameOverData } from "@minigame/react";

function GamePage() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleScoreUpdate = (data: ScoreUpdateData) => {
    setScore(data.score);
  };

  const handleGameOver = (data: GameOverData) => {
    setIsGameOver(true);
    console.log("Final Score:", data.finalScore);
  };

  return (
    <div>
      <h1>Snake Game</h1>
      <p>Score: {score}</p>
      {isGameOver && <p>Game Over!</p>}

      <SnakeGame
        config={{
          colors: {
            primary: "#3b82f6",
            secondary: "#8b5cf6",
          },
        }}
        onScoreUpdate={handleScoreUpdate}
        onGameOver={handleGameOver}
      />
    </div>
  );
}
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Requirements

- React 18.0.0 or higher
- Modern browsers with Canvas API support

## License

MIT
