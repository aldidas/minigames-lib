# Story 4.1: Snake Game Package Setup

**Epic:** MVP Game Implementations  
**Story ID:** 4.1  
**Story Key:** 4-1-snake-game-package-setup  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want the @minigame/snake package structure initialized,  
So that I can implement the Snake game.

---

## Acceptance Criteria

### AC1: Package Directory Structure

**Given** @minigame/core is complete  
**When** I create snake package structure  
**Then**:

- packages/snake/ directory exists
- packages/snake/src/ directory for source code
- packages/snake/src/index.ts exports SnakeGame class
- Directory structure follows monorepo conventions

### AC2: Package Configuration

**Given** package directory exists  
**When** I configure the snake package  
**Then**:

- packages/snake/package.json with name: "@minigame/snake", version: "1.0.0"
- dependencies: { "@minigame/core": "workspace:^" } (FR45, FR53)
- Zero additional runtime dependencies beyond @minigame/core (FR53)
- publishConfig with access: "public"
- keywords, description, author, license, repository fields

### AC3: Build Configuration

**Given** package configuration exists  
**When** I verify build setup  
**Then**:

- packages/snake/tsconfig.json extends root, references core
- packages/snake/tsup.config.ts configured
- globalName: "MinigameSnake" for IIFE build
- Build script works: `pnpm build`
- Exports correct (ESM, CJS, IIFE, types)

---

## Tasks & Subtasks

### Task 1: Create Package Directory Structure

- [ ] Create packages/snake/ directory
- [ ] Create packages/snake/src/ directory
- [ ] Create packages/snake/src/index.ts (stub)

### Task 2: Create package.json

- [ ] Set name: "@minigame/snake"
- [ ] Set version: "1.0.0"
- [ ] Add dependency: "@minigame/core": "workspace:^"
- [ ] Configure exports field
- [ ] Add build/dev/clean scripts
- [ ] Add keywords, description, metadata
- [ ] Add publishConfig

### Task 3: Create TypeScript Configuration

- [ ] Create packages/snake/tsconfig.json
- [ ] Extend root tsconfig
- [ ] Reference @minigame/core
- [ ] Configure outDir, rootDir

### Task 4: Create Build Configuration

- [ ] Create packages/snake/tsup.config.ts
- [ ] Set entry: ['src/index.ts']
- [ ] Set formats: ['esm', 'cjs', 'iife']
- [ ] Set globalName: 'MinigameSnake'
- [ ] Enable dts, sourcemap, minify

### Task 5: Verify Package Setup

- [ ] Run `pnpm install` to link workspace dependency
- [ ] Run `pnpm build` from snake package
- [ ] Verify dist/ outputs
- [ ] Test import from core package

---

## Prerequisites

**Epic 1: Foundation & Infrastructure** - DONE ✅  
**Epic 2: Core Package - Game Framework** - DONE ✅  
**Epic 3: Build & Distribution Pipeline** - DONE ✅

---

## Dependencies

**Blocks:**

- Story 4.2: Snake Game Implementation
- Publishing @minigame/snake to npm

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 4**: Game package pattern
- **FR43**: Published as @minigame/snake
- **FR45**: Core is required dependency
- **FR53**: Games depend only on core

### Package.json

```json
{
  "name": "@minigame/snake",
  "version": "1.0.0",
  "description": "Classic Snake game implementation for minigame library",
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
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  },
  "keywords": ["minigame", "snake", "game", "html5", "canvas", "arcade"],
  "author": "Aldi",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/aldidas/minigames-lib.git",
    "directory": "packages/snake"
  },
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "@minigame/core": "workspace:^"
  },
  "devDependencies": {}
}
```

### tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [{ "path": "../core" }]
}
```

### tsup.config.ts

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  outDir: "dist",
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  splitting: false,
  globalName: "MinigameSnake",
  target: "es2020",
  external: ["@minigame/core"],
  esbuildOptions(options) {
    options.charset = "utf8";
  },
});
```

### Initial index.ts Stub

```typescript
import { BaseGame } from "@minigame/core";
import type { GameConfig } from "@minigame/core";

/**
 * Snake game state
 */
export interface SnakeGameState {
  score: number;
  level: number;
}

/**
 * Classic Snake game implementation
 */
export class SnakeGame extends BaseGame<SnakeGameState> {
  protected init(): void {
    // TODO: Implement in Story 4.2
  }

  protected update(deltaTime: number): void {
    // TODO: Implement in Story 4.2
  }

  protected render(): void {
    // TODO: Implement in Story 4.2
  }

  protected cleanup(): void {
    // TODO: Implement in Story 4.2
  }

  protected getCurrentState(): SnakeGameState {
    return {
      score: 0,
      level: 1,
    };
  }
}
```

---

## Definition of Done

- [ ] packages/snake/ directory structure created
- [ ] package.json configured with @minigame/core dependency
- [ ] tsconfig.json extends root and references core
- [ ] tsup.config.ts configured for multi-format builds
- [ ] src/index.ts exports SnakeGame stub
- [ ] Zero runtime dependencies beyond core
- [ ] Build successful: `pnpm build` works
- [ ] Workspace dependency linked correctly
- [ ] Git commit with snake package setup

---

## Related FRs

- **FR43**: Game packages published as @minigame/{game-name}
- **FR45**: Core is dependency of game packages
- **FR53**: Games depend only on core (no other runtime deps)

---

## Dev Notes

### Workspace Dependency

Using `"@minigame/core": "workspace:^"` ensures:

- Local development uses workspace version
- Replaced with actual version on publish
- Hot reload works during development

### External Dependencies

Mark @minigame/core as `external` in tsup config:

- Prevents bundling core into snake
- Users install both packages
- Smaller bundle sizes
- Shared code between games

### Next Story Context

After this story, Story 4.2 will implement the actual Snake game logic, extending the SnakeGame class created here.

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
