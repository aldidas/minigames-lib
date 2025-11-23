# minigames-lib - Architecture Document

**Project:** minigames-lib  
**Architect:** Winston  
**Date:** 2025-11-23  
**Status:** In Progress

---

## Executive Summary

_Architecture decisions for minigames-lib TypeScript monorepo library providing headless, event-driven arcade games for advertising agencies._

---

## Project Context

### Overview

minigames-lib is a TypeScript-based monorepo library designed to provide advertising agencies with embeddable, headless HTML5 arcade games for campaign websites.

### Requirements Summary

- **77 Functional Requirements** across 12 capability areas
- **Target**: < 30 minute integration time for developers
- **Performance**: 60fps gameplay, < 50kb bundles, < 1s load time
- **Quality**: 100% TypeScript coverage, zero runtime dependencies, zero critical bugs

### Core Capabilities

1. **Uniform Game API**: start(), stop(), pause(), resume(), mute(), unmute(), setPlayerName(), getGameState()
2. **Event System**: onGameStarted, onGameFinished, onGameOver, onScoreUpdate, onSoundMuted/Unmuted
3. **UI Customization**: Headless games with styling API (colors, fonts, animations, volumes)
4. **Multi-format Distribution**: ESM, CJS, UMD builds with TypeScript declarations

### MVP Scope

- **Core Package**: `@minigame/core` with shared interfaces, types, event system
- **3 Games**: Snake ✅, Pong ✅, Breakout (to build)
- **Infrastructure**: pnpm workspace monorepo, automated build/publish pipeline

### Key Architectural Challenges

1. Monorepo structure - organizing shared vs game-specific code
2. Uniform API enforcement - ensuring all games implement same interface
3. Event system design - type-safe event emitter pattern
4. Build pipeline - multi-format output with tree-shaking
5. TypeScript architecture - shared types, base classes, strict typing

---

## Starter Template Decision

**Decision: Manual Setup (No Starter Template)**

**Rationale:**

- Most TypeScript monorepo starters are focused on applications (Next.js, Vite apps), not libraries
- Library monorepos have simpler requirements than full-stack app monorepos
- Manual pnpm workspace setup gives precise control over package structure
- Avoids bloat from unused app-focused tooling

**Recommendation:** Initialize manually with pnpm workspace configuration

---

## Build Tool Selection

### Decision: **tsup** for all packages

**Research Findings (2024):**

- **tsup** is the modern standard for TypeScript library bundling
- Powered by esbuild - extremely fast builds
- Zero-config with sensible defaults
- Native multi-format output (ESM, CJS, UMD)
- Automatic TypeScript declaration (.d.ts) generation
- Tree-shaking built-in
- Perfect for libraries (vs Rollup's complexity for equivalent results)

**Configuration:**

```bash
# Per-package tsup configuration
tsup src/index.ts --format esm,cjs,iife --dts --clean
```

**Verified Version:** tsup ^8.0.0 (latest stable as of 2024)

---

## Architectural Decisions

### 1. Monorepo Structure

**Decision: Feature-based package organization with shared core**

```
minigames-lib/
├── packages/
│   ├── core/                    # @minigame/core
│   │   ├── src/
│   │   │   ├── index.ts        # Main export
│   │   │   ├── BaseGame.ts     # Abstract base class
│   │   │   ├── GameConfig.ts   # Configuration types
│   │   │   ├── EventEmitter.ts # Event system
│   │   │   └── types/          # Shared TypeScript types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── snake/                   # @minigame/snake
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── SnakeGame.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── pong/                    # @minigame/pong
│   └── breakout/                # @minigame/breakout
├── pnpm-workspace.yaml
├── package.json                 # Root package
├── tsconfig.json                # Base TypeScript config
└── .npmrc                       # pnpm configuration
```

**Rationale:**

- Each game is independently publishable
- Core package contains zero dependencies (just types/base classes)
- Clear separation of concerns
- Easy to add new games without affecting existing ones

---

### 2. TypeScript Configuration Strategy

**Decision: Project References with Composite Projects**

**Root `tsconfig.json` (Base Config):**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Per-Package `tsconfig.json`:**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../core" } // For game packages
  ]
}
```

**Rationale:**

- Strict type checking (no `any` allowed - satisfies FR39)
- Composite projects enable incremental builds
- Project references ensure type safety across packages
- Modern module resolution for bundlers

---

### 3. Core Package Architecture

**Decision: Abstract Base Class Pattern + Event Emitter**

**BaseGame Class (Abstract):**

```typescript
// packages/core/src/BaseGame.ts
export abstract class BaseGame<TState = any> {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected gameState: GameState = "stopped";
  protected playerName?: string;
  protected config: GameConfig;
  private eventEmitter: EventEmitter;

