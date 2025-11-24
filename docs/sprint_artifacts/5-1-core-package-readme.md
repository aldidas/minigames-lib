# Story 5.1: Core Package README

**Epic:** Documentation & Developer Experience  
**Story ID:** 5.1  
**Story Key:** 5-1-core-package-readme  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want comprehensive README for @minigame/core,  
So that I understand the framework and can extend BaseGame to create custom games.

---

## Acceptance Criteria

### AC1: Installation & Quick Start

**Given** @minigame/core package exists  
**When** I read the README  
**Then**:

- Installation instructions for npm, pnpm, and yarn (FR55)
- Quick overview of framework architecture
- Simple "getting started" example

### AC2: BaseGame API Documentation

**Given** BaseGame class is the core abstraction  
**When** I reference the API docs  
**Then**:

- All public methods documented (FR57):
  - `start()`, `stop()`, `pause()`, `resume()`
  - `mute()`, `unmute()`, `setPlayerName()`
  - `getGameState()`, `on()`, `off()`
- Method signatures with parameters
- Return types documented

### AC3: Event System Documentation

**Given** events are core to the framework  
**When** I want to handle game events  
**Then**:

- Event callback signatures documented (FR59)
- All standard events listed:
  - gameStarted, gameOver, gameFinished, scoreUpdate
- Event payload types documented
- Examples of event handling

### AC4: GameConfig Documentation

**Given** games are highly customizable  
**When** I want to customize a game  
**Then**:

- Complete GameConfig interface documented (FR58)
- All configuration options explained:
  - colors, typography, styling, animation, audio
- Default values shown
- Customization examples

### AC5: Code Examples

**Given** developers learn by example  
**When** I read the README  
**Then**:

- TypeScript examples (FR60)
- JavaScript examples (FR60)
- All examples are copy-paste ready (FR56)
- Examples are runnable without modification (FR62)

### AC6: Extending BaseGame

**Given** developers may want custom games  
**When** I want to create a new game  
**Then**:

- Guide on extending BaseGame
- Abstract methods explained
- Example custom game implementation

### AC7: Browser Support & Troubleshooting

**Given** developers need compatibility info  
**When** I check requirements  
**Then**:

- Browser support table
- Minimum requirements
- Common troubleshooting scenarios

---

## Prerequisites

**Epic 4 Complete:** All games implemented ✅

---

## Definition of Done

- [ ] packages/core/README.md created
- [ ] Installation instructions included
- [ ] Architecture overview included
- [ ] BaseGame API fully documented
- [ ] Event system fully documented
- [ ] GameConfig options fully documented
- [ ] TypeScript examples included
- [ ] JavaScript examples included
- [ ] Extending BaseGame guide included
- [ ] Browser support documented
- [ ] Troubleshooting section included
- [ ] All code examples tested and runnable
- [ ] Git commit

---

## Related FRs

- **FR55-FR62**: Documentation requirements
- **FR69**: < 30 min integration goal

---

## Change Log

| Date       | Version | Changes                | Author   |
| ---------- | ------- | ---------------------- | -------- |
| 2025-11-24 | 1.0     | Initial story creation | SM (Bob) |
