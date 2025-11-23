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
pnpm build    # Build all packages
pnpm test     # Test all packages
pnpm clean    # Clean all packages
```

## Architecture

- `packages/core/` - @minigame/core (shared framework, types, base classes)
- `packages/snake/` - @minigame/snake
- `packages/pong/` - @minigame/pong
- `packages/breakout/` - @minigame/breakout

## License

MIT