  // Abstract methods - MUST be implemented by each game
  protected abstract init(): void;
  protected abstract update(deltaTime: number): void;
  protected abstract render(): void;
  protected abstract cleanup(): void;

  // Uniform API (FR1-FR8) - implemented in BaseGame
  public start(): void {
    /* ... */
  }
  public stop(): void {
    /* ... */
  }
  public pause(): void {
    /* ... */
  }
  public resume(): void {
    /* ... */
  }
  public mute(): void {
    /* ... */
  }
  public unmute(): void {
    /* ... */
  }
  public setPlayerName(name: string): void {
    /* ... */
  }
  public getGameState(): TState {
    /* ... */
  }

  // Event system (FR9-FR17)
  public on(event: GameEvent, callback: EventCallback): void {
    /* ... */
  }
  public off(event: GameEvent, callback: EventCallback): void {
    /* ... */
  }
  protected emit(event: GameEvent, data?: any): void {
    /* ... */
  }
}
```

**Event System:**

```typescript
// packages/core/src/EventEmitter.ts
export type GameEvent =
  | "gameStarted"
  | "gameFinished"
  | "gameOver"
  | "scoreUpdate"
  | "soundMuted"
  | "soundUnmuted";

export interface BaseEventData {
  timestamp: number;
  playerName?: string;
  gameId: string;
}

export interface GameOverData extends BaseEventData {
  finalScore: number;
  gameStatus: "won" | "lost" | "abandoned";
  playDuration: number;
}

// ... other event data interfaces
```

**Rationale:**

- Forces all games to implement uniform API (satisfies FR1-FR8)
- Event emitter is type-safe (satisfies FR36-FR41)
- Games can't deviate from interface
- Extensible for game-specific state via generics

---

### 4. Game Package Pattern

**Decision: Each game extends BaseGame**

**Example: Snake Game:**

```typescript
// packages/snake/src/SnakeGame.ts
import { BaseGame, GameConfig } from '@minigame/core';

export class SnakeGame extends BaseGame<SnakeGameState> {
  private snake: Segment[];
  private food: Position;
  private direction: Direction;

  constructor(canvas: HTMLCanvasElement, config?: Partial<Snake Config>) {
    super(canvas, { ...defaultSnakeConfig, ...config });
  }

  protected init(): void {
    // Snake-specific initialization
  }

  protected update(deltaTime: number): void {
    // Snake game logic
  }

  protected render(): void {
    // Snake rendering
  }

  protected cleanup(): void {
    // Snake cleanup
  }
}
```

**Rationale:**

- Inheritance ensures uniform API compliance
- Each game manages its own state
- Clear separation between framework (BaseGame) and game logic
- Type-safe extensibility

---

### 5. Build Configuration

**Decision: tsup with unified configuration**

**Per-Package `tsup.config.ts`:**

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: true,
  target: "es2020",
  outDir: "dist",
  globalName: "MinigameSnake", // For IIFE format
});
```

**Build Output Structure:**

```
packages/snake/dist/
├── index.js         # ESM
├── index.cjs        # CommonJS
├── index.global.js  # UMD/IIFE (browser <script>)
├── index.d.ts       # TypeScript declarations
└── *.map            # Source maps
```

**Rationale:**

- Satisfies FR48 (ESM, CJS, UMD formats)
- Satisfies FR49-FR50 (minified + source maps)
- Satisfies FR51 (< 50kb target via tree-shaking)
- Single config, consistent across all packages

---

### 6. Package Dependency Strategy

**Decision: Workspace protocol for internal/packages**

**Core package.json:**

```json
{
  "name": "@minigame/core",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "dependencies": {}, // ZERO runtime dependencies (FR52)
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  }
}
```

**Game package.json:**

```json
{
  "name": "@minigame/snake",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "dependencies": {
    "@minigame/core": "workspace:^" // Links to local core package
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  }
}
```

**`pnpm-workspace.yaml`:**

