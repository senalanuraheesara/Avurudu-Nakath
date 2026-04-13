import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';

/**
 * Footer credit with a light “tech” feel: monospace, pulse, slow gear spin.
 */
export function DeveloperCredit({ lang }: { lang: Lang }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    pulseLoop.start();
    spinLoop.start();
    return () => {
      pulseLoop.stop();
      spinLoop.stop();
    };
  }, [pulse, spin]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.62, 1] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const line = UI.developerCreditLine(lang);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.gearWrap, { transform: [{ rotate }] }]} accessibilityElementsHidden>
        <Text style={styles.gear} allowFontScaling={false}>
          ⚙
        </Text>
      </Animated.View>
      <Animated.Text
        style={[styles.text, { opacity }]}
        selectable
        accessibilityRole="text"
        accessibilityLabel={line}
      >
        {line}
      </Animated.Text>
      <Animated.View
        style={[
          styles.gearWrap,
          {
            transform: [
              {
                rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] }),
              },
            ],
          },
        ]}
        accessibilityElementsHidden
      >
        <Text style={styles.gear} allowFontScaling={false}>
          ⚙
        </Text>
      </Animated.View>
    </View>
  );
}

const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
    paddingTop: 14,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(139, 69, 19, 0.35)',
  },
  gearWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gear: {
    fontSize: 16,
    color: '#5d4037',
    opacity: 0.9,
  },
  text: {
    fontFamily: mono,
    fontSize: 12,
    letterSpacing: 0.3,
    color: '#4e342e',
    textAlign: 'center',
    fontWeight: '600',
  },
});
