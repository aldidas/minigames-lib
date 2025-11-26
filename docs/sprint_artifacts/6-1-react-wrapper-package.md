# Story 6.1: React Wrapper Package

**Epic:** Framework Integrations  
**Story ID:** 6.1  
**Story Key:** 6-1-react-wrapper-package  
**Status:** done  
**Created:** 2025-11-24

---

## User Story

As a React developer,  
I want React component wrappers for all games,  
So that I can use games as native React components with props and events.

---

## Acceptance Criteria

### AC1: Package Structure & Configuration

**Given** the monorepo structure exists  
**When** I create the React wrapper package  
**Then**:

- `packages/react/` directory created following monorepo pattern
- `package.json` configured:
  - name: "@minigame/react" (FR79)
  - peerDependencies: "react": "^18.0.0" (FR80)
  - dependencies: @minigame/core, @minigame/snake, @minigame/pong, @minigame/breakout
  - version: 1.0.0 (synced with monorepo)
- `tsconfig.json` extends root with React types
- `tsup.config.ts` for ESM/CJS/IIFE builds
- `src/index.ts` as entry point

### AC2: React Component Implementation

**Given** all MVP games are complete  
**When** I implement React components  
**Then**:

- Component-based API (not hooks) (FR77)
- Three components exported (FR73):
  - `SnakeGame`
  - `PongGame`
  - `BreakoutGame`
- Each component:
  - Accepts `config` prop (FR74)
  - Supports manual control via refs (start, stop, pause, resume, mute, unmute)
  - Exposes GameHandle interface for external control
  - autoStart prop (default: true) to control auto-start behavior
  - Manages canvas ref internally
  - Cleans up on unmount

### AC3: Props & Events

**Given** React components are implemented  
**When** I use a component  
**Then**:

- Props interface includes:
  - `config?: Partial<GameConfig>` (FR74)
  - `onGameStarted?: (data: GameStartedData) => void` (FR75)
  - `onGameOver?: (data: GameOverData) => void` (FR75)
  - `onScoreUpdate?: (data: ScoreUpdateData) => void` (FR75)
  - `onGameFinished?: (data: GameFinishedData) => void` (FR75)
- All event callbacks are optional
- Component handles config changes reactively

### AC4: TypeScript Support

**Given** TypeScript definitions are needed  
**When** I build the package  
**Then**:

- Full TypeScript support (FR76)
- Exported types:
  - `SnakeGameProps`, `PongGameProps`, `BreakoutGameProps`
  - `SnakeGameHandle`, `PongGameHandle`, `BreakoutGameHandle` (for manual control)
  - Event callback types
  - Re-export GameConfig from @minigame/core
- No `any` usage in public APIs
- IntelliSense works in VSCode

### AC5: Build & Distribution

**Given** the package is complete  
**When** I build the package  
**Then**:

- ESM output: `dist/index.js`
- CJS output: `dist/index.cjs`
- Type definitions: `dist/index.d.ts`, `dist/index.d.cts`
- Source maps included
- Bundle size < 10kb (wrappers are thin)

### AC6: Testing

**Given** components are implemented  
**When** I write tests  
**Then**:

- Test framework: Vitest + React Testing Library (FR90)
- Test coverage:
  - Component mounts with canvas
  - Config prop passed to game instance
  - Event callbacks triggered correctly
  - Cleanup on unmount
  - Config changes trigger reinitialization
- All tests passing

### AC7: Documentation

**Given** the package is ready  
**When** I write the README  
**Then**:

- `packages/react/README.md` includes:
  - Installation instructions
  - Quick start example (< 10 lines)
  - Props API reference
  - Event handling examples
  - TypeScript usage example
  - All three game components documented

---

## Tasks & Subtasks

### Task 1: Package Setup

- [ ] Create `packages/react/` directory structure
- [ ] Create `package.json` with correct dependencies
- [ ] Create `tsconfig.json` extending root
- [ ] Create `tsup.config.ts` for builds
- [ ] Create `src/index.ts` entry point

### Task 2: Implement Base Component Pattern

- [ ] Create generic game component wrapper pattern
- [ ] Implement canvas ref management
- [ ] Implement lifecycle (mount/unmount)
- [ ] Implement props-to-config mapping
- [ ] Implement event callback wiring

### Task 3: Implement Game Components

- [ ] Implement `SnakeGame` component
- [ ] Implement `PongGame` component
- [ ] Implement `BreakoutGame` component
- [ ] Export all components from index

### Task 4: TypeScript Types

- [ ] Define props interfaces for each component
- [ ] Export event callback types
- [ ] Re-export GameConfig from core
- [ ] Ensure no `any` types

### Task 5: Testing

- [ ] Setup Vitest + React Testing Library
- [ ] Write component mount tests
- [ ] Write props handling tests
- [ ] Write event callback tests
- [ ] Write cleanup tests
- [ ] Verify all tests pass

### Task 6: Documentation

- [ ] Write README with installation
- [ ] Add quick start examples
- [ ] Document all props and events
- [ ] Add TypeScript usage examples

### Task 7: Build & Verify

- [ ] Run build and verify outputs
- [ ] Check bundle sizes
- [ ] Verify type definitions
- [ ] Test in example React app

---

## Prerequisites

**Epic 4 Complete:** All MVP games (Snake, Pong, Breakout) implemented ✅

---

## Dependencies

**Blocks:**

- Story 6.2 (Vue wrapper will follow same pattern)

---

## Technical Notes

### Component Implementation Pattern

