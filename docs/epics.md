# minigames-lib - Epic and Story Breakdown

**Project:** minigames-lib  
**Author:** Aldi  
**Date:** 2025-11-23  
**Version:** 1.0

---

## Epic Structure Overview

This document breaks down the 95 functional requirements from the PRD into 6 implementable epics, each delivering incremental value.

### Epic Progression

1. **Foundation & Infrastructure** → Sets up monorepo, build tools, TypeScript
2. **Core Package - Game Framework** → Creates @minigame/core with BaseGame, events, types
3. **Build & Distribution Pipeline** → Makes packages publishable to npm
4. **MVP Game Implementations** → Builds Snake, Pong, Breakout games
5. **Documentation & Developer Experience** → Enables < 30 min integration
6. **Framework Integrations** → React and Vue component wrappers

---

## FR Coverage Map

### Epic 1: Foundation & Infrastructure

**FRs Covered:** FR73-FR77 (Monorepo Infrastructure)

### Epic 2: Core Package - Game Framework

**FRs Covered:** FR1-FR8 (Game Control API), FR9-FR17 (Event System), FR18-FR24 (UI Customization), FR36-FR41 (TypeScript Support), FR52-FR53 (Core dependencies)

### Epic 3: Build & Distribution Pipeline

**FRs Covered:** FR42-FR50 (Package Distribution), FR51, FR54 (Build & Bundling), FR63-FR68 (Versioning & Migration)

### Epic 4: MVP Game Implementations

**FRs Covered:** FR25-FR31 (MVP Games), FR28-FR31 (Performance), FR69-FR72 (Developer Experience)

### Epic 5: Documentation & Developer Experience

**FRs Covered:** FR55-FR62 (Documentation)

### Epic 6: Framework Integrations

**FRs Covered:** FR73-FR90 (Framework Wrappers)

---

## Epic 1: Foundation & Infrastructure

**Goal:** Establish the monorepo foundation that enables all subsequent development.

**Value Delivered:** A working TypeScript monorepo with build tooling, ready for package development.

**FRs Covered:** FR73, FR74, FR75, FR76, FR77

### Story 1.1: Monorepo Initialization

**User Story:**
As a developer,
I want a properly configured pnpm monorepo,
So that I can develop multiple packages efficiently in one repository.

**Acceptance Criteria:**

Given a new project directory
When I initialize the monorepo structure
Then:

- pnpm-workspace.yaml exists and defines packages/\* pattern
- Root package.json exists with workspace configuration
- packages/ directory exists for all packages
- .gitignore excludes node_modules, dist, and build artifacts
- package.json includes workspace scripts (build, test, lint)

**Prerequisites:** None (first story)

**Technical Notes:**

- Use pnpm workspace protocol (FR73)
- Architecture specifies pnpm 8.x
- Root package.json manages shared devDependencies

---

### Story 1.2: TypeScript Configuration

**User Story:**
As a developer,
I want TypeScript properly configured across all packages,
So that I get strict type checking and project references working correctly.

**Acceptance Criteria:**

Given the monorepo structure exists
When I set up TypeScript configuration
Then:

- Root tsconfig.json exists with strict compiler options (FR39)
- compilerOptions include: strict, noUnusedLocals, noUnusedParameters, noImplicitReturns
- target: ES2020, module: ESNext, lib: ["ES2020", "DOM"]
- moduleResolution: bundler (as per Architecture decision 2)
- declaration: true, declarationMap: true, sourceMap: true (FR36)
- Each package can extend root config with composite: true

**Prerequisites:** Story 1.1

**Technical Notes:**

- Architecture section 2: Project References with Composite Projects
- Strict mode ensures no `any` escapes (FR39)
- Composite projects enable incremental builds

---

### Story 1.3: Build Tool Setup (tsup)

**User Story:**
As a developer,
I want tsup configured for all packages,
So that I can generate multi-format builds (ESM, CJS, UMD) with TypeScript declarations.

**Acceptance Criteria:**

Given TypeScript is configured
When I set up tsup for building packages
Then:

- tsup ^8.0.0 installed as root devDependency
- Each package can have tsup.config.ts
- Default config generates: ESM (.js), CJS (.cjs), IIFE (.global.js)
- TypeScript declarations (.d.ts) generated automatically (FR36)
- Source maps included (FR50)
- Minified production builds (FR49)
- Clean builds (old artifacts removed)

**Prerequisites:** Story 1.2

**Technical Notes:**

- Architecture decision 5: tsup with unified configuration
- Build output: dist/index.js (ESM), dist/index.cjs (CJS), dist/index.global.js (UMD)
- FR48: Multi-format output requirement
- Target bundle size < 50kb gzipped (FR51)

---

### Story 1.4: Development Scripts & Tooling

**User Story:**
As a developer,
I want shared development scripts at the root level,
So that I can build, test, and lint all packages with single commands.

**Acceptance Criteria:**

Given build tools are set up
When I configure root package.json scripts
Then:

