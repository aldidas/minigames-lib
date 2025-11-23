# Story 2.2: TypeScript Type Definitions

**Epic:** Core Package - Game Framework  
**Story ID:** 2.2  
**Story Key:** 2-2-typescript-type-definitions  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want core TypeScript types and interfaces defined,  
So that all games have consistent type contracts.

---

## Acceptance Criteria

### AC1: Event Type Definitions

**Given** core package structure exists  
**When** I create event type definitions  
**Then**:

- src/types/events.ts exists
- GameEvent type union: 'gameStarted' | 'gameFinished' | 'gameOver' | 'scoreUpdate' | 'soundMuted' | 'soundUnmuted' (FR9-FR13)
- BaseEventData interface with timestamp, playerName?, gameId? (FR14)
- GameOverData interface extends BaseEventData with reason, finalScore (FR15)
- ScoreUpdateData interface extends BaseEventData with score, delta
- EventCallback type for event handlers
- All types fully documented with JSDoc (FR38, FR41)

### AC2: Game State and Config Types

**Given** event types exist  
**When** I create game and config type definitions  
**Then**:

- src/types/game.ts exists
- GameState type: 'idle' | 'running' | 'paused' | 'finished' (FR18)
- GameConfig interface with colors, typography, styling, animation, audio (FR18-FR22)
- All config properties properly typed
- JSDoc explains each config property (FR40)

### AC3: Type Export and Usage

**Given** all types are defined  
**When** I export types from index  
**Then**:

- All types exported from src/types/index.ts
- Re-exported from src/index.ts
- No `any` types used (FR39)
- IntelliSense documentation available (FR40)
- Types compile without errors

---

## Tasks & Subtasks

### Task 1: Create Event Type Definitions

- [ ] Create src/types/events.ts
- [ ] Define GameEvent union type
- [ ] Create BaseEventData interface
- [ ] Create GameOverData interface
- [ ] Create ScoreUpdateData interface
- [ ] Create EventCallback type
- [ ] Add comprehensive JSDoc comments

### Task 2: Create Game State and Config Types

- [ ] Create src/types/game.ts
- [ ] Define GameState type
- [ ] Create GameConfig interface with all properties
- [ ] Add JSDoc for each config property
- [ ] Document color scheme options
- [ ] Document typography options

### Task 3: Create Type Barrel Exports

- [ ] Create src/types/index.ts
- [ ] Export all types from events.ts
- [ ] Export all types from game.ts
- [ ] Update src/index.ts to re-export types

### Task 4: Verify Types

- [ ] Build package successfully
- [ ] Verify .d.ts files generated
- [ ] No TypeScript errors
- [ ] IntelliSense works in IDE

---

## Prerequisites

**Story 2.1: Core Package Structure** - backlog

---

## Dependencies

**Blocks:**

- Story 2.3: Event Emitter Implementation
- All Epic 2 stories

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 3**: Event System with typed events
- **Decision 7**: UI Customization Architecture
- **FR9-FR17**: Complete event system requirements
- **FR18-FR24**: UI customization requirements
- **FR36-FR41**: TypeScript support requirements

### Event Types (events.ts)

```typescript
/**
 * All possible game events that can be emitted
 */
export type GameEvent =
  | "gameStarted"
  | "gameFinished"
  | "gameOver"
  | "scoreUpdate"
  | "soundMuted"
  | "soundUnmuted";

/**
 * Base event data included with every event emission
 */
export interface BaseEventData {
  /** ISO 8601 timestamp of when the event occurred */
  timestamp: string;
  /** Optional player name */
  playerName?: string;
  /** Optional unique game instance ID */
  gameId?: string;
}

/**
 * Data emitted with gameOver event
 */
export interface GameOverData extends BaseEventData {
  /** Reason for game over (e.g., 'collision', 'timeout') */
  reason: string;
  /** Final score at game over */
  finalScore: number;
}

/**
 * Data emitted with scoreUpdate event
 */
export interface ScoreUpdateData extends BaseEventData {
  /** Current score */
  score: number;
  /** Change in score since last update */
  delta: number;
}

/**
 * Type for event callback functions
 */
export type EventCallback<TData = BaseEventData> = (data: TData) => void;
```

### Game Types (game.ts)

