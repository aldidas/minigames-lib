# Story 2.6: Core Package Exports & Build

**Epic:** Core Package - Game Framework  
**Story ID:** 2.6  
**Story Key:** 2-6-core-package-exports-build  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want @minigame/core properly exported and buildable,  
So that I can install it and use the framework in my projects.

---

## Acceptance Criteria

### AC1: Public API Exports

**Given** all core components exist  
**When** I configure exports  
**Then**:

- src/index.ts exports all public APIs
- Named exports: BaseGame, EventEmitter
- Named exports: GameConfig, defaultGameConfig, mergeConfig
- Named exports: All types (GameEvent, GameState, etc.)
- No internal implementation details exposed
- Clean public API surface

### AC2: Build Output Verification

**Given** exports configured  
**When** I build the package  
**Then**:

- `pnpm build` successfully builds core package
- Build output in dist/:
  - index.js (ESM)
  - index.cjs (CommonJS)
  - index.global.js (UMD/IIFE)
  - index.d.ts (TypeScript declarations)
  - Source maps (.map files)
- All formats contain complete exports
- Zero runtime dependencies in package.json (FR52)

### AC3: Bundle Size and Quality

**Given** package builds successfully  
**When** I verify build quality  
**Then**:

- Bundle size < 20kb gzipped (well under FR51 limit)
- Tree-shakeable exports (ESM)
- No console warnings during build
- Type definitions complete and accurate
- `pnpm -r build` works from root

---

## Tasks & Subtasks

### Task 1: Configure Main Entry Point

- [ ] Update src/index.ts with all exports
- [ ] Export BaseGame class
- [ ] Export EventEmitter class
- [ ] Export GameConfig, defaultGameConfig, mergeConfig
- [ ] Export all types from src/types/
- [ ] Add file-level JSDoc

### Task 2: Verify Package.json Configuration

- [ ] Confirm package.json exports field correct
- [ ] Verify main, module, types fields set
- [ ] Check files field includes only "dist"
- [ ] Ensure zero runtime dependencies
- [ ] Verify version matches Epic 2 (1.0.0)

### Task 3: Build and Verify Outputs

- [ ] Run `pnpm build` from core package
- [ ] Verify dist/index.js (ESM) exists
- [ ] Verify dist/index.cjs (CJS) exists
- [ ] Verify dist/index.global.js (IIFE) exists
- [ ] Verify dist/index.d.ts exists
- [ ] Verify source maps present
- [ ] Check bundle sizes

### Task 4: Test from Root

- [ ] Run `pnpm -r build` from repository root
- [ ] Verify core package builds successfully
- [ ] Check build order (core first if dependencies)
- [ ] Confirm clean build (no errors/warnings)

### Task 5: Create Usage Example (Documentation)

- [ ] Document how to import from @minigame/core
- [ ] Show basic usage example
- [ ] Document available exports
- [ ] Add to package README

---

## Prerequisites

**Story 2.1: Core Package Structure** - backlog  
**Story 2.2: TypeScript Type Definitions** - backlog  
**Story 2.3: Event Emitter Implementation** - backlog  
**Story 2.4: BaseGame Abstract Class** - backlog  
**Story 2.5: GameConfig Implementation** - backlog

---

## Dependencies

**Blocks:**

- Epic 4: MVP Game Implementations (all games need @minigame/core)

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 5**: tsup with unified configuration
- **Decision 6**: Package dependency strategy (zero deps for core)
- **FR48-FR50**: Multi-format builds with source maps
- **FR51**: Bundle size target
- **FR52**: Zero runtime dependencies

### Main Entry Point (src/index.ts)

```typescript
/**
 * @minigame/core - Core framework for minigame library
 *
 * Provides BaseGame class, event system, and TypeScript types
 * for building embeddable HTML5 games.
 *
 * @packageDocumentation
 */

// Core classes
export { BaseGame } from "./BaseGame";
export { EventEmitter } from "./EventEmitter";

// Configuration
export { defaultGameConfig, mergeConfig } from "./GameConfig";

// Type exports
export type {
  // Event types
  GameEvent,
  BaseEventData,
  GameOverData,
  ScoreUpdateData,
  EventCallback,

  // Game types
  GameState,
  GameConfig,
} from "./types";
```

### Usage Example

```typescript
// Install
// npm install @minigame/core

// Import
import { BaseGame, type GameConfig } from "@minigame/core";

// Create a game by extending BaseGame
class MyGame extends BaseGame<{ score: number }> {
  private score = 0;

  protected init(): void {
    // Initialize game state
  }

  protected update(deltaTime: number): void {
    // Update game logic
  }

  protected render(): void {
    // Render game
  }

  protected cleanup(): void {
    // Clean up resources
  }

  protected getCurrentState() {
    return { score: this.score };
  }
}

// Use the game
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const game = new MyGame(canvas, {
  colors: {
    primary: "#ff0000",
  },
});

// Subscribe to events
game.on("scoreUpdate", (data) => {
  console.log("Score:", data.score);
});

// Control the game
game.setPlayerName("Alice");
game.start();
```

### Bundle Size Breakdown

Expected sizes (minified + gzipped):

- **BaseGame**: ~5kb
- **EventEmitter**: ~1kb
- **Types**: 0kb (TypeScript only)
- **GameConfig**: ~1kb
- **Total**: ~7kb (well under 20kb target)

### Verification Checklist

After build, verify:

- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] All exports present in .d.ts
- [ ] ESM tree-shakeable
- [ ] CJS works in Node.js
- [ ] IIFE works in browsers
- [ ] Source maps valid

---

## Definition of Done

- [ ] src/index.ts exports all public APIs
- [ ] Package builds successfully with `pnpm build`
- [ ] All output formats generated (ESM, CJS, IIFE, .d.ts)
- [ ] Source maps included
- [ ] Bundle size < 20kb gzipped
- [ ] Zero runtime dependencies
- [ ] `pnpm -r build` works from root
- [ ] Usage example documented
- [ ] Git commit with complete core package

---

## Related FRs

- **FR48**: Package bundles in ESM, CommonJS, UMD formats
- **FR49**: Minified production builds
- **FR50**: Source maps included
- **FR51**: Bundle size under 50kb (core target: <20kb)
- **FR52**: Zero runtime dependencies

---

## Dev Notes

### Why Multiple Formats?

- **ESM**: Modern bundlers, tree-shaking
- **CJS**: Node.js compatibility
- **IIFE**: Direct browser usage via CDN

### Tree-Shaking

ESM format enables:

- Dead code elimination
- Smaller final bundles
- Import only what you use

Example:

```typescript
// Only BaseGame bundled, not EventEmitter
import { BaseGame } from "@minigame/core";
```

### Publishing Readiness

After this story, @minigame/core is ready for:

- Local workspace usage (Epic 2 complete)
- npm publishing (Epic 3)
- Game implementations (Epic 4)

### Next Epic Context

Epic 2 complete! Next is Epic 3 (Build & Distribution Pipeline) and then Epic 4 (MVP Game Implementations using @minigame/core).

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