- `pnpm build` runs build across all packages (pnpm -r run build)
- `pnpm test` runs Vitest across all packages
- `pnpm lint` runs ESLint (if configured)
- `pnpm -r` enables recursive script execution (FR77)
- Development mode supports hot reload (HMR) via tsup --watch
- Local package linking works via workspace protocol

**Prerequisites:** Story 1.3

**Technical Notes:**

- FR74: Shared build configuration centralized in root
- FR77: Development mode for local testing
- Architecture: pnpm workspace for monorepo management

---

### Story 1.5: Versioning Setup (Changesets)

**User Story:**
As a developer,
I want Changesets configured for version management,
So that I can automate semantic versioning and changelog generation.

**Acceptance Criteria:**

Given the monorepo is set up
When I configure Changesets
Then:

- @changesets/cli installed as root devDependency
- .changeset/config.json exists with fixed versioning strategy
- `pnpm changeset` command creates changeset files (FR67)
- All packages use synchronized versions (FR47)
- Changelog generation configured (FR67)
- Git tagging enabled for releases (FR68)
- Breaking changes trigger major bump (FR63)
- Features trigger minor bump (FR64)
- Fixes trigger patch bump (FR65)

**Prerequisites:** Story 1.4

**Technical Notes:**

- Architecture decision 9: Changesets for versioning + automated npm publishing
- Fixed versioning: all packages share same version number
- FR46: Semantic versioning (major.minor.patch)
- FR66: Migration guides for breaking changes

---

_Epic 1 Complete: 5 stories_

---

## Epic 2: Core Package - Game Framework

**Goal:** Create @minigame/core package with BaseGame class, event system, and type definitions.

**Value Delivered:** Developers can install @minigame/core and extend BaseGame to create custom games.

**FRs Covered:** FR1-FR8, FR9-FR17, FR18-FR24, FR36-FR41, FR52-FR53

### Story 2.1: Core Package Structure

**User Story:**
As a developer,
I want the @minigame/core package structure initialized,
So that I can begin implementing the game framework.

**Acceptance Criteria:**

Given the monorepo foundation exists
When I create the core package structure
Then:

- packages/core/ directory exists
- packages/core/package.json with name: "@minigame/core", version: "1.0.0"
- packages/core/tsconfig.json extends root config with composite: true
- packages/core/src/index.ts exists as main entry point
- packages/core/tsup.config.ts configured (ESM, CJS, IIFE output)
- package.json exports field points to dist outputs
- Zero runtime dependencies (FR52)
- Type: "module" in package.json

**Prerequisites:** Epic 1 complete

**Technical Notes:**

- Architecture decision 6: Package Dependency Strategy
- FR42: Published as @minigame/core
- FR52: Zero runtime dependencies (only devDependencies allowed)

---

### Story 2.2: TypeScript Type Definitions

**User Story:**
As a developer,
I want core TypeScript types and interfaces defined,
So that all games have consistent type contracts.

**Acceptance Criteria:**

Given core package structure exists
When I create type definitions
Then:

- packages/core/src/types/ directory contains:
  - events.ts: GameEvent type union, BaseEventData, GameOverData, ScoreUpdateData interfaces (FR14, FR15)
  - game.ts: GameState type, GameConfig interface (FR18-FR24)
  - config.ts: Full GameConfig with colors, typography, styling, animation, audio
- All types exported from packages/core/src/index.ts
- JSDoc comments on all public types (FR38, FR41)
- No `any` usage (FR39)
- Type definitions include IntelliSense documentation (FR40)

**Prerequisites:** Story 2.1

**Technical Notes:**

- Architecture decision 3: Event System types
- Architecture decision 7: UI Customization Architecture
- FR36-FR41: Full TypeScript support
- FR14: Event payloads include timestamp, playerName, gameId

---

### Story 2.3: Event Emitter Implementation

**User Story:**
As a developer,
I want a type-safe event emitter,
So that games can emit events and developers can subscribe to them.

**Acceptance Criteria:**

Given type definitions exist
When I implement EventEmitter class
Then:

- packages/core/src/EventEmitter.ts exists
- on(event: GameEvent, callback: EventCallback): void method (FR16)
- off(event: GameEvent, callback: EventCallback): void method (FR17)
- emit(event: GameEvent, data?: EventData): void method (protected)
- Strongly typed for all GameEvent types
- Callback registry manages multiple listeners per event
- off() correctly removes specific callback
- Event emission calls all registered callbacks
- TypeScript prevents invalid event types at compile time

**Prerequisites:** Story 2.2

**Technical Notes:**

- Architecture decision 3: Abstract Base Class Pattern + Event Emitter
- FR9-FR17: Complete event system requirements
- Type-safe: GameEvent = 'gameStarted' | 'gameFinished' | 'gameOver' | 'scoreUpdate' | 'soundMuted' | 'soundUnmuted'

---

### Story 2.4: BaseGame Abstract Class

**User Story:**
As a game developer,
I want an abstract BaseGame class with uniform API methods,
So that all games implement the same interface and developers have a consistent API.

