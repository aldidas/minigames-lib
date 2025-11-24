# minigames-lib - Product Requirements Document

**Author:** Aldi
**Date:** 2025-11-23
**Version:** 1.0

---

## Executive Summary

minigames-lib is a TypeScript-based monorepo library designed to provide advertising agencies with a collection of embeddable, headless HTML5 arcade games. Built for campaign websites, it enables agencies to quickly integrate branded, interactive minigames into their projects with minimal effort while maintaining full control over styling and user experience.

**Target Users:** Web developers at advertising agencies building campaign websites  
**Core Problem Solved:** Eliminates the need to build custom games for each campaign by providing production-ready, customizable game components  
**Key Value:** Reduces development time from weeks to hours while enabling full brand customization and player data capture

### What Makes This Special

**Headless Architecture + Event-Driven Integration**

Unlike standalone game libraries, minigames-lib provides:

- **Uniform API** across all games (start, stop, mute, setPlayerName) - learn once, use everywhere
- **Headless Design** - games are fully functional but styleable via API, enabling perfect brand alignment
- **Rich Event System** - onGameStarted, onGameFinished, onGameOver, onSoundMuted events stream player data (scores, status) to host apps for campaign analytics
- **Selective Installation** - agencies install only the games they need via scoped npm packages (@minigame/core + game-specific packages)

This isn't just a game collection - it's **game infrastructure for marketers**.

---

## Project Classification

**Technical Type:** Developer Tool (npm Package/SDK)
**Domain:** General
**Complexity:** Medium

**Technical Stack:**

- TypeScript (full type support, no UI frameworks)
- Monorepo structure (pnpm workspace)
- Modern browser targets only (evergreen desktop + mobile browsers)
- Canvas-based rendering with customizable UI layer

**Distribution Model:**

- Core package: `@minigame/core` (mandatory)
- Game packages: `@minigame/snake`, `@minigame/pong`, `@minigame/breakout`, etc. (selective installation)
- Semantic versioning with migration guides

---

## Success Criteria

### Primary Success Metric

**Easy Installation & Integration** - Developers can go from npm install to working game in under 30 minutes by following the README.

### Developer Experience Goals

- **Installation:** `npm install @minigame/core @minigame/snake` - instantly works
- **Time to First Game:** < 30 minutes from README to functional, styled game in their app
- **Learning Curve:** Uniform API means learning one game = understanding all games
- **TypeScript Support:** 100% type coverage - IntelliSense guides developers through every API

### Performance Benchmarks

- **Frame Rate:** 60fps smooth gameplay on both desktop and mobile browsers
- **Browser Support:** Runs flawlessly on modern evergreen browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Mobile Performance:** Smooth gameplay on 3-year-old Android/iOS devices

### Production Quality Bar

A game is considered production-ready when:

- **Zero Known Bugs:** No open critical or high-priority bugs
- **100% Type Coverage:** Full TypeScript types with no `any` escapes
- **API Stability:** Follows semantic versioning with clear migration guides
- **Documentation:** README with working code examples that actually run

### Success Validation

Library succeeds when:

1. Agencies **reuse** it across multiple campaigns (not just one-off)
2. Integration is **faster than expected** (developers report < 30 min goal is achievable)
3. **Zero production incidents** from library bugs in live campaigns

---

## Product Scope

### MVP - Minimum Viable Product

The MVP delivers a production-ready library that agencies can immediately use for campaigns.

**Core Package (`@minigame/core`)**

- Uniform game control API: `start()`, `stop()`, `pause()`, `resume()`, `mute()`, `setPlayerName()`
- Event system with standard events:
  - `onGameStarted` - fires when game begins
  - `onGameFinished` - fires when player completes game
  - `onGameOver` - fires when player loses/fails
  - `onScoreUpdate` - fires when score changes
  - `onSoundMuted` / `onSoundUnmuted` - fires on audio toggle
