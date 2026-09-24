import { FONT_STACKS, GAME_META, INERT_CONFIG_KEYS, metaOf, type GameId, type ThemeForm } from '../shared/meta';

const COLOR_KEYS = ['primary', 'secondary', 'background', 'text'] as const;

interface ControlsRailProps {
  themes: Record<GameId, ThemeForm>;
  selected: GameId;
  onSelect: (id: GameId) => void;
  onThemeChange: (id: GameId, patch: Partial<ThemeForm>) => void;
  onReset: (id: GameId) => void;
  playerName: string;
  onPlayerName: (name: string) => void;
  autoStart: boolean;
  onAutoStart: (value: boolean) => void;
}

export function ControlsRail({
  themes,
  selected,
  onSelect,
  onThemeChange,
  onReset,
  playerName,
  onPlayerName,
  autoStart,
  onAutoStart,
}: ControlsRailProps) {
  const theme = themes[selected];

  return (
    <aside className="panel panel--sticky">
      <div className="panel__head">
        <h3>Controls</h3>
        <span className="chip">props</span>
      </div>
      <div className="panel__body">
        <div className="field">
          <label htmlFor="react-player">setPlayerName()</label>
          <input
            id="react-player"
            type="text"
            value={playerName}
            placeholder="Ada"
            autoComplete="off"
            maxLength={24}
            onChange={(event) => onPlayerName(event.target.value)}
          />
          <p className="hint">Applied through the ref handle on all three games.</p>
        </div>

        <div className="field">
          <span className="field__label">autoStart prop</span>
          <div className="field__row">
            <button
              type="button"
              className="btn btn--sm"
              aria-pressed={autoStart}
              onClick={() => onAutoStart(!autoStart)}
            >
              {autoStart ? 'true — games run on mount' : 'false — idle until start()'}
            </button>
          </div>
        </div>

        <div className="fieldset">
          <p className="fieldset__title">
            theme — editing <span className="chip">{metaOf(selected).title.toLowerCase()}</span>
          </p>
          <div className="segmented">
            {GAME_META.map((meta) => (
              <button
                key={meta.id}
                type="button"
                className="btn btn--sm"
                aria-pressed={meta.id === selected}
                onClick={() => onSelect(meta.id)}
              >
                {meta.title}
              </button>
            ))}
          </div>
          <p className="hint">
            Editing a theme changes that game&apos;s <code>config</code> identity, which rebuilds the instance.
          </p>

          {COLOR_KEYS.map((key) => (
            <div className="field" key={key}>
              <label htmlFor={`react-${key}`}>{key}</label>
              <div className="field__row">
                <input
                  id={`react-${key}`}
                  type="color"
                  value={theme[key]}
                  onChange={(event) => onThemeChange(selected, { [key]: event.target.value })}
                />
                <span className="hex">{theme[key]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fieldset">
          <p className="fieldset__title">typography</p>
          <div className="field">
            <label htmlFor="react-font">fontFamily</label>
            <select
              id="react-font"
              value={theme.fontFamily}
              onChange={(event) => onThemeChange(selected, { fontFamily: event.target.value })}
            >
              {FONT_STACKS.map((stack) => (
                <option key={stack.label} value={stack.value}>
                  {stack.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="react-large">fontSize.large — score text</label>
            <input
              id="react-large"
              type="number"
              min={8}
              max={72}
              value={theme.fontSizeLarge}
              onChange={(event) =>
                onThemeChange(selected, { fontSizeLarge: clampSize(event.target.value) })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="react-small">fontSize.small — captions</label>
            <input
              id="react-small"
              type="number"
              min={8}
              max={72}
              value={theme.fontSizeSmall}
              onChange={(event) =>
                onThemeChange(selected, { fontSizeSmall: clampSize(event.target.value) })
              }
            />
          </div>
        </div>

        <div className="fieldset">
          <button type="button" className="btn btn--sm" onClick={() => onReset(selected)}>
            Reset this theme
          </button>
        </div>

        <details className="fieldset inert">
          <summary className="fieldset__title">Accepted by the constructor, ignored by these games</summary>
          {INERT_CONFIG_KEYS.map((item) => (
            <p key={item.key}>
              <code>{item.key}</code> — {item.detail}
            </p>
          ))}
        </details>
      </div>
    </aside>
  );
}

function clampSize(raw: string): number {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return 16;
  return Math.min(72, Math.max(8, parsed));
}