**Acceptance Criteria:**

Given EventEmitter and types exist
When I implement BaseGame abstract class
Then:

- packages/core/src/BaseGame.ts exists
- Abstract class BaseGame<TState = any> with generic state support
- Protected properties: canvas, ctx, gameState, playerName, config, eventEmitter
- Public methods implement uniform API:
  - start(): void (FR1)
  - stop(): void (FR2)
  - pause(): void (FR3)
  - resume(): void (FR4)
  - mute(): void (FR5)
  - unmute(): void (FR6)
  - setPlayerName(name: string): void (FR7)
  - getGameState(): TState (FR8)
- Event methods: on(), off(), protected emit()
- Abstract protected methods: init(), update(deltaTime), render(), cleanup()
- Game loop using requestAnimationFrame (60fps target, FR30)
- Canvas context initialization with error handling
- Device pixel ratio support for high-DPI displays

**Prerequisites:** Story 2.3

**Technical Notes:**

- Architecture decision 3: BaseGame abstract class pattern
- Architecture decision 12: Canvas & rendering architecture
- FR1-FR8: Uniform game control API enforced by base class
- Games extend BaseGame and MUST implement abstract methods
- Generic TState allows game-specific state typing

---

### Story 2.5: GameConfig Implementation

**User Story:**
As a developer,
I want a comprehensive GameConfig type with default values,
So that I can customize game appearance and behavior consistently.

**Acceptance Criteria:**

Given BaseGame exists
When I implement GameConfig
Then:

- packages/core/src/GameConfig.ts exports GameConfig interface
- Full configuration structure:
  - colors: { primary, secondary, background, text } (FR18)
  - typography: { fontFamily, fontSize: { small, medium, large } } (FR19)
  - styling: { borderRadius, borderWidth, shadowBlur } (FR20)
  - animation: { speed } (FR21)
  - audio: { volume, muted } (FR22)
- Default configuration object exported as defaultGameConfig
- Deep partial merge utility for user configs
- BaseGame constructor accepts Partial<GameConfig>
- All config properties used in rendering (FR23, FR24)

**Prerequisites:** Story 2.4

**Technical Notes:**

- Architecture decision 7: Configuration object pattern
- FR18-FR24: Complete UI customization requirements
- Deep merge allows users to override only specific properties
- Consistent across all game implementations (FR24)

---

### Story 2.6: Core Package Exports & Build

**User Story:**
As a developer,
I want @minigame/core properly exported and buildable,
So that I can install it and use the framework in my projects.

**Acceptance Criteria:**

Given all core components exist
When I configure exports and build
Then:

- packages/core/src/index.ts exports all public APIs
- Named exports: BaseGame, EventEmitter, GameConfig, all types
- packages/core/tsup.config.ts builds successfully
- Build output in packages/core/dist/:
  - index.js (ESM), index.cjs (CommonJS), index.global.js (UMD)
  - index.d.ts with full type definitions
  - Source maps (.map files)
- package.json exports field properly configured
- `pnpm -r build` successfully builds core package
- Zero runtime dependencies in package.json (FR52)
- Bundle size < 20kb gzipped (well under FR51 limit)

**Prerequisites:** Story 2.5

**Technical Notes:**

- Architecture decision 5: tsup with unified configuration
- Architecture decision 6: Package dependency strategy
- FR48-FR50: Multi-format builds with source maps
- Core has zero deps, only devDependencies (FR52)

---

_Epic 2 Complete: 6 stories_

---

## Epic 3: Build & Distribution Pipeline

**Goal:** Enable packages to be published to npm with automated versioning and multi-format builds.

**Value Delivered:** @minigame/core and game packages are installable via npm by developers.

**FRs Covered:** FR42-FR50, FR51, FR54, FR63-FR68

### Story 3.1: Package Metadata & npm Configuration

**User Story:**
As a package maintainer,
I want all package.json files properly configured for npm publishing,
So that packages are discoverable and installable.

**Acceptance Criteria:**

Given core package exists
When I configure package metadata
Then:

- Each package.json includes:
  - Correct scoped name: @minigame/core, @minigame/snake, etc. (FR42, FR43)
  - version: "1.0.0" (synchronized via Changesets, FR47)
  - type: "module"
  - main, module, types fields point to dist outputs
  - exports field with import/require/types conditions
  - files: ["dist"] to include only build artifacts
  - keywords, description, author, license, repository fields
- Root .npmrc configured for @minigame scope
- publishConfig: { access: "public" }

**Prerequisites:** Epic 2 complete

**Technical Notes:**

- FR42-FR43: Core and game package naming
- FR44: Selective installation via scoped packages
- FR45: Core is required dependency for game packages
- FR47: Consistent version numbers across packages

---

### Story 3.2: Multi-Format Build Configuration

**User Story:**
As a developer,
I want packages built in multiple formats,
So that I can use them in any JavaScript environment (ESM, CJS, or browser).

**Acceptance Criteria:**

Given package metadata is configured
When I ensure build configurations are complete
Then:

