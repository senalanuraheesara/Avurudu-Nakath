import type { NakathEvent } from '../data/nakath2026';
import type { Lang } from '../i18n/lang';

const COLombo = 'Asia/Colombo';

export function parseEventInstant(ev: NakathEvent): Date | null {
  if (ev.kind === 'multi_date' && ev.extraDates?.length) {
    const future = ev.extraDates
      .map((d) => (d.at ? new Date(d.at) : null))
      .filter((d): d is Date => d !== null && !Number.isNaN(d.getTime()));
    const now = Date.now();
    const upcoming = future.filter((d) => d.getTime() >= now).sort((a, b) => a.getTime() - b.getTime());
    return upcoming[0] ?? future.sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  }
  if (!ev.startAt) return null;
  const d = new Date(ev.startAt);
  return Number.isNaN(d.getTime()) ? null : d;
}

function localeTag(lang: Lang) {
  if (lang === 'ta') return 'ta-LK';
  return lang === 'si' ? 'si-LK' : 'en-GB';
}

export function formatColombo(iso?: string, lang: Lang = 'si'): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(localeTag(lang), {
    timeZone: COLombo,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function formatColomboDateOnly(iso?: string, lang: Lang = 'si'): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(localeTag(lang), {
    timeZone: COLombo,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatRange(startIso: string, endIso: string, lang: Lang = 'si'): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return '';
  const df = new Intl.DateTimeFormat(localeTag(lang), {
    timeZone: COLombo,
    month: 'long',
    day: 'numeric',
  });
  const tf = new Intl.DateTimeFormat(localeTag(lang), {
    timeZone: COLombo,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  if (lang === 'si') {
    return `${df.format(s)} — ${tf.format(s)} සිට ${tf.format(e)} දක්වා`;
  }
  if (lang === 'ta') {
    return `${df.format(s)} — ${tf.format(s)} முதல் ${tf.format(e)} வரை`;
  }
  return `${df.format(s)} — from ${tf.format(s)} to ${tf.format(e)}`;
}

export type GetNextEventOptions = {
  /** Skip these ritual ids (e.g. පරණ ස්නානය — countdown should show ඊළඟ as පුණ්‍ය කාලය instead). */
  excludeEventIds?: readonly string[];
  /**
   * While `now` is before `rangeEventId`’s range `startAt`, skip `blockedEventIds`.
   * Used so e.g. the 3rd nakath countdown only appears after පුණ්‍ය කාලය (2nd) has begun.
   */
  excludeUntilRangeStarted?: { rangeEventId: string; blockedEventIds: readonly string[] };
};

/**
 * Earliest upcoming **start** instant for the home countdown banner.
 *
 * Rules (all nakath kinds):
 * - `range`: only `startAt` counts, and only while `now` is **before** that start. Never `endAt`.
 *   After the range has begun, this event contributes nothing — the banner moves to the next ritual.
 * - `single` / `date_only`: `startAt` while it is still in the future (≥ now).
 * - `multi_date`: each `extraDates[].at` that is still ≥ now (e.g. after one moon time passes, the next row is used).
 *
 * Optional `excludeUntilRangeStarted` can hold back specific ids (e.g. 3rd nakath) until a range (2nd) has opened.
 */
export function getNextEvent(
  events: NakathEvent[],
  options?: GetNextEventOptions,
): { event: NakathEvent; at: Date } | null {
  const now = Date.now();
  const skip = new Set(options?.excludeEventIds ?? []);
  let blocked = new Set<string>();
  const gate = options?.excludeUntilRangeStarted;
  if (gate) {
    const rangeEv = events.find((e) => e.id === gate.rangeEventId);
    if (rangeEv?.kind === 'range' && rangeEv.startAt) {
      const startMs = new Date(rangeEv.startAt).getTime();
      if (!Number.isNaN(startMs) && now < startMs) {
        blocked = new Set(gate.blockedEventIds);
      }
    }
  }
  const candidates: { event: NakathEvent; at: Date }[] = [];

  for (const ev of events) {
    if (skip.has(ev.id) || blocked.has(ev.id)) continue;

    if (ev.kind === 'range' && ev.startAt && ev.endAt) {
      const startMs = new Date(ev.startAt).getTime();
      if (Number.isNaN(startMs)) continue;
      if (now < startMs) {
        candidates.push({ event: ev, at: new Date(ev.startAt) });
      }
      continue;
    }

    if (ev.kind === 'multi_date' && ev.extraDates?.length) {
      for (const row of ev.extraDates) {
        if (!row.at) continue;
        const at = new Date(row.at);
        const t = at.getTime();
        if (Number.isNaN(t) || t < now) continue;
        candidates.push({ event: ev, at });
      }
      continue;
    }

    if (ev.startAt) {
      const at = new Date(ev.startAt);
      const t = at.getTime();
      if (Number.isNaN(t) || t < now) continue;
      candidates.push({ event: ev, at });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.at.getTime() - b.at.getTime());
  return candidates[0];
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '0:00:00';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** Next instant to fire a one-off local notification for this ritual. */
export function getReminderDate(ev: NakathEvent): Date | null {
  const all = getAllReminderInstants(ev);
  return all[0] ?? null;
}

/** All future instants to schedule (e.g. both lunar & solar new-moon rows). */
export function getAllReminderInstants(ev: NakathEvent): Date[] {
  const now = Date.now();
  const out: Date[] = [];
  if (ev.kind === 'range' && ev.startAt) {
    const d = new Date(ev.startAt);
    if (!Number.isNaN(d.getTime()) && d.getTime() > now) out.push(d);
    return out;
  }
  if (ev.kind === 'multi_date' && ev.extraDates?.length) {
    for (const row of ev.extraDates) {
      if (!row.at) continue;
      const d = new Date(row.at);
      if (!Number.isNaN(d.getTime()) && d.getTime() > now) out.push(d);
    }
    out.sort((a, b) => a.getTime() - b.getTime());
    return out;
  }
  if (ev.startAt) {
    const d = new Date(ev.startAt);
    if (!Number.isNaN(d.getTime()) && d.getTime() > now) out.push(d);
  }
  return out;
}

/** True when this ritual’s clock time is over (range: after end; multi: all listed times passed). */
export function isNakathPast(ev: NakathEvent, now: number = Date.now()): boolean {
  if (ev.kind === 'range' && ev.endAt) {
    const end = new Date(ev.endAt).getTime();
    return !Number.isNaN(end) && end < now;
  }
  if (ev.kind === 'multi_date' && ev.extraDates?.length) {
    const rows = ev.extraDates.filter((r) => r.at);
    if (rows.length === 0) return false;
    return rows.every((r) => {
      const t = new Date(r.at!).getTime();
      return !Number.isNaN(t) && t < now;
    });
  }
  if (ev.startAt) {
    const t = new Date(ev.startAt).getTime();
    return !Number.isNaN(t) && t < now;
  }
  return false;
}

/**
 * After this instant, wait {@link NAKATH_LIST_REMOVAL_GRACE_MS} before removing the list row.
 * For point nakaths that instant is `startAt`; for `range` (පුණ්‍ය කාලය) it is also **`startAt`**
 * so the row drops 10 minutes after the period **begins**, same idea as “10 minutes after it started”.
 * Hero timing is separate (see `getActiveDashboardEvent`).
 */
export const NAKATH_LIST_REMOVAL_GRACE_MS = 10 * 60 * 1000;

/**
 * Reference instant for list removal (before the 10-minute grace).
 * - `range` → `startAt` (පුණ්‍ය කාලය — hide soon after opening, like other clock nakaths)
 * - `multi_date` → latest `extraDates[].at`
 * - `single` / `date_only` → `startAt`
 */
function nakathFinishInstantMs(ev: NakathEvent): number | null {
  if (ev.kind === 'range' && ev.startAt) {
    const t = new Date(ev.startAt).getTime();
    return Number.isNaN(t) ? null : t;
  }
  if (ev.kind === 'multi_date' && ev.extraDates?.length) {
    let max = -Infinity;
    for (const row of ev.extraDates) {
      if (!row.at) continue;
      const t = new Date(row.at).getTime();
      if (!Number.isNaN(t)) max = Math.max(max, t);
    }
    return max === -Infinity ? null : max;
  }
  if (ev.startAt) {
    const t = new Date(ev.startAt).getTime();
    return Number.isNaN(t) ? null : t;
  }
  return null;
}

/** Hide from the list once `finish + {@link NAKATH_LIST_REMOVAL_GRACE_MS}` has passed. */
export function shouldHideNakathFromList(ev: NakathEvent, now: number = Date.now()): boolean {
  const finish = nakathFinishInstantMs(ev);
  if (finish === null) return false;
  return now > finish + NAKATH_LIST_REMOVAL_GRACE_MS;
}
