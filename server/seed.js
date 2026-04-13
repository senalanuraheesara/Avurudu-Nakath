import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { nakathSchema } from './models/NakathEvent.js';

dotenv.config();

const data = [
  {
    id: 'snana-parana',
    order: 1,
    titleSi: 'පරණ අවුරුද්ද සඳහා ස්නානය',
    titleEn: 'Bathing for the old year',
    kind: 'date_only',
    startAt: '2026-04-13T06:00:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 13 වැනි සදු දින දිවුල් පත් යුෂ මිශ්‍ර නානු ගා ස්නානය කොට ඉෂ්ට දේවතා අනුස්මරණයේ යෙදී වාසය මැනවි.',
    detailsEn:
      'On 13 April (Monday), apply nanu mixed with wood-apple leaf juice, bathe, remember your chosen deity, and may you be blessed with wellbeing.',
  },
  {
    id: 'punya-kalaya',
    order: 2,
    titleSi: 'පුණ්‍ය කාලය',
    titleEn: 'Punya Kalaya (religious auspicious period)',
    kind: 'range',
    startAt: '2026-04-14T03:08:00+05:30',
    endAt: '2026-04-14T15:56:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වැනි අඟහරුවාදා පුර්ව භාග 03.08 සිට එදිනම අපර භාග 03.56 දක්වා.\nමෙම කාලය ආගමික කටයුතු සඳහා යොදා ගන්න; නව වැඩ ආරම්භ නොකරන්න.',
    detailsEn:
      'April 14 (Tuesday): from 3:08 in the early morning (purva bhaga) until 3:56 in the afternoon (apara bhaga) on the same day.\nUse this period for religious observances; do not begin new work.',
  },
  {
    id: 'aluth-avurudu-udawa',
    order: 3,
    titleSi: 'අලුත් අවුරුදු උදාව',
    titleEn: 'Dawn of the Sinhala New Year',
    kind: 'single',
    startAt: '2026-04-14T09:32:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වැනි අඟහරුවාදා පුර්ව භාග 09.32 ට සිංහල අලුත් අවුරුද්ද උදාවෙයි.',
    detailsEn:
      'On Tuesday 14 April, at 9:32 in the early morning (purva bhaga), the Sinhala New Year dawns.',
  },
  {
    id: 'ahara-pisima',
    order: 4,
    titleSi: 'ආහාර පිසීම',
    titleEn: 'Cooking the ritual meal',
    kind: 'single',
    startAt: '2026-04-14T10:51:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වැනි අඟහරුවාදා පූර්ව භාග 10.51 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා ලිප් බැද ගිණි ගිණි මොලවා කිරි බත් ද, තැවිලි වර්ගයද දී කිරි වලද ද, පිලියෙල කර ගැනීම මැනවි.',
    detailsEn:
      'Tuesday 14 April, at 10:51 in the forenoon (purva bhaga): dress in red, face south, prepare the hearth and light the fire; prepare milk rice, traditional sweets (thevili), curd, and other items with care.',
  },
  {
    id: 'wada-ganuden',
    order: 5,
    titleSi: 'වැඩ ඇල්ලීම, ගනුදෙනු කිරීම හා ආහාර අනුභවය',
    titleEn: 'Work, transactions, and partaking of the meal',
    kind: 'single',
    startAt: '2026-04-14T12:06:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 14 වැනි අඟහරුවාදා අපර භාග 12.06 ට රත්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා සියලු වැඩ අල්ලා ගනුදෙනු කොට ආහාර අනුභවය කිරීම මැනවි.',
    detailsEn:
      'Tuesday 14 April, at 12:06 in the afternoon (apara bhaga): dressed in red, face south; begin all work and transactions, then partake of the meal with care.',
  },
  {
    id: 'hisatel-gema',
    order: 6,
    titleSi: 'හිසතෙල් ගෑම',
    titleEn: 'Anointing oil on the head',
    kind: 'single',
    startAt: '2026-04-15T06:55:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 15 වැනි බදාදා පූර්ව භාග 06.55 ට නැගෙනහිර දිශාව බලා හිසට කොහොඹ පත් ද, පයට කොළොන් පනී ද තබා පච්ච වර්ණ වස්ත්‍රාභරණයෙන් සැරසී කොහොඹ පත් යුෂ මිශ්‍ර නානු ගා තෙල් හා ස්නානය කිරීම මැනවි.',
    detailsEn:
      'Wednesday 15 April, at 06:55 in the morning (purva bhaga): face east; place kohomba leaves on the head and kolon at the feet; wear green (patcha); anoint with nanu mixed with kohomba-leaf juice and oil, then bathe with care.',
  },
  {
    id: 'nava-sanda',
    order: 7,
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
      'For the Abhinava lunar year, view the new moon on Friday 20 March at sunset; for the solar year, on Sunday 19 April at sunset — observe with care.',
  },
  {
    id: 'raksha-pitata',
    order: 8,
    titleSi: 'රැකී රක්ෂා සඳහා පිටත්ව යෑම',
    titleEn: 'Leaving for work / livelihood',
    kind: 'single',
    startAt: '2026-04-20T06:27:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 20 වැනි සඳුදා පූර්ව භාග 06.27 ට ශ්වේත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී කිරි බත් සහ වළකිරි මිශ්‍ර කැවිලිද අනුභව කර දකුණු දිශාව බලා පිටත් වීම මැනවි.',
    detailsEn:
      'Monday 20 April, at 06:27 in the morning (purva bhaga): dressed in white, eat milk rice and sweets mixed with valakiri; face south; then leave for livelihood with care.',
  },
  {
    id: 'pala-situwima',
    order: 9,
    titleSi: 'පැල සිටුවීම',
    titleEn: 'Planting saplings',
    kind: 'single',
    startAt: '2026-04-23T11:36:00+05:30',
    detailsSi:
      'අප්‍රේල් මස 23 වැනි බ්‍රහස්පතින්දා රන්වන් පැහැති වස්ත්‍රාභරණයෙන් සැරසී පූර්ව භාග 11.36 ට උතුරු දිශාව බලා පැල සිටුවීම මැනවි.',
    detailsEn:
      'Thursday 23 April, at 11:36 in the morning (purva bhaga): dressed in gold-coloured attire; face north; plant saplings with care.',
  },
];

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/avurudu';

const Nakath = mongoose.model('NakathEvent', nakathSchema, 'nakath_events');

async function run() {
  await mongoose.connect(uri);
  await Nakath.deleteMany({});
  await Nakath.insertMany(data);
  console.log(`Seeded ${data.length} nakath events.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