- Each package builds to:
  - ESM format (index.js) for modern bundlers (FR48)
  - CommonJS format (index.cjs) for Node.js (FR48)
  - UMD/IIFE format (index.global.js) for browser <script> tags (FR48)
- Minified production builds (FR49)
- Development and production versions (FR54)
- Source maps included for debugging (FR50)
- tsup config specifies: format: ['esm', 'cjs', 'iife'], minify: true, sourcemap: true
- Bundle size validated < 50kb gzipped for each game (FR51)

**Prerequisites:** Story 3.1

**Technical Notes:**

- Architecture decision 5: tsup multi-format output
- FR48-FR50: Complete build format requirements
- FR51: Bundle size constraint (< 50kb gzipped per game)
- FR54: Dev and prod versions

---

### Story 3.3: Publishing Automation with Changesets

**User Story:**
As a package maintainer,
I want automated publishing to npm,
So that releases are consistent and follow semantic versioning.

**Acceptance Criteria:**

Given Changesets is configured (Story 1.5)
When I set up publishing automation
Then:

- `pnpm changeset` creates changeset files for tracking changes
- `pnpm changeset version` bumps versions according to semver:
  - Breaking changes → major bump (FR63)
  - New features → minor bump (FR64)
  - Bug fixes → patch bump (FR65)
- Changelogs auto-generated from changesets (FR67)
- Git tags created for each release (version numbers, FR68)
- `pnpm changeset publish` publishesto npm
- All packages published with synchronized versions (FR47)
- Migration guides template for breaking changes (FR66)

**Prerequisites:** Story 3.2

**Technical Notes:**

- Architecture decision 9: Changesets for versioning
- FR46: Semantic versioning
- FR63-FR68: Complete versioning requirements
- Fixed versioning strategy keeps all packages in sync

---

_Epic 3 Complete: 3 stories_

---

## Epic 4: MVP Game Implementations

**Goal:** Implement Snake, Pong, and Breakout games extending BaseGame.

**Value Delivered:** Agencies can install and embed actual games in campaigns.

**FRs Covered:** FR25-FR31, FR69-FR72

### Story 4.1: Snake Game Package Setup

**User Story:**
As a developer,
I want the @minigame/snake package structure initialized,
So that I can implement the Snake game.

**Acceptance Criteria:**

Given @minigame/core is complete
When I create snake package structure
Then:

- packages/snake/ directory exists
- packages/snake/package.json with name: "@minigame/snake", version: "1.0.0"
- dependencies: { "@minigame/core": "workspace:^" } (FR45, FR53)
- packages/snake/tsconfig.json extends root, references core
- packages/snake/src/index.ts exports SnakeGame
- packages/snake/tsup.config.ts configured (globalName: "MinigameSnake")
- Zero additional runtime dependencies beyond @minigame/core (FR53)

**Prerequisites:** Epic 3 complete

**Technical Notes:**

- Architecture decision 4: Game package pattern
- FR43: Published as @minigame/snake
- FR45: Core is required dependency
- FR53: Games depend only on core

---

### Story 4.2: Snake Game Implementation

**User Story:**
As a player,
I want to play the classic Snake game,
So that I can enjoy the nostalgic arcade experience in my browser.

**Acceptance Criteria:**

Given snake package structure exists
When I implement SnakeGame class
Then:

- SnakeGame extends BaseGame<SnakeGameState>
- Classic snake gameplay mechanics:
  - Snake grows when eating food
  - Game over on wall collision or self-collision
  - Score increases with each food eaten
  - Increasing speed as score grows (optional difficulty ramp)
- Implements all abstract methods: init(), update(), render(), cleanup()
- Keyboard controls: Arrow keys or WASD
- Touch controls for mobile devices (swipe directions)
- Emits all required events at correct times (FR9-FR13)
- Renders using canvas 2D context
- Respects GameConfig colors and styling (FR18-FR24)
- Achieves 60fps on desktop and mobile (FR30)
- Works on 3-year-old mobile devices (FR31)

**Prerequisites:** Story 4.1

**Technical Notes:**

- FR25: Classic snake gameplay mechanics
- FR28-FR31: Browser support and performance requirements
- Architecture decision 12: Canvas rendering with requestAnimationFrame
- Mobile support: Touch event handling for swipe directions

---

### Story 4.3: Pong Game Package & Implementation

**User Story:**
As a player,
I want to play the classic Pong game,
So that I can enjoy competitive paddle-and-ball gameplay.

**Acceptance Criteria:**

Given Snake game is complete
When I implement Pong game
Then:

- packages/pong/ structure follows snake package pattern
- PongGame extends BaseGame<PongGameState>
- Classic pong mechanics:
  - Two paddles (player vs AI or player vs player mode)
  - Ball bounces off paddles and walls
  - Score increments when ball passes paddle
  - AI opponent with adjustable difficulty
