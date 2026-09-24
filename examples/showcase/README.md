# minigames-lib showcase

Three pages, one static artifact, every package in the monorepo in use. Built with Vite
as a multi-page app, so `/` loads the vanilla JavaScript integration and `/react/` and
`/vue/` load only the runtime they need.

| Page      | Consumes                                            | Ships               |
| --------- | --------------------------------------------------- | ------------------- |
| `/`       | `@minigame/core` + snake, pong, breakout            | ~35 kB JS (11 kB gz) |
| `/react/` | `@minigame/react` (React 19)                        | ~429 kB JS          |
| `/vue/`   | `@minigame/vue` (Vue 3.5)                           | ~108 kB JS          |

## Commands

```bash
# From the repo root — builds the packages the showcase needs, then the showcase
pnpm build:showcase

# From this directory, with the packages already built
pnpm dev       # vite dev server
pnpm build     # vue-tsc --noEmit && vite build
pnpm preview   # serve dist/
```

Examples resolve `@minigame/*` to each package's `dist/`, so the packages have to be
built before this one. `pnpm build:showcase` handles that ordering.

## Deploy

Static output in `dist/`. On Cloudflare Pages with Git integration:

| Setting                | Value                                |
| ---------------------- | ------------------------------------ |
| Root directory         | *(empty — build from the repo root)* |
| Build command          | `pnpm build:showcase`                |
| Build output directory | `examples/showcase/dist`             |
| Environment variable   | `NODE_VERSION=22` (optional)         |

`public/_headers` sets immutable caching on `/assets/*` and adds `nosniff`,
`Referrer-Policy` and a `Permissions-Policy`. `public/404.html` is served for unknown
paths, so there is no SPA fallback and no client-side router.

Set `PUBLIC_BASE=/sub/path/` at build time if the site is served from a subpath rather
than a domain root.

## What each page shows

**`/` (vanilla)** drives all three games through the uniform API: `start`, `stop`,
`pause`, `resume`, `mute`, `unmute`, `setPlayerName`, `getGameState`. It also has a
config editor, an event console fed by all six events, a `getGameState()` inspector
sampled four times a second, and copy-paste integration snippets per game.

**`/react/`** and **`/vue/`** build the same page from the wrapper components: a config
prop, four forwarded events, and either a forwarded ref (React) or `expose()`d methods
(Vue). Neither page ever calls a game constructor, and neither can show
`getGameState()` — see below.

## Library behavior this demo works around

Everything here is a property of the current packages, worked around rather than fixed,
so the demo stays a consumer of the published API.

**Config is merged at construction, with no `setConfig()`.** The editor therefore
rebuilds the affected instance (`stop()` plus a new `XGame(canvas, config)`) and
restarts it if it was mid-game. Same for the wrappers, which re-instantiate whenever
the `config` object's identity changes (`packages/react/src/SnakeGame.tsx:110`,
`packages/vue/src/SnakeGame.ts:80`). That is why the React page memoises config and
callbacks, and why the Vue page derives its configs from `computed` — an inline object
literal would tear the running game down on every score update.

**Loading a game paints nothing until `start()`.** Each game renders only from inside
its loop, so an idle canvas would be blank. The vanilla page calls `start()` and then
`stop()` on mount — through the public API — to paint one frame and leave the instance
idle with no animation frame pending.

**A game that ends by itself leaves an animation frame scheduling forever.** When
`update()` decides the game is over it calls `stop()` from inside the loop; that
cancels the frame currently executing, which does nothing, and the loop then schedules
another one (`packages/core/src/BaseGame.ts:201-218`). The frame is inert once
`gameState` is `finished`, and the next `start()` overwrites the frame id so nothing
outside can cancel it. Measured on the built showcase: 0 pending frames idle, 1 while
running, 1 after the snake dies, 2 after one restart. Game *logic* does not speed up —
the chains share `lastFrameTime`, so the second one sees a delta of ~0 and the snake
still steps every 150 ms — but each cycle adds a permanent callback and an extra
`render()` per frame.

**`styling.*`, `animation.speed` and `audio.*` are accepted and never read.** No game
reads them (`packages/core/src/BaseGame.ts:255` only range-checks the speed), and the
library contains no audio code at all, so `mute()`/`unmute()` flip a flag and emit an
event. The editor's "accepted by the constructor, ignored by these games" block says so
rather than pretending the sliders work.

**`getGameState()` and the sound events are unreachable from the wrappers.** React and
Vue forward four events and expose seven methods; `getGameState()`, `soundMuted` and
`soundUnmuted` have no prop, callback or handle method. The wrapper pages derive their
score numbers from the event stream instead.

**Pong's mode is constructor-only.** `new PongGame(canvas, config, 'pvai' | 'pvp')` —
the wrappers pass no third argument, so `/react/` and `/vue/` always play PvAI. On the
vanilla page you can switch it in the snippet, and note that Pong overloads
`scoreUpdate.playerName` with the *scorer id* (`'player1'` / `'player2'`) rather than the
name set by `setPlayerName()` (`packages/pong/src/index.ts:307`).

**`@minigame/react` declares `peerDependencies.react: ^18`,** so pnpm installs a React 18
copy inside `packages/react`. Bundling that next to this app's React 19 produces two
React copies and hooks throw, which is why `vite.config.ts` sets
`resolve.dedupe: ['react', 'react-dom', 'vue']`.

**Levels never advance.** Snake and Breakout both report `level: 1` for the whole game;
Breakout ends the game when the last brick is cleared rather than starting a new level.
