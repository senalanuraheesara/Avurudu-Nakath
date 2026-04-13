import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NakathEvent } from '../data/nakath2026';
import { eventDetails, eventTitle } from '../i18n/eventCopy';
import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';
import { getNakathVisualAccent } from '../utils/nakathAnimations';
import { formatEventWhenText } from '../utils/nakathDisplay';
import { NakathSceneArt } from './nakathArt/NakathSceneArt';


type Props = {
  event: NakathEvent;
  index: number;
  lang: Lang;
  past: boolean;
  muted: boolean;
  canToggleMute: boolean;
  onToggleMute: () => void;
  onCompass?: (direction: 'south' | 'east' | 'north') => void;
};

function directionForEvent(id: string): 'south' | 'east' | 'north' | null {
  if (id === 'ahara-pisima' || id === 'wada-ganuden' || id === 'raksha-pitata') return 'south';
  if (id === 'hisatel-gema') return 'east';
  if (id === 'pala-situwima' || id === 'hadisi-rajakari-pitata') return 'north';
  return null;
}

export function EventCard({
  event,
  index,
  lang,
  past,
  muted,
  canToggleMute,
  onToggleMute,
  onCompass,
}: Props) {
  const accent = getNakathVisualAccent(event.id);
  const fade = useRef(new Animated.Value(past ? 1 : 0)).current;
  const title = eventTitle(event, lang);
  const details = eventDetails(event, lang);
  const dir = directionForEvent(event.id);

  const whenText = formatEventWhenText(event, lang);

  const pastLabel = UI.pastNakath(lang);

  useEffect(() => {
    if (past) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    const anim = Animated.timing(fade, {
      toValue: 1,
      duration: 420,
      delay: Math.min(index * 50, 450),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [past, index, fade]);

  return (
    <Animated.View style={{ opacity: fade }}>
      <View style={[styles.card, past && styles.cardPast]}>
        <View style={[styles.accentBar, { backgroundColor: accent.borderColor }]} />
        <View style={styles.heroRow}>
          <View style={styles.cardArtBox}>
            <NakathSceneArt eventId={event.id} accentColor={accent.borderColor} variant="card" />
          </View>
          <View style={styles.heroMain}>
            <View style={styles.rowTop}>
              <Text style={styles.badge}>{index + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                {whenText ? (
                  <Text style={styles.when} selectable>
                    {whenText}
                  </Text>
                ) : null}
              </View>
              {past ? (
                <View style={styles.pastBadge} accessibilityLabel={pastLabel}>
                  <Text style={styles.pastBadgeText} numberOfLines={3}>
                    {pastLabel}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      {details ? (
        <Text style={styles.details} selectable>
          {details}
        </Text>
      ) : null}
      <View style={styles.actions}>
        {canToggleMute ? (
          <Pressable onPress={onToggleMute} style={({ pressed }) => [styles.btn, muted && styles.btnMuted, pressed && { opacity: 0.8 }]}>
            <Text style={styles.btnText}>{muted ? UI.muteOff(lang) : UI.muteOn(lang)}</Text>
          </Pressable>
        ) : null}
        {dir && onCompass && !past ? (
          <Pressable onPress={() => onCompass(dir)} style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.8 }]}>
            <Text style={styles.btnTextGhost}>{UI.directions(lang)}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c4a574',
    overflow: 'hidden',
  },
  accentBar: {
    height: 4,
    marginTop: -14,
    marginHorizontal: -14,
    marginBottom: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardArtBox: {
    width: 84,
    flexShrink: 0,
  },
  heroMain: {
    flex: 1,
    minWidth: 0,
  },
  cardPast: {
    opacity: 0.78,
    backgroundColor: 'rgba(230,220,200,0.65)',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8b4513',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
    fontWeight: '800',
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1f0f',
  },
  when: {
    marginTop: 6,
    fontSize: 14,
    color: '#4a3520',
    lineHeight: 20,
  },
  pastBadge: {
    maxWidth: 108,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#558b2f',
  },
  pastBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#33691e',
    textAlign: 'center',
    lineHeight: 16,
  },
  details: {
    marginTop: 10,
    fontSize: 14,
    color: '#3d2914',
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  btn: {
    backgroundColor: '#8b4513',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
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
    fontSize: 13,
    fontWeight: '600',
  },
  btnTextGhost: {
    color: '#8b4513',
    fontSize: 13,
    fontWeight: '600',
  },
});
