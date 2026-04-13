import type { Lang } from './lang';

/** UI chrome: Sinhala / English / Tamil */
export function tx(lang: Lang, si: string, en: string, ta: string): string {
  if (lang === 'ta') return ta;
  if (lang === 'en') return en;
  return si;
}

export const UI = {
  mainTitle: (year: number, lang: Lang) =>
    tx(
      lang,
      `සිංහල හා හින්දු අලුත් අවුරුදු නැකත් ${year}`,
      `Sinhala & Hindu New Year — Nakath ${year}`,
      `சிங்கள மற்றும் இந்து புத்தாண்டு — நேர அட்டவணை ${year}`,
    ),
  seettuwaBtn: (lang: Lang) =>
    tx(lang, 'නැකැත් සීට්ටුවට යන්න...', 'Go to full nakath list...', 'முழு நேர அட்டவணைக்குச் செல்ல...'),
  /** Heading above the scrollable list (default “සීට්ටුව” view after a live window ends). */
  seettuwaSheetTitle: (lang: Lang) =>
    tx(lang, 'නැකැත් සීට්ටුව', 'Nakath list', 'நேர அட்டவணை'),
  pastNakathsHidden: (lang: Lang) =>
    tx(
      lang,
      'සෑම නැකතක වේලාව ගෙවී ගොස් මිනිත්තු 10කට පසු එය මෙහි නොපෙන්වයි.',
      'Each nakath leaves this list about 10 minutes after its listed time has passed.',
      'ஒவ்வொரு நேரமும் கடந்த பிறகு சுமார் 10 நிமிடத்தில் பட்டியலிலிருந்து நீக்கப்படும்.',
    ),
  focusHint: (lang: Lang) =>
    tx(
      lang,
      'මෙම වේලාවට අදාළ නැකත පමණක් පෙන්වේ. වෙනත් නැකත් පිටුවේ ලැයිස්තුවට නැකත අවසන් වූ පසු බලන්න.',
      'Only the nakath in progress is shown. The full list returns when this window ends.',
      'இப்போது நடைபெறும் நேரம் மட்டுமே காட்டப்படும். சாளரம் முடிந்த பின் முழு பட்டியல் திரும்பும்.',
    ),
  backHero: (lang: Lang) =>
    tx(
      lang,
      '← නැකැත් දර්ශකයට ආපසු',
      '← Back to nakath view',
      '← நேர முகப்புக் காட்சிக்குத் திரும்பு',
    ),
  hintFooter: (lang: Lang) =>
    tx(
      lang,
      'ඉදිරි නැකත් සඳහා දැනුම්දීම් ස්වයංක්‍රීයව සැකසේ. දැනුම්දීම් අවසරය අවශ්‍යයි. ඔබට අවශ්‍ය නැකතක් නිශ්ශබ්ද කිරීමට "නිශ්ශබ්ද කරන්න" භාවිතා කරන්න.',
      'Upcoming nakaths schedule notifications automatically. Grant notification permission. Use “Mute this nakath” to skip one ritual.',
      'வரும் நேரங்களுக்கு அறிவிப்புகள் தானாக அமைக்கப்படும். அனுமதி தேவை. ஒரு சடங்கைத் தவிர்க்க “இந்த நேரத்தை முடக்கு” பயன்படுத்தவும்.',
    ),
  muteOn: (lang: Lang) =>
    tx(lang, 'මෙම නැකත නිශ්ශබ්ද කරන්න', 'Mute this nakath', 'இந்த நேரத்தை முடக்கு'),
  muteOff: (lang: Lang) =>
    tx(lang, 'ස්වයං සටහන නැවත සක්‍රීය කරන්න', 'Enable automatic reminder', 'தானியங்கு நினைவூட்டலை மீண்டும் இயக்கு'),
  directions: (lang: Lang) => tx(lang, 'දිශා සහාය', 'Directions', 'திசை வழிகாட்டி'),
  kickerActive: (lang: Lang) =>
    tx(lang, 'දැන් සිදුවන නැකත', 'Active nakath now', 'இப்போது நடைபெறும் நேரம்'),
  pastNakath: (lang: Lang) => tx(lang, 'නැකත ඉකුත් විය', 'Nakath has passed', 'நேரம் கடந்துவிட்டது'),
  countdownNext: (lang: Lang) => tx(lang, 'ඊළඟ නැකතට', 'Next auspicious time', 'அடுத்த சுப நேரம்'),
  countdownDone: (lang: Lang) => tx(lang, 'සියලු නැකත් අවසන්', 'All scheduled times have passed', 'அனைத்து நேரங்களும் முடிந்தன'),
  countdownSub: (lang: Lang) => tx(lang, 'සුබ අලුත් අවුරුද්දක්!', 'Happy New Year!', 'இனிய புத்தாண்டு!'),
  bannerAlert: (lang: Lang) => tx(lang, 'නැකත් දැනුම්දීම', 'Nakath alert', 'நேர அறிவிப்பு'),
  dismiss: (lang: Lang) => tx(lang, 'වසන්න', 'Dismiss', 'மூடு'),
  loading: (lang: Lang) => tx(lang, 'පූරණය වෙමින්', 'Loading', 'ஏற்றுகிறது'),
  compassTitle: (lang: Lang) => tx(lang, 'දිශා සහාය', 'Direction helper', 'திசை உதவி'),
  compassClose: (lang: Lang) => tx(lang, 'වසන්න', 'Close', 'மூடு'),
  compassPointer: (lang: Lang) =>
    tx(
      lang,
      'දුරකථනයේ ඉහළ කෙලවර මෙම දිශාවට යොමු වේ',
      'Top of phone points this way on the compass',
      'தொலைபேசியின் மேல் ஓரம் இந்தத் திசையை நோக்குகிறது',
    ),
  compassFacing: (lang: Lang) =>
    tx(lang, 'වර්තමාන මුහුණත් දිශාව', 'Current facing (clockwise from N)', 'தற்போதைய முகப்பு (வடக்கிலிருந்து கடிகார திசை)'),
  compassRitual: (lang: Lang) => tx(lang, 'අවශ්‍ය: ', 'Ritual: ', 'சடங்கு: '),
  compassAndroid: (lang: Lang) =>
    tx(
      lang,
      'හොඳම නිරවද්‍යතාවට ස්ථාන සේවා අවසරය ලබා දෙන්න. ලෝහ වස්තුවලින් ඈත්ව තබන්න.',
      'Allow location permission for best accuracy. Move away from metal objects.',
      'சிறந்த துல்லியத்திற்கு இருப்பிட அனுமதி வழங்கவும். உலோகப் பொருள்களிலிருந்து விலகி நிலையுங்கள்.',
    ),
  compassIos: (lang: Lang) =>
    tx(
      lang,
      'ලෝහ හා ඉලෙක්ට්‍රොනික වලින් ඈත්ව තබන්න. නිරවද්‍යතාව උපකරණය අනුව වෙනස් වේ.',
      'Stay clear of metal and electronics. Accuracy varies by device.',
      'உலோகம் மற்றும் மின்னணுப் பொருள்களிலிருந்து விலகி இருங்கள். துல்லியம் சாதனத்தைப் பொறுத்தது.',
    ),
  notifStarted: (lang: Lang) =>
    tx(lang, 'නැකත ආරම්භ විය — සූදානම් වන්න.', 'The auspicious time has started — get ready.', 'சுப நேரம் தொடங்கியது — தயாராக இருங்கள்.'),
  compassSourceLocation: (lang: Lang) =>
    tx(lang, 'පද්ධති කම්පාසය (නිරවද්‍ය)', 'System compass (best)', 'கணினி திசைகாட்டி (சிறந்தது)'),
  compassSourceMag: (lang: Lang) =>
    tx(lang, 'චුම්බක සංවේදකය (ආසන්න වශයෙන්)', 'Magnetometer (approximate)', 'காந்த உணரி (தோராயம்)'),
  compassAlignedOk: (lang: Lang) =>
    tx(lang, '✓ දිශාව හරි — නැකතට සුදුසුයි', '✓ Aligned — good for this ritual', '✓ திசை சரி — இந்தச் சடங்குக்கு'),
  compassRotateDial: (lang: Lang, letter: 'N' | 'E' | 'S') =>
    tx(
      lang,
      `රතු ඊතලය යට ${letter} අකුර පෙන්වන තුරු ඔබගේ දුරකථනය කරකවන්න`,
      `Rotate until the red arrow sits over the ${letter} on the dial`,
      `சிவப்பு அம்பு டயலில் ${letter} மீது அமையும் வரை தொலைபேசியைச் சுழற்றவும்`,
    ),
  splashHeroTitle: (year: number, lang: Lang) =>
    tx(
      lang,
      `සිංහල අලුත් අවුරුදු චාරිත්‍ර ${year}`,
      `Sinhala New Year rituals ${year}`,
      `சிங்களப் புத்தாண்டுச் சடங்குகள் ${year}`,
    ),
  splashA11yImage: (lang: Lang) =>
    tx(
      lang,
      '2026 අලුත් අවුරුදු නැකත් සීට්ටුව — සිංහල අලුත් අවුරුදු චාරිත්‍ර',
      '2026 New Year nakath sheet illustration',
      '2026 புத்தாண்டு நேர அட்டவணை — சிங்களப் புத்தாண்டுச் சடங்குகள்',
    ),
  developerCreditLine: (lang: Lang) =>
    tx(
      lang,
      'developed by: Senal Anuraheesara',
      'developed by: Senal Anuraheesara',
      'வடிவமைப்பு: Senal Anuraheesara',
    ),
} as const;
