<script setup lang="ts">
import { ref } from 'vue';
import { copyToClipboard } from '../shared/dom';
import { GAME_META, metaOf, type GameId } from '../shared/meta';
import { SNIPPETS } from './snippets';

const current = ref<GameId>('snake');

function copy(button: HTMLButtonElement): void {
  copyToClipboard(SNIPPETS[current.value], button);
}
</script>

<template>
  <div class="console">
    <div class="console__bar">
      <span class="section__note">{{ metaOf(current).title }} integration</span>
      <button
        v-for="meta in GAME_META"
        :key="meta.id"
        type="button"
        class="btn btn--sm"
        :aria-pressed="meta.id === current"
        @click="current = meta.id"
      >
        {{ meta.title }}
      </button>
    </div>
    <div class="code">
      <pre>{{ SNIPPETS[current] }}</pre>
      <button
        type="button"
        class="btn btn--icon code__copy"
        @click="copy($event.currentTarget as HTMLButtonElement)"
      >
        Copy
      </button>
    </div>
  </div>
</template>
