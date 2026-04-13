import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';

export type BannerPayload = {
  title: string;
  body: string;
};

type Props = {
  payload: BannerPayload | null;
  onDismiss: () => void;
  lang: Lang;
};

export function InAppBanner({ payload, onDismiss, lang }: Props) {
  if (!payload) return null;
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <View style={styles.inner}>
        <Text style={styles.kicker}>{UI.bannerAlert(lang)}</Text>
        <Text style={styles.title} numberOfLines={3}>
          {payload.title}
        </Text>
        {payload.body ? (
          <ScrollView
            style={styles.bodyScroll}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            <Text style={styles.body} selectable>
              {payload.body}
            </Text>
          </ScrollView>
        ) : null}
        <Pressable onPress={onDismiss} style={({ pressed }) => [styles.dismiss, pressed && { opacity: 0.85 }]}>
          <Text style={styles.dismissTxt}>{UI.dismiss(lang)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b4513',
    backgroundColor: '#fff8e7',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  inner: {
    padding: 14,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8b4513',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2d1f0f',
  },
  bodyScroll: {
    marginTop: 6,
    maxHeight: 320,
  },
  body: {
    fontSize: 14,
    color: '#4a3520',
    lineHeight: 20,
  },
  dismiss: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#8b4513',
    borderRadius: 8,
  },
  dismissTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
