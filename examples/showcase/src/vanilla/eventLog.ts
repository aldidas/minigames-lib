import { el } from '../shared/dom';
import { payloadParts, type LogEntry } from '../shared/events';
import type { GameId } from '../shared/meta';

export interface EventLog {
  push(entry: LogEntry): void;
  clear(): void;
}

const MAX_ROWS = 200;

export interface EventLogMounts {
  /** Scrolling container. */
  list: HTMLElement;
  /** Element holding the "N events" counter. */
  count: HTMLElement;
  /** Filter buttons carrying `data-filter`. */
  filters: HTMLButtonElement[];
}

export function createEventLog({ list, count, filters }: EventLogMounts): EventLog {
  const entries: LogEntry[] = [];
  let filter: GameId | 'all' = 'all';
  let empty: HTMLElement | null = null;

  const matches = (entry: LogEntry) => filter === 'all' || entry.game === filter;

  function syncEmpty(): void {
    const any = entries.some(matches);
    if (!any && !empty) {
      empty = el('p', {
        class: 'log__empty',
        text: 'No events yet. Press start() on any game above.',
      });
      list.append(empty);
    } else if (any && empty) {
      empty.remove();
      empty = null;
    }
  }

  function syncCount(): void {
    const shown = filter === 'all' ? entries.length : entries.filter(matches).length;
    const noun = entries.length === 1 ? 'event' : 'events';
    count.textContent = filter === 'all' ? `${entries.length} ${noun}` : `${shown} of ${entries.length} ${noun}`;
  }

  function row(entry: LogEntry): HTMLElement {
    return el('div', { class: 'log__row' }, [
      el('span', { class: 'log__meta' }, [
        el('span', {
          class: 'log__time',
          text: new Date(entry.at).toLocaleTimeString(undefined, { hour12: false }),
        }),
        el('span', { class: 'log__game', text: entry.game }),
        el('span', { class: `log__event log__event--${entry.event}`, text: entry.event }),
      ]),
      el('span', { class: 'log__payload' }, [payloadFragment(entry)]),
    ]);
  }

  function payloadFragment(entry: LogEntry): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const parts = payloadParts(entry.payload);

    if (parts.length === 0) {
      fragment.append('—');
      return fragment;
    }

    parts.forEach(([key, value], index) => {
      if (index > 0) fragment.append('  ');
      fragment.append(`${key}=`);
      fragment.append(el('b', { text: value }));
    });

    return fragment;
  }

  function renderAll(): void {
    list.replaceChildren();
    empty = null;
    for (const entry of entries) {
      if (matches(entry)) list.append(row(entry));
    }
    syncEmpty();
    syncCount();
  }

  for (const button of filters) {
    button.addEventListener('click', () => {
      const next = button.dataset.filter;
      if (!next) return;
      filter = next === 'all' ? 'all' : (next as GameId);
      for (const other of filters) {
        other.setAttribute('aria-pressed', String(other === button));
      }
      renderAll();
    });
  }

  renderAll();

  return {
    push(entry) {
      entries.unshift(entry);
      if (entries.length > MAX_ROWS) entries.length = MAX_ROWS;
      if (matches(entry)) {
        empty?.remove();
        empty = null;
        list.prepend(row(entry));
        while (list.childElementCount > MAX_ROWS) list.lastElementChild?.remove();
      }
      syncEmpty();
      syncCount();
    },
    clear() {
      entries.length = 0;
      renderAll();
    },
  };
}
