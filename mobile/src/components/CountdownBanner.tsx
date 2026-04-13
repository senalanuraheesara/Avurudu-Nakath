import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';
import type { NakathEvent } from '../data/nakath2026';
import { eventTitle } from '../i18n/eventCopy';
import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';
import { formatCountdown } from '../utils/time';

type Props = {
  next: { event: NakathEvent; at: Date } | null;
  now: number;
  lang: Lang;
};

export function CountdownBanner({ next, now, lang }: Props) {
  if (!next) {
    return (
      <LinearGradient colors={['#c9a66b', '#a67c3d']} style={styles.wrap}>
        <Text style={styles.title}>{UI.countdownDone(lang)}</Text>
        <Text style={styles.sub}>{UI.countdownSub(lang)}</Text>
      </LinearGradient>
    );
  }

  const ms = next.at.getTime() - now;
  const title = eventTitle(next.event, lang);
  return (
    <LinearGradient colors={['#c9a66b', '#8b6914']} style={styles.wrap}>
      <Text style={styles.label}>{UI.countdownNext(lang)}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.timer}>{formatCountdown(ms)}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#5c3d1e',
  },
  label: {
    color: '#fff8e7',
    fontSize: 12,
    opacity: 0.95,
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    color: '#fff8e7',
    textAlign: 'center',
    fontSize: 14,
  },
  timer: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
});
