import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';
import { DeveloperCredit } from './DeveloperCredit';

export type Facing = 'south' | 'east' | 'north';

const LABEL: Record<Facing, { si: string; en: string; ta: string; deg: number }> = {
  north: { si: 'උතුර', en: 'North', ta: 'வடக்கு', deg: 0 },
  east: { si: 'නැගෙනහිර', en: 'East', ta: 'கிழக்கு', deg: 90 },
  south: { si: 'දකුණු', en: 'South', ta: 'தெற்கு', deg: 180 },
};

function labelForFacing(f: Facing, lang: Lang): string {
  const row = LABEL[f];
  if (lang === 'ta') return row.ta;
  return lang === 'si' ? row.si : row.en;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  target: Facing | null;
  lang: Lang;
};

const DIAL = 216;
const ROSE = 188;

function pickLocationHeading(h: Location.LocationHeadingObject): number {
  const t = h.trueHeading;
  if (t >= 0 && t <= 360) return t % 360;
  const m = h.magHeading;
  if (!Number.isFinite(m)) return 0;
  return ((m % 360) + 360) % 360;
}

/** Fallback when location compass is unavailable: bearing of device “top” from magnetic north. */
function magnetometerFallbackDeg(x: number, y: number): number {
  let deg = (Math.atan2(-x, y) * 180) / Math.PI;
  return (deg + 360) % 360;
}

function smallestAngleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function smoothHeading(prev: number, next: number, alpha: number): number {
  let d = next - prev;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  let s = prev + alpha * d;
  return (s + 360) % 360;
}

