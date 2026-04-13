/**
 * Per-ritual motion design for the “දැන් සිදුවන නැකත” hero.
 * Entrance runs once; loop runs until the nakath window changes.
 */

export type NakathLoopKind =
  | 'ring-gentle'
  | 'ring-slow'
  | 'ring-bright'
  | 'float-y'
  | 'float-y-strong'
  | 'sway-x'
  | 'breathe'
  | 'breathe-strong'
  | 'moon-breathe'
  | 'tilt'
  /** Soft upward drift — dawn / new light */
  | 'rise'
  /** Very slow growth pulse — planting */
  | 'roots';

export type NakathEntrancePreset = {
  fromOpacity: number;
  fromTranslateY: number;
  fromTranslateX: number;
  fromScale: number;
  durationMs: number;
  useSpring: boolean;
  springFriction?: number;
  springTension?: number;
};

export type NakathLoopPreset = {
  kind: NakathLoopKind;
  /** One full cycle duration (ms) */
  periodMs: number;
};

export type NakathVisualAccent = {
  borderColor: string;
  ringBorderColor: string;
  kickerColor: string;
};

const DEFAULT_ACCENT: NakathVisualAccent = {
  borderColor: '#a67c3d',
  ringBorderColor: 'rgba(166, 124, 61, 0.45)',
  kickerColor: '#8b4513',
};

const ACCENTS: Record<string, NakathVisualAccent> = {
  'snana-parana': {
    borderColor: '#5d8aa8',
    ringBorderColor: 'rgba(93, 138, 168, 0.5)',
    kickerColor: '#2e5a72',
  },
  'punya-kalaya': {
    borderColor: '#7a6b8c',
    ringBorderColor: 'rgba(122, 107, 140, 0.45)',
    kickerColor: '#4a3d5c',
  },
  'aluth-avurudu-udawa': {
    borderColor: '#d4a017',
    ringBorderColor: 'rgba(212, 160, 23, 0.55)',
    kickerColor: '#b8860b',
  },
  'ahara-pisima': {
    borderColor: '#c45c26',
    ringBorderColor: 'rgba(196, 92, 38, 0.5)',
    kickerColor: '#9e3f18',
  },
  'wada-ganuden': {
    borderColor: '#a0522d',
    ringBorderColor: 'rgba(160, 82, 45, 0.5)',
    kickerColor: '#6b3418',
  },
  'hisatel-gema': {
    borderColor: '#2e7d32',
    ringBorderColor: 'rgba(46, 125, 50, 0.45)',
    kickerColor: '#1b5e20',
  },
  'hadisi-rajakari-pitata': {
    borderColor: '#b8860b',
    ringBorderColor: 'rgba(184, 134, 11, 0.45)',
    kickerColor: '#7c5e10',
  },
  'nava-sanda': {
    borderColor: '#5c6bc0',
    ringBorderColor: 'rgba(92, 107, 192, 0.4)',
    kickerColor: '#3949ab',
  },
  'raksha-pitata': {
    borderColor: '#78909c',
    ringBorderColor: 'rgba(120, 144, 156, 0.45)',
    kickerColor: '#455a64',
  },
  'pala-situwima': {
    borderColor: '#6b8e23',
    ringBorderColor: 'rgba(107, 142, 35, 0.45)',
    kickerColor: '#4a6218',
  },
};

export function getNakathVisualAccent(id: string): NakathVisualAccent {
  return ACCENTS[id] ?? DEFAULT_ACCENT;
}

