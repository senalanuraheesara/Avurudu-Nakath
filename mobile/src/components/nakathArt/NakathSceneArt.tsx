import type { ComponentType } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import type { SceneBaseProps } from './scenes';
import { SceneAharaPisima } from './aharaPisimaScene';
import { SceneAluthUdawa } from './aluthUdawaScene';
import { SceneHisatel } from './hisatelScene';
import { ScenePunya } from './punyaScene';
import { SceneSnana } from './snanaScene';
import { SceneNavaSanda } from './navaSandaScene';
import { SceneRakshaPitata } from './rakshaPitataScene';
import { ScenePalaSituwima } from './palaSituwimaScene';
import { SceneWadaGanuden } from './wadaGanudenScene';
import { SceneHadisiRajakari } from './hadisiRajakariScene';

type Props = {
  eventId: string;
  /** When set (active hero), SVG sub-layers use looping micro-motion. */
  osc?: Animated.Value;
  accentColor: string;
  variant: 'hero' | 'card';
};

const SCENES: Record<string, ComponentType<SceneBaseProps>> = {
  'snana-parana': SceneSnana,
  'punya-kalaya': ScenePunya,
  'aluth-avurudu-udawa': SceneAluthUdawa,
  'ahara-pisima': SceneAharaPisima,
  'wada-ganuden': SceneWadaGanuden,
  'hisatel-gema': SceneHisatel,
  'hadisi-rajakari-pitata': SceneHadisiRajakari,
  'nava-sanda': SceneNavaSanda,
  'raksha-pitata': SceneRakshaPitata,
  'pala-situwima': ScenePalaSituwima,
};

export function NakathSceneArt({ eventId, osc, accentColor, variant }: Props) {
  const Scene = SCENES[eventId] ?? SceneSnana;
  const height = variant === 'hero' ? 158 : 68;
  const marginBottom = variant === 'hero' ? 10 : 8;

  const isHero = variant === 'hero';
  const entranceOpacity = useRef(new Animated.Value(isHero ? 0 : 1)).current;
  const entranceScale = useRef(new Animated.Value(isHero ? 0.9 : 1)).current;
  const entranceY = useRef(new Animated.Value(isHero ? 16 : 0)).current;

  useEffect(() => {
    if (!isHero) {
      entranceOpacity.setValue(1);
      entranceScale.setValue(1);
      entranceY.setValue(0);
      return;
    }
    entranceOpacity.setValue(0);
    entranceScale.setValue(0.82);
    entranceY.setValue(26);
    const anim = Animated.sequence([
      Animated.delay(110),
      Animated.parallel([
        Animated.timing(entranceOpacity, {
          toValue: 1,
          duration: 560,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(entranceScale, {
          toValue: 1,
          friction: 7,
          tension: 76,
          useNativeDriver: true,
        }),
        Animated.spring(entranceY, {
          toValue: 0,
          friction: 7,
          tension: 76,
          useNativeDriver: true,
        }),
      ]),
    ]);
    anim.start();
    return () => anim.stop();
  }, [eventId, isHero, entranceOpacity, entranceScale, entranceY]);

  const entranceStyle = isHero
    ? {
        opacity: entranceOpacity,
        transform: [{ translateY: entranceY }, { scale: entranceScale }],
      }
    : undefined;

  /** Hero: one shared loop on the raster (stronger than per-scene micro-motion). Card: static art. */
  const heroLoopStyle = useMemo(() => {
    if (!isHero || !osc) return undefined;
    return {
      opacity: osc.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }),
      transform: [
        { translateY: osc.interpolate({ inputRange: [0, 1], outputRange: [-6, 8] }) },
        { scale: osc.interpolate({ inputRange: [0, 1], outputRange: [0.972, 1.028] }) },
      ],
    };
  }, [isHero, osc]);

  const body = <Scene osc={isHero ? undefined : osc} accentColor={accentColor} />;
  const art =
    heroLoopStyle != null ? (
      <Animated.View style={[styles.loopWrap, heroLoopStyle]}>{body}</Animated.View>
    ) : (
      body
    );

  if (isHero) {
    return (
      <Animated.View style={[styles.wrap, { height, marginBottom }, entranceStyle]}>
        {art}
      </Animated.View>
    );
  }

  return (
    <View style={[styles.wrap, { height, marginBottom }]}>
      {art}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'stretch',
  },
  loopWrap: {
    width: '100%',
    flex: 1,
    minHeight: 0,
  },
});
