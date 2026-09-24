<script setup lang="ts">
import { computed } from 'vue';
import { FONT_STACKS, GAME_META, INERT_CONFIG_KEYS, metaOf, type GameId, type ThemeForm } from '../shared/meta';

const COLOR_KEYS = ['primary', 'secondary', 'background', 'text'] as const;
type ColorKey = (typeof COLOR_KEYS)[number];

const props = defineProps<{
  themes: Record<GameId, ThemeForm>;
  selected: GameId;
  playerName: string;
  autoStart: boolean;
}>();

const emit = defineEmits<{
  select: [id: GameId];
  theme: [id: GameId, patch: Partial<ThemeForm>];
  player: [name: string];
  autoStart: [value: boolean];
  reset: [id: GameId];
}>();

const theme = computed(() => props.themes[props.selected]);

function patch(change: Partial<ThemeForm>): void {
  emit('theme', props.selected, change);
}

function onColor(key: ColorKey, event: Event): void {
  const next: Partial<ThemeForm> = {};
  next[key] = (event.target as HTMLInputElement).value;
  patch(next);
}

function onFont(event: Event): void {
  patch({ fontFamily: (event.target as HTMLSelectElement).value });
}

function onSize(key: 'fontSizeLarge' | 'fontSizeSmall', event: Event): void {
  const parsed = Number.parseInt((event.target as HTMLInputElement).value, 10);
  if (!Number.isFinite(parsed)) return;
  const next: Partial<ThemeForm> = {};
  next[key] = Math.min(72, Math.max(8, parsed));
  patch(next);
}
</script>

<template>
  <aside class="panel panel--sticky">
    <div class="panel__head">
      <h3>Controls</h3>
      <span class="chip">props &amp; events</span>
    </div>
    <div class="panel__body">
      <div class="field">
        <label for="vue-player">setPlayerName()</label>
        <input
          id="vue-player"
          type="text"
          :value="props.playerName"
          placeholder="Ada"
          autocomplete="off"
          maxlength="24"
          @input="emit('player', ($event.target as HTMLInputElement).value)"
        />
        <p class="hint">Applied through the exposed method on all three games.</p>
      </div>

      <div class="field">
        <span class="field__label">autoStart prop</span>
        <div class="field__row">
          <button
            type="button"
            class="btn btn--sm"
            :aria-pressed="props.autoStart"
            @click="emit('autoStart', !props.autoStart)"
          >
            {{ props.autoStart ? 'true — games run on mount' : 'false — idle until start()' }}
          </button>
        </div>
      </div>

      <div class="fieldset">
        <p class="fieldset__title">
          theme — editing <span class="chip">{{ metaOf(props.selected).title.toLowerCase() }}</span>
        </p>
        <div class="segmented">
          <button
            v-for="meta in GAME_META"
            :key="meta.id"
            type="button"
            class="btn btn--sm"
            :aria-pressed="meta.id === props.selected"
            @click="emit('select', meta.id)"
          >
            {{ meta.title }}
          </button>
        </div>
        <p class="hint">
          Editing a theme changes that game&apos;s <code>config</code> identity, which rebuilds the instance.
        </p>

        <div v-for="key in COLOR_KEYS" :key="key" class="field">
          <label :for="`vue-${key}`">{{ key }}</label>
          <div class="field__row">
            <input
              :id="`vue-${key}`"
              type="color"
              :value="theme[key]"
              @input="onColor(key, $event)"
            />
            <span class="hex">{{ theme[key] }}</span>
          </div>
        </div>
      </div>

      <div class="fieldset">
        <p class="fieldset__title">typography</p>
        <div class="field">
          <label for="vue-font">fontFamily</label>
          <select id="vue-font" :value="theme.fontFamily" @change="onFont">
            <option v-for="stack in FONT_STACKS" :key="stack.label" :value="stack.value">
              {{ stack.label }}
            </option>
          </select>
        </div>
        <div class="field">
          <label for="vue-large">fontSize.large — score text</label>
          <input
            id="vue-large"
            type="number"
            min="8"
            max="72"
            :value="theme.fontSizeLarge"
            @input="onSize('fontSizeLarge', $event)"
          />
        </div>
        <div class="field">
          <label for="vue-small">fontSize.small — captions</label>
          <input
            id="vue-small"
            type="number"
            min="8"
            max="72"
            :value="theme.fontSizeSmall"
            @input="onSize('fontSizeSmall', $event)"
          />
        </div>
      </div>

      <div class="fieldset">
        <button type="button" class="btn btn--sm" @click="emit('reset', props.selected)">
          Reset this theme
        </button>
      </div>

      <details class="fieldset inert">
        <summary class="fieldset__title">Accepted by the constructor, ignored by these games</summary>
        <p v-for="item in INERT_CONFIG_KEYS" :key="item.key">
          <code>{{ item.key }}</code> — {{ item.detail }}
        </p>
      </details>
    </div>
  </aside>
</template>
