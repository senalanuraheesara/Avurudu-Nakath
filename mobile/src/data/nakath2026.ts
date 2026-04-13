/**
 * Sinhala & Hindu New Year — auspicious times (nakath) for 2026.
 * Times: Asia/Colombo (UTC+05:30).
 *
 * The active-nakath hero uses each event’s `id` for motion, colours, and scene art — see
 * `src/utils/nakathAnimations.ts` and `src/components/nakathArt/`.
 */

import { TAMIL_BY_ID, TAMIL_EXTRA } from './nakathTamilBundle';

export type EventKind = 'single' | 'range' | 'multi_date' | 'date_only';

export type NakathEvent = {
  id: string;
  titleSi: string;
  titleEn: string;
  /** Tamil (merged from `nakathTamilBundle`) */
  titleTa?: string;
  kind: EventKind;
  /** ISO 8601 with offset +05:30 */
  startAt?: string;
  endAt?: string;
  /** For multi_date (e.g. new moon lunar vs solar) */
  extraDates?: {
    labelSi: string;
    labelEn: string;
    labelTa?: string;
    dateSi: string;
    dateTa?: string;
    at?: string;
  }[];
  detailsSi?: string;
  detailsEn?: string;
  detailsTa?: string;
};

export const YEAR = 2026;

function withTamil(ev: NakathEvent): NakathEvent {
  const t = TAMIL_BY_ID[ev.id];
  if (!t) return ev;
  let merged: NakathEvent = {
    ...ev,
    titleTa: ev.titleTa ?? t.titleTa,
    detailsTa: ev.detailsTa ?? t.detailsTa,
  };
  const tex = TAMIL_EXTRA[ev.id];
  if (tex?.length && merged.extraDates) {
    merged = {
      ...merged,
      extraDates: merged.extraDates.map((row, i) => ({
        ...row,
        ...(tex[i] ? { labelTa: tex[i].labelTa, dateTa: tex[i].dateTa } : {}),
      })),
    };
  }
  return merged;
}