export function CompassPanel({ visible, onClose, target, lang }: Props) {
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);
  const [source, setSource] = useState<'location' | 'magnetometer' | null>(null);
  const smoothRef = useRef(0);
  const hasHeadingRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      setHeadingDeg(null);
      setSource(null);
      hasHeadingRef.current = false;
      return;
    }

    let headingSub: Location.LocationSubscription | null = null;
    let magSub: { remove: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;

      if (status === 'granted') {
        try {
          headingSub = await Location.watchHeadingAsync((h) => {
            const raw = pickLocationHeading(h);
            if (!hasHeadingRef.current) {
              smoothRef.current = raw;
              hasHeadingRef.current = true;
            } else {
              smoothRef.current = smoothHeading(smoothRef.current, raw, 0.25);
            }
            setHeadingDeg(smoothRef.current);
            setSource('location');
          });
        } catch {
          // fall through to magnetometer
        }
      }

      if (cancelled) return;

      if (!headingSub) {
        Magnetometer.setUpdateInterval(80);
        magSub = Magnetometer.addListener((m) => {
          const raw = magnetometerFallbackDeg(m.x, m.y);
          if (!hasHeadingRef.current) {
            smoothRef.current = raw;
            hasHeadingRef.current = true;
          } else {
            smoothRef.current = smoothHeading(smoothRef.current, raw, 0.2);
          }
          setHeadingDeg(smoothRef.current);
          setSource('magnetometer');
        });
      }
    })();

    return () => {
      cancelled = true;
      headingSub?.remove();
      magSub?.remove();
    };
  }, [visible]);

  const targetDeg = target ? LABEL[target].deg : null;
  const h = headingDeg ?? 0;
  const align = headingDeg !== null && targetDeg !== null ? smallestAngleDiff(h, targetDeg) < 18 : false;

  const pointerLabel = UI.compassPointer(lang);

  const sourceHint =
    source === 'location'
      ? UI.compassSourceLocation(lang)
      : source === 'magnetometer'
        ? UI.compassSourceMag(lang)
        : '';

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{UI.compassTitle(lang)}</Text>

          <View style={styles.dialWrap}>
            <View style={styles.pointerRow}>
              <View style={styles.triangle} />
            </View>
            <Text style={styles.pointerCaption}>{pointerLabel}</Text>

            <View style={[styles.dialOuter, { width: DIAL, height: DIAL }]}>
              <View
                style={[
                  styles.rose,
                  {
                    width: ROSE,
                    height: ROSE,
                    transform: headingDeg === null ? [] : [{ rotate: `${-h}deg` }],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardinal,
                    styles.posN,
                    target === 'north' && styles.cardinalTarget,
                    target === 'north' && align && styles.cardinalAligned,
                  ]}
                >
                  N
                </Text>
                <Text
                  style={[
                    styles.cardinal,
                    styles.posE,
                    target === 'east' && styles.cardinalTarget,
                    target === 'east' && align && styles.cardinalAligned,
                  ]}
                >
                  E
                </Text>
                <Text
                  style={[
                    styles.cardinal,
                    styles.posS,
                    target === 'south' && styles.cardinalTarget,
                    target === 'south' && align && styles.cardinalAligned,
                  ]}
                >
                  S
                </Text>
                <Text style={[styles.cardinal, styles.posW]}>W</Text>
                <View style={styles.crossH} />
                <View style={styles.crossV} />
              </View>
            </View>

            <View style={styles.readout}>
              <Text style={styles.degMain}>
                {headingDeg === null ? '—' : `${Math.round(h)}°`}
              </Text>
              <Text style={styles.degSub}>{UI.compassFacing(lang)}</Text>
              {target ? (
                <Text style={styles.targetLine}>
                  {UI.compassRitual(lang)}
                  <Text style={styles.targetBold}>
                    {labelForFacing(target, lang)} ({targetDeg}°)
                  </Text>
                </Text>
              ) : null}
              {sourceHint ? <Text style={styles.sourceHint}>{sourceHint}</Text> : null}
            </View>

            <Text style={[styles.alignMsg, align && styles.alignOk]}>
              {target
                ? align
                  ? UI.compassAlignedOk(lang)
                  : UI.compassRotateDial(
                      lang,
                      target === 'north' ? 'N' : target === 'east' ? 'E' : 'S',
                    )
                : ''}
            </Text>
          </View>

          {Platform.OS === 'android' ? (
            <Text style={styles.hint}>{UI.compassAndroid(lang)}</Text>
          ) : (
            <Text style={styles.hint}>{UI.compassIos(lang)}</Text>
          )}

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>{UI.compassClose(lang)}</Text>
          </Pressable>

          <DeveloperCredit lang={lang} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#f4e8d8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: '#c4a574',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3d2914',
    marginBottom: 8,
    textAlign: 'center',
  },
  dialWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
  pointerRow: {
    alignItems: 'center',
    marginBottom: 4,
    zIndex: 4,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#b71c1c',
  },
  pointerCaption: {
    fontSize: 11,
    color: '#5c3d1e',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  dialOuter: {
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#5c3d1e',
    backgroundColor: 'rgba(255,248,230,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rose: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardinal: {
    position: 'absolute',
    fontSize: 26,
    fontWeight: '900',
    color: '#3d2914',
    width: 36,
    textAlign: 'center',
  },
  cardinalTarget: {
    color: '#1565c0',
    textDecorationLine: 'underline',
  },
  cardinalAligned: {
    color: '#2e7d32',
  },
  posN: { top: 4, alignSelf: 'center' },
  posE: { right: 4, top: '50%', marginTop: -16 },
  posS: { bottom: 4, alignSelf: 'center' },
  posW: { left: 4, top: '50%', marginTop: -16 },
  crossH: {
    position: 'absolute',
    width: '70%',
    height: 1,
    backgroundColor: 'rgba(92,61,30,0.25)',
  },
  crossV: {
    position: 'absolute',
    height: '70%',
    width: 1,
    backgroundColor: 'rgba(92,61,30,0.25)',
  },
  readout: {
    marginTop: 14,
    alignItems: 'center',
  },
  degMain: {
    fontSize: 40,
    fontWeight: '800',
    color: '#5c3d1e',
    fontVariant: ['tabular-nums'],
  },
  degSub: {
    fontSize: 12,
    color: '#6d4c2b',
    marginTop: 2,
    textAlign: 'center',
  },
  targetLine: {
    marginTop: 8,
    fontSize: 15,
    color: '#3d2914',
    textAlign: 'center',
  },
  targetBold: {
    fontWeight: '800',
    color: '#1565c0',
  },
  sourceHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#6d4c2b',
    fontStyle: 'italic',
  },
  alignMsg: {
    marginTop: 12,
    fontSize: 14,
    color: '#8b4513',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  alignOk: {
    color: '#2e7d32',
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    color: '#4a3520',
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 12,
  },
  closeBtn: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: '#8b4513',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
