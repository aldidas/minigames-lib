# @minigame/vue

Vue 3 component wrappers for minigames-lib. Use classic arcade games as native Vue components.

## Installation

```bash
npm install @minigame/core @minigame/vue
# or
pnpm add @minigame/core @minigame/vue
# or
yarn add @minigame/core @minigame/vue
```

## Quick Start

```vue
<script setup lang="ts">
import { SnakeGame } from "@minigame/vue";

const gameConfig = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
  },
};

const handleGameOver = (data) => {
  console.log("Game Over! Score:", data.finalScore);
};
</script>

<template>
  <SnakeGame :config="gameConfig" @game-over="handleGameOver" />
</template>
```

## Components

### SnakeGame

Classic snake game where you control a growing snake.

```vue
<script setup lang="ts">
import { SnakeGame } from "@minigame/vue";

const config = {
  colors: { primary: "#3b82f6" },
};
</script>

<template>
  <SnakeGame
    :config="config"
    @game-started="onStart"
    @game-over="onGameOver"
    @score-update="onScoreUpdate"
    :width="600"
    :height="600"
  />
</template>
```

**Controls:** Arrow keys or WASD

### PongGame

Classic pong game with AI opponent.

```vue
<script setup lang="ts">
import { PongGame } from "@minigame/vue";
</script>

<template>
  <PongGame
    :config="{ colors: { primary: '#10b981' } }"
    @score-update="handleScore"
  />
</template>
```

**Controls:** Arrow Up/Down or W/S keys, or touch/drag

### BreakoutGame

Classic brick-breaking game.

```vue
<script setup lang="ts">
import { BreakoutGame } from "@minigame/vue";
</script>

<template>
  <BreakoutGame
    :config="{ colors: { primary: '#8b5cf6' } }"
    @game-over="(data) => alert(`Final Score: ${data.finalScore}`)"
  />
</template>
```

**Controls:** Arrow Left/Right or A/D keys, or touch/drag

## Props

All game components accept the same props:

| Prop     | Type                  | Required | Default | Description                              |
| -------- | --------------------- | -------- | ------- | ---------------------------------------- |
| `config` | `Partial<GameConfig>` | No       | `{}`    | Game configuration (colors, fonts, etc.) |
| `width`  | `Number`              | No       | `600`   | Canvas width in pixels                   |
| `height` | `Number`              | No       | `600`   | Canvas height in pixels                  |

## Events

All game components emit the same events:

| Event            | Payload Type                                 | Description                              |
| ---------------- | -------------------------------------------- | ---------------------------------------- |
| `@game-started`  | `{ timestamp: string; playerName?: string }` | Emitted when game starts                 |
| `@game-over`     | `GameOverData`                               | Emitted when game ends                   |
| `@score-update`  | `ScoreUpdateData`                            | Emitted when score changes               |
| `@game-finished` | `{ timestamp: string; playerName?: string }` | Emitted when game completes successfully |

## TypeScript Support

Full TypeScript support with exported types:

```vue
<script setup lang="ts">
import { SnakeGame } from "@minigame/vue";
import type { GameConfig, GameOverData, ScoreUpdateData } from "@minigame/vue";

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

const handleScoreUpdate = (data: ScoreUpdateData) => {
  console.log("Score:", data.score);
};
</script>

<template>
  <SnakeGame
    :config="config"
    @game-over="handleGameOver"
    @score-update="handleScoreUpdate"
  />
</template>
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

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  SnakeGame,
  type GameOverData,
  type ScoreUpdateData,
} from "@minigame/vue";

const score = ref(0);
const isGameOver = ref(false);

const config = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
  },
};

const handleScoreUpdate = (data: ScoreUpdateData) => {
  score.value = data.score;
};

const handleGameOver = (data: GameOverData) => {
  isGameOver.value = true;
  console.log("Final Score:", data.finalScore);
};
</script>

<template>
  <div>
    <h1>Snake Game</h1>
    <p>Score: {{ score }}</p>
    <p v-if="isGameOver">Game Over!</p>

    <SnakeGame
      :config="config"
      @score-update="handleScoreUpdate"
      @game-over="handleGameOver"
    />
  </div>
</template>
```

## Using with Options API

```vue
<script lang="ts">
import { defineComponent } from "vue";
import { SnakeGame } from "@minigame/vue";

export default defineComponent({
  components: {
    SnakeGame,
  },
  data() {
    return {
      config: {
        colors: {
          primary: "#3b82f6",
        },
      },
      score: 0,
    };
  },
  methods: {
    handleScoreUpdate(data) {
      this.score = data.score;
    },
    handleGameOver(data) {
      alert(`Game Over! Score: ${data.finalScore}`);
    },
  },
});
</script>

<template>
  <div>
    <p>Score: {{ score }}</p>
    <SnakeGame
      :config="config"
      @score-update="handleScoreUpdate"
      @game-over="handleGameOver"
    />
  </div>
</template>
```

## Reactive Config

The components watch for config changes and reinitialize the game automatically:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SnakeGame } from "@minigame/vue";

const primaryColor = ref("#3b82f6");

const config = ref({
  colors: {
    primary: primaryColor.value,
  },
});

// Changing this will reinitialize the game with new config
const changeColor = () => {
  primaryColor.value = "#f59e0b";
  config.value = {
    colors: {
      primary: primaryColor.value,
    },
  };
};
</script>

<template>
  <div>
    <button @click="changeColor">Change Color</button>
    <SnakeGame :config="config" />
  </div>
</template>
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Requirements

- Vue 3.3.0 or higher
- Modern browsers with Canvas API support

## License

MIT
