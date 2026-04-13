import type { NakathEvent } from '../data/nakath2026';
import type { Lang } from '../i18n/lang';
import { formatColombo, formatColomboDateOnly, formatRange } from './time';

export function formatEventWhenText(event: NakathEvent, lang: Lang): string {
  if (event.kind === 'range' && event.startAt && event.endAt) {
    return formatRange(event.startAt, event.endAt, lang);
  }
  if (event.kind === 'multi_date' && event.extraDates) {
    return event.extraDates
      .map((row) => {
        const label =
          lang === 'ta' && row.labelTa
            ? row.labelTa
            : lang === 'en'
              ? row.labelEn
              : row.labelSi;
        const date = lang === 'ta' && row.dateTa ? row.dateTa : row.dateSi;
        return `${label}: ${date}`;
      })
      .join('\n');
  }
  if (event.kind === 'date_only' && event.startAt) {
    return formatColomboDateOnly(event.startAt, lang);
  }
  if (event.startAt) {
    return formatColombo(event.startAt, lang);
  }
  return '';
}
