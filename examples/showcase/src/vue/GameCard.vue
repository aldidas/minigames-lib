<script setup lang="ts">
import { onMounted, useTemplateRef, watch, type Component } from 'vue';
import { BreakoutGame, PongGame, SnakeGame } from '@minigame/vue';
import type { GameConfig } from '@minigame/core';

import { COMMANDS, type Command, type GameMeta, type GameStatus } from '../shared/meta';
import type { GameEvent, Payload } from '../shared/events';

interface ExposedGame {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  mute(): void;
  unmute(): void;
  setPlayerName(name: string): void;
}

const props = defineProps<{
  meta: GameMeta;
  config: Partial<GameConfig>;
  autoStart: boolean;
  playerName: string;
  status: GameStatus;
  readout: [string, string][];
}>();

const emit = defineEmits<{
  record: [event: GameEvent, payload: Payload];
  statusChange: [status: GameStatus];
}>();

const COMPONENTS: Record<GameMeta['id'], Component> = {
  snake: SnakeGame,
  pong: PongGame,
  breakout: BreakoutGame,
};

const gameRef = useTemplateRef<ExposedGame>('gameRef');

onMounted(() => gameRef.value?.setPlayerName(props.playerName));

watch(
  () => props.playerName,
  (name) => gameRef.value?.setPlayerName(name),
);

function run(command: Command): void {
  const game = gameRef.value;
  if (!game) return;

  game[command]();

  if (command === 'start' || command === 'resume') emit('statusChange', 'running');
  else if (command === 'pause') emit('statusChange', 'paused');
}
</script>

<template>
  <article class="game" :style="{ '--accent': props.meta.accent }">
    <header class="game__head">
      <span class="game__badge" />
      <h3>{{ props.meta.title }}</h3>
      <span :class="`game__status game__status--${props.status}`">{{ props.status }}</span>
    </header>

    <div class="game__stage">
      <component
        :is="COMPONENTS[props.meta.id]"
        ref="gameRef"
        :config="props.config"
        :width="400"
        :height="400"
        :auto-start="props.autoStart"
        @game-started="(data: unknown) => emit('record', 'gameStarted', data as Payload)"
        @score-update="(data: unknown) => emit('record', 'scoreUpdate', data as Payload)"
        @game-over="(data: unknown) => emit('record', 'gameOver', data as Payload)"
        @game-finished="(data: unknown) => emit('record', 'gameFinished', data as Payload)"
      />
    </div>

    <div class="game__readout">
      <span v-for="([label, value]) in props.readout" :key="label">
        {{ label }} <b>{{ value }}</b>
      </span>
    </div>

    <div class="game__controls">
      <button
        v-for="command in COMMANDS"
        :key="command"
        type="button"
        class="btn btn--icon"
        @click="run(command)"
      >
        {{ command }}()
      </button>
    </div>

    <p class="game__hint">{{ props.meta.keys }}. {{ props.meta.touch }}.</p>
  </article>
</template>
