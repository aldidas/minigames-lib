import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { GameConfig } from '@minigame/core';

import { STATUS_BY_EVENT, type LogEntry } from '../shared/events';
import {
  GAME_META,
  cloneThemes,
  metaOf,
  toGameConfig,
  type Command,
  type GameId,
  type GameStatus,
  type ThemeForm,
} from '../shared/meta';
import { readoutFromEvents } from '../shared/readout';
import { ControlsRail } from './ControlsRail';
import { EventConsole } from './EventConsole';
import { GameCard, type GameHandle } from './GameCard';
import { SnippetPanel } from './SnippetPanel';
import { EVENTS_SNIPPET } from './snippets';

const IDLE_STATUS: Record<GameId, GameStatus> = { snake: 'idle', pong: 'idle', breakout: 'idle' };

export default function App() {
  const [themes, setThemes] = useState<Record<GameId, ThemeForm>>(cloneThemes);
  const [selected, setSelected] = useState<GameId>('snake');
  const [playerName, setPlayerName] = useState('');
  const [autoStart, setAutoStart] = useState(true);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<GameId | 'all'>('all');
  const [statuses, setStatuses] = useState<Record<GameId, GameStatus>>(IDLE_STATUS);
  const [epoch, setEpoch] = useState(0);

  const snakeRef = useRef<GameHandle | null>(null);
  const pongRef = useRef<GameHandle | null>(null);
  const breakoutRef = useRef<GameHandle | null>(null);
  const handles: Record<GameId, MutableRefObject<GameHandle | null>> = {
    snake: snakeRef,
    pong: pongRef,
    breakout: breakoutRef,
  };
  const seq = useRef(0);

  // One memo per game: editing Snake's theme must not disturb Pong's instance.
  const snakeConfig = useMemo(() => toGameConfig(themes.snake), [themes.snake]);
  const pongConfig = useMemo(() => toGameConfig(themes.pong), [themes.pong]);
  const breakoutConfig = useMemo(() => toGameConfig(themes.breakout), [themes.breakout]);
  const configs: Record<GameId, Partial<GameConfig>> = {
    snake: snakeConfig,
    pong: pongConfig,
    breakout: breakoutConfig,
  };

  const onEvent = useCallback((entry: Omit<LogEntry, 'seq'>) => {
    const full: LogEntry = { ...entry, seq: seq.current++ };
    setEntries((prev) => [full, ...prev].slice(0, 200));
    const next = STATUS_BY_EVENT[entry.event];
    if (next) setStatuses((prev) => ({ ...prev, [entry.game]: next }));
  }, []);

  useEffect(() => {
    for (const ref of [snakeRef, pongRef, breakoutRef]) ref.current?.setPlayerName(playerName);
  }, [playerName]);

  // The wrappers only size the canvas at construction, so a width change needs
  // fresh instances. A key bump is the only way to remount them from outside.
  useEffect(() => {
    let timer = 0;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (Math.abs(window.innerWidth - lastWidth) < 2) return;
        lastWidth = window.innerWidth;
        setEpoch((value) => value + 1);
      }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
    };
  }, []);

  const applyTheme = (id: GameId, patch: Partial<ThemeForm>) => {
    setThemes((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const bumpStatus = (id: GameId, status: GameStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const run = (id: GameId, command: Command) => {
    handles[id].current?.[command]();
    if (command === 'start' || command === 'resume') bumpStatus(id, 'running');
    else if (command === 'pause') bumpStatus(id, 'paused');
  };

  return (
    <>
      <section className="section" id="playground">
        <div className="section__head">
          <h2>Playground</h2>
          <p className="section__note">
            Three wrapper components, three refs, one event console. The wrappers own the game instances — this page
            never calls a game constructor.
          </p>
        </div>
        <div className="playground">
          <ControlsRail
            themes={themes}
            selected={selected}
            onSelect={setSelected}
            onThemeChange={applyTheme}
            onReset={(id) => setThemes((prev) => ({ ...prev, [id]: { ...metaOf(id).theme } }))}
            playerName={playerName}
            onPlayerName={setPlayerName}
            autoStart={autoStart}
            onAutoStart={setAutoStart}
          />
          <div className="games">
            {GAME_META.map((meta) => (
              <GameCard
                key={`${meta.id}-${epoch}`}
                meta={meta}
                config={configs[meta.id]}
                autoStart={autoStart}
                status={statuses[meta.id]}
                handleRef={handles[meta.id]}
                onEvent={onEvent}
                onCommand={run}
                readout={readoutFromEvents(meta.id, entries)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="events">
        <div className="section__head">
          <h2>Event stream</h2>
          <p className="section__note">
            The wrapper forwards four of the six events as props. Scores on each card are derived from this stream,
            because the wrappers do not expose <code>getGameState()</code>.
          </p>
        </div>
        <EventConsole
          entries={entries}
          filter={filter}
          onFilter={setFilter}
          onClear={() => setEntries([])}
        />
      </section>

      <section className="section" id="integrate">
        <div className="section__head">
          <h2>The integration</h2>
          <p className="section__note">
            Memoised config, stable callbacks, one ref. Both matter: the wrapper re-instantiates the game whenever a
            dependency changes.
          </p>
        </div>
        <SnippetPanel />
        <div className="code">
          <pre>{EVENTS_SNIPPET}</pre>
        </div>
      </section>

      <section className="section" id="notes">
        <div className="section__head">
          <h2>Wrapper specifics</h2>
        </div>
        <div className="notes notes--tight">
          <div className="note">
            <h4>Props and refs</h4>
            <p>
              Every component takes <code>config</code>, <code>width</code>, <code>height</code>,{' '}
              <code>autoStart</code> and four event callbacks. Its ref exposes the same seven methods as the vanilla
              API, so imperative control reads identically in both integrations.
            </p>
          </div>
          <div className="note">
            <h4>Config identity rebuilds the game</h4>
            <p>
              <code>config</code> and the four callbacks are in the effect&apos;s dependency list. An object literal
              in JSX changes identity on every render, which would tear the game down on each score update — hence{' '}
              <code>useMemo</code> and <code>useCallback</code> throughout this page.
            </p>
          </div>
          <div className="note">
            <h4>Not exposed by the wrapper</h4>
            <p>
              <code>getGameState()</code> and the <code>soundMuted</code> / <code>soundUnmuted</code> events have no
              prop or handle method, and Pong&apos;s third constructor argument never reaches the component, so this
              page always plays PvAI.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