- UI customization API for styling games
- Full TypeScript type definitions
- Event payload includes: score, playerName, gameStatus, timestamp

**Initial Games (3 total)**

- `@minigame/snake` - Classic snake game ✅
- `@minigame/pong` - Classic pong game ✅
- `@minigame/breakout` - Brick breaker game

**Monorepo Infrastructure**

- pnpm workspace configured for all packages
- Shared build tooling (TypeScript compilation, bundling)
- Consistent package structure across all games
- npm publishing automation

**Essential Documentation**

- README with installation instructions
- Quick start guide (< 30 min integration)
- Working code example showing full integration
- API reference for core package
- Per-game documentation with customization options

**Quality Standards**

- 100% TypeScript type coverage
- Zero critical bugs
- 60fps performance on desktop and mobile
- Works on modern evergreen browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)

### Growth Features (Post-MVP)

**Additional Games**

- `@minigame/shooter` - Endless space shooter (Space Invaders-style)
- `@minigame/runner` - Endless runner game
- `@minigame/maze` - Pac-Man-like maze game

**Enhanced Customization**

- More granular UI styling options
- Theme presets (retro, modern, minimal)
- Advanced event hooks (onPauseStart, onResumeStart, onLevelComplete)
- Custom sound support (allow agencies to provide their own audio assets)

**Developer Experience Improvements**

- Interactive documentation site with live game demos
- Additional code examples (React, Vue, vanilla JS integrations)
- Migration guides between versions
- Troubleshooting guide

**Framework Wrappers**

- `@minigame/react` - React component wrappers for all games
- `@minigame/vue` - Vue 3 component wrappers for all games
- Full TypeScript support with type definitions
- Component-based API for easy framework integration
- Comprehensive test coverage

**Performance & Quality**

- Performance monitoring utilities
- Accessibility improvements (keyboard navigation, screen reader support)
- Unit test coverage for all games

### Vision (Future)

**Expanded Game Library**

- 10+ classic arcade games covering all major genres
- Game variants (e.g., different difficulty modes, game modes)
- Seasonal/themed game variations

**Platform Capabilities**

- Multiplayer support (competitive leaderboards, real-time battles)
- Built-in analytics dashboard for campaign managers
- A/B testing framework for game configurations
- Server-side leaderboard integration (optional hosted service)

**Ecosystem Features**

- Game builder/editor for creating custom variations
- Community-contributed games
- Plugin system for extending game functionality
- White-label licensing options for agencies

---

---

## Developer Tool Specific Requirements

### Package Architecture

**Monorepo Structure (pnpm workspace)**

- Root package manages shared dependencies and build scripts
- Each game is an independent npm package with its own package.json
- Core package (`@minigame/core`) contains shared interfaces, types, and base classes
- Packages can be installed independently but all depend on `@minigame/core`

**Package Naming Convention**

- Core: `@minigame/core`
- Games: `@minigame/[game-name]` (e.g., `@minigame/snake`, `@minigame/pong`)
- Consistent versioning across all packages in monorepo

### API Design Principles

**Uniform Game API**
Every game implementation must expose the same core methods:

- `start(): void` - Initialize and begin gameplay
- `stop(): void` - Stop game and cleanup
- `pause(): void` - Pause gameplay
- `resume(): void` - Resume from pause
- `mute(): void` - Mute all game audio
- `unmute(): void` - Unmute game audio
- `setPlayerName(name: string): void` - Set player identifier
- `getGameState(): GameState` - Get current game state snapshot

**Event System**
All games emit standardized events via event emitter pattern:

- `onGameStarted(callback: (data: GameStartData) => void)`
- `onGameFinished(callback: (data: GameFinishData) => void)`
- `onGameOver(callback: (data: GameOverData) => void)`
- `onScoreUpdate(callback: (data: ScoreUpdateData) => void)`
- `onSoundMuted(callback: () => void)`
- `onSoundUnmuted(callback: () => void)`

