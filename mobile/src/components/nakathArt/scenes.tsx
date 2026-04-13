/**
 * Shared props for nakath scene components (SVG or raster).
 */
import type { Animated } from 'react-native';

export type SceneBaseProps = {
  osc?: Animated.Value;
  accentColor: string;
};
