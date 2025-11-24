import { useEffect, useRef } from 'react';
import { BreakoutGame as BreakoutGameVanilla } from '@minigame/breakout';
import type { GameConfig, GameOverData, ScoreUpdateData } from '@minigame/core';

/**
 * Props for the BreakoutGame React component
 */
export interface BreakoutGameProps {
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
}

/**
 * React wrapper component for Breakout game
 * 
 * @example
 * ```tsx
 * <BreakoutGame
 *   config={{ colors: { primary: '#8b5cf6' } }}
 *   onGameOver={(data) => alert(`Game Over! Score: ${data.finalScore}`)}
 * />
 * ```
 */
export function BreakoutGame({
  config,
  onGameStarted,
  onGameOver,
  onScoreUpdate,
  onGameFinished,
  width = 600,
  height = 600,
}: BreakoutGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<BreakoutGameVanilla | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create game instance
    const game = new BreakoutGameVanilla(canvasRef.current, config);

    // Wire up event callbacks (cast to any as game accepts proper types internally)
    if (onGameStarted) game.on('gameStarted', onGameStarted as any);
    if (onGameOver) game.on('gameOver', onGameOver as any);
    if (onScoreUpdate) game.on('scoreUpdate', onScoreUpdate as any);
    if (onGameFinished) game.on('gameFinished', onGameFinished as any);

    gameRef.current = game;
    game.start();

    // Cleanup
    return () => {
      game.stop();
    };
  }, [config, onGameStarted, onGameOver, onScoreUpdate, onGameFinished]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
