/**
 * ආහාර පිසීම — bundled illustration PNG, gentle motion on the active hero.
 */
import { useMemo } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import type { SceneBaseProps } from './scenes';

const AHARA_PISIMA = require('../../../assets/ahara-pisima.png');

export function SceneAharaPisima({ osc }: SceneBaseProps) {
  const animStyle = useMemo(() => {
    if (!osc) return null;
    return {
      opacity: osc.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }),
      transform: [
        { translateY: osc.interpolate({ inputRange: [0, 1], outputRange: [-2, 3] }) },
      ],
    };
  }, [osc]);

  const img = (
    <Image
      source={AHARA_PISIMA}
      style={styles.img}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="ආහාර පිසීම — ලිප් බැඳ ගිණි තැබීම"
      accessibilityIgnoresInvertColors
    />
  );

  if (osc && animStyle) {
    return <Animated.View style={[styles.wrap, animStyle]}>{img}</Animated.View>;
  }

  return <View style={styles.wrap}>{img}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
