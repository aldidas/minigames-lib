<script setup lang="ts">
import { ref } from 'vue';
import { SnakeGame, PongGame, BreakoutGame } from '@minigame/vue';
import type { GameOverData, ScoreUpdateData } from '@minigame/vue';

const snakeScore = ref(0);
const pongScore = ref(0);
const breakoutScore = ref(0);

const handleSnakeScoreUpdate = (data: ScoreUpdateData) => {
  snakeScore.value = data.score;
};

const handlePongScoreUpdate = (data: ScoreUpdateData) => {
  pongScore.value = data.score;
};

const handleBreakoutScoreUpdate = (data: ScoreUpdateData) => {
  breakoutScore.value = data.score;
};

const handleGameOver = (gameName: string) => (data: GameOverData) => {
  alert(`${gameName} - Game Over! Final Score: ${data.finalScore}`);
};
</script>

<template>
  <div class="app">
    <h1>Minigames Library - Vue Demo</h1>
    <p class="subtitle">Testing @minigame/vue with all three games</p>

    <div class="games-grid">
      <!-- Snake Game -->
      <div class="game-card">
        <h2>🐍 Snake Game</h2>
        <p class="score">Score: {{ snakeScore }}</p>
        <div class="canvas-container">
          <SnakeGame
            :config="{
              colors: {
                primary: '#3b82f6',
                secondary: '#8b5cf6',
                background: '#1f2937',
                text: '#f9fafb',
              },
            }"
            @score-update="handleSnakeScoreUpdate"
            @game-over="handleGameOver('Snake')"
            :width="400"
            :height="400"
          />
        </div>
        <p class="controls">Controls: Arrow keys or WASD</p>
      </div>

      <!-- Pong Game -->
      <div class="game-card">
        <h2>🏓 Pong Game</h2>
        <p class="score">Score: {{ pongScore }}</p>
        <div class="canvas-container">
          <PongGame
            :config="{
              colors: {
                primary: '#10b981',
                secondary: '#f59e0b',
                background: '#1f2937',
                text: '#f9fafb',
              },
            }"
            @score-update="handlePongScoreUpdate"
            @game-over="handleGameOver('Pong')"
            :width="400"
            :height="400"
          />
        </div>
        <p class="controls">Controls: Arrow Up/Down or W/S</p>
      </div>

      <!-- Breakout Game -->
      <div class="game-card">
        <h2>🧱 Breakout Game</h2>
        <p class="score">Score: {{ breakoutScore }}</p>
        <div class="canvas-container">
          <BreakoutGame
            :config="{
              colors: {
                primary: '#8b5cf6',
                secondary: '#ec4899',
                background: '#1f2937',
                text: '#f9fafb',
              },
            }"
            @score-update="handleBreakoutScoreUpdate"
            @game-over="handleGameOver('Breakout')"
            :width="400"
            :height="400"
          />
        </div>
        <p class="controls">Controls: Arrow Left/Right or A/D</p>
      </div>
    </div>

    <div class="info">
      <p>
        <strong>Vue Version:</strong> Vue 3.5+ with TypeScript
      </p>
      <p>
        <strong>Framework:</strong> @minigame/vue (Composition API)
      </p>
      <p>
        <strong>Features:</strong> Reactive props, Vue events, full TypeScript support
      </p>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.game-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.game-card h2 {
  color: #1f2937;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.canvas-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.canvas-container canvas {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.controls {
  color: #6b7280;
  font-size: 0.9rem;
  font-style: italic;
}

.info {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info p {
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.info p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1200px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