```typescript
/**
 * Possible states a game can be in
 */
export type GameState = "idle" | "running" | "paused" | "finished";

/**
 * Configuration for game appearance and behavior
 */
export interface GameConfig {
  /**
   * Color scheme for the game
   */
  colors: {
    /** Primary color (e.g., for main game elements) */
    primary: string;
    /** Secondary color (e.g., for accents) */
    secondary: string;
    /** Background color */
    background: string;
    /** Text color */
    text: string;
  };

  /**
   * Typography settings
   */
  typography: {
    /** Font family (e.g., 'Arial', 'system-ui') */
    fontFamily: string;
    /** Font sizes for different text elements */
    fontSize: {
      small: number;
      medium: number;
      large: number;
    };
  };

  /**
   * Visual styling options
   */
  styling: {
    /** Border radius for rounded corners (px) */
    borderRadius: number;
    /** Border width for game elements (px) */
    borderWidth: number;
    /** Shadow blur amount (px) */
    shadowBlur: number;
  };

  /**
   * Animation settings
   */
  animation: {
    /** Animation speed multiplier (1.0 = normal) */
    speed: number;
  };

  /**
   * Audio settings
   */
  audio: {
    /** Volume level (0.0 - 1.0) */
    volume: number;
    /** Whether audio is muted */
    muted: boolean;
  };
}
```

---

## Definition of Done

- [ ] src/types/events.ts created with all event types
- [ ] src/types/game.ts created with GameState and GameConfig
- [ ] src/types/index.ts created as barrel export
- [ ] All types exported from src/index.ts
- [ ] Comprehensive JSDoc comments on all types
- [ ] No `any` types used
- [ ] TypeScript compiles without errors
- [ ] .d.ts files generated correctly
- [ ] Git commit with type definitions

---

## Related FRs

- **FR9-FR17**: Event system (gameStarted, gameFinished, gameOver, scoreUpdate, soundMuted, soundUnmuted, on/off methods)
- **FR14**: Event payloads include timestamp, playerName, gameId
- **FR15**: gameOver event includes reason and finalScore
- **FR18-FR22**: UI customization (colors, typography, styling, animation, audio)
- **FR36-FR41**: Full TypeScript support (types, no any, autocomplete, IntelliSense, JSDoc)

---

## Dev Notes

### Type Safety Benefits

Strict typing provides:

- **Compile-time errors**: Catch bugs before runtime
- **IntelliSense**: IDE autocomplete and hints
- **Refactoring safety**: Type errors show breaking changes
- **Documentation**: Types are self-documenting

### Event Data Pattern

All event data extends `BaseEventData` to ensure:

- Consistent timestamp tracking
- Optional player name for all events
- Optional game ID for multi-instance tracking

### Next Story Context

After this story, Story 2.3 will implement the EventEmitter class using these type definitions, providing type-safe event handling.

---

## Dev Agent Record

### Implementation Status

**Status:** ✅ COMPLETE  
**Implemented By:** Amelia (Dev Agent)  
**Date:** 2025-11-24  
**All ACs Satisfied:** Yes

- ✅ AC1: Event Type Definitions - events.ts with all types
- ✅ AC2: Game State and Config Types - game.ts created
- ✅ AC3: Type Export and Usage - Exported from index

### Completion Notes

Successfully created all TypeScript type definitions:

1. **src/types/events.ts** - Created:

   - GameEvent union type (6 events)
   - BaseEventData interface
   - GameOverData, ScoreUpdateData interfaces
   - EventCallback type
   - Comprehensive JSDoc on all types

2. **src/types/game.ts** - Created:

   - GameState type (idle/running/paused/finished)
   - GameConfig interface with colors, typography, styling, animation, audio
   - JSDoc documentation for each property

3. **src/types/index.ts** - Barrel export for all types

4. **src/index.ts** - Updated to re-export all types

No `any` types used, fully type-safe.

### Debug Log

No issues encountered.

### Files Changed

**Created:**

- `/packages/core/src/types/events.ts`
- `/packages/core/src/types/game.ts`
- `/packages/core/src/types/index.ts`

**Modified:**

- `/packages/core/src/index.ts` - Added type exports

**Git Commit:** Part of `feat: Add TypeScript types and EventEmitter to @minigame/core`

---

## Change Log

| Date       | Version | Changes                | Author       |
| ---------- | ------- | ---------------------- | ------------ |
| 2025-11-24 | 1.0     | Initial story creation | SM (Bob)     |
| 2025-11-24 | 2.0     | Story implemented      | Dev (Amelia) |