- Keyboard controls: Player 1 (W/S), Player 2 (↑/↓)
- Touch controls for mobile (tap zones or virtual joystick)
- All events emitted correctly (FR9-FR13)
- Respects GameConfig (FR18-FR24)
- 60fps performance (FR30)
- Mobile compatibility (FR29, FR31)
- Published as @minigame/pong (FR43)

**Prerequisites:** Story 4.2

**Technical Notes:**

- FR26: Classic paddle-and-ball mechanics
- FR28-FR31: Browser and performance requirements
- Consider dual-player mode for enhanced engagement
- AI difficulty can be config option

---

### Story 4.4: Breakout Game Package & Implementation

**User Story:**
As a player,
I want to play the classic Breakout game,
So that I can break bricks with a paddle and ball.

**Acceptance Criteria:**

Given Pong game is complete
When I implement Breakout game
Then:

- packages/breakout/ structure follows package pattern
- BreakoutGame extends BaseGame<BreakoutGameState>
- Classic breakout mechanics:
  - Grid of destructible bricks at top
  - Paddle at bottom controlled by player
  - Ball bounces off paddle, walls, and bricks
  - Bricks destroyed on ball collision
  - Score increases per brick destroyed
  - Level complete when all bricks destroyed
  - Game over if ball passes paddle
- Keyboard/mouse controls: Arrow keys or mouse movement
- Touch controls: Touch/drag for mobile
- All events emitted (FR9-FR13)
- Respects GameConfig (FR18-FR24)
- 60fps performance (FR30)
- Mobile support (FR29, FR31)
- Published as @minigame/breakout (FR43)

**Prerequisites:** Story 4.3

**Technical Notes:**

- FR27: Brick-breaking gameplay mechanics
- FR28-FR31: Browser and performance requirements
- Brick grid layout can be configurable
- Consider power-ups for enhanced gameplay (post-MVP)

---

### Story 4.5: Game Quality & Error Handling

**User Story:**
As a developer,
I want clear error messages and helpful warnings,
So that I can quickly debug integration issues.

**Acceptance Criteria:**

Given all three MVP games are implemented
When I enhance error handling and developer experience
Then:

- Clear error messages for common mistakes:
  - Missing canvas element: "Canvas element required for game initialization"
  - Invalid canvas context: "Failed to get 2D rendering context"
  - Invalid config values: "Volume must be between 0 and 1"
- Console warnings for misconfigurations (FR71):
  - Canvas too small for optimal gameplay
  - Missing player name when events fire
  - Performance degradation warnings
- Custom GameError class with error codes
- TypeScript errors for incorrect API usage (FR72)
- All error scenarios tested
- Developer-friendly error messages (FR70)

**Prerequisites:** Story 4.4

**Technical Notes:**

- FR70-FR72: Developer experience requirements
- Architecture: Error handling patterns
- Custom GameError with code property for programmatic handling
- Graceful degradation on performance issues

---

_Epic 4 Complete: 5 stories_

---

## Epic 5: Documentation & Developer Experience

**Goal:** Create comprehensive documentation enabling < 30 min integration.

**Value Delivered:** Developers can install, configure, and integrate games quickly with excellent DX.

**FRs Covered:** FR55-FR62, FR69

### Story 5.1: Core Package README

**User Story:**
As a developer,
I want comprehensive README for @minigame/core,
So that I understand the framework and can extend BaseGame.

**Acceptance Criteria:**

Given @minigame/core is complete
When I write the core package README
Then:

- packages/core/README.md includes:
  - Installation instructions (npm/pnpm/yarn) (FR55)
  - Quick overview of framework architecture
  - BaseGame API reference (all public methods) (FR57)
  - Event system documentation with callback signatures
  - GameConfig customization options (FR58)
  - Event handling examples (FR59)
  - TypeScript usage examples with types (FR60)
  - JavaScript usage examples (FR60)
  - How to extend BaseGame to create custom games
  - Browser support information
  - Troubleshooting section
- All code examples are copy-paste ready (FR56)
- Examples are runnable without modification (FR62)

**Prerequisites:** Epic 4 complete

**Technical Notes:**

- FR55-FR62: Complete documentation requirements
- Architecture decision 13: Documentation structure
- Focus on framework concepts, not specific games

---

### Story 5.2: Game Package READMEs (Snake, Pong, Breakout)

**User Story:**
As a developer,
I want detailed README for each game package,
So that I can integrate games in under 30 minutes.

**Acceptance Criteria:**

Given all MVP games are implemented
When I write game package READMEs
Then:

- Each game package (snake, pong, breakout) has README.md with:
  - Installation: `npm install @minigame/core @minigame/snake` (FR55)
  - Quick start code example (< 10 lines, copy-paste ready) (FR56, FR69)
  - Complete API reference (start, stop, pause, events) (FR57)
  - Customization examples (colors, fonts, volumes) (FR58)
  - Event handling examples with all event types (FR59)
  - TypeScript examples with type imports (FR60)
  - JavaScript examples (FR60)
  - Integration examples:
    - Vanilla JavaScript (FR61)
    - React component (FR61)
    - Vue component (FR61)
  - Game controls documentation (keyboard, mouse, touch)
  - Browser support table
  - Troubleshooting common issues
