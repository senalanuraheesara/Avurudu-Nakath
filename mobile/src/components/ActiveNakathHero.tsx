import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NakathEvent } from '../data/nakath2026';
import { eventDetails, eventTitle } from '../i18n/eventCopy';
import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';
import {
  getNakathEntrancePreset,
  getNakathLoopPreset,
  getNakathVisualAccent,
  type NakathLoopKind,
} from '../utils/nakathAnimations';
import { NakathSceneArt } from './nakathArt/NakathSceneArt';
import { formatEventWhenText } from '../utils/nakathDisplay';

type Facing = 'south' | 'east' | 'north';

type Props = {
  event: NakathEvent;
  lang: Lang;
  muted: boolean;
  canToggleMute: boolean;
  onToggleMute: () => void;
  onCompass?: (direction: Facing) => void;
};

function directionForEvent(id: string): Facing | null {
  if (id === 'ahara-pisima' || id === 'wada-ganuden' || id === 'raksha-pitata') return 'south';
  if (id === 'hisatel-gema') return 'east';
  if (id === 'pala-situwima' || id === 'hadisi-rajakari-pitata') return 'north';
  return null;
}

function ringOpacityRange(kind: NakathLoopKind): [number, number] {
  switch (kind) {
    case 'ring-slow':
      return [0.22, 0.52];
    case 'ring-bright':
      return [0.48, 0.98];
    case 'ring-gentle':
    default:
      return [0.32, 0.82];
  }
}

