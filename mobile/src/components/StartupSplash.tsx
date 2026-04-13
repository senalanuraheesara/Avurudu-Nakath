import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YEAR } from '../data/nakath2026';
import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';
import { DeveloperCredit } from './DeveloperCredit';

const STARTUP_IMAGE = require('../../assets/startup-seettuwa.png');

const MIN_SPLASH_MS = 3000;
const EXIT_FADE_MS = 520;

type Props = {
  ready: boolean;
  lang: Lang;
  onExitComplete: () => void;
};

export function StartupSplash({ ready, lang, onExitComplete }: Props) {
  const insets = useSafeAreaInsets();
  const mountAt = useRef(Date.now());

  const screenOpacity = useRef(new Animated.Value(1)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(36)).current;
  const titleScale = useRef(new Animated.Value(0.92)).current;

  const lineScaleX = useRef(new Animated.Value(0)).current;

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.82)).current;
  const imageRotate = useRef(new Animated.Value(0)).current;

  const footerOpacity = useRef(new Animated.Value(0)).current;

  const floatY = useRef(new Animated.Value(0)).current;
  const floatX = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;

  const orbitA = useRef(new Animated.Value(0)).current;
  const orbitB = useRef(new Animated.Value(0)).current;

  const dotA = useRef(new Animated.Value(0.35)).current;
  const dotB = useRef(new Animated.Value(0.35)).current;
  const dotC = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const entrance = Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 680,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(titleY, {
          toValue: 0,
          friction: 7,
          tension: 68,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(lineScaleX, {
          toValue: 1,
          duration: 640,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 720,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          friction: 6,
          tension: 62,
          useNativeDriver: true,
        }),
        Animated.spring(imageRotate, {
          toValue: 1,
          friction: 9,
          tension: 64,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    entrance.start();

    const yLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const xLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatX, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatX, {
          toValue: 0,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.poly(2)),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.poly(2)),
          useNativeDriver: true,
        }),
      ]),
    );
    const orbitLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orbitA, {
            toValue: 1,
            duration: 4500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(orbitB, {
            toValue: 1,
            duration: 5200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(orbitA, {
            toValue: 0,
            duration: 4500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(orbitB, {
            toValue: 0,
            duration: 5200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.stagger(100, [
          Animated.sequence([
            Animated.timing(dotA, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(dotA, { toValue: 0.38, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(dotB, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(dotB, { toValue: 0.38, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(dotC, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(dotC, { toValue: 0.38, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          ]),
        ]),
        Animated.delay(180),
      ]),
    );

    yLoop.start();
    xLoop.start();
    breathLoop.start();
    orbitLoop.start();
    dotLoop.start();

    return () => {
      yLoop.stop();
      xLoop.stop();
      breathLoop.stop();
      orbitLoop.stop();
      dotLoop.stop();
    };
  }, [
    breath,
    dotA,
    dotB,
    dotC,
    floatX,
    floatY,
    footerOpacity,
    imageOpacity,
    imageRotate,
    imageScale,
    lineScaleX,
    orbitA,
    orbitB,
    titleOpacity,
    titleScale,
    titleY,
  ]);

  useEffect(() => {
    if (!ready) return;

    const elapsed = Date.now() - mountAt.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: EXIT_FADE_MS,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onExitComplete();
      });
    }, remaining);

    return () => clearTimeout(timer);
  }, [ready, onExitComplete, screenOpacity]);

  const rotateInterpolate = imageRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-2.2deg', '0deg'],
  });

  const titleStyle = {
    opacity: titleOpacity,
    transform: [{ translateY: titleY }, { scale: titleScale }],
  };

  const lineStyle = {
    transform: [{ scaleX: lineScaleX }],
    opacity: titleOpacity,
  };

  const imageShellStyle = {
    opacity: imageOpacity,
    transform: [{ scale: imageScale }, { rotate: rotateInterpolate }],
  };

  const breathStyle = {
    transform: [
      {
        scale: breath.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.024],
        }),
      },
    ],
  };

  const floatStyle = {
    transform: [
      {
        translateY: floatY.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -11],
        }),
      },
      {
        translateX: floatX.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 7],
        }),
      },
    ],
  };

  const orbitStyleA = {
    opacity: orbitA.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 0.62],
    }),
    transform: [
      {
        scale: orbitA.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1.06],
        }),
      },
    ],
  };

  const orbitStyleB = {
    opacity: orbitB.interpolate({
      inputRange: [0, 1],
      outputRange: [0.28, 0.52],
    }),
    transform: [
      {
        scale: orbitB.interpolate({
          inputRange: [0, 1],
          outputRange: [1.02, 0.96],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.root,
        {
          opacity: screenOpacity,
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 14),
        },
      ]}
    >
      <LinearGradient colors={['#fffefb', '#fff5e6', '#fffefb']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(212,160,23,0.07)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.orbit, styles.orbitLeft, orbitStyleA]} pointerEvents="none" />
      <Animated.View style={[styles.orbit, styles.orbitRight, orbitStyleB]} pointerEvents="none" />

      <View style={styles.main}>
        <Animated.View style={titleStyle}>
          <Text style={styles.title} accessibilityRole="header">
            {UI.splashHeroTitle(YEAR, lang)}
          </Text>
        </Animated.View>

        <View style={styles.lineWrap}>
          <Animated.View style={[styles.accentLine, lineStyle]} />
        </View>

        <Animated.View style={[styles.imageWrap, imageShellStyle]}>
          <Animated.View style={[styles.card, breathStyle]}>
            <LinearGradient
              colors={['#fffef9', '#fff8ee', '#fffef9']}
              style={styles.cardInnerGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <Animated.View style={[styles.imageFloat, floatStyle]}>
              <Image
                source={STARTUP_IMAGE}
                style={styles.image}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={UI.splashA11yImage(lang)}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>

        <View style={styles.loadingRow} accessibilityLabel={UI.loading(lang)}>
          {!ready ? (
            <View style={styles.dots}>
              <Animated.View style={[styles.dot, { opacity: dotA }]} />
              <Animated.View style={[styles.dot, { opacity: dotB }]} />
              <Animated.View style={[styles.dot, { opacity: dotC }]} />
            </View>
          ) : null}
        </View>
      </View>

      <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
        <DeveloperCredit lang={lang} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fffefb',
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(212, 165, 90, 0.14)',
  },
  orbitLeft: {
    top: '8%',
    left: -72,
  },
  orbitRight: {
    bottom: '18%',
    right: -88,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    color: '#24180c',
    textAlign: 'center',
    lineHeight: 42,
    paddingHorizontal: 6,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(212, 160, 23, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 12,
  },
  lineWrap: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
    height: 4,
  },
  accentLine: {
    height: 3,
    width: 148,
    borderRadius: 2,
    backgroundColor: '#c4956a',
    opacity: 0.85,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fffdf8',
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.18)',
    overflow: 'hidden',
    maxWidth: 320,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#5c3d1e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  cardInnerGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 17,
  },
  imageFloat: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 148,
    maxWidth: 288,
  },
  loadingRow: {
    minHeight: 48,
    marginTop: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a0522d',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
