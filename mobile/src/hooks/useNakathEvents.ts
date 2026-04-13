import { NAKATH_EVENTS, type NakathEvent } from '../data/nakath2026';

/** Bundled 2026 almanac only — no remote backend. */
export function useNakathEvents(): { events: NakathEvent[] } {
  return { events: NAKATH_EVENTS };
}
