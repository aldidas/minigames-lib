import type { GameId } from '../shared/meta';

const SHARED_TAIL = `
// The uniform API, identical on every game:
//   start() stop() pause() resume() mute() unmute() setPlayerName() getGameState()
// The twelve lines above are also the twelve lines below:
//   new PongGame(canvas, config, 'pvai')      new BreakoutGame(canvas, config)
`;

export const SNIPPETS: Record<GameId, string> = {
  snake: `import { SnakeGame } from '@minigame/snake';

const canvas = document.querySelector('canvas');
const game = new SnakeGame(canvas, {
  colors: { primary: '#4ade80', secondary: '#15803d', background: '#0a0d12', text: '#e8eef7' },
  typography: { fontFamily: 'Menlo, monospace', fontSize: { small: 12, medium: 16, large: 24 } },
});

game.setPlayerName('Ada');

game.on('scoreUpdate', ({ score, delta }) => sendToAnalytics('score', score, delta));
game.on('gameOver', ({ reason, finalScore }) => report('snake_over', reason, finalScore));

game.start();${SHARED_TAIL}`,

  pong: `import { PongGame } from '@minigame/pong';

const canvas = document.querySelector('canvas');
const game = new PongGame(
  canvas,
  {
    colors: { primary: '#7dd3fc', secondary: '#ffb454', background: '#0a0d12', text: '#e8eef7' },
  },
  'pvai', // 'pvai' (default) or 'pvp' for two players on one keyboard
);

game.setPlayerName('Ada');

game.on('scoreUpdate', ({ score, playerName }) => sendToAnalytics('pong_score', score, playerName));
game.on('gameOver', ({ reason, finalScore }) => report('pong_over', reason, finalScore));

game.start();${SHARED_TAIL}`,

  breakout: `import { BreakoutGame } from '@minigame/breakout';

const canvas = document.querySelector('canvas');
const game = new BreakoutGame(canvas, {
  colors: { primary: '#f472b6', secondary: '#a78bfa', background: '#0a0d12', text: '#e8eef7' },
});

game.setPlayerName('Ada');

game.on('scoreUpdate', ({ score }) => sendToAnalytics('breakout_score', score));
game.on('gameOver', ({ reason, finalScore }) => report('breakout_over', reason, finalScore));

game.start();${SHARED_TAIL}`,
};

export const INSTALL_SNIPPET = 'npm install @minigame/core @minigame/snake';