export function getNakathEntrancePreset(id: string): NakathEntrancePreset {
  switch (id) {
    case 'snana-parana':
      return {
        fromOpacity: 0,
        fromTranslateY: 40,
        fromTranslateX: 0,
        fromScale: 0.92,
        durationMs: 620,
        useSpring: false,
      };
    case 'punya-kalaya':
      return {
        fromOpacity: 0,
        fromTranslateY: 16,
        fromTranslateX: 0,
        fromScale: 0.98,
        durationMs: 900,
        useSpring: false,
      };
    case 'aluth-avurudu-udawa':
      return {
        fromOpacity: 0,
        fromTranslateY: 48,
        fromTranslateX: 0,
        fromScale: 0.88,
        durationMs: 480,
        useSpring: true,
        springFriction: 6,
        springTension: 78,
      };
    case 'ahara-pisima':
      return {
        fromOpacity: 0,
        fromTranslateY: 36,
        fromTranslateX: 0,
        fromScale: 0.9,
        durationMs: 500,
        useSpring: true,
        springFriction: 7,
        springTension: 80,
      };
    case 'wada-ganuden':
      return {
        fromOpacity: 0,
        fromTranslateY: 12,
        fromTranslateX: -36,
        fromScale: 0.94,
        durationMs: 540,
        useSpring: false,
      };
    case 'hisatel-gema':
      return {
        fromOpacity: 0,
        fromTranslateY: 20,
        fromTranslateX: 24,
        fromScale: 0.93,
        durationMs: 580,
        useSpring: false,
      };
    case 'hadisi-rajakari-pitata':
      return {
        fromOpacity: 0,
        fromTranslateY: 10,
        fromTranslateX: 32,
        fromScale: 0.94,
        durationMs: 520,
        useSpring: false,
      };
    case 'nava-sanda':
      return {
        fromOpacity: 0,
        fromTranslateY: 24,
        fromTranslateX: 0,
        fromScale: 0.96,
        durationMs: 800,
        useSpring: false,
      };
    case 'raksha-pitata':
      return {
        fromOpacity: 0,
        fromTranslateY: 8,
        fromTranslateX: 40,
        fromScale: 0.95,
        durationMs: 520,
        useSpring: false,
      };
    case 'pala-situwima':
      return {
        fromOpacity: 0,
        fromTranslateY: 52,
        fromTranslateX: 0,
        fromScale: 0.9,
        durationMs: 600,
        useSpring: true,
        springFriction: 8,
        springTension: 68,
      };
    default:
      return {
        fromOpacity: 0,
        fromTranslateY: 28,
        fromTranslateX: 0,
        fromScale: 0.96,
        durationMs: 520,
        useSpring: false,
      };
  }
}

/**
 * One loop preset per ritual id (see `NAKATH_EVENTS` in `nakath2026.ts`).
 * snana-parana, punya-kalaya, aluth-avurudu-udawa, ahara-pisima, wada-ganuden,
 * hisatel-gema, nava-sanda, raksha-pitata, pala-situwima — each has its own entrance + loop + accent.
 */
export function getNakathLoopPreset(id: string): NakathLoopPreset {
  switch (id) {
    case 'snana-parana':
      /* bathing — gentle vertical like ripples */
      return { kind: 'float-y', periodMs: 2800 };
    case 'punya-kalaya':
      /* sacred window — slow halo */
      return { kind: 'ring-slow', periodMs: 3400 };
    case 'aluth-avurudu-udawa':
      /* dawn — upward lift */
      return { kind: 'rise', periodMs: 1900 };
    case 'ahara-pisima':
      /* cooking / hearth — bright ring (no inner skew) */
      return { kind: 'ring-bright', periodMs: 1350 };
    case 'wada-ganuden':
      /* work & trade — side-to-side energy */
      return { kind: 'sway-x', periodMs: 1650 };
    case 'hisatel-gema':
      /* oil on head — subtle rock */
      return { kind: 'tilt', periodMs: 2300 };
    case 'hadisi-rajakari-pitata':
      return { kind: 'float-y-strong', periodMs: 2100 };
    case 'nava-sanda':
      /* new moon — soft lunar pulse */
      return { kind: 'moon-breathe', periodMs: 4400 };
    case 'raksha-pitata':
      /* setting out — stronger forward float */
      return { kind: 'float-y-strong', periodMs: 2100 };
    case 'pala-situwima':
      /* planting — roots / slow growth */
      return { kind: 'roots', periodMs: 3200 };
    default:
      return { kind: 'ring-gentle', periodMs: 1600 };
  }
}
