import type { GameId } from '../shared/meta';

export const INSTALL_SNIPPET = 'npm install @minigame/react react react-dom';

const HEAD = `import { useMemo, useRef } from 'react';
import { SnakeGame, type SnakeGameHandle } from '@minigame/react';

export function Snake() {
  const ref = useRef<SnakeGameHandle>(null);

  // Identity matters: the component re-instantiates the game whenever this
  // object changes, so it must not be built inline in JSX.
  const config = useMemo(() => ({
    colors: { primary: '#4ade80', background: '#0a0d12' },
  }), []);

  return (
    <SnakeGame
      ref={ref}
      config={config}
      width={400}
      height={400}
      autoStart={false}
      onScoreUpdate={({ score }) => console.log('score', score)}
      onGameOver={({ reason, finalScore }) => console.log(reason, finalScore)}
    />
  );
}

// ref.current exposes the uniform API:
//   start() stop() pause() resume() mute() unmute() setPlayerName()
`;

export const SNIPPETS: Record<GameId, string> = {
  snake: HEAD,
  pong: HEAD.replace('SnakeGame', 'PongGame').replace('SnakeGameHandle', 'PongGameHandle').replace('Snake', 'Pong'),
  breakout: HEAD.replace('SnakeGame', 'BreakoutGame')
    .replace('SnakeGameHandle', 'BreakoutGameHandle')
    .replace('Snake', 'Breakout'),
};

export const EVENTS_SNIPPET = `<SnakeGame
  ref={ref}
  config={config}
  onGameStarted={({ playerName }) => track('start', playerName)}
  onScoreUpdate={({ score, delta }) => track('score', score, delta)}
  onGameOver={({ reason, finalScore }) => track('over', reason, finalScore)}
  onGameFinished={({ timestamp }) => track('finished', timestamp)}
/>
// soundMuted and soundUnmuted are not forwarded by the wrapper.`;
