/**
 * නව සඳ බැලීම — bundled illustration PNG, gentle motion on the active hero.
 */
import { useMemo } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import type { SceneBaseProps } from './scenes';

const NAVA_SANDA = require('../../../assets/nava-sanda.png');

export function SceneNavaSanda({ osc }: SceneBaseProps) {
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
      source={NAVA_SANDA}
      style={styles.img}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="නව සඳ බැලීම"
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
