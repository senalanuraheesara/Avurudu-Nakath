import type { NakathEvent } from '../data/nakath2026';
import { NAKATH_LIST_REMOVAL_GRACE_MS } from './time';

/** Legacy long window for `multi_date` rows (e.g. sunset) where a wider “active” span is kept. */
const MULTI_DATE_POINT_CAP_MS = 3 * 60 * 60 * 1000;

type Seg = { start: number; end: number; ev: NakathEvent; prio: number };

/** Same 10 minutes as list removal: hero for clock-time nakaths until “finish” + grace (see `NAKATH_LIST_REMOVAL_GRACE_MS`). */
function activeWindowMsForInstant(ev: NakathEvent): number {
  if (ev.kind === 'multi_date') return MULTI_DATE_POINT_CAP_MS;
  return NAKATH_LIST_REMOVAL_GRACE_MS;
}

/**
 * While "inside" an active window, only this event should fill the main dashboard.
 * Point-in-time nakaths override overlapping පුණ්‍ය කාලය segments.
 */
export function getActiveDashboardEvent(events: NakathEvent[], now: number): NakathEvent | null {
  const rangeEv = events.find((e) => e.kind === 'range');

  const instants: { t: number; ev: NakathEvent }[] = [];
  for (const ev of events) {
    if (ev.kind === 'range') continue;
    if (ev.kind === 'multi_date') {
      ev.extraDates?.forEach((row) => {
        if (row.at) {
          const t = new Date(row.at).getTime();
          if (!Number.isNaN(t)) instants.push({ t, ev });
        }
      });
    } else if (ev.startAt) {
      const t = new Date(ev.startAt).getTime();
      if (!Number.isNaN(t)) instants.push({ t, ev });
    }
  }
  instants.sort((a, b) => a.t - b.t);

  const segs: Seg[] = [];

  for (let i = 0; i < instants.length; i++) {
    const { t, ev } = instants[i];
    const cap = activeWindowMsForInstant(ev);
    const nextT = instants[i + 1]?.t ?? t + cap;
    const end = Math.min(t + cap, nextT);
    segs.push({ start: t, end, ev, prio: 2 });
  }

  if (rangeEv?.startAt && rangeEv.endAt) {
    const rs = new Date(rangeEv.startAt).getTime();
    const re = new Date(rangeEv.endAt).getTime();
    if (!Number.isNaN(rs) && !Number.isNaN(re)) {
      const inside = instants.map((x) => x.t).filter((t) => t > rs && t < re).sort((a, b) => a - b);
      let g = rs;
      for (const t of inside) {
        if (g < t) {
          segs.push({ start: g, end: t, ev: rangeEv, prio: 1 });
        }
        g = t;
      }
      if (g < re) {
        segs.push({ start: g, end: re, ev: rangeEv, prio: 1 });
      }
    }
  }

  const covering = segs.filter((s) => s.start <= now && now < s.end);
  if (!covering.length) return null;
  covering.sort((a, b) => b.prio - a.prio || a.start - b.start);
  return covering[0].ev;
}
