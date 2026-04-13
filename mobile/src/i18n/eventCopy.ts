import type { NakathEvent } from '../data/nakath2026';
import type { Lang } from './lang';

export function eventTitle(ev: NakathEvent, lang: Lang): string {
  if (lang === 'ta' && ev.titleTa) return ev.titleTa;
  if (lang === 'en') return ev.titleEn;
  return ev.titleSi;
}

export function eventDetails(ev: NakathEvent, lang: Lang): string | undefined {
  if (lang === 'ta' && ev.detailsTa) return ev.detailsTa;
  if (lang === 'en') return ev.detailsEn;
  return ev.detailsSi;
}