export function ActiveNakathHero({
  event,
  lang,
  muted,
  canToggleMute,
  onToggleMute,
  onCompass,
}: Props) {
  const id = event.id;
  const entrance = useMemo(() => getNakathEntrancePreset(id), [id]);
  const loopPreset = useMemo(() => getNakathLoopPreset(id), [id]);
  const accent = useMemo(() => getNakathVisualAccent(id), [id]);

  const opacity = useRef(new Animated.Value(entrance.fromOpacity)).current;
  const translateX = useRef(new Animated.Value(entrance.fromTranslateX)).current;
  const translateY = useRef(new Animated.Value(entrance.fromTranslateY)).current;
  const scale = useRef(new Animated.Value(entrance.fromScale)).current;
  const osc = useRef(new Animated.Value(0)).current;

  /** Entrance (once per nakath) */
  useEffect(() => {
    opacity.setValue(entrance.fromOpacity);
    translateX.setValue(entrance.fromTranslateX);
    translateY.setValue(entrance.fromTranslateY);
    scale.setValue(entrance.fromScale);

    const timingOpacity = Animated.timing(opacity, {
      toValue: 1,
      duration: entrance.durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    if (entrance.useSpring) {
      Animated.parallel([
        timingOpacity,
        Animated.spring(translateX, {
          toValue: 0,
          friction: entrance.springFriction ?? 7,
          tension: entrance.springTension ?? 72,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: entrance.springFriction ?? 7,
          tension: entrance.springTension ?? 72,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: entrance.springFriction ?? 7,
          tension: entrance.springTension ?? 72,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      const half = entrance.durationMs;
      Animated.parallel([
        timingOpacity,
        Animated.timing(translateX, {
          toValue: 0,
          duration: half,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: half,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: half,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [id, entrance, opacity, translateX, translateY, scale]);

  /** Continuous loop — style depends on nakath */
  useEffect(() => {
    osc.setValue(0);
    const period = loopPreset.periodMs;
    const half = Math.max(300, period / 2);

    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(osc, {
          toValue: 1,
          duration: half,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(osc, {
          toValue: 0,
          duration: half,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loopAnim.start();
    return () => loopAnim.stop();
  }, [id, loopPreset.periodMs, osc]);

  const ringOpacity = useMemo(() => {
    const kind = loopPreset.kind;
    if (
      kind === 'ring-gentle' ||
      kind === 'ring-slow' ||
      kind === 'ring-bright' ||
      kind === 'moon-breathe'
    ) {
      const [a, b] =
        kind === 'moon-breathe' ? ([0.28, 0.55] as const) : ringOpacityRange(kind);
      return osc.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
    }
    if (
      kind === 'float-y' ||
      kind === 'float-y-strong' ||
      kind === 'sway-x' ||
      kind === 'tilt' ||
      kind === 'rise' ||
      kind === 'roots'
    ) {
      const [a, b] = ringOpacityRange('ring-gentle');
      return osc.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
    }
    if (kind === 'breathe' || kind === 'breathe-strong') {
      const [a, b] = ringOpacityRange('ring-bright');
      return osc.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
    }
    const [a, b] = ringOpacityRange('ring-gentle');
    return osc.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  }, [loopPreset.kind, osc]);

  const innerStyle = useMemo(() => {
    const k = loopPreset.kind;
    if (k === 'ring-gentle' || k === 'ring-slow' || k === 'ring-bright') {
      return {};
    }
    if (k === 'float-y') {
      return {
        transform: [
          {
            translateY: osc.interpolate({ inputRange: [0, 1], outputRange: [-7, 7] }),
          },
        ],
      };
    }
    if (k === 'float-y-strong') {
      return {
        transform: [
          {
            translateY: osc.interpolate({ inputRange: [0, 1], outputRange: [-11, 10] }),
          },
        ],
      };
    }
    if (k === 'sway-x') {
      return {
        transform: [
          {
            translateX: osc.interpolate({ inputRange: [0, 1], outputRange: [-8, 8] }),
          },
        ],
      };
    }
    if (k === 'breathe') {
      return {
        transform: [
          {
            scale: osc.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.028, 1] }),
          },
        ],
      };
    }
    if (k === 'breathe-strong') {
      return {
        transform: [
          {
            scale: osc.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.048, 1] }),
          },
        ],
      };
    }
    if (k === 'moon-breathe') {
      return {
        transform: [
          {
            scale: osc.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.022, 1] }),
          },
        ],
      };
    }
    if (k === 'rise') {
      return {
        transform: [
          {
            translateY: osc.interpolate({ inputRange: [0, 1], outputRange: [5, -5] }),
          },
        ],
      };
    }
    if (k === 'roots') {
      return {
        transform: [
          {
            scale: osc.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.018, 1] }),
          },
        ],
      };
    }
    if (k === 'tilt') {
      return {
        transform: [
          {
            rotate: osc.interpolate({
              inputRange: [0, 1],
              outputRange: ['-1.1deg', '1.1deg'],
            }),
          },
        ],
      };
    }
    return {};
  }, [loopPreset.kind, osc]);

  const title = eventTitle(event, lang);
  const details = eventDetails(event, lang);
  const whenText = formatEventWhenText(event, lang);
  const dir = directionForEvent(event.id);

  return (
    <Animated.View
      style={[
        styles.hero,
        {
          borderColor: accent.borderColor,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <Animated.View style={[styles.pulseRing, { borderColor: accent.ringBorderColor, opacity: ringOpacity }]} />
      <Animated.View style={[styles.inner, innerStyle]}>
        <Text style={[styles.kicker, { color: accent.kickerColor }]}>{UI.kickerActive(lang)}</Text>
        <NakathSceneArt key={id} eventId={id} osc={osc} accentColor={accent.borderColor} variant="hero" />
        <Text style={styles.title}>{title}</Text>
        {whenText ? (
          <Text style={styles.when} selectable>
            {whenText}
          </Text>
        ) : null}
        {details ? (
          <Text style={styles.details} selectable>
            {details}
          </Text>
        ) : null}
        <View style={styles.actions}>
          {canToggleMute ? (
            <Pressable onPress={onToggleMute} style={({ pressed }) => [styles.btn, muted && styles.btnMuted, pressed && { opacity: 0.85 }]}>
              <Text style={styles.btnText}>{muted ? UI.muteOff(lang) : UI.muteOn(lang)}</Text>
            </Pressable>
          ) : null}
          {dir && onCompass ? (
            <Pressable onPress={() => onCompass(dir)} style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.85 }]}>
              <Text style={styles.btnTextGhost}>{UI.directions(lang)}</Text>
            </Pressable>
          ) : null}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: 'rgba(255, 248, 235, 0.98)',
    borderRadius: 16,
    padding: 0,
    marginBottom: 16,
    borderWidth: 2,
    overflow: 'visible',
  },
  inner: {
    padding: 20,
  },
  pulseRing: {
    position: 'absolute',
    left: -2,
    right: -2,
    top: -2,
    bottom: -2,
    borderRadius: 18,
    borderWidth: 2,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2d1f0f',
    lineHeight: 30,
  },
  when: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a3520',
    lineHeight: 24,
  },
  details: {
    marginTop: 12,
    fontSize: 15,
    color: '#3d2914',
    lineHeight: 23,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  btn: {
    backgroundColor: '#8b4513',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnMuted: {
    backgroundColor: '#6d4c2b',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8b4513',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnTextGhost: {
    color: '#8b4513',
    fontSize: 14,
    fontWeight: '600',
  },
});