- All examples runnable without modification (FR62)
- Examples demonstrate < 30 min integration goal (FR69)

**Prerequisites:** Story 5.1

**Technical Notes:**

- FR55-FR62: Documentation requirements
- FR69: < 30 min integration time is PRIMARY success metric
- Architecture decision 13: Per-package README template
- Focus on practical integration, not theory

---

### Story 5.3: Root Repository README & Examples

**User Story:**
As a developer,
I want a comprehensive repository README,
So that I understand the project structure and can choose which games to install.

**Acceptance Criteria:**

Given all packages have READMEs
When I write the root README
Then:

- Root README.md includes:
  - Project overview and value proposition
  - Available packages list (@minigame/core, @minigame/snake, etc.)
  - Quick start guide (choose game → install → integrate)
  - Links to individual package READMEs
  - Monorepo structure explanation
  - Development setup instructions for contributors
  - Build and test commands
  - Publishing workflow overview
  - License information
- examples/ directory with working demos:
  - examples/vanilla/ - Pure HTML/JS example (FR61)
  - examples/react/ - React integration example (FR61)
  - examples/vue/ - Vue integration example (FR61)
- All examples are runnable (FR62)
- Developer can go from clone → working example in < 5 minutes

**Prerequisites:** Story 5.2

**Technical Notes:**

- FR61: Framework integration examples
- FR62: Runnable examples
- Root README is entry point for discovery
- Examples serve as validation and reference

---

_Epic 5 Complete: 3 stories_

---

## Epic 6: Framework Integrations

**Goal:** Provide framework-specific wrappers for React and Vue, making games easily integrable in modern frontend applications.

**Value Delivered:** Developers using React or Vue can install framework-native components instead of manually wrapping vanilla JS games.

**FRs Covered:** FR73-FR90

### Story 6.1: React Wrapper Package

**User Story:**
As a React developer,
I want React component wrappers for all games,
So that I can use games as native React components with props and events.

**Acceptance Criteria:**

Given all MVP games are complete
When I create the React wrapper package
Then:

- packages/react/ structure created following monorepo pattern
- package.json:
  - name: "@minigame/react" (FR79)
  - peerDependencies: react ^18.0.0 (FR80)
  - dependencies: @minigame/core, @minigame/snake, @minigame/pong, @minigame/breakout
- Component-based API implemented (not hooks) (FR77)
- React components for all games:
  - `<SnakeGame />` (FR73)
  - `<PongGame />` (FR73)
  - `<BreakoutGame />` (FR73)
- Components accept config as props (FR74):
  ```tsx
  <SnakeGame
    config={{
      colors: { primary: '#3b82f6', ... },
      ...
    }}
  />
  ```
- Components emit React events (FR75):
  - `onGameStarted={(data) => ...}`
  - `onGameOver={(data) => ...}`
  - `onScoreUpdate={(data) => ...}`
  - `onGameFinished={(data) => ...}`
- Full TypeScript support (FR76):
  - Prop types exported
  - Event callback types exported
  - Full IntelliSense support
- No refs required for game control (FR78)
- Build outputs (ESM, CJS, types)
- Comprehensive unit tests using React Testing Library (FR90)
- README.md with:
  - Installation instructions
  - Quick start example
  - Props API reference
  - Event handling examples
  - TypeScript examples

**Prerequisites:** Epic 4 (all games complete)

**Technical Notes:**

- FR73-FR80: React wrapper requirements
- Use React 18+ (latest stable)
- Components use useEffect/useRef internally to manage game lifecycle
- Canvas ref managed internally
- Props changes trigger game reinitialization
- Clean up on unmount
- Example implementation:

  ```tsx
  export function SnakeGame({ config, onGameStarted, onGameOver, ... }: SnakeGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<SnakeGameInstance | null>(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      const game = new SnakeGameVanilla(canvasRef.current, config);
      game.on('gameStarted', onGameStarted);
      game.on('gameOver', onGameOver);
      // ... other events
      gameRef.current = game;

      return () => {
        game.stop();
        game.cleanup();
      };
    }, [config]);

    return <canvas ref={canvasRef} />;
  }
  ```

---

### Story 6.2: Vue Wrapper Package

**User Story:**
As a Vue developer,
I want Vue 3 component wrappers for all games,
So that I can use games as native Vue components with reactive props and emits.

**Acceptance Criteria:**

Given all MVP games are complete
When I create the Vue wrapper package
Then:

- packages/vue/ structure created following monorepo pattern
- package.json:
  - name: "@minigame/vue" (FR88)
  - peerDependencies: vue ^3.3.0 (FR89)
  - dependencies: @minigame/core, @minigame/snake, @minigame/pong, @minigame/breakout
- No Vue 2 support (FR87)
- Vue 3 Composition API used internally (FR85)
- Component syntax for template usage (FR86):
  ```vue
  <SnakeGame
    :config="gameConfig"
    @game-started="handleStart"
    @game-over="handleGameOver"
  />
  ```
