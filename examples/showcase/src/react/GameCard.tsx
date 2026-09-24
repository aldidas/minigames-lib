import { useCallback } from 'react';
import type { CSSProperties, ComponentType, MutableRefObject, RefAttributes } from 'react';
import { BreakoutGame, PongGame, SnakeGame } from '@minigame/react';
import type { SnakeGameHandle, SnakeGameProps } from '@minigame/react';
import type { GameConfig, GameOverData, ScoreUpdateData } from '@minigame/core';

import { COMMANDS, type Command, type GameId, type GameMeta, type GameStatus } from '../shared/meta';
import type { LogEntry, Payload } from '../shared/events';

/** All three wrappers expose the same props and handle, so one component can drive them. */
type WrapperProps = SnakeGameProps & RefAttributes<SnakeGameHandle>;

export type GameHandle = SnakeGameHandle;

const GAME_COMPONENTS: Record<GameId, ComponentType<WrapperProps>> = {
  snake: SnakeGame,
  pong: PongGame,
  breakout: BreakoutGame,
};

interface GameCardProps {
  meta: GameMeta;
  config: Partial<GameConfig>;
  autoStart: boolean;
  status: GameStatus;
  handleRef: MutableRefObject<GameHandle | null>;
  onEvent: (entry: Omit<LogEntry, 'seq'>) => void;
  onCommand: (id: GameId, command: Command) => void;
  readout: [string, string][];
}

export function GameCard({
  meta,
  config,
  autoStart,
  status,
  handleRef,
  onEvent,
  onCommand,
  readout,
}: GameCardProps) {
  const id = meta.id;
  const Wrapper = GAME_COMPONENTS[id];

  // Every callback below must keep a stable identity, otherwise it lands in the
  // wrapper's effect dependencies and rebuilds the running game on each render.
  const record = useCallback(
    (event: LogEntry['event'], data: unknown) =>
      onEvent({ game: id, event, payload: data as Payload, at: Date.now() }),
    [id, onEvent],
  );

  const onGameStarted = useCallback(
    (data: { timestamp: string; playerName?: string }) => record('gameStarted', data),
    [record],
  );
  const onScoreUpdate = useCallback((data: ScoreUpdateData) => record('scoreUpdate', data), [record]);
  const onGameOver = useCallback((data: GameOverData) => record('gameOver', data), [record]);
  const onGameFinished = useCallback(
    (data: { timestamp: string; playerName?: string }) => record('gameFinished', data),
    [record],
  );

  return (
    <article className="game" style={{ '--accent': meta.accent } as CSSProperties}>
      <header className="game__head">
        <span className="game__badge" />
        <h3>{meta.title}</h3>
        <span className={`game__status game__status--${status}`}>{status}</span>
      </header>

      <div className="game__stage">
        <Wrapper
          ref={handleRef}
          config={config}
          width={400}
          height={400}
          autoStart={autoStart}
          onGameStarted={onGameStarted}
          onScoreUpdate={onScoreUpdate}
          onGameOver={onGameOver}
          onGameFinished={onGameFinished}
        />
      </div>

      <div className="game__readout">
        {readout.map(([label, value]) => (
          <span key={label}>
            {label} <b>{value}</b>
          </span>
        ))}
      </div>

      <div className="game__controls">
        {COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            className="btn btn--icon"
            onClick={() => onCommand(id, command)}
          >
            {command}()
          </button>
        ))}
      </div>

      <p className="game__hint">
        {meta.keys}. {meta.touch}.
      </p>
    </article>
  );
}
