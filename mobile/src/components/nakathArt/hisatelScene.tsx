/**
 * හිසතෙල් ගෑම — bundled illustration PNG (not SVG), gentle motion on the active hero.
 */
import { useMemo } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import type { SceneBaseProps } from './scenes';

const HISATEL_GEMA = require('../../../assets/hisatel-gema.png');

export function SceneHisatel({ osc }: SceneBaseProps) {
  const animStyle = useMemo(() => {
    if (!osc) return null;
    return {
      opacity: osc.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }),
      transform: [
        { translateY: osc.interpolate({ inputRange: [0, 1], outputRange: [-2, 3] }) },
      ],
    };
  }, [osc]);

  if (osc && animStyle) {
    return (
      <Animated.View style={[styles.wrap, animStyle]}>
        <Image
          source={HISATEL_GEMA}
          style={styles.img}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="හිසතෙල් ගෑම — වැඩිමහල්ලා ළමයාට තෙල් ගැනීම"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Image
        source={HISATEL_GEMA}
        style={styles.img}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="හිසතෙල් ගෑම — වැඩිමහල්ලා ළමයාට තෙල් ගැනීම"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
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