- Vue components for all games (FR81):
  - `SnakeGame` component
  - `PongGame` component
  - `BreakoutGame` component
- Components accept config via props (FR82):
  - :config prop binding
  - Reactive updates on config changes
- Components emit Vue events (FR83):
  - @game-started
  - @game-over
  - @score-update
  - @game-finished
- Full TypeScript support (FR84):
  - Prop types defined
  - Emit types defined
  - Component types exported
  - Full IntelliSense in templates
- Build outputs (ESM, CJS, types)
- Comprehensive unit tests using Vitest + Vue Test Utils (FR90)
- README.md with:
  - Installation instructions
  - Quick start example (SFC + setup script)
  - Props API reference
  - Events reference
  - TypeScript usage examples

**Prerequisites:** Story 6.1

**Technical Notes:**

- FR81-FR89: Vue wrapper requirements
- Use Vue 3.3+ (latest stable)
- Use Composition API internally with defineComponent
- Manage canvas with template refs
- Watch for prop changes to reinitialize game
- onUnmounted cleanup
- Example implementation:

  ```ts
  export default defineComponent({
    name: "SnakeGame",
    props: {
      config: {
        type: Object as PropType<GameConfig>,
        default: () => ({}),
      },
    },
    emits: ["game-started", "game-over", "score-update", "game-finished"],
    setup(props, { emit }) {
      const canvasRef = ref<HTMLCanvasElement | null>(null);
      const game = ref<SnakeGameInstance | null>(null);

      onMounted(() => {
        if (!canvasRef.value) return;

        game.value = new SnakeGameVanilla(canvasRef.value, props.config);
        game.value.on("gameStarted", (data) => emit("game-started", data));
        game.value.on("gameOver", (data) => emit("game-over", data));
        // ... other events
      });

      watch(
        () => props.config,
        () => {
          // Reinitialize on config change
        },
        { deep: true }
      );

      onUnmounted(() => {
        game.value?.stop();
        game.value?.cleanup();
      });

      return { canvasRef };
    },
    template: '<canvas ref="canvasRef"></canvas>',
  });
  ```

---

_Epic 6 Complete: 2 stories_

---

## FR Coverage Matrix