**Event Payload Structure**
All events include consistent metadata:

```typescript
interface BaseEventData {
  timestamp: number;
  playerName?: string;
  gameId: string;
}

interface GameOverData extends BaseEventData {
  finalScore: number;
  gameStatus: "won" | "lost" | "abandoned";
  playDuration: number; // milliseconds
}
```

**UI Customization API**
Games must expose styling configuration:

- Color schemes (primary, secondary, background, text)
- Font family and sizes
- Border radius and styling
- Animation speeds
- Sound volume controls

### TypeScript Requirements

**100% Type Coverage**

- No use of `any` type except in controlled, documented cases
- All public APIs fully typed
- Generic types for extensibility
- Type guards for runtime safety

**Export Strategy**

- Named exports for all public APIs
- Default export for main game class
- Separate type-only exports for interfaces

**Declaration Files**

- Generate `.d.ts` files for all packages
- Include JSDoc comments for IntelliSense
- Export all necessary types for consumer applications

### Build & Distribution

**Build Output**

- ESM (ES Modules) for modern bundlers
- CommonJS for Node.js compatibility
- UMD bundle for browser `<script>` tag usage
- Minified production builds
- Source maps for debugging

**npm Package Contents**

- Compiled JavaScript (ESM, CJS, UMD)
- TypeScript declaration files (.d.ts)
- README with installation and usage
- LICENSE file
- package.json with proper metadata

**Dependency Management**

- Core package has zero runtime dependencies (dev dependencies allowed)
- Games depend only on `@minigame/core`
- Keep bundle sizes minimal (target: < 50kb per game gzipped)

### Versioning & Release

**Semantic Versioning**

- MAJOR: Breaking API changes
- MINOR: New features, backward compatible
- PATCH: Bug fixes, backward compatible

**Migration Guides**

- Document all breaking changes
- Provide code examples for migration
- Include automated migration scripts when possible

**Release Process**

- Automated version bumping
- Changelog generation
- npm publishing automation
- Git tags for each release

### Documentation Standards

**README Structure (per package)**

1. Installation instructions
2. Quick start code example (copy-paste ready)
3. API reference
4. Customization options
5. Event handling examples
6. TypeScript usage examples
7. Troubleshooting common issues

**Code Examples**

- All examples must be runnable without modification
- Include both TypeScript and JavaScript examples
- Show integration with popular frameworks (React, Vue, vanilla)

---

## Functional Requirements

### Core Package API (Game Control)

**FR1:** Developers can initialize any game using a uniform `start()` method  
**FR2:** Developers can stop and cleanup any game using a uniform `stop()` method  
**FR3:** Developers can pause gameplay using a uniform `pause()` method  
**FR4:** Developers can resume paused gameplay using a uniform `resume()` method  
**FR5:** Developers can mute all game audio using a uniform `mute()` method  
**FR6:** Developers can unmute game audio using a uniform `unmute()` method  
**FR7:** Developers can set player name/identifier using `setPlayerName(name)` method  
**FR8:** Developers can retrieve current game state snapshot using `getGameState()` method

### Event System

**FR9:** Games emit `onGameStarted` event when gameplay begins, including timestamp and player data  
**FR10:** Games emit `onGameFinished` event when player successfully completes the game  
**FR11:** Games emit `onGameOver` event when player loses/fails, including final score and game status  
**FR12:** Games emit `onScoreUpdate` event whenever the score changes during gameplay  
**FR13:** Games emit `onSoundMuted` and `onSoundUnmuted` events when audio state changes  
**FR14:** All event payloads include consistent metadata: timestamp, playerName, gameId  
**FR15:** Event payloads for game completion include finalScore, gameStatus, and playDuration  
**FR16:** Developers can register callback functions for all game events  
**FR17:** Developers can unregister/remove event listeners

### UI Customization

