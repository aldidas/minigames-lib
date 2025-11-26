import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { PongGame as PongGameVanilla } from '@minigame/pong';
import type { GameConfig, GameOverData, ScoreUpdateData } from '@minigame/core';

/**
 * Props for the PongGame React component
 */
export interface PongGameProps {
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
 * Ref handle exposed by PongGame component for manual control
 */
export interface PongGameHandle {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  mute: () => void;
  unmute: () => void;
  setPlayerName: (name: string) => void;
}

/**
 * React wrapper component for Pong game
 * 
 * @example
 * ```tsx
 * const gameRef = useRef<PongGameHandle>(null);
 * 
 * <PongGame
 *   ref={gameRef}
 *   config={{ colors: { primary: '#10b981' } }}
 *   onScoreUpdate={(data) => console.log('Score:', data.score)}
 *   autoStart={false}
 * />
 * 
 * // Control the game
 * gameRef.current?.start();
 * gameRef.current?.pause();
 * ```
 */
export const PongGame = forwardRef<PongGameHandle, PongGameProps>(
  function PongGame(
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
    const gameRef = useRef<PongGameVanilla | null>(null);

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
      const game = new PongGameVanilla(canvasRef.current, config);

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
