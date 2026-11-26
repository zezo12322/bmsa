import type { ExchangeCall } from './types';

export type CallState =
  | { status: 'open'; call: ExchangeCall; target: number }
  | { status: 'upcoming'; call: ExchangeCall; target: number }
  | { status: 'none' };

/**
 * Picks the call to feature at `now`: an open call (closing soonest) wins,
 * otherwise the next one to open. `target` is the moment the countdown runs to.
 */
export function currentCallState(calls: ExchangeCall[], now: number): CallState {
  const timed = calls
    .map((call) => ({ call, opens: Date.parse(call.opensAt), closes: Date.parse(call.closesAt) }))
    .filter(({ opens, closes }) => Number.isFinite(opens) && Number.isFinite(closes) && closes > opens);

  const open = timed.filter(({ opens, closes }) => opens <= now && now < closes).sort((a, b) => a.closes - b.closes)[0];
  if (open) return { status: 'open', call: open.call, target: open.closes };

  const upcoming = timed.filter(({ opens }) => opens > now).sort((a, b) => a.opens - b.opens)[0];
  if (upcoming) return { status: 'upcoming', call: upcoming.call, target: upcoming.opens };

  return { status: 'none' };
}