**FR18:** Developers can customize game color schemes (primary, secondary, background, text colors)  
**FR19:** Developers can customize typography (font family and sizes)  
**FR20:** Developers can customize visual styling (border radius, borders, shadows)  
**FR21:** Developers can control animation speeds and effects  
**FR22:** Developers can adjust sound volume levels  
**FR23:** Games render to canvas but allow external UI chrome/container styling  
**FR24:** Customization API is consistent across all game implementations

### Game Implementations - MVP

**FR25:** Library includes Snake game implementation with classic snake gameplay mechanics  
**FR26:** Library includes Pong game implementation with classic paddle-and-ball mechanics  
**FR27:** Library includes Breakout game implementation with brick-breaking mechanics  
**FR28:** All MVP games support desktop browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**FR29:** All MVP games support mobile browsers (iOS Safari, Android Chrome)  
**FR30:** All MVP games achieve 60fps gameplay on desktop and mobile devices  
**FR31:** All MVP games work on 3-year-old mobile devices

### Game Implementations - Growth

**FR32:** Library includes endless space shooter game (Space Invaders-style)  
**FR33:** Library includes endless runner game  
**FR34:** Library includes maze game (Pac-Man-like)  
**FR35:** Additional games follow the same API, event system, and customization standards

### TypeScript Support

**FR36:** All packages provide full TypeScript type definitions (.d.ts files)  
**FR37:** Core package exports all necessary interfaces and types for game implementations  
**FR38:** Type definitions include JSDoc comments for IntelliSense documentation  
**FR39:** Public APIs are 100% typed with no `any` usage  
**FR40:** Developers get autocomplete and type checking when using the library in TypeScript projects  
**FR41:** Developers get IntelliSense hints in JavaScript projects via JSDoc

### Package Distribution & Installation

**FR42:** Core package is published to npm as `@minigame/core`  
**FR43:** Each game is published as separate scoped package: `@minigame/snake`, `@minigame/pong`, etc.  
**FR44:** Developers can install only the packages they need (selective installation)  
**FR45:** Core package is required dependency for all game packages  
**FR46:** Packages follow semantic versioning (major.minor.patch)  
**FR47:** All packages in monorepo maintain consistent version numbers  
**FR48:** Package bundles are available in ESM, CommonJS, and UMD formats  
**FR49:** Minified production builds are provided for all packages  
**FR50:** Source maps are included for debugging

### Build & Bundling

**FR51:** Each game package has bundle size under 50kb (gzipped)  
**FR52:** Core package has zero runtime dependencies  
**FR53:** Game packages depend only on `@minigame/core`  
**FR54:** Build outputs include both development and production versions

### Documentation

**FR55:** Each package includes README with installation instructions  
**FR56:** README includes quick start code example (copy-paste ready)  
**FR57:** README includes complete API reference  
**FR58:** README includes customization examples  
**FR59:** README includes event handling examples  
**FR60:** Code examples are provided in both TypeScript and JavaScript  
**FR61:** Examples show integration with vanilla JS, React, and Vue  
**FR62:** All code examples are runnable without modification

### Versioning & Migration

**FR63:** Breaking changes trigger major version bump  
**FR64:** New features trigger minor version bump  
**FR65:** Bug fixes trigger patch version bump  
**FR66:** Migration guides are provided for all breaking changes  
**FR67:** Changelogs are auto-generated for each release  
**FR68:** Git tags are created for each published version

### Developer Experience

**FR69:** Developers can integrate a game from npm install to working implementation in under 30 minutes  
**FR70:** Error messages are clear and actionable  
**FR71:** Console warnings alert developers to common misconfigurations  
**FR72:** Library provides helpful TypeScript errors for incorrect API usage

### Framework Wrappers

**React Wrapper (@minigame/react)**

