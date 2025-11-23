# Story 2.5: GameConfig Implementation

**Epic:** Core Package - Game Framework  
**Story ID:** 2.5  
**Story Key:** 2-5-gameconfig-implementation  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want a comprehensive GameConfig type with default values,  
So that I can customize game appearance and behavior consistently.

---

## Acceptance Criteria

### AC1: GameConfig Interface

**Given** type definitions exist  
**When** I implement GameConfig  
**Then**:

- src/GameConfig.ts exports GameConfig interface
- Full configuration structure:
  - colors: { primary, secondary, background, text } (FR18)
  - typography: { fontFamily, fontSize: { small, medium, large } } (FR19)
  - styling: { borderRadius, borderWidth, shadowBlur } (FR20)
  - animation: { speed } (FR21)
  - audio: { volume, muted } (FR22)
- All properties properly typed with JSDoc

### AC2: Default Configuration

**Given** GameConfig interface exists  
**When** I create default configuration  
**Then**:

- defaultGameConfig object exported
- Sensible default values for all properties
- Default colors follow modern design aesthetic
- Default typography uses web-safe fonts
- Defaults documented with JSDoc

### AC3: Configuration Merging

**Given** default config exists  
**When** I implement config merging  
**Then**:

- mergeConfig utility function exported
- Deep merge of user config with defaults
- Partial<GameConfig> support (FR23)
- User values override defaults
- Type-safe config merging

---

## Tasks & Subtasks

### Task 1: Create GameConfig File

- [ ] Create src/GameConfig.ts
- [ ] Import GameConfig type from types/game.ts
- [ ] Add file-level JSDoc documentation

### Task 2: Create Default Config

- [ ] Export defaultGameConfig object
- [ ] Set default colors (modern, accessible)
- [ ] Set default typography (system fonts)
- [ ] Set default styling (modern, clean)
- [ ] Set default animation speed
- [ ] Set default audio settings
- [ ] Document each default choice

### Task 3: Implement Config Merge Utility

- [ ] Create mergeConfig function
- [ ] Accept Partial<GameConfig> parameter
- [ ] Deep merge with defaultGameConfig
- [ ] Return full GameConfig
- [ ] Add JSDoc documentation
- [ ] Handle nested objects correctly

### Task 4: Export from Index

- [ ] Export defaultGameConfig from src/index.ts
- [ ] Export mergeConfig from src/index.ts
- [ ] Verify exports in build output

---

## Prerequisites

**Story 2.1: Core Package Structure** - backlog  
**Story 2.2: TypeScript Type Definitions** - backlog  
**Story 2.4: BaseGame Abstract Class** - backlog

---

## Dependencies

**Blocks:**

- Story 2.6: Core Package Exports & Build
- All game customization (Epic 4)

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 7**: Configuration object pattern
- **FR18-FR24**: Complete UI customization requirements
- **FR23**: Users can override specific config properties
- **FR24**: Configurations consistent across all games

### Default Configuration

```typescript
import type { GameConfig } from "./types";

/**
 * Default game configuration with sensible defaults
 * Can be partially overridden when creating a game instance
 */
export const defaultGameConfig: GameConfig = {
  colors: {
    primary: "#3b82f6", // Modern blue
    secondary: "#8b5cf6", // Purple accent
    background: "#1f2937", // Dark gray
    text: "#f9fafb", // Near white
  },
  typography: {
    fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
    fontSize: {
      small: 12,
      medium: 16,
      large: 24,
    },
  },
  styling: {
    borderRadius: 8, // Modern rounded corners
    borderWidth: 2,
    shadowBlur: 10,
  },
  animation: {
    speed: 1.0, // Normal speed (1.0 = 100%)
  },
  audio: {
    volume: 0.7, // 70% volume
    muted: false,
  },
};
```

### Config Merge Utility

```typescript
/**
 * Deep merge user config with default config
 * @param userConfig - Partial user configuration
 * @returns Complete GameConfig with merged values
 */
export function mergeConfig(userConfig?: Partial<GameConfig>): GameConfig {
  if (!userConfig) {
    return { ...defaultGameConfig };
  }

  return {
    colors: {
      ...defaultGameConfig.colors,
      ...userConfig.colors,
    },
    typography: {
      ...defaultGameConfig.typography,
      fontSize: {
        ...defaultGameConfig.typography.fontSize,
        ...userConfig.typography?.fontSize,
      },
      ...(userConfig.typography || {}),
    },
    styling: {
      ...defaultGameConfig.styling,
      ...userConfig.styling,
    },
    animation: {
      ...defaultGameConfig.animation,
      ...userConfig.animation,
    },
    audio: {
      ...defaultGameConfig.audio,
      ...userConfig.audio,
    },
  };
}
```

### Usage Example

```typescript
import { BaseGame, mergeConfig } from "@minigame/core";

// Use all defaults
const game1 = new MyGame(canvas);

// Override specific colors
const game2 = new MyGame(canvas, {
  colors: {
    primary: "#ff0000", // Red primary
    // secondary, background, text use defaults
  },
});

// Override multiple properties
const game3 = new MyGame(canvas, {
  colors: {
    primary: "#00ff00",
  },
  animation: {
    speed: 1.5, // 50% faster
  },
  audio: {
    muted: true,
  },
});
```

---

## Definition of Done

- [ ] src/GameConfig.ts created
- [ ] defaultGameConfig exported with all defaults
- [ ] mergeConfig utility function implemented
- [ ] Deep merge handles nested objects correctly
- [ ] All exports available from src/index.ts
- [ ] Comprehensive JSDoc documentation
- [ ] TypeScript compiles without errors
- [ ] Git commit with GameConfig implementation

---

## Related FRs

- **FR18**: Customizable colors (primary, secondary, background, text)
- **FR19**: Customizable typography (font family, sizes)
- **FR20**: Customizable styling (border radius, width, shadow)
- **FR21**: Customizable animation speed
- **FR22**: Customizable audio (volume, muted)
- **FR23**: Developers override only specific properties
- **FR24**: Configurations consistent across games

---

## Dev Notes

### Default Color Choices

Colors chosen for:

- **Accessibility**: Good contrast ratios
- **Modern aesthetic**: Following current design trends
- **Versatility**: Works for various game types
- **Dark theme**: Popular in gaming UIs

### Deep Merge Importance

Shallow merge would require users to specify ALL nested properties:

```typescript
// Bad (shallow merge)
config: {
  colors: {
    primary, secondary, background, text;
  } // Must specify all 4
}

// Good (deep merge)
config: {
  colors: {
    primary;
  } // Only override what you need
}
```

### Type Safety

Partial<GameConfig> ensures:

- Only valid properties can be overridden
- TypeScript catches typos at compile time
- IntelliSense shows available options

### Next Story Context

After this story, Story 2.6 will export all components and build the package, making @minigame/core ready for use.

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
