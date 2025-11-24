import { useState } from 'react';
import { SnakeGame, PongGame, BreakoutGame } from '@minigame/react';
import type { GameOverData, ScoreUpdateData } from '@minigame/react';
import './App.css';

function App() {
  const [snakeScore, setSnakeScore] = useState(0);
  const [pongScore, setPongScore] = useState(0);
  const [breakoutScore, setBreakoutScore] = useState(0);

  const handleSnakeScoreUpdate = (data: ScoreUpdateData) => {
    setSnakeScore(data.score);
  };

  const handlePongScoreUpdate = (data: ScoreUpdateData) => {
    setPongScore(data.score);
  };

  const handleBreakoutScoreUpdate = (data: ScoreUpdateData) => {
    setBreakoutScore(data.score);
  };

  const handleGameOver = (gameName: string) => (data: GameOverData) => {
    alert(`${gameName} - Game Over! Final Score: ${data.finalScore}`);
  };

  return (
    <div className="app">
      <h1>Minigames Library - React Demo</h1>
      <p className="subtitle">Testing @minigame/react with all three games</p>

      <div className="games-grid">
        {/* Snake Game */}
        <div className="game-card">
          <h2>🐍 Snake Game</h2>
          <p className="score">Score: {snakeScore}</p>
          <div className="canvas-container">
            <SnakeGame
              config={{
                colors: {
                  primary: '#3b82f6',
                  secondary: '#8b5cf6',
                  background: '#1f2937',
                  text: '#f9fafb',
                },
              }}
              onScoreUpdate={handleSnakeScoreUpdate}
              onGameOver={handleGameOver('Snake')}
              width={400}
              height={400}
            />
          </div>
          <p className="controls">Controls: Arrow keys or WASD</p>
        </div>

        {/* Pong Game */}
        <div className="game-card">
          <h2>🏓 Pong Game</h2>
          <p className="score">Score: {pongScore}</p>
          <div className="canvas-container">
            <PongGame
              config={{
                colors: {
                  primary: '#10b981',
                  secondary: '#f59e0b',
                  background: '#1f2937',
                  text: '#f9fafb',
                },
              }}
              onScoreUpdate={handlePongScoreUpdate}
              onGameOver={handleGameOver('Pong')}
              width={400}
              height={400}
            />
          </div>
          <p className="controls">Controls: Arrow Up/Down or W/S</p>
        </div>

        {/* Breakout Game */}
        <div className="game-card">
          <h2>🧱 Breakout Game</h2>
          <p className="score">Score: {breakoutScore}</p>
          <div className="canvas-container">
            <BreakoutGame
              config={{
                colors: {
                  primary: '#8b5cf6',
                  secondary: '#ec4899',
                  background: '#1f2937',
                  text: '#f9fafb',
                },
              }}
              onScoreUpdate={handleBreakoutScoreUpdate}
              onGameOver={handleGameOver('Breakout')}
              width={400}
              height={400}
            />
          </div>
          <p className="controls">Controls: Arrow Left/Right or A/D</p>
        </div>
      </div>

      <div className="info">
        <p>
          <strong>React Version:</strong> React 18+ with TypeScript
        </p>
        <p>
          <strong>Framework:</strong> @minigame/react (Component-based API)
        </p>
        <p>
          <strong>Features:</strong> Props for config, events for game state, full TypeScript support
        </p>
      </div>
    </div>
  );
}

export default App;
