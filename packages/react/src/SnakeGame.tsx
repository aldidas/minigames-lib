import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { SnakeGame as SnakeGameVanilla } from '@minigame/snake';
import type { GameConfig, GameOverData, ScoreUpdateData } from '@minigame/core';

/**
 * Props for the SnakeGame React component
 */
export interface SnakeGameProps {
  /** Optional game configuration */
  config?: Partial<GameConfig>;
  /** Callback when game starts */
  onGameStarted?: (data: { timestamp: string; playerName?: string }) => void;
  /** Callback when game ends */
  onGameOver?: (data: GameOverData) => void;
  /** Callback when score updates */
  onScoreUpdate?: (data: ScoreUpdateData) => void;
  /** Callback when game finishes successfully */
  onGameFinished?: (data: { timestamp: string; playerName?: string }) => void;
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Whether to auto-start the game on mount (default: true) */
  autoStart?: boolean;
}

/**
 * Ref handle exposed by SnakeGame component for manual control
 */
export interface SnakeGameHandle {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  mute: () => void;
  unmute: () => void;
  setPlayerName: (name: string) => void;
}

/**
 * React wrapper component for Snake game
 * 
 * @example
 * ```tsx
 * const gameRef = useRef<SnakeGameHandle>(null);
 * 
 * <SnakeGame
 *   ref={gameRef}
 *   config={{ colors: { primary: '#3b82f6' } }}
 *   onGameOver={(data) => console.log('Game Over!', data.finalScore)}
 *   autoStart={false}
 * />
 * 
 * // Control the game
 * gameRef.current?.start();
 * gameRef.current?.pause();
 * ```
 */
export const SnakeGame = forwardRef<SnakeGameHandle, SnakeGameProps>(
  function SnakeGame(
    {
      config,
      onGameStarted,
      onGameOver,
      onScoreUpdate,
      onGameFinished,
      width = 600,
      height = 600,
      autoStart = true,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<SnakeGameVanilla | null>(null);

    // Expose game control methods via ref
    useImperativeHandle(ref, () => ({
      start: () => gameRef.current?.start(),
      stop: () => gameRef.current?.stop(),
      pause: () => gameRef.current?.pause(),
      resume: () => gameRef.current?.resume(),
      mute: () => gameRef.current?.mute(),
      unmute: () => gameRef.current?.unmute(),
      setPlayerName: (name: string) => gameRef.current?.setPlayerName(name),
    }));

    useEffect(() => {
      if (!canvasRef.current) return;

      // Create game instance
      const game = new SnakeGameVanilla(canvasRef.current, config);

      // Wire up event callbacks (cast to any as game accepts proper types internally)
      if (onGameStarted) game.on('gameStarted', onGameStarted as any);
      if (onGameOver) game.on('gameOver', onGameOver as any);
      if (onScoreUpdate) game.on('scoreUpdate', onScoreUpdate as any);
      if (onGameFinished) game.on('gameFinished', onGameFinished as any);

      gameRef.current = game;
      
      // Auto-start if enabled
      if (autoStart) {
        game.start();
      }

      // Cleanup
      return () => {
        game.stop();
      };
    }, [config, onGameStarted, onGameOver, onScoreUpdate, onGameFinished, autoStart]);

    return <canvas ref={canvasRef} width={width} height={height} />;
  }
);
