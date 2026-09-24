<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import type { GameConfig } from '@minigame/core';

import { STATUS_BY_EVENT, type GameEvent, type LogEntry, type Payload } from '../shared/events';
import {
  GAME_META,
  cloneThemes,
  metaOf,
  toGameConfig,
  type GameId,
  type GameStatus,
  type ThemeForm,
} from '../shared/meta';
import { readoutFromEvents } from '../shared/readout';
import ControlsRail from './ControlsRail.vue';
import EventConsole from './EventConsole.vue';
import GameCard from './GameCard.vue';
import SnippetPanel from './SnippetPanel.vue';
import { EVENTS_SNIPPET } from './snippets';

// `reactive`, not `ref`: replacing a ref's value invalidates every computed that
// reads it, which would rebuild all three games when one theme is edited.
const themes = reactive<Record<GameId, ThemeForm>>(cloneThemes());
const selected = ref<GameId>('snake');
const playerName = ref('');
const autoStart = ref(true);
const entries = ref<LogEntry[]>([]);
const filter = ref<GameId | 'all'>('all');
const statuses = ref<Record<GameId, GameStatus>>({ snake: 'idle', pong: 'idle', breakout: 'idle' });
const epoch = ref(0);

let seq = 0;
let resizeTimer = 0;

// One computed per game: editing Snake's theme must not disturb Pong's instance.
const snakeConfig = computed(() => toGameConfig(themes.snake));
const pongConfig = computed(() => toGameConfig(themes.pong));
const breakoutConfig = computed(() => toGameConfig(themes.breakout));

function configFor(id: GameId): Partial<GameConfig> {
  if (id === 'snake') return snakeConfig.value;
  if (id === 'pong') return pongConfig.value;
  return breakoutConfig.value;
}

function onRecord(game: GameId, event: GameEvent, payload: Payload): void {
  entries.value = [{ seq: seq++, game, event, payload, at: Date.now() }, ...entries.value].slice(0, 200);
  const next = STATUS_BY_EVENT[event];
  if (next) statuses.value = { ...statuses.value, [game]: next };
}

function applyTheme(id: GameId, patch: Partial<ThemeForm>): void {
  themes[id] = { ...themes[id], ...patch };
}

// The wrappers only size the canvas at construction, so a width change needs
// fresh instances. A key bump is the only way to remount them from outside.
let lastWidth = window.innerWidth;

function onResize(): void {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (Math.abs(window.innerWidth - lastWidth) < 2) return;
    lastWidth = window.innerWidth;
    epoch.value += 1;
  }, 200);
}

onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  window.clearTimeout(resizeTimer);
});
</script>

<template>
  <section class="section" id="playground">
    <div class="section__head">
      <h2>Playground</h2>
      <p class="section__note">
        Three wrapper components, three template refs, one event console. The components own the game instances —
        this page never calls a game constructor.
      </p>
    </div>
    <div class="playground">
      <ControlsRail
        :themes="themes"
        :selected="selected"
        :player-name="playerName"
        :auto-start="autoStart"
        @select="(id) => (selected = id)"
        @theme="applyTheme"
        @player="(name) => (playerName = name)"
        @auto-start="(value) => (autoStart = value)"
        @reset="(id) => (themes[id] = { ...metaOf(id).theme })"
      />
      <div class="games">
        <GameCard
          v-for="meta in GAME_META"
          :key="`${meta.id}-${epoch}`"
          :meta="meta"
          :config="configFor(meta.id)"
          :auto-start="autoStart"
          :player-name="playerName"
          :status="statuses[meta.id]"
          :readout="readoutFromEvents(meta.id, entries)"
          @record="(event, payload) => onRecord(meta.id, event, payload)"
          @status-change="(status) => (statuses[meta.id] = status)"
        />
      </div>
    </div>
  </section>

  <section class="section" id="events">
    <div class="section__head">
      <h2>Event stream</h2>
      <p class="section__note">
        The components emit four of the six game events as kebab-case listeners. Scores on each card are derived from
        this stream, because the components expose no <code>getGameState()</code>.
      </p>
    </div>
    <EventConsole :entries="entries" :filter="filter" @filter="(next) => (filter = next)" @clear="entries = []" />
  </section>

  <section class="section" id="integrate">
    <div class="section__head">
      <h2>The integration</h2>
      <p class="section__note">
        A stable config object and one template ref. Both matter: the component re-creates the game whenever the config
        identity changes.
      </p>
    </div>
    <SnippetPanel />
    <div class="code">
      <pre>{{ EVENTS_SNIPPET }}</pre>
    </div>
  </section>

  <section class="section" id="notes">
    <div class="section__head">
      <h2>Wrapper specifics</h2>
    </div>
    <div class="notes notes--tight">
      <div class="note">
        <h4>Props and exposed methods</h4>
        <p>
          Every component takes <code>config</code>, <code>width</code>, <code>height</code> and{' '}
          <code>autoStart</code>, emits four kebab-case events, and exposes the same seven methods as the vanilla API
          through <code>expose()</code>.
        </p>
      </div>
      <div class="note">
        <h4>Config identity rebuilds the game</h4>
        <p>
          The component deep-watches <code>props.config</code>. An object literal in the template is a new object on
          every render, which would tear the game down on each score update — hence the <code>computed</code> configs
          on this page.
        </p>
      </div>
      <div class="note">
        <h4>Not exposed by the component</h4>
        <p>
          <code>getGameState()</code> and the <code>soundMuted</code> / <code>soundUnmuted</code> events have no prop
          or exposed method, and Pong&apos;s third constructor argument never reaches the component, so this page
          always plays PvAI.
        </p>
      </div>
    </div>
  </section>
</template>
