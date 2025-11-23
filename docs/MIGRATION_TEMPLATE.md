# Migration Guide Template

Use this template when creating migration guides for breaking changes (major version bumps).

---

# Migration Guide: v[OLD] → v[NEW]

**Release Date:** [Date]  
**Packages Affected:** @minigame/[package-names]

## Overview

Brief summary of what changed and why.

## Breaking Changes

### 1. [Breaking Change Title]

**What Changed:**

- Description of what was changed/removed/renamed

**Before (v[OLD]):**

```typescript
// Old code example
```

**After (v[NEW]):**

```typescript
// New code example
```

**Migration Steps:**

1. Step-by-step instructions
2. What to change in user code
3. Testing recommendations

**Rationale:**
Why this breaking change was necessary.

---

### 2. [Another Breaking Change]

[Same structure as above]

---

## New Features

### [Feature Name]

Brief description of new features added in this version.

**Example:**

```typescript
// Feature usage example
```

---

## Bug Fixes

- Fix 1
- Fix 2
- Fix 3

---

## Deprecations

### [Deprecated API]

**Deprecated:** `oldMethod()`  
**Use Instead:** `newMethod()`  
**Removal:** Will be removed in v[VERSION]

---

## Migration Checklist

Use this checklist to ensure complete migration:

- [ ] Update package versions in package.json
- [ ] Update API calls (see Breaking Changes above)
- [ ] Update configuration objects
- [ ] Update event handlers
- [ ] Run tests
- [ ] Check for TypeScript errors
- [ ] Review deprecation warnings
- [ ] Update documentation

---

## Need Help?

- **Issues:** [GitHub Issues](https://github.com/aldidas/minigames-lib/issues)
- **Discussions:** [GitHub Discussions](https://github.com/aldidas/minigames-lib/discussions)
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

## Example Migration Guide

# Migration Guide: v1.x → v2.0

**Release Date:** 2025-12-01  
**Packages Affected:** @minigame/core, @minigame/snake, @minigame/pong

## Overview

Version 2.0 introduces a new event system architecture for better TypeScript support and performance. The main breaking change is the event naming convention.

## Breaking Changes

### 1. Event Names Changed

**What Changed:**
Event names now use colon notation instead of camelCase for better namespacing.

**Before (v1.x):**

```typescript
game.on("gameStarted", (data) => {
  console.log("Started");
});
```

**After (v2.0):**

```typescript
game.on("game:started", (data) => {
  console.log("Started");
});
```

**Migration Steps:**

1. Find all `game.on()` and `game.off()` calls
2. Replace event names:
   - `gameStarted` → `game:started`
   - `gameFinished` → `game:finished`
   - `gameOver` → `game:over`
   - `scoreUpdate` → `score:update`
   - `soundMuted` → `sound:muted`
   - `soundUnmuted` → `sound:unmuted`
3. Test event handlers still work

**Rationale:**
Colon notation provides better namespacing and is a common pattern in event systems.

### 2. GameConfig TypeScript Interface

**What Changed:**
`GameConfig` is now a required type parameter when extending BaseGame.

**Before (v1.x):**

```typescript
class MyGame extends BaseGame {
  // config was loosely typed
}
```

**After (v2.0):**

```typescript
class MyGame extends BaseGame<MyGameState> {
  // TState is now required
  protected getCurrentState(): MyGameState {
    return { score: this.score };
  }
}
```

**Migration Steps:**

1. Define your game state interface
2. Pass it as type parameter to BaseGame
3. Implement getCurrentState() method
4. Update TypeScript compiler if needed

**Rationale:**
Better type safety for game state management.

## New Features

### Event Middleware

Add middleware to intercept and transform events:

```typescript
game.use((event, data) => {
  console.log("Event:", event, data);
  return data;
});
```

## Migration Checklist

- [ ] Update event names (camelCase → colon notation)
- [ ] Add state type parameter to BaseGame
- [ ] Implement getCurrentState() method
- [ ] Run TypeScript compilation
- [ ] Test all event handlers
- [ ] Update tests

---
