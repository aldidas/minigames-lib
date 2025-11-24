import { SnakeGame } from '@minigame/snake';
import { PongGame } from '@minigame/pong';
import { BreakoutGame } from '@minigame/breakout';
import './style.css';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // ==================== Snake Game ====================
  const snakeCanvas = document.getElementById('snakeCanvas');
  const snakeScore = document.getElementById('snakeScore');

  const snakeGame = new SnakeGame(snakeCanvas, {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#1f2937',
      text: '#f9fafb',
    },
  });

  snakeGame.setPlayerName('Player');

  snakeGame.on('scoreUpdate', (data) => {
    snakeScore.textContent = `Score: ${data.score}`;
  });

  snakeGame.on('gameOver', (data) => {
    alert(`Snake Game Over! 🐍\nReason: ${data.reason}\nFinal Score: ${data.finalScore}`);
  });

  document.getElementById('snakeStart').addEventListener('click', () => {
    snakeScore.textContent = 'Score: 0';
    snakeGame.start();
  });

  document.getElementById('snakePause').addEventListener('click', () => {
    snakeGame.pause();
  });

  document.getElementById('snakeResume').addEventListener('click', () => {
    snakeGame.resume();
  });

  document.getElementById('snakeStop').addEventListener('click', () => {
    snakeGame.stop();
  });

  // ==================== Pong Game ====================
  const pongCanvas = document.getElementById('pongCanvas');
  const pongScore = document.getElementById('pongScore');

  const pongGame = new PongGame(pongCanvas, {
    colors: {
      primary: '#10b981',
      secondary: '#f59e0b',
      background: '#1f2937',
      text: '#f9fafb',
    },
  }, 'pvai');

  pongGame.setPlayerName('Player');

  pongGame.on('scoreUpdate', (data) => {
    const state = pongGame.getGameState();
    pongScore.textContent = `Player: ${state.score.player1} | AI: ${state.score.player2}`;
  });

  pongGame.on('gameOver', (data) => {
    alert(`Pong Game Over! 🏓\n${data.reason}`);
  });

  document.getElementById('pongStart').addEventListener('click', () => {
    pongScore.textContent = 'Player: 0 | AI: 0';
    pongGame.start();
  });

  document.getElementById('pongPause').addEventListener('click', () => {
    pongGame.pause();
  });

  document.getElementById('pongResume').addEventListener('click', () => {
    pongGame.resume();
  });

  document.getElementById('pongStop').addEventListener('click', () => {
    pongGame.stop();
  });

  // ==================== Breakout Game ====================
  const breakoutCanvas = document.getElementById('breakoutCanvas');
  const breakoutScore = document.getElementById('breakoutScore');

  const breakoutGame = new BreakoutGame(breakoutCanvas, {
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      background: '#1f2937',
      text: '#f9fafb',
    },
  });

  breakoutGame.setPlayerName('Player');

  breakoutGame.on('scoreUpdate', (data) => {
    const state = breakoutGame.getGameState();
    breakoutScore.textContent = `Score: ${state.score} | Lives: ${state.lives}`;
  });

  breakoutGame.on('gameOver', (data) => {
    alert(`Breakout Game Over! 🧱\n${data.reason}\nFinal Score: ${data.finalScore}`);
  });

  document.getElementById('breakoutStart').addEventListener('click', () => {
    breakoutScore.textContent = 'Score: 0 | Lives: 3';
    breakoutGame.start();
  });

  document.getElementById('breakoutPause').addEventListener('click', () => {
    breakoutGame.pause();
  });

  document.getElementById('breakoutResume').addEventListener('click', () => {
    breakoutGame.resume();
  });

  document.getElementById('breakoutStop').addEventListener('click', () => {
    breakoutGame.stop();
  });
});
