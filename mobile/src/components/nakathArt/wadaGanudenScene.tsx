/**
 * වැඩ ඇල්ලීම, ගණුදෙනු කිරීම හා ආහාර අනුභවය — bundled illustration PNG, gentle motion on the active hero.
 */
import { useMemo } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import type { SceneBaseProps } from './scenes';

const WADA_GANUDEN = require('../../../assets/wada-ganuden.png');

export function SceneWadaGanuden({ osc }: SceneBaseProps) {
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
      source={WADA_GANUDEN}
      style={styles.img}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="වැඩ ඇල්ලීම, ගණුදෙනු හා ආහාර අනුභවය — පවුලේ ආහාර"
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