**FR73:** Library provides React component wrappers for all games (SnakeGame, PongGame, BreakoutGame)  
**FR74:** React components accept game configuration as props (config object)  
**FR75:** React components emit standard React events: onGameStarted, onGameOver, onScoreUpdate, onGameFinished  
**FR76:** React wrapper supports TypeScript with full type definitions for props and events  
**FR77:** React components use component-based API (not hooks-based)  
**FR78:** React wrapper does not require refs for game control (fully controlled by props/events)  
**FR79:** React wrapper package is published to npm as `@minigame/react`  
**FR80:** React wrapper has peer dependency on React 18+ (latest stable)

**Vue Wrapper (@minigame/vue)**

**FR81:** Library provides Vue 3 component wrappers for all games (SnakeGame, PongGame, BreakoutGame)  
**FR82:** Vue components accept configuration via props (:config binding)  
**FR83:** Vue components emit standard Vue events: @game-started, @game-over, @score-update, @game-finished  
**FR84:** Vue wrapper supports TypeScript with full type definitions for props and events  
**FR85:** Vue wrapper uses Vue 3 Composition API internally  
**FR86:** Vue wrapper provides component syntax (template-based usage, not composables)  
**FR87:** Vue wrapper does not support Vue 2  
**FR88:** Vue wrapper package is published to npm as `@minigame/vue`  
**FR89:** Vue wrapper has peer dependency on Vue 3.3+ (latest stable)

**Framework Wrapper Quality**

**FR90:** Both framework wrappers include comprehensive test coverage (unit tests for components)

### Monorepo Infrastructure

**FR91:** Project uses pnpm workspace for monorepo management  
**FR92:** Shared build configuration is centralized in root package  
**FR93:** All packages follow consistent directory structure  
**FR94:** Automated publishing workflow deploys all packages to npm  
**FR95:** Development mode allows local testing across packages

---

### Performance

- **Frame Rate:** All games must maintain 60fps during active gameplay on desktop and mobile browsers
- **Load Time:** Game packages must load and initialize in under 1 second on 3G connection
- **Bundle Size:** Each game package must be under 50kb gzipped
- **Memory Usage:** Games must not leak memory during extended play sessions
- **Mobile Performance:** Smooth gameplay on 3-year-old Android (Android 11+) and iOS (iOS 14+) devices
- **Canvas Rendering:** Efficient canvas rendering with minimal repaints per frame

### Quality & Reliability

- **Bug Tolerance:** Zero critical or high-priority bugs in production releases
- **Type Safety:** 100% TypeScript type coverage with no `any` usage in public APIs
- **Test Coverage:** Core package and game implementations have comprehensive unit tests
- **Browser Compatibility:** Works on modern evergreen browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Backward Compatibility:** Semantic versioning ensures backward compatibility for minor/patch releases
- **Error Handling:** All APIs handle edge cases gracefully with clear error messages
- **Production Stability:** Library causes zero crashes or errors in host applications

### Developer Experience (Non-Functional)

- **API Consistency:** 100% consistent API across all game implementations
- **Type Inference:** TypeScript users get full autocomplete without manual type imports
- **Documentation Quality:** All public APIs documented with JSDoc for IntelliSense
- **Learning Curve:** Developers familiar with one game can use any other game without additional learning
- **Integration Speed:** < 30 minutes from install to working, styled game (measured goal)
- **Build Speed:** Development builds complete in under 10 seconds
- **Hot Module Replacement:** Changes reflect immediately during development

### Browser Support

**Desktop Browsers:**

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile Browsers:**

- iOS Safari 14+
- Android Chrome (latest 2 versions)

**Explicitly NOT Supported:**

- Internet Explorer (all versions)
- Browsers older than 2 major versions
- Opera Mini (limited canvas support)

---

_This PRD captures the essence of minigames-lib - **a developer-first game infrastructure that turns campaign game integration from weeks of custom development into 30 minutes of configuration**. By providing headless, event-driven arcade games with a uniform API, agencies get the speed of pre-built games with the flexibility of custom implementations._

_Created through collaborative discovery between Aldi and AI facilitator._
