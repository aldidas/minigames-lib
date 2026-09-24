# minigames-lib 🎮

> TypeScript-based library providing headless, event-driven HTML5 arcade games for advertising agencies and web developers.

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

Install a game and start playing in under 30 minutes:

```bash
# Install core and a game
npm install @minigame/core @minigame/snake

# Use it
import { SnakeGame } from '@minigame/snake';

const canvas = document.getElementById('game-canvas');
const game = new SnakeGame(canvas);
game.start();
```

That's it! Your game is running.

## 📦 Available Packages

| Package                                       | Description                                   | npm                  | Size   |
| --------------------------------------------- | --------------------------------------------- | -------------------- | ------ |
| **[@minigame/core](./packages/core)**         | Base game framework, types, and utilities     | `@minigame/core`     | < 20kb |
| **[@minigame/snake](./packages/snake)**       | Classic Snake game                            | `@minigame/snake`    | < 50kb |
| **[@minigame/pong](./packages/pong)**         | Classic Pong game (PvAI, PvP, Practice modes) | `@minigame/pong`     | < 50kb |
| **[@minigame/breakout](./packages/breakout)** | Classic Breakout brick-breaking game          | `@minigame/breakout` | < 50kb |
| **[@minigame/react](./packages/react)**       | React component wrappers for all games        | `@minigame/react`    | < 5kb  |
| **[@minigame/vue](./packages/vue)**           | Vue 3 component wrappers for all games        | `@minigame/vue`      | < 5kb  |

## ✨ Features

### Headless & Customizable

Games render to canvas but are fully customizable via API. Control colors, fonts, audio, and more without touching game logic.

### Event-Driven

Rich event system for capturing player data: game starts, score updates, game overs, and more. Perfect for analytics and engagement tracking.

### Uniform API

All games share a consistent interface:

```typescript
game.start(); // Start the game
game.stop(); // Stop and reset
game.pause(); // Pause gameplay
game.resume(); // Resume gameplay
game.mute(); // Mute sounds
game.unmute(); // Unmute sounds
game.setPlayerName("Player"); // Set player name for events
game.getGameState(); // Get current game state
```

### TypeScript First

100% TypeScript with full IntelliSense support. Types exported for all APIs, events, and configurations.

### Framework Support

Use as vanilla JavaScript or with included React and Vue wrappers for seamless framework integration.

### Selective Installation

Install only what you need. Each game is a separate package with the core as the only required dependency.

## 🎯 Use Cases

- **Advertising Campaigns**: Add branded games to campaign landing pages
- **Engagement Tools**: Increase time-on-site with interactive content
- **Educational Platforms**: Gamify learning experiences
- **Portfolio Projects**: Showcase classic game implementations
- **Hackathons**: Quick game prototypes with minimal setup

## 📚 Documentation

### Game Packages

- [Snake Game →](./packages/snake/README.md)
- [Pong Game →](./packages/pong/README.md)
- [Breakout Game →](./packages/breakout/README.md)

### Framework Wrappers

- [React Components →](./packages/react/README.md)
- [Vue 3 Components →](./packages/vue/README.md)

### Core Framework

- [Core Package & API Reference →](./packages/core/README.md)

## 🎨 Examples & Demos

- **[Showcase](./examples/showcase)** — the deployable demo. Three pages in one static artifact, covering the vanilla JavaScript, React, and Vue integrations.
- **[Vanilla JS Demo](./examples/vanilla-demo)** — the minimal reference. Three canvases, one script, nothing but Vite.

### The showcase

`examples/showcase` builds to a single static site:

| Page      | Packages it consumes                                |
| --------- | --------------------------------------------------- |
| `/`       | `@minigame/core` plus snake, pong and breakout       |
| `/react/` | `@minigame/react`                                   |
| `/vue/`   | `@minigame/vue`                                     |

The vanilla page drives all three games through the uniform API, applies live config
changes, streams all six events into an event console, and samples `getGameState()`
four times a second. The React and Vue pages present the same content through each
wrapper's own idioms — props and refs, or props and exposed methods.

### Running the demos locally

```bash
# Clone the repository
git clone https://github.com/aldidas/minigames-lib.git
cd minigames-lib

# Install dependencies
pnpm install

# Build every package (examples resolve @minigame/* to dist/, so this comes first)
pnpm build

# Hot reload: tsup --watch in every package, vite in every example
pnpm dev

# Or just one example
pnpm --filter minigame-showcase dev
pnpm --filter vanilla-demo dev
```

### Deploying the showcase

The showcase is a static site; any host works. On Cloudflare Pages with Git integration:

| Setting                 | Value                                     |
| ----------------------- | ----------------------------------------- |
| Root directory          | *(empty — build from the repo root)*      |
| Build command           | `pnpm build:showcase`                     |
| Build output directory  | `examples/showcase/dist`                  |
| Environment variable    | `NODE_VERSION=22` (optional)              |

`pnpm build:showcase` runs the tsup build for every package the showcase depends on,
then the showcase's own `vue-tsc --noEmit && vite build`. Set `PUBLIC_BASE=/sub/path/`
if the site is ever served from a subpath instead of a domain root.

## 🛠️ Development

### Prerequisites

- Node.js 20+
- pnpm 11 (pinned in `packageManager`; Corepack picks it up automatically)

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Common Commands

```bash
# Build all packages
pnpm build

# Build the packages the showcase needs, then the showcase itself
pnpm build:showcase

# Watch mode for development (hot reload)
pnpm dev

# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean

# Type check all packages
pnpm typecheck
```

### Workspace Commands

```bash
# Build specific package
pnpm --filter @minigame/core build
pnpm --filter @minigame/snake dev

# Run scripts in parallel across all packages
pnpm -r --parallel run dev

# Clean and rebuild everything
pnpm clean && pnpm build
```

## 📁 Monorepo Structure

```
minigames-lib/
├── packages/
│   ├── core/          # @minigame/core - Base framework
│   ├── snake/         # @minigame/snake - Snake game
│   ├── pong/          # @minigame/pong - Pong game
│   ├── breakout/      # @minigame/breakout - Breakout game
│   ├── react/         # @minigame/react - React wrappers
│   └── vue/           # @minigame/vue - Vue 3 wrappers
├── examples/
│   ├── showcase/      # Deployable demo — vanilla, React and Vue pages
│   └── vanilla-demo/  # Minimal vanilla JavaScript reference
└── docs/              # Documentation and specifications
```

### Package Architecture

All packages follow a consistent structure:

```
package/
├── src/              # TypeScript source files
├── dist/             # Built output (ESM, CJS, IIFE)
├── package.json      # Package metadata and dependencies
├── tsconfig.json     # TypeScript configuration
├── tsup.config.ts    # Build configuration
└── README.md         # Package documentation
```

## 🔧 Build System

This monorepo uses:

- **pnpm workspaces** for package management
- **tsup** for bundling (builds ESM, CJS, and IIFE formats)
- **TypeScript** for type checking and compilation
- **Vitest** for testing

### Build Outputs

Each package produces:

- **ESM** (`index.js`) - For modern bundlers
- **CommonJS** (`index.cjs`) - For Node.js
- **IIFE** (`index.global.js`) - For browser `<script>` tags
- **Type Declarations** (`index.d.ts`) - For TypeScript

All builds include source maps for debugging.

## 📦 Publishing Workflow

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### 1. Create a Changeset

After making changes:

```bash
pnpm changeset
```

This prompts you to:

1. Select changed packages
2. Choose semver bump type (major/minor/patch)
3. Write a change summary

### 2. Version Packages

When ready to release:

```bash
pnpm version-packages
```

This will:

- Bump versions in package.json files
- Update CHANGELOG.md files
- Delete consumed changeset files

### 3. Publish to npm

```bash
pnpm release
```

This builds all packages and publishes them to npm with git tags.

**Note:** All `@minigame/*` packages use fixed versioning (synchronized version numbers).

## 🌐 Browser Support

| Browser | Desktop | Mobile |
| ------- | ------- | ------ |
| Chrome  | ✅ 90+  | ✅ 90+ |
| Firefox | ✅ 88+  | ✅ 88+ |
| Safari  | ✅ 14+  | ✅ 14+ |
| Edge    | ✅ 90+  | ✅ 90+ |

All games run at 60fps on modern desktop and mobile devices (last 3 years).

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with tests
4. **Run tests and lint** (`pnpm test && pnpm lint`)
5. **Create a changeset** (`pnpm changeset`)
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Development Guidelines

- Write TypeScript with strict type checking
- Include unit tests for new features
- Update documentation for API changes
- Follow existing code style and conventions
- Keep bundle sizes small (check with `pnpm build`)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/scraperapi/minigames-lib)
- [Issue Tracker](https://github.com/scraperapi/minigames-lib/issues)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## 💡 Project Vision

minigames-lib enables developers and agencies to quickly integrate branded, interactive minigames into websites with minimal effort while maintaining full control over styling, user experience, and player data capture.

Built for advertising agencies, educational platforms, and developers who need production-ready games without the complexity of game engines.

---

Made with ❤️ for web developers who want to add fun, interactive games to their projects in under 30 minutes.
