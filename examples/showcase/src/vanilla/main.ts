import { BreakoutGame } from '@minigame/breakout';
import { PongGame } from '@minigame/pong';
import { SnakeGame } from '@minigame/snake';
import type { BaseGame, GameConfig } from '@minigame/core';
import type { BreakoutGameState } from '@minigame/breakout';
import type { PongGameState } from '@minigame/pong';
import type { SnakeGameState } from '@minigame/snake';

import { copyToClipboard, el, must } from '../shared/dom';
import { EVENTS, STATUS_BY_EVENT, type Payload } from '../shared/events';
import {
  COMMANDS,
  GAME_IDS,
  GAME_META,
  cloneThemes,
  metaOf,
  toGameConfig,
  type Command,
  type GameId,
  type GameMeta,
  type GameStatus,
} from '../shared/meta';
import { createControlsPanel } from './controlsPanel';
import { createEventLog } from './eventLog';
import { INSTALL_SNIPPET, SNIPPETS } from './snippets';
import '../shared/theme.css';

type AnyGame = BaseGame<unknown>;

interface Card {
  meta: GameMeta;
  canvas: HTMLCanvasElement;
  statusEl: HTMLElement;
  readoutEl: HTMLElement;
}

const themes = cloneThemes();
let playerName = '';
let currentSnippet: GameId = 'snake';
let seq = 0;

const games: Record<GameId, AnyGame | null> = { snake: null, pong: null, breakout: null };
const status: Record<GameId, GameStatus> = { snake: 'idle', pong: 'idle', breakout: 'idle' };
const widths: Record<GameId, number> = { snake: 0, pong: 0, breakout: 0 };

const gamesRoot = must<HTMLElement>('#games');
const cards: Record<GameId, Card> = {
  snake: buildCard(metaOf('snake')),
  pong: buildCard(metaOf('pong')),
  breakout: buildCard(metaOf('breakout')),
};

const log = createEventLog({
  list: must<HTMLElement>('#log'),
  count: must<HTMLElement>('#log-count'),
  filters: [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')],
});

const inspector = buildInspector();

createControlsPanel({
  mount: must<HTMLElement>('#config-panel'),
  themes,
  onThemeChange: scheduleRemount,
  onPlayerName: (name) => {
    playerName = name;
    for (const id of GAME_IDS) games[id]?.setPlayerName(name);
  },
});

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-snippet]')) {
  const id = button.dataset.snippet as GameId | undefined;
  if (id) button.addEventListener('click', () => showSnippet(id));
}
showSnippet('snake');

must<HTMLButtonElement>('#copy-install').addEventListener('click', (event) => {
  copyToClipboard(INSTALL_SNIPPET, event.currentTarget as HTMLButtonElement);
});

must<HTMLButtonElement>('#copy-snippet').addEventListener('click', (event) => {
  copyToClipboard(SNIPPETS[currentSnippet], event.currentTarget as HTMLButtonElement);
});

must<HTMLButtonElement>('#log-clear').addEventListener('click', () => log.clear());

for (const id of GAME_IDS) mount(id, false);

// Poll the public state getter; score feedback also refreshes on each event.
window.setInterval(() => {
  for (const id of GAME_IDS) refresh(id);
}, 250);

let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const changed = GAME_IDS.filter(
      (id) => Math.abs(cards[id].canvas.getBoundingClientRect().width - widths[id]) > 1,
    );
    if (changed.length === 0) return;
    for (const id of GAME_IDS) mount(id, status[id] === 'running');
  }, 200);
});

// ---------------------------------------------------------------- cards

function buildCard(meta: GameMeta): Card {
  const canvas = el('canvas', { 'aria-label': `${meta.title} board` });
  const statusEl = el('span', { class: 'game__status', text: 'idle' });
  const readoutEl = el('div', { class: 'game__readout' });

  const controls = el('div', { class: 'game__controls' });
  for (const command of COMMANDS) {
    controls.append(
      el('button', {
        class: 'btn btn--icon',
        type: 'button',
        text: `${command}()`,
        onclick: () => run(meta.id, command),
      }),
    );
  }

  gamesRoot.append(
    el('article', { class: 'game', style: `--accent: ${meta.accent}` }, [
      el('header', { class: 'game__head' }, [
        el('span', { class: 'game__badge' }),
        el('h3', { text: meta.title }),
        statusEl,
      ]),
      el('div', { class: 'game__stage' }, [canvas]),
      readoutEl,
      controls,
      el('p', { class: 'game__hint', text: `${meta.keys}. ${meta.touch}.` }),
    ]),
  );

  return { meta, canvas, statusEl, readoutEl };
}