```yaml
packages:
  - "packages/*"
```

**Rationale:**

- `workspace:^` protocol links local packages during development
- Replaced with actual versions during publish
- Satisfies FR44-FR45 (selective install, core dependency)
- Satisfies FR52-FR53 (zero runtime deps, games depend only on core)

---

### 7. UI Customization Architecture

**Decision: Configuration object pattern**

**GameConfig Interface:**

```typescript
// packages/core/src/GameConfig.ts
export interface GameConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
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
    speed: number; // 0.5 = half speed, 2 = double speed
  };
  audio: {
    volume: number; // 0-1
    muted: boolean;
  };
}
```

**Usage:**

```typescript
const game = new SnakeGame(canvas, {
  colors: {
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    background: "#1A1A2E",
    text: "#FFFFFF",
  },
  audio: {
    volume: 0.7,
  },
});
```

**Rationale:**

- Satisfies FR18-FR24 (complete customization API)
- Type-safe configuration
- Deep partial merging with defaults
- Consistent across all games

---

### 8. Testing Strategy

**Decision: Vitest for unit testing**

**Test Setup:**

```bash
pnpm add -D -w vitest @vitest/ui
```

**Per-Package Test Pattern:**
Co-located tests in `__tests__/` directories within src folders.

**Testing Requirements:**

- Unit tests for all public APIs
- Event emitter tests for all event types
- Integration tests for BaseGame → Game inheritance
- Coverage: minimum 80% (target 100% for core)

**Rationale:** Vitest is fast, TypeScript-native, and supports jsdom for browser APIs (canvas)

---

### 9. Publishing Strategy

**Decision: Changesets for versioning + automated npm publishing**

**Version Synchronization:** All packages use **fixed versioning** (same version number)

**Publishing Workflow:**

1. Developer runs: `pnpm changeset`
2. Merges to main
3. CI runs: `pnpm changeset version`
4. CI runs: `pnpm -r publish`

**Rationale:** Satisfies FR46-FR47, FR63-FR68

---

### 10. Naming Conventions

**Files:** PascalCase for classes, camelCase for utilities, kebab-case for configs
**Exports:** Named exports for APIs, default export for main game class
**TypeScript:** No `any` usage except controlled edge cases
**Code Style:** 2-space indentation, single quotes, semicolons required

---

### 11. Development Workflow

**Project Initialization:**

```bash
mkdir minigames-lib && cd minigames-lib
pnpm init
echo "packages:\n  - 'packages/*'" > pnpm-workspace.yaml
pnpm add -D -w typescript@^5.3.0 tsup@^8.0.0 vitest@latest @changesets/cli
```

**Root package.json scripts:**

```json
{
  "scripts": {
    "build": "pnpm -r run build",
    "test": "vitest",
    "changeset": "changeset",
    "publish": "pnpm build && changeset publish"
  }
}
```

---

## Decision Summary Table

| Decision Area     | Choice                          | Version | FR Coverage          |
| ----------------- | ------------------------------- | ------- | -------------------- |
| **Monorepo Tool** | pnpm workspaces                 | 8.x     | FR73                 |
| **Build Tool**    | tsup                            | 8.0.0   | FR48-FR51, FR54      |
| **TypeScript**    | Strict mode, composite projects | 5.3.0   | FR36-FR41            |
| **Testing**       | Vitest + jsdom                  | latest  | Quality NFRs         |
| **Versioning**    | Changesets (fixed)              | latest  | FR46-FR47, FR63-FR68 |
| **Base Pattern**  | Abstract class + Events         | -       | FR1-FR24             |

---

## FR Coverage Validation

**All 77 functional requirements have architectural support:**

- ✅ FR1-FR8: Uniform API enforced via BaseGame abstract class
- ✅ FR9-FR17: Event system with TypeScript types
- ✅ FR18-FR24: GameConfig interface for customization
- ✅ FR25-FR31: Game implementations (Snake, Pong, Breakout)
- ✅ FR36-FR41: 100% TypeScript with strict mode
- ✅ FR42-FR53: Package structure, dependencies, build formats
- ✅ FR55-FR62: Documentation templates defined
- ✅ FR63-FR68: Changesets for versioning
- ✅ FR69-FR72: Developer experience via tsup, TypeScript errors
- ✅ FR73-FR77: pnpm workspace monorepo
