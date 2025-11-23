# minigames-lib

TypeScript-based monorepo library providing headless, event-driven HTML5 arcade games for advertising agencies.

## Project Vision

minigames-lib enables agencies to quickly integrate branded, interactive minigames into campaign websites with minimal effort while maintaining full control over styling and user experience.

## Features

- **Headless Architecture**: Games are fully functional but styleable via API
- **Event-Driven Integration**: Rich event system for player data capture
- **Uniform API**: Consistent interface across all games (start, stop, pause, resume, mute, setPlayerName)
- **TypeScript**: 100% type coverage with full IntelliSense support
- **Selective Installation**: Install only the games you need via scoped npm packages

## MVP Games

- Snake (classic snake gameplay)
- Pong (paddle and ball mechanics)
- Breakout (brick-breaking mechanics)

## Development

This monorepo uses pnpm workspaces. Each game is an independent npm package.

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
pnpm install
```

### Commands

```bash
# Build all packages
pnpm build

# Watch mode for development (hot reload)
pnpm dev

# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

### Advanced Workspace Commands

```bash
# Filter by specific package
pnpm --filter @minigame/core build
pnpm --filter @minigame/snake dev

# Run scripts in parallel
pnpm -r --parallel run dev

# Clean and rebuild
pnpm clean && pnpm build
```

### Workspace Protocol

Packages use the `workspace:` protocol for local dependencies:

```json
{
  "dependencies": {
    "@minigame/core": "workspace:^"
  }
}
```

This ensures:

- Always uses local version during development
- Replaced with actual version on publish
- Hot reload works across dependent packages

## Versioning

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

### Creating a Changeset

After making changes to a package:

```bash
pnpm changeset
```

This will prompt you to:

1. Select the packages that changed
2. Choose the semver bump type (major/minor/patch)
3. Write a summary of the changes

### Versioning Packages

When ready to create a new version:

```bash
pnpm version-packages
```

This will:

- Bump versions in all affected package.json files
- Update CHANGELOG.md files
- Delete consumed changeset files

### Publishing

```bash
pnpm release
```

This will build all packages and publish them to npm with git tags.

**Note:** All @minigame/\* packages use fixed versioning (same version number).

## Architecture

- `packages/core/` - @minigame/core (shared framework, types, base classes)
- `packages/snake/` - @minigame/snake
- `packages/pong/` - @minigame/pong
- `packages/breakout/` - @minigame/breakout

## License

MIT