function buildInspector(): Record<GameId, HTMLPreElement> {
  const mount = must<HTMLElement>('#inspector');
  const pres = {
    snake: el('pre'),
    pong: el('pre'),
    breakout: el('pre'),
  };

  for (const meta of GAME_META) {
    mount.append(
      el('div', { class: 'panel' }, [
        el('div', { class: 'panel__head' }, [
          el('h3', { text: meta.title }),
          el('span', { class: 'chip', text: meta.stateShape }),
        ]),
        el('div', { class: 'panel__body' }, [pres[meta.id]]),
      ]),
    );
  }

  return pres;
}

// ---------------------------------------------------------------- lifecycle

function createGame(id: GameId, canvas: HTMLCanvasElement, config: Partial<GameConfig>): AnyGame {
  switch (id) {
    case 'snake':
      return new SnakeGame(canvas, config);
    case 'pong':
      return new PongGame(canvas, config, 'pvai');
    case 'breakout':
      return new BreakoutGame(canvas, config);
  }
}

function mount(id: GameId, autoStart: boolean): void {
  const card = cards[id];

  // stop() cancels the pending animation frame, so the replaced instance leaves
  // nothing running behind it.
  games[id]?.stop();

  const game = createGame(id, card.canvas, toGameConfig(themes[id]));

  // Paint one frame through the public API so an idle canvas is not a blank
  // rectangle. Wiring happens afterwards, so these two events stay out of the log.
  game.start();
  game.stop();

  for (const event of EVENTS) {
    game.on(event, (data) => {
      log.push({ seq: seq++, game: id, event, payload: data as unknown as Payload, at: Date.now() });
      const next = STATUS_BY_EVENT[event];
      if (next) setStatus(id, next);
      refresh(id);
    });
  }

  game.setPlayerName(playerName);
  games[id] = game;
  widths[id] = card.canvas.getBoundingClientRect().width;

  if (autoStart) {
    game.start();
    setStatus(id, 'running');
  } else {
    setStatus(id, 'idle');
  }

  refresh(id);
}

function run(id: GameId, command: Command): void {
  const game = games[id];
  if (!game) return;

  game[command]();

  if (command === 'start' || command === 'resume') setStatus(id, 'running');
  else if (command === 'pause') setStatus(id, 'paused');
  else if (command === 'stop') setStatus(id, 'finished');

  refresh(id);
}

function setStatus(id: GameId, next: GameStatus): void {
  status[id] = next;
  const chip = cards[id].statusEl;
  chip.textContent = next;
  chip.className = `game__status game__status--${next}`;
}

const pendingRemount = new Set<GameId>();
let remountTimer = 0;

/** Config is merged at construction and there is no setConfig(), so a theme
 *  change rebuilds the instance, preserving whether it was mid-game. */
function scheduleRemount(id: GameId): void {
  pendingRemount.add(id);
  window.clearTimeout(remountTimer);
  remountTimer = window.setTimeout(() => {
    for (const target of pendingRemount) mount(target, status[target] === 'running');
    pendingRemount.clear();
  }, 140);
}

// ---------------------------------------------------------------- rendering

function refresh(id: GameId): void {
  const game = games[id];
  if (!game) return;

  const state = game.getGameState();
  cards[id].readoutEl.replaceChildren(
    ...readout(id, state).map(([label, value]) => el('span', {}, [`${label} `, el('b', { text: value })])),
  );
  inspector[id].textContent = JSON.stringify(state, null, 2);
}

function readout(id: GameId, state: unknown): [string, string][] {
  switch (id) {
    case 'snake': {
      const snake = state as SnakeGameState;
      return [
        ['score', String(snake.score)],
        ['level', String(snake.level)],
      ];
    }
    case 'pong': {
      const pong = state as PongGameState;
      return [
        ['player', String(pong.score.player1)],
        ['ai', String(pong.score.player2)],
        ['ball', pong.ballSpeed.toFixed(0)],
        ['mode', pong.gameMode],
      ];
    }
    case 'breakout': {
      const breakout = state as BreakoutGameState;
      return [
        ['score', String(breakout.score)],
        ['lives', String(breakout.lives)],
        ['bricks', String(breakout.bricksRemaining)],
      ];
    }
  }
}

// ---------------------------------------------------------------- snippets

function showSnippet(id: GameId): void {
  currentSnippet = id;
  must<HTMLElement>('#snippet').textContent = SNIPPETS[id];
  must<HTMLElement>('#snippet-label').textContent = `${metaOf(id).title} integration`;
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-snippet]')) {
    button.setAttribute('aria-pressed', String(button.dataset.snippet === id));
  }
}
