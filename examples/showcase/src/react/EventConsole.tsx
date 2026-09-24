import { Fragment } from 'react';
import { payloadParts, type LogEntry } from '../shared/events';
import { GAME_META, type GameId } from '../shared/meta';

interface EventConsoleProps {
  entries: LogEntry[];
  filter: GameId | 'all';
  onFilter: (filter: GameId | 'all') => void;
  onClear: () => void;
}

export function EventConsole({ entries, filter, onFilter, onClear }: EventConsoleProps) {
  const shown = filter === 'all' ? entries : entries.filter((entry) => entry.game === filter);
  const noun = entries.length === 1 ? 'event' : 'events';
  const count = filter === 'all' ? `${entries.length} ${noun}` : `${shown.length} of ${entries.length} ${noun}`;

  return (
    <div className="console">
      <div className="console__bar">
        <button
          type="button"
          className="btn btn--sm"
          aria-pressed={filter === 'all'}
          onClick={() => onFilter('all')}
        >
          All games
        </button>
        {GAME_META.map((meta) => (
          <button
            key={meta.id}
            type="button"
            className="btn btn--sm"
            aria-pressed={filter === meta.id}
            onClick={() => onFilter(meta.id)}
          >
            {meta.title}
          </button>
        ))}
        <button type="button" className="btn btn--sm" onClick={onClear}>
          Clear
        </button>
        <span className="console__count">{count}</span>
      </div>

      <div className="log" role="log" aria-live="polite" aria-label="Game events">
        {shown.length === 0 ? (
          <p className="log__empty">No events yet. Press start() on any game above.</p>
        ) : (
          shown.map((entry) => (
            <div className="log__row" key={entry.seq}>
              <span className="log__meta">
                <span className="log__time">
                  {new Date(entry.at).toLocaleTimeString(undefined, { hour12: false })}
                </span>
                <span className="log__game">{entry.game}</span>
                <span className={`log__event log__event--${entry.event}`}>{entry.event}</span>
              </span>
              <span className="log__payload">
                {payloadParts(entry.payload).map(([key, value], index) => (
                  <Fragment key={key}>
                    {index > 0 ? '  ' : ''}
                    {key}=<b>{value}</b>
                  </Fragment>
                ))}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
