import { el } from '../shared/dom';
import {
  FONT_STACKS,
  GAME_META,
  INERT_CONFIG_KEYS,
  metaOf,
  type GameId,
  type ThemeForm,
} from '../shared/meta';

export interface ControlsPanelOptions {
  /** Element to fill — the `<aside>` in the page shell. */
  mount: HTMLElement;
  themes: Record<GameId, ThemeForm>;
  onThemeChange(id: GameId, theme: ThemeForm): void;
  onPlayerName(name: string): void;
}

const COLOR_KEYS = ['primary', 'secondary', 'background', 'text'] as const;

export function createControlsPanel(options: ControlsPanelOptions): void {
  const { mount, themes, onThemeChange, onPlayerName } = options;
  let selected: GameId = 'snake';

  const colorInputs: Record<string, HTMLInputElement> = {};
  const hexLabels: Record<string, HTMLElement> = {};
  const fontSelect = el('select', { id: 'field-font' });
  const largeInput = el('input', { type: 'number', min: '8', max: '72', step: '1', id: 'field-large' });
  const smallInput = el('input', { type: 'number', min: '8', max: '72', step: '1', id: 'field-small' });
  const themeName = el('span', { class: 'chip' });

  const nameInput = el('input', {
    type: 'text',
    id: 'field-player',
    placeholder: 'Ada',
    autocomplete: 'off',
    maxlength: '24',
  });

  for (const stack of FONT_STACKS) {
    fontSelect.append(el('option', { value: stack.value, text: stack.label }));
  }

  const gameButtons = GAME_META.map((meta) =>
    el('button', {
      class: 'btn btn--sm',
      type: 'button',
      text: meta.title,
      'data-game': meta.id,
      'aria-pressed': String(meta.id === selected),
      onclick: () => select(meta.id),
    }),
  );

  function select(id: GameId): void {
    selected = id;
    for (const button of gameButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.game === id));
    }
    syncInputs();
  }

  function current(): ThemeForm {
    return themes[selected];
  }

  function syncInputs(): void {
    const theme = current();
    for (const key of COLOR_KEYS) {
      colorInputs[key]!.value = theme[key];
      hexLabels[key]!.textContent = theme[key];
    }
    fontSelect.value = theme.fontFamily;
    largeInput.value = String(theme.fontSizeLarge);
    smallInput.value = String(theme.fontSizeSmall);
    themeName.textContent = metaOf(selected).title.toLowerCase();
  }

  function emit(): void {
    onThemeChange(selected, current());
  }

  const colorRows = COLOR_KEYS.map((key) => {
    const input = el('input', {
      type: 'color',
      id: `field-${key}`,
      value: '#000000',
      oninput: () => {
        const theme = current();
        theme[key] = input.value;
        hexLabels[key]!.textContent = input.value;
        emit();
      },
    });
    const hex = el('span', { class: 'hex', text: '#000000' });
    colorInputs[key] = input;
    hexLabels[key] = hex;

    return el('div', { class: 'field' }, [
      el('label', { for: `field-${key}`, text: key }),
      el('div', { class: 'field__row' }, [input, hex]),
    ]);
  });

  mount.className = 'panel panel--sticky';
  mount.append(
    el('div', { class: 'panel__head' }, [
      el('h3', { text: 'Controls' }),
      el('span', { class: 'chip', text: 'per instance' }),
    ]),
    el('div', { class: 'panel__body' }, [
      el('div', { class: 'field' }, [
        el('label', { for: 'field-player', text: 'setPlayerName()' }),
        nameInput,
        el('p', {
          class: 'hint',
          text: 'Applied to all three instances. Every event payload carries it.',
        }),
      ]),
      el('div', { class: 'fieldset' }, [
        el('div', { class: 'fieldset__title' }, [el('span', { text: 'theme — editing' }), themeName]),
        el('div', { class: 'segmented' }, gameButtons),
        el('p', { class: 'hint', text: 'Each instance holds its own config object.' }),
        ...colorRows,
      ]),
      el('div', { class: 'fieldset' }, [
        el('p', { class: 'fieldset__title', text: 'typography' }),
        el('div', { class: 'field' }, [
          el('label', { for: 'field-font', text: 'fontFamily' }),
          fontSelect,
        ]),
        el('div', { class: 'field' }, [
          el('label', { for: 'field-large', text: 'fontSize.large — score text' }),
          largeInput,
        ]),
        el('div', { class: 'field' }, [
          el('label', { for: 'field-small', text: 'fontSize.small — captions' }),
          smallInput,
        ]),
      ]),
      el('div', { class: 'fieldset' }, [
        el('button', {
          class: 'btn btn--sm',
          type: 'button',
          text: 'Reset this theme',
          onclick: () => {
            themes[selected] = { ...metaOf(selected).theme };
            syncInputs();
            emit();
          },
        }),
      ]),
      el('details', { class: 'fieldset inert' }, [
        el('summary', { class: 'fieldset__title', text: 'Accepted by the constructor, ignored by these games' }),
        ...INERT_CONFIG_KEYS.map((item) =>
          el('p', {}, [el('code', { text: item.key }), ` — ${item.detail}`]),
        ),
      ]),
    ]),
  );

  fontSelect.addEventListener('change', () => {
    current().fontFamily = fontSelect.value;
    emit();
  });

  const numberHandler = (input: HTMLInputElement, assign: (theme: ThemeForm, value: number) => void) => () => {
    const parsed = Number.parseInt(input.value, 10);
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(72, Math.max(8, parsed));
    assign(current(), clamped);
    emit();
  };

  largeInput.addEventListener('input', numberHandler(largeInput, (theme, value) => (theme.fontSizeLarge = value)));
  smallInput.addEventListener('input', numberHandler(smallInput, (theme, value) => (theme.fontSizeSmall = value)));
  nameInput.addEventListener('input', () => onPlayerName(nameInput.value));

  syncInputs();
}
