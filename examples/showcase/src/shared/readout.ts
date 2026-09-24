import type { LogEntry } from './events';
import type { GameId } from './meta';

/**
 * The framework wrappers expose no getGameState(), so the React and Vue pages
 * derive their numbers from the event stream instead.
 */
export function readoutFromEvents(game: GameId, entries: LogEntry[]): [string, string][] {
  const mine = entries.filter((entry) => entry.game === game);
  const last = mine[0]?.event ?? '—';

  if (game === 'pong') {
    let player = 0;
    let ai = 0;
    for (const entry of mine) {
      if (entry.event !== 'scoreUpdate') continue;
      const score = Number(entry.payload.score ?? 0);
      if (entry.payload.playerName === 'player1') player = score;
      else if (entry.payload.playerName === 'player2') ai = score;
    }
    return [
      ['player', String(player)],
      ['ai', String(ai)],
      ['last', last],
    ];
  }

  const scored = mine.find((entry) => entry.event === 'scoreUpdate' || entry.event === 'gameOver');
  const score = scored ? Number(scored.payload.score ?? scored.payload.finalScore ?? 0) : 0;

  return [
    ['score', String(score)],
    ['last', last],
  ];
}
