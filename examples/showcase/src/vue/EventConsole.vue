<script setup lang="ts">
import { computed } from 'vue';
import { payloadParts, type LogEntry } from '../shared/events';
import { GAME_META, type GameId } from '../shared/meta';

const props = defineProps<{
  entries: LogEntry[];
  filter: GameId | 'all';
}>();

const emit = defineEmits<{
  filter: [filter: GameId | 'all'];
  clear: [];
}>();

const shown = computed(() =>
  props.filter === 'all' ? props.entries : props.entries.filter((entry) => entry.game === props.filter),
);

const count = computed(() => {
  const noun = props.entries.length === 1 ? 'event' : 'events';
  return props.filter === 'all'
    ? `${props.entries.length} ${noun}`
    : `${shown.value.length} of ${props.entries.length} ${noun}`;
});
</script>

<template>
  <div class="console">
    <div class="console__bar">
      <button
        type="button"
        class="btn btn--sm"
        :aria-pressed="props.filter === 'all'"
        @click="emit('filter', 'all')"
      >
        All games
      </button>
      <button
        v-for="meta in GAME_META"
        :key="meta.id"
        type="button"
        class="btn btn--sm"
        :aria-pressed="props.filter === meta.id"
        @click="emit('filter', meta.id)"
      >
        {{ meta.title }}
      </button>
      <button type="button" class="btn btn--sm" @click="emit('clear')">Clear</button>
      <span class="console__count">{{ count }}</span>
    </div>

    <div class="log" role="log" aria-live="polite" aria-label="Game events">
      <p v-if="shown.length === 0" class="log__empty">No events yet. Press start() on any game above.</p>
      <template v-else>
        <div v-for="entry in shown" :key="entry.seq" class="log__row">
          <span class="log__meta">
            <span class="log__time">{{ new Date(entry.at).toLocaleTimeString(undefined, { hour12: false }) }}</span>
            <span class="log__game">{{ entry.game }}</span>
            <span :class="`log__event log__event--${entry.event}`">{{ entry.event }}</span>
          </span>
          <span class="log__payload">
            <template v-for="([key, value], index) in payloadParts(entry.payload)" :key="key">
              {{ index > 0 ? '  ' : '' }}{{ key }}=<b>{{ value }}</b>
            </template>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
