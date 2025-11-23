# Story 2.3: Event Emitter Implementation

**Epic:** Core Package - Game Framework  
**Story ID:** 2.3  
**Story Key:** 2-3-event-emitter-implementation  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want a type-safe event emitter,  
So that games can emit events and developers can subscribe to them.

---

## Acceptance Criteria

### AC1: EventEmitter Class Implementation

**Given** type definitions exist  
**When** I implement EventEmitter class  
**Then**:

- src/EventEmitter.ts exists
- EventEmitter class with private callback registry
- Callback registry uses Map<GameEvent, Set<EventCallback>>
- Class is generic to support custom event types
- All methods properly typed with TypeScript

### AC2: Event Subscription Methods

**Given** EventEmitter exists  
**When** I use subscription methods  
**Then**:

- on(event: GameEvent, callback: EventCallback): void method (FR16)
- Registers callback for specific event
- Multiple callbacks can be registered for same event
- Type-safe: prevents invalid event types at compile time
- Returns void (no unsubscribe return value)

### AC3: Event Unsubscription and Emission

**Given** EventEmitter has subscriptions  
**When** I use unsubscribe and emit methods  
**Then**:

- off(event: GameEvent, callback: EventCallback): void method (FR17)
- Correctly removes specific callback reference
- emit(event: GameEvent, data?: EventData): void method (protected)
- Calls all registered callbacks for event
- Passes event data to each callback
- Handles missing callbacks gracefully

---

## Tasks & Subtasks

### Task 1: Create EventEmitter Class

- [ ] Create src/EventEmitter.ts
- [ ] Define EventEmitter class
- [ ] Add private listeners Map
- [ ] Add JSDoc class documentation

### Task 2: Implement on() Method

- [ ] Implement on(event, callback) method
- [ ] Initialize Set if event not in Map
- [ ] Add callback to Set
- [ ] Add JSDoc documentation
- [ ] Type-safe event parameter

### Task 3: Implement off() Method

- [ ] Implement off(event, callback) method
- [ ] Remove specific callback from Set
- [ ] Handle case where event/callback doesn't exist
- [ ] Add JSDoc documentation

### Task 4: Implement emit() Method

- [ ] Implement protected emit(event, data) method
- [ ] Get all callbacks for event
- [ ] Call each callback with data
- [ ] Handle errors in callbacks gracefully
- [ ] Add JSDoc documentation

### Task 5: Write Unit Tests (if time permits)

- [ ] Test on() adds callbacks
- [ ] Test multiple callbacks for same event
- [ ] Test off() removes specific callback
- [ ] Test emit() calls all callbacks
- [ ] Test type safety at compile time

---

## Prerequisites

**Story 2.1: Core Package Structure** - backlog  
**Story 2.2: TypeScript Type Definitions** - backlog

---

## Dependencies

**Blocks:**

- Story 2.4: BaseGame Abstract Class

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 3**: Abstract Base Class Pattern + Event Emitter
- **FR9-FR17**: Complete event system requirements
- **FR16**: on() method for subscribing to events
- **FR17**: off() method for unsubscribing from events

### EventEmitter Implementation

```typescript
import type { GameEvent, EventCallback, BaseEventData } from "./types";

/**
 * Type-safe event emitter for game events
 * Manages event subscriptions and emissions
 */
export class EventEmitter {
  private listeners: Map<GameEvent, Set<EventCallback>> = new Map();

  /**
   * Subscribe to a game event
   * @param event - The event type to listen for
   * @param callback - Function to call when event is emitted
   * @example
   * emitter.on('gameStarted', (data) => {
   *   console.log('Game started at', data.timestamp);
   * });
   */
  public on(event: GameEvent, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Unsubscribe from a game event
   * @param event - The event type to stop listening for
   * @param callback - The specific callback to remove
   * @example
   * emitter.off('gameStarted', myCallback);
   */
  public off(event: GameEvent, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit a game event to all subscribers
   * Protected - only called by game implementations
   * @param event - The event type to emit
   * @param data - Optional event data
   */
  protected emit(event: GameEvent, data?: BaseEventData): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data || { timestamp: new Date().toISOString() });
        } catch (error) {
          // Log error but don't break other callbacks
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }
}
```

### Usage Example

```typescript
const emitter = new EventEmitter();

// Subscribe to events
const handleGameStart = (data: BaseEventData) => {
  console.log("Game started:", data.timestamp);
};

emitter.on("gameStarted", handleGameStart);
emitter.on("scoreUpdate", (data) => {
  console.log("Score updated:", data);
});

// Emit events (from game code)
emitter.emit("gameStarted", {
  timestamp: new Date().toISOString(),
  playerName: "Alice",
  gameId: "game-123",
});

// Unsubscribe
emitter.off("gameStarted", handleGameStart);
```

### Design Decisions

**Why Map<GameEvent, Set<EventCallback>>?**

- **Map**: Fast O(1) lookup by event type
- **Set**: Prevents duplicate callbacks, easy add/remove
- **Type-safe**: GameEvent ensures only valid events

**Why protected emit()?**

- Games emit events, but external users shouldn't
- BaseGame will extend EventEmitter and use emit() internally
- Public API only exposes on() and off()

**Error Handling in emit()**

- Wrap each callback in try-catch
- One callback error doesn't break others
- Log error for debugging

---

## Definition of Done

- [ ] src/EventEmitter.ts created
- [ ] on() method implemented
- [ ] off() method implemented
- [ ] emit() method implemented (protected)
- [ ] Comprehensive JSDoc on all methods
- [ ] TypeScript compiles without errors
- [ ] Type safety verified (compile-time checks)
- [ ] Export from src/index.ts
- [ ] Git commit with EventEmitter implementation

---

## Related FRs

- **FR16**: on(event, callback) method for subscribing to events
- **FR17**: off(event, callback) method for unsubscribing

---

## Dev Notes

### Event Emitter Pattern

The event emitter pattern provides:

- **Decoupling**: Game logic separate from event handlers
- **Flexibility**: Multiple listeners per event
- **Type safety**: Compile-time event type checking
- **Simplicity**: Simple API (on, off, emit)

### Alternative Approaches Considered

**Custom event bus**: More complex, unnecessary
**Native EventTarget**: Not type-safe for custom events
**RxJS Observables**: Too heavy, adds dependency

Simple Map/Set approach is lightweight and type-safe.

### Testing Strategies

Unit tests should verify:

1. on() adds callbacks correctly
2. Multiple callbacks for same event work
3. off() removes only specified callback
4. emit() calls all registered callbacks
5. Error in one callback doesn't break others

### Next Story Context

After this story, Story 2.4 will implement the BaseGame abstract class, which will extend EventEmitter to provide the public event API.

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
