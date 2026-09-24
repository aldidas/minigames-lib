import { useState } from 'react';
import { copyToClipboard } from '../shared/dom';
import { GAME_META, metaOf, type GameId } from '../shared/meta';
import { SNIPPETS } from './snippets';

export function SnippetPanel() {
  const [current, setCurrent] = useState<GameId>('snake');

  return (
    <div className="console">
      <div className="console__bar">
        <span className="section__note">{metaOf(current).title} integration</span>
        {GAME_META.map((meta) => (
          <button
            key={meta.id}
            type="button"
            className="btn btn--sm"
            aria-pressed={meta.id === current}
            onClick={() => setCurrent(meta.id)}
          >
            {meta.title}
          </button>
        ))}
      </div>
      <div className="code">
        <pre>{SNIPPETS[current]}</pre>
        <button
          type="button"
          className="btn btn--icon code__copy"
          onClick={(event) => copyToClipboard(SNIPPETS[current], event.currentTarget)}
        >
          Copy
        </button>
      </div>
    </div>
  );
}