| FR#       | Description                       | Epic | Story         |
| --------- | --------------------------------- | ---- | ------------- |
| FR1       | start() method                    | 2    | 2.4           |
| FR2       | stop() method                     | 2    | 2.4           |
| FR3       | pause() method                    | 2    | 2.4           |
| FR4       | resume() method                   | 2    | 2.4           |
| FR5       | mute() method                     | 2    | 2.4           |
| FR6       | unmute() method                   | 2    | 2.4           |
| FR7       | setPlayerName() method            | 2    | 2.4           |
| FR8       | getGameState() method             | 2    | 2.4           |
| FR9       | onGameStarted event               | 2    | 2.3, 2.4      |
| FR10      | onGameFinished event              | 2    | 2.3, 2.4      |
| FR11      | onGameOver event                  | 2    | 2.3, 2.4      |
| FR12      | onScoreUpdate event               | 2    | 2.3, 2.4      |
| FR13      | onSoundMuted/Unmuted events       | 2    | 2.3, 2.4      |
| FR14      | Event metadata                    | 2    | 2.2, 2.3      |
| FR15      | Game completion event data        | 2    | 2.2, 2.3      |
| FR16      | Register event callbacks          | 2    | 2.3, 2.4      |
| FR17      | Unregister event listeners        | 2    | 2.3, 2.4      |
| FR18      | Customize colors                  | 2    | 2.5           |
| FR19      | Customize typography              | 2    | 2.5           |
| FR20      | Customize styling                 | 2    | 2.5           |
| FR21      | Control animation speed           | 2    | 2.5           |
| FR22      | Adjust sound volume               | 2    | 2.5           |
| FR23      | Canvas rendering with external UI | 2    | 2.5           |
| FR24      | Consistent customization API      | 2    | 2.5           |
| FR25      | Snake game                        | 4    | 4.1, 4.2      |
| FR26      | Pong game                         | 4    | 4.3           |
| FR27      | Breakout game                     | 4    | 4.4           |
| FR28      | Desktop browser support           | 4    | 4.2, 4.3, 4.4 |
| FR29      | Mobile browser support            | 4    | 4.2, 4.3, 4.4 |
| FR30      | 60fps performance                 | 4    | 4.2, 4.3, 4.4 |
| FR31      | Old mobile device support         | 4    | 4.2, 4.3, 4.4 |
| FR32-FR35 | Growth games                      | -    | Post-MVP      |
| FR36      | TypeScript declarations           | 2    | 2.2, 2.6      |
| FR37      | Core exports types                | 2    | 2.2, 2.6      |
| FR38      | JSDoc comments                    | 2    | 2.2           |
| FR39      | No `any` usage                    | 2    | 2.2           |
| FR40      | TypeScript autocomplete           | 2    | 2.2           |
| FR41      | JavaScript IntelliSense           | 2    | 2.2           |
| FR42      | @minigame/core npm package        | 3    | 3.1           |
| FR43      | Game packages                     | 3    | 3.1           |
| FR44      | Selective installation            | 3    | 3.1           |
| FR45      | Core dependency                   | 3    | 3.1, 4.1      |
| FR46      | Semantic versioning               | 3    | 3.3           |
| FR47      | Consistent versions               | 3    | 3.1, 3.3      |
| FR48      | Multi-format builds               | 3    | 3.2           |
| FR49      | Minified builds                   | 3    | 3.2           |
| FR50      | Source maps                       | 3    | 3.2           |
| FR51      | Bundle size < 50kb                | 3    | 3.2           |
| FR52      | Zero core dependencies            | 2    | 2.1, 2.6      |
| FR53      | Games depend on core only         | 4    | 4.1           |
| FR54      | Dev and prod builds               | 3    | 3.2           |
| FR55      | README with installation          | 5    | 5.1, 5.2      |
| FR56      | Quick start example               | 5    | 5.1, 5.2      |
| FR57      | API reference                     | 5    | 5.1, 5.2      |
| FR58      | Customization examples            | 5    | 5.1, 5.2      |
| FR59      | Event examples                    | 5    | 5.1, 5.2      |
| FR60      | TS & JS examples                  | 5    | 5.1, 5.2      |
| FR61      | Framework integrations            | 5    | 5.2, 5.3      |
| FR62      | Runnable examples                 | 5    | 5.1, 5.2, 5.3 |
| FR63      | Major version bumps               | 3    | 3.3           |
| FR64      | Minor version bumps               | 3    | 3.3           |
| FR65      | Patch version bumps               | 3    | 3.3           |
| FR66      | Migration guides                  | 3    | 3.3           |
| FR67      | Auto-generated changelogs         | 1    | 1.5, 3.3      |
| FR68      | Git tags                          | 1    | 1.5, 3.3      |
| FR69      | < 30 min integration              | 5    | 5.2           |
| FR70      | Clear error messages              | 4    | 4.5           |
| FR71      | Console warnings                  | 4    | 4.5           |
| FR72      | TypeScript errors                 | 4    | 4.5           |
| FR73      | React component wrappers          | 6    | 6.1           |
| FR74      | React config as props             | 6    | 6.1           |
| FR75      | React events                      | 6    | 6.1           |
| FR76      | React TypeScript support          | 6    | 6.1           |
| FR77      | React component-based API         | 6    | 6.1           |
| FR78      | React no refs required            | 6    | 6.1           |
| FR79      | @minigame/react package           | 6    | 6.1           |
| FR80      | React peer dependency             | 6    | 6.1           |
| FR81      | Vue component wrappers            | 6    | 6.2           |
| FR82      | Vue config props                  | 6    | 6.2           |
| FR83      | Vue events                        | 6    | 6.2           |
| FR84      | Vue TypeScript support            | 6    | 6.2           |
| FR85      | Vue Composition API               | 6    | 6.2           |
| FR86      | Vue component syntax              | 6    | 6.2           |
| FR87      | Vue 3 only (no Vue 2)             | 6    | 6.2           |
| FR88      | @minigame/vue package             | 6    | 6.2           |
| FR89      | Vue peer dependency               | 6    | 6.2           |
| FR90      | Framework wrapper tests           | 6    | 6.1, 6.2      |
| FR91      | pnpm workspace                    | 1    | 1.1           |
| FR92      | Shared build config               | 1    | 1.3, 1.4      |
| FR93      | Consistent structure              | 1    | 1.1, 3.1      |
| FR94      | Automated publishing              | 3    | 3.3           |
| FR95      | Local testing                     | 1    | 1.4           |

**Total Coverage:** All 95 functional requirements mapped to stories ✅

---

## Epic Summary

| Epic                                        | Stories        | FRs Covered                | Value Delivered                           |
| ------------------------------------------- | -------------- | -------------------------- | ----------------------------------------- |
| **1. Foundation & Infrastructure**          | 5              | FR91-FR95                  | Working monorepo with build tools         |
| **2. Core Package - Game Framework**        | 6              | FR1-FR24, FR36-FR41, FR52  | @minigame/core framework installable      |
| **3. Build & Distribution Pipeline**        | 3              | FR42-FR50, FR54, FR63-FR68 | Packages publishable to npm               |
| **4. MVP Game Implementations**             | 5              | FR25-FR31, FR69-FR72       | Snake, Pong, Breakout games working       |
| **5. Documentation & Developer Experience** | 3              | FR55-FR62                  | < 30 min integration achieved             |
| **6. Framework Integrations**               | 2              | FR73-FR90                  | React & Vue wrappers available            |
| **TOTAL**                                   | **24 stories** | **All 95 FRs**             | **Production-ready library + frameworks** |

---

## Status: READY FOR EPIC 6 IMPLEMENTATION

All 6 epics fully detailed with 24 implementable stories covering all 95 functional requirements from the PRD.