```tsx
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { SnakeGame as SnakeGameVanilla } from "@minigame/snake";
import type { GameConfig, GameOverData, ScoreUpdateData } from "@minigame/core";

export interface SnakeGameProps {
  config?: Partial<GameConfig>;
  onGameStarted?: (data: any) => void;
  onGameOver?: (data: GameOverData) => void;
  onScoreUpdate?: (data: ScoreUpdateData) => void;
  onGameFinished?: (data: any) => void;
  autoStart?: boolean; // default: true
}

export interface SnakeGameHandle {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  mute: () => void;
  unmute: () => void;
  setPlayerName: (name: string) => void;
}

export const SnakeGame = forwardRef<SnakeGameHandle, SnakeGameProps>(
  function SnakeGame(
    {
      config,
      onGameStarted,
      onGameOver,
      onScoreUpdate,
      onGameFinished,
      autoStart = true,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<SnakeGameVanilla | null>(null);

    // Expose game control methods via ref
    useImperativeHandle(ref, () => ({
      start: () => gameRef.current?.start(),
      stop: () => gameRef.current?.stop(),
      pause: () => gameRef.current?.pause(),
      resume: () => gameRef.current?.resume(),
      mute: () => gameRef.current?.mute(),
      unmute: () => gameRef.current?.unmute(),
      setPlayerName: (name: string) => gameRef.current?.setPlayerName(name),
    }));

    useEffect(() => {
      if (!canvasRef.current) return;

      // Create game instance
      const game = new SnakeGameVanilla(canvasRef.current, config);

      // Wire up event callbacks
      if (onGameStarted) game.on("gameStarted", onGameStarted);
      if (onGameOver) game.on("gameOver", onGameOver);
      if (onScoreUpdate) game.on("scoreUpdate", onScoreUpdate);
      if (onGameFinished) game.on("gameFinished", onGameFinished);

      gameRef.current = game;

      // Auto-start if enabled
      if (autoStart) {
        game.start();
      }

      // Cleanup
      return () => {
        game.stop();
      };
    }, [
      config,
      onGameStarted,
      onGameOver,
      onScoreUpdate,
      onGameFinished,
      autoStart,
    ]);

    return <canvas ref={canvasRef} width={600} height={600} />;
  }
);
```

### Manual Control Usage Example

```tsx
import { useRef } from "react";
import { SnakeGame, type SnakeGameHandle } from "@minigame/react";

function App() {
  const gameRef = useRef<SnakeGameHandle>(null);

  return (
    <div>
      <SnakeGame
        ref={gameRef}
        autoStart={false}
        onScoreUpdate={(data) => console.log("Score:", data.score)}
      />
      <div>
        <button onClick={() => gameRef.current?.start()}>Start</button>
        <button onClick={() => gameRef.current?.pause()}>Pause</button>
        <button onClick={() => gameRef.current?.resume()}>Resume</button>
        <button onClick={() => gameRef.current?.stop()}>Stop</button>
      </div>
    </div>
  );
}
```

### Package Structure

```
packages/react/
├── src/
│   ├── index.ts
│   ├── SnakeGame.tsx
│   ├── PongGame.tsx
│   └── BreakoutGame.tsx
├── tests/
│   ├── SnakeGame.test.tsx
│   ├── PongGame.test.tsx
│   └── BreakoutGame.test.tsx
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── README.md
```

### Testing Example

```tsx
import { render } from "@testing-library/react";
import { SnakeGame } from "../src/SnakeGame";

describe("SnakeGame", () => {
  it("renders canvas element", () => {
    const { container } = render(<SnakeGame />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("calls onGameOver callback", async () => {
    const handleGameOver = vi.fn();
    render(<SnakeGame onGameOver={handleGameOver} />);

    // Trigger game over somehow
    // Assert handleGameOver was called
  });
});
```

---

## Definition of Done

- [ ] Package structure created in `packages/react/`
- [ ] All three game components implemented
- [ ] Props and events working correctly
- [ ] Full TypeScript support with exported types
- [ ] Build outputs (ESM, CJS, types) generated
- [ ] Tests written and passing (FR90)
- [ ] README.md complete with examples
- [ ] Bundle size verified < 10kb
- [ ] Manually tested in example React app
- [ ] Git commit with implementation

---

## Related FRs

- **FR73-FR80**: React wrapper requirements
- **FR90**: Framework wrapper testing

---

## Dev Notes

### React Version Support

Using React 18+ peer dependency ensures:

- Concurrent features available
- Automatic batching
- Modern hooks API
- TypeScript 4.7+ required

### Canvas Sizing

Components render canvas with fixed dimensions (600x600). Consider:

- Making dimensions configurable via props (future enhancement)
- Responsive sizing based on container
- CSS styling support

### Manual Control

Components use `forwardRef` and `useImperativeHandle` to expose game control methods:

- `start()`, `stop()`, `pause()`, `resume()` - Game lifecycle control
- `mute()`, `unmute()` - Audio control
- `setPlayerName(name)` - Set player identifier

This implements FR1-FR4 (uniform API) for React framework wrappers.

---

## Dev Agent Record

### Implementation Status

_To be filled by dev agent during implementation_

### Completion Notes

_To be filled by dev agent_

### Files Changed

_To be filled by dev agent_

---

## Change Log

| Date       | Version | Changes                | Author   |
| ---------- | ------- | ---------------------- | -------- |
| 2025-11-24 | 1.0     | Initial story creation | SM (Bob) |