/** Official almanac times — April 2026, Asia/Colombo. */
const NAKATH_EVENTS_STATIC: NakathEvent[] = [
  {
    id: 'snana-parana',
    titleSi: 'පරණ අවුරුද්ද සඳහා ස්නානය',
    titleEn: 'Bathing for the old year',
    kind: 'date_only',
    startAt: '2026-04-13T06:00:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 13 වන සඳුදා දින දිවුල්පත් යුෂ මිශ්‍ර නානු ගා ස්නානය කොට ඉෂ්ට දේවතා අනුස්මරණයෙහි යෙදී වාසය මැනවි.',
    detailsEn:
      'On Sunday 13 April, bathe using nanu mixed with wood-apple leaf juice, then dwell in remembrance of your chosen deity — may you be blessed with wellbeing.',
  },
  {
    id: 'punya-kalaya',
    titleSi: 'පුණ්‍ය කාලය',
    titleEn: 'Punya Kalaya (religious auspicious period)',
    kind: 'range',
    startAt: '2026-04-14T03:08:00+05:30',
    endAt: '2026-04-14T15:56:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වන අඟහරුවාදා පූර්වභාග 03.08 සිට එම දා අපරභාග 03.56 දක්වා පුණ්‍ය කාලය බැවින් එම පළමුව ආහාර පාන ගෙන සියලු වැඩ අතහැර ආගමික වතාවත්, ආධ්‍යාත්මික කටයුතු, දානමය පුණ්‍ය ක්‍රියා සහ පුණ්‍යකාල චාරිත්‍රයන් හි නිරතවීමත් ආහාර පිසීම, අනුභවය, වැඩ ඇල්ලීම හා ගනුදෙනු කිරීම ආදී නැකැත් චාරිත්‍ර විධි පහත පරිදි ඉටුකිරීමත් මැනවි.',
    detailsEn:
      'Tuesday 14 April, from 3:08 a.m. (purva bhāga) until 3:56 p.m. (apara bhāga) that same day is Punya Kalaya. Therefore, first take food and drink and set aside all ordinary work; engage in religious observances, spiritual practice, generous giving (dāna), and Punya Kalaya rites; thereafter complete the nakath rites for cooking, eating, beginning work, and transactions as set out below.',
  },
  {
    id: 'aluth-avurudu-udawa',
    titleSi: 'අලුත් අවුරුදු උදාව',
    titleEn: 'Dawn of the Sinhala New Year',
    kind: 'single',
    startAt: '2026-04-14T09:32:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වන අඟහරුවාදා දින පූර්වභාග 09.32 ට සිංහල අලුත් අවුරුද්ද උදාවෙයි.',
    detailsEn:
      'On Tuesday 14 April, at 9:32 in the forenoon (pūrvabhāga), the Sinhala New Year dawns.',
  },
  {
    id: 'ahara-pisima',
    titleSi: 'ආහාර පිසීම (ලිප ගිනි දැල්වීම)',
    titleEn: 'Cooking the meal (lighting the hearth fire)',
    kind: 'single',
    startAt: '2026-04-14T10:51:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වන අඟහරුවාදා පූර්වභාග 10.51 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා ලිප බැඳ ගිනි මොළවා කිරි බතක් ද කැවිලි වර්ගයක් ද දී කිරි සහ විළඳ ද පිළියෙල කරගැනීම මැනවි.',
    detailsEn:
      'Tuesday 14 April, at 10:51 in the forenoon (pūrvabhāga): dress in red (rakta); face south; tie the hearth and light the fire; prepare milk rice, sweets, curd, and milk rice with curd (kiri ha viḷanda) with care.',
  },
  {
    id: 'wada-ganuden',
    titleSi: 'වැඩ ඇල්ලීම, ගනුදෙනු කිරීම හා ආහාර අනුභවය',
    titleEn: 'Work, transactions, and partaking of the meal',
    kind: 'single',
    startAt: '2026-04-14T12:06:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වන අඟහරුවාදා අපරභාග 12.06 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා සියලු වැඩ අල්ලා ගනුදෙනු කොට ආහාර අනුභව කිරීම මැනවි.',
    detailsEn:
      'Tuesday 14 April, at 12:06 in the afternoon (aparabhāga): dress in red (rakta); face south; begin all work and transactions, then partake of the meal with care.',
  },
  {
    id: 'hisatel-gema',
    titleSi: 'හිසතෙල් ගෑම',
    titleEn: 'Anointing oil on the head',
    kind: 'single',
    startAt: '2026-04-15T06:55:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 15 වන බදාදා පූර්වභාග 6.55 ට පච්ච වර්ණ හෙවත් කොළ පැහැති වස්ත්‍රාභරණයෙන් සැරසී නැගෙනහිර දිශාව බලා හිසට කොහොඹපත් ද පයට කොළොන් පත් ද තබා කොහොඹපත් යුෂ මිශ්‍ර නානු හා තෙල් ගා ස්නානය කිරීම මැනවි.',
    detailsEn:
      'Wednesday 15 April, at 6:55 in the morning (pūrvabhāga): wear green (patcha / leaf-green) attire; face east; place kohomba leaves on the head and kolon leaves at the feet; apply nanu mixed with kohomba juice and oil to the head, then bathe with care.',
  },
  {
    id: 'hadisi-rajakari-pitata',
    titleSi: 'හදිසි රාජකාරි සඳහා පිටත්ව යෑම',
    titleEn: 'Leaving for urgent official or emergency duties',
    kind: 'single',
    startAt: '2026-04-17T05:38:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 17 වන සිකුරාදා දින පූර්වභාග 05.38 ට රන්වන් පාට වස්ත්‍රාභරණයෙන් සැරසී දීකිරි මිශ්‍ර කිරිබතක් ද තෙල මෝරු ද උඳු මිශ්‍ර කැවිලි වර්ගයක් ද අනුභව කර උතුරු දිශාව බලා පිටත්ව යෑම මැනවි.',
    detailsEn:
      'Friday 17 April, at 5:38 in the morning (pūrvabhāga): dress in gold-coloured attire; partake of milk rice mixed with ghee (dīkiri), oil cake (tela moru), and sweets mixed with undu (black gram); then face north and set out with care.',
  },
  {
    id: 'nava-sanda',
    titleSi: 'නව සඳ බැලීම',
    titleEn: 'Seeing the new moon',
    kind: 'multi_date',
    extraDates: [
      {
        labelSi: 'අභිනව චන්ද්‍ර වර්ෂය',
        labelEn: 'Lunar new year',
        dateSi: 'මාර්තු 20 වැනි සිකුරාදා',
        at: '2026-03-20T18:00:00+05:30',
      },
      {
        labelSi: 'සූර්ය වර්ෂය',
        labelEn: 'Solar new year',
        dateSi: 'අප්‍රේල් 19 වැනි ඉරිදා',
        at: '2026-04-19T18:00:00+05:30',
      },
    ],
    detailsSi:
      'අභිනව චන්ද්‍ර වර්ෂය සඳහා මාර්තු මස 20 වැනි සිකුරාදා දින හිරු අස්ත ව, සූර්ය වර්ෂය සඳහා අප්‍රේල් මස 19 වැනි ඉරිදා දින හිරු අස්ත ව නව සඳ බැලීම මැනවි.',
    detailsEn:
      'For the Abhinava lunar year: on Friday 20 March, at sunset (hiru asta), view the new moon. For the solar year: on Sunday 19 April, at sunset, view the new moon — observe with care.',
  },
  {
    id: 'raksha-pitata',
    titleSi: 'රැකීරක්ෂා සඳහා පිටත්ව යෑම',
    titleEn: 'Leaving for livelihood and work',
    kind: 'multi_date',
    extraDates: [
      {
        labelSi: 'පළමු විකල්පය — දකුණු දිශාව',
        labelEn: 'First option — face south',
        dateSi: 'අප්‍රේල් 20 සඳුදා පෙ.ව. 6.27',
        at: '2026-04-20T06:27:00+05:30',
      },
      {
        labelSi: 'දෙවන විකල්පය — නැගෙනහිර දිශාව',
        labelEn: 'Second option — face east',
        dateSi: 'අප්‍රේල් 20 සඳුදා පෙ.ව. 6.50',
        at: '2026-04-20T06:50:00+05:30',
      },
    ],
    detailsSi:
      'අප්‍රේල් මස 20 වන සඳුදා පූර්වභාග 06.27 ට ස්වේත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී කිරිබතක් ද එළකිරි මිශ්‍ර කැවිලි වර්ගයක් ද අනුභව කර දකුණු දිශාව බලා හෝ,\n\nඅප්‍රේල් මස 20 වන සඳුදා පූර්වභාග 06.50 ට මුං හා ස්වේත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී ගිතෙල් හා තල මිශ්‍ර කිරිබතක් ද දීකිරි සහ අග්ගලා සමඟ කැවිලි වර්ගයක් ද අනුභව කර නැගෙනහිර දිශාව බලා පිටත්ව යෑම මැනවි.',
    detailsEn:
      'Monday 20 April — first option: at 6:27 a.m. (pūrvabhāga), dressed in white (svēta), partake of milk rice and sweets mixed with curd (elu-kiri), then face south and set out; or second option: at 6:50 a.m. (pūrvabhāga), dressed in mun (green gram) and white, partake of milk rice mixed with gingelly and thala, and sweets with ghee (dīkiri) and aggala, then face east and set out — with care.',
  },
  {
    id: 'pala-situwima',
    titleSi: 'පැළ සිටුවීම',
    titleEn: 'Planting saplings',
    kind: 'single',
    startAt: '2026-04-23T09:01:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 23 වන බ්‍රහස්පතින්දා පූර්වභාග 09.01 ට රන්වන් පැහැති වස්ත්‍රාභරණයෙන් සැරසී උතුරු දිශාව බලා පැළ සිටුවීම මැනවි.',
    detailsEn:
      'Thursday 23 April, at 9:01 in the morning (pūrvabhāga): dress in gold-toned attire; face north; plant saplings with care.',
  },
];

export const NAKATH_EVENTS: NakathEvent[] = NAKATH_EVENTS_STATIC.map(withTamil);

export const GREETING_SI = 'සුබ අලුත් අවුරුද්දක් වේවා!';
export const GREETING_EN = 'Wishing you a happy new year!';
export const GREETING_TA = 'இனிய புத்தாண்டு வாழ்த்துக்கள்!';
