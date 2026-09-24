import type { GameId } from '../shared/meta';

export const INSTALL_SNIPPET = 'npm install @minigame/vue vue';

const HEAD = `<!-- SnakeCard.vue -->
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { SnakeGame } from '@minigame/vue';

const gameRef = useTemplateRef('gameRef');

// Stable identity: the component re-creates the game when this object changes,
// so derive it once instead of building a literal in the template.
const config = computed(() => ({
  colors: { primary: '#4ade80', background: '#0a0d12' },
}));

function start() {
  gameRef.value?.start();
}
<\/script>

<template>
  <SnakeGame
    ref="gameRef"
    :config="config"
    :width="400"
    :height="400"
    :auto-start="false"
    @score-update="({ score }) => console.log('score', score)"
    @game-over="({ reason, finalScore }) => console.log(reason, finalScore)"
  />
</template>

<!-- The exposed surface is the uniform API:
     start() stop() pause() resume() mute() unmute() setPlayerName() -->
`;

export const SNIPPETS: Record<GameId, string> = {
  snake: HEAD,
  pong: HEAD.replaceAll('SnakeGame', 'PongGame').replaceAll('SnakeCard', 'PongCard').replaceAll('4ade80', '7dd3fc'),
  breakout: HEAD.replaceAll('SnakeGame', 'BreakoutGame')
    .replaceAll('SnakeCard', 'BreakoutCard')
    .replaceAll('4ade80', 'f472b6'),
};

export const EVENTS_SNIPPET = `<SnakeGame
  :config="config"
  @game-started="({ playerName }) => track('start', playerName)"
  @score-update="({ score, delta }) => track('score', score, delta)"
  @game-over="({ reason, finalScore }) => track('over', reason, finalScore)"
  @game-finished="({ timestamp }) => track('finished', timestamp)"
/>
<!-- soundMuted and soundUnmuted are not forwarded by the wrapper. -->`;
