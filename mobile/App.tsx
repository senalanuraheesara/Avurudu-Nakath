import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ActiveNakathHero } from './src/components/ActiveNakathHero';
import { CountdownBanner } from './src/components/CountdownBanner';
import { DeveloperCredit } from './src/components/DeveloperCredit';
import { StartupSplash } from './src/components/StartupSplash';
import { CompassPanel, type Facing } from './src/components/CompassPanel';
import { EventCard } from './src/components/EventCard';
import { InAppBanner, type BannerPayload } from './src/components/InAppBanner';
import { GREETING_EN, GREETING_SI, GREETING_TA, YEAR } from './src/data/nakath2026';
import type { Lang } from './src/i18n/lang';
import { UI } from './src/i18n/ui';
import { useNakathEvents } from './src/hooks/useNakathEvents';
import {
  hasUpcomingInstants,
  loadMutedIds,
  rescheduleAllNakathNotifications,
  subscribeNakathDashboardAlerts,
  toggleMutedEvent,
} from './src/notifications';
import { getActiveDashboardEvent } from './src/utils/activeNakath';
import { getNextEvent, isNakathPast, shouldHideNakathFromList } from './src/utils/time';

function greetingLine(lang: Lang): string {
  if (lang === 'ta') return GREETING_TA;
  if (lang === 'en') return GREETING_EN;
  return GREETING_SI;
}

export default function App() {
  const [lang, setLang] = useState<Lang>('si');
  const [now, setNow] = useState(() => Date.now());
  const { events } = useNakathEvents();
  const [compassTarget, setCompassTarget] = useState<Facing | null>(null);
  const [compassOpen, setCompassOpen] = useState(false);
  const [muted, setMuted] = useState<Set<string>>(new Set());
  const [mutedLoaded, setMutedLoaded] = useState(false);
  const [banner, setBanner] = useState<BannerPayload | null>(null);
  /** While a nakath is “live”, user can open full list (සීට්ටුව); reset when window ends. */
  const [showFullSeettuwa, setShowFullSeettuwa] = useState(false);
  /** Which ritual’s hero was showing when user opened the full list — back button only while that same nakath is still the active hero. */
  const [seettuwaOriginEventId, setSeettuwaOriginEventId] = useState<string | null>(null);
  /** After animated splash finishes — show nakath UI. */
  const [startupIntroDismissed, setStartupIntroDismissed] = useState(false);
  const onSplashExitComplete = useCallback(() => setStartupIntroDismissed(true), []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadMutedIds().then((s) => {
      if (!cancelled) {
        setMuted(s);
        setMutedLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const runReschedule = useCallback(async () => {
    if (!mutedLoaded) return;
    await rescheduleAllNakathNotifications(events, muted, lang);
  }, [events, muted, lang, mutedLoaded]);

  useEffect(() => {
    void runReschedule();
  }, [runReschedule]);

  useEffect(() => {
    const sub = (next: AppStateStatus) => {
      if (next === 'active') void runReschedule();
    };
    const a = AppState.addEventListener('change', sub);
    return () => a.remove();
  }, [runReschedule]);

  useEffect(() => {
    return subscribeNakathDashboardAlerts((p) => setBanner(p), { events, lang });
  }, [events, lang]);

  const onToggleMute = useCallback(async (eventId: string) => {
    const next = await toggleMutedEvent(eventId);
    setMuted(next);
  }, []);

  const nextEv = useMemo(
    () =>
      getNextEvent(events, {
        excludeEventIds: ['snana-parana'],
        excludeUntilRangeStarted: {
          rangeEventId: 'punya-kalaya',
          blockedEventIds: ['aluth-avurudu-udawa'],
        },
      }),
    [events, now],
  );
  const activeDashboard = useMemo(() => getActiveDashboardEvent(events, now), [events, now]);

  /** Omitted from the සීට්ටු list ~10 min after the removal instant (start for range/point; last row for multi_date). */
  const visibleEvents = useMemo(
    () => events.filter((ev) => !shouldHideNakathFromList(ev, now)),
    [events, now],
  );

  const showBackToHero = useMemo(
    () =>
      Boolean(
        activeDashboard &&
          showFullSeettuwa &&
          seettuwaOriginEventId !== null &&
          activeDashboard.id === seettuwaOriginEventId,
      ),
    [activeDashboard, showFullSeettuwa, seettuwaOriginEventId],
  );

  useEffect(() => {
    if (!activeDashboard) {
      setShowFullSeettuwa(false);
      setSeettuwaOriginEventId(null);
      return;
    }
    if (seettuwaOriginEventId !== null && activeDashboard.id !== seettuwaOriginEventId) {
      setSeettuwaOriginEventId(null);
    }
  }, [activeDashboard, seettuwaOriginEventId]);

  const title = UI.mainTitle(YEAR, lang);

  const openCompass = (f: Facing) => {
    setCompassTarget(f);
    setCompassOpen(true);
  };

  if (!startupIntroDismissed) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.splashSafe} edges={['top', 'left', 'right', 'bottom']}>
          <StatusBar style="dark" />
          <StartupSplash ready={mutedLoaded} lang={lang} onExitComplete={onSplashExitComplete} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <Text style={styles.sun}>☀</Text>
            <Text style={styles.mainTitle}>{title}</Text>
            <View style={styles.langRow}>
              <Pressable onPress={() => setLang('si')} style={[styles.langBtn, lang === 'si' && styles.langOn]}>
                <Text style={[styles.langTxt, lang === 'si' && styles.langTxtOn]}>සිං</Text>
              </Pressable>
              <Pressable onPress={() => setLang('en')} style={[styles.langBtn, lang === 'en' && styles.langOn]}>
                <Text style={[styles.langTxt, lang === 'en' && styles.langTxtOn]}>EN</Text>
              </Pressable>
              <Pressable onPress={() => setLang('ta')} style={[styles.langBtn, lang === 'ta' && styles.langOn]}>
                <Text style={[styles.langTxt, lang === 'ta' && styles.langTxtOn]}>தமிழ்</Text>
              </Pressable>
            </View>
          </View>

          <InAppBanner payload={banner} onDismiss={() => setBanner(null)} lang={lang} />

          {activeDashboard && !showFullSeettuwa ? (
            <>
              <ActiveNakathHero
                event={activeDashboard}
                lang={lang}
                muted={muted.has(activeDashboard.id)}
                canToggleMute={hasUpcomingInstants(activeDashboard) || muted.has(activeDashboard.id)}
                onToggleMute={() => void onToggleMute(activeDashboard.id)}
                onCompass={openCompass}
              />
              <Pressable
                onPress={() => {
                  setSeettuwaOriginEventId(activeDashboard.id);
                  setShowFullSeettuwa(true);
                }}
                style={({ pressed }) => [styles.seettuwaBtn, pressed && { opacity: 0.88 }]}
                accessibilityRole="button"
              >
                <Text style={styles.seettuwaBtnText}>{UI.seettuwaBtn(lang)}</Text>
              </Pressable>
              <Text style={styles.focusHint}>{UI.focusHint(lang)}</Text>
            </>
          ) : (
            <>
              {showBackToHero ? (
                <Pressable
                  onPress={() => {
                    setShowFullSeettuwa(false);
                    setSeettuwaOriginEventId(null);
                  }}
                  style={({ pressed }) => [styles.backHeroBtn, pressed && { opacity: 0.88 }]}
                  accessibilityRole="button"
                >
                  <Text style={styles.backHeroBtnText}>{UI.backHero(lang)}</Text>
                </Pressable>
              ) : null}
              <CountdownBanner next={nextEv} now={now} lang={lang} />

              <Text style={styles.seettuwaSheetTitle} accessibilityRole="header">
                {UI.seettuwaSheetTitle(lang)}
              </Text>

              {visibleEvents.length === 0 && events.length > 0 ? (
                <Text style={styles.pastHiddenHint}>{UI.pastNakathsHidden(lang)}</Text>
              ) : null}

              {visibleEvents.map((ev, i) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  index={i}
                  lang={lang}
                  past={isNakathPast(ev, now)}
                  muted={muted.has(ev.id)}
                  canToggleMute={hasUpcomingInstants(ev) || muted.has(ev.id)}
                  onToggleMute={() => void onToggleMute(ev.id)}
                  onCompass={openCompass}
                />
              ))}
            </>
          )}

          <Text style={styles.greeting}>{greetingLine(lang)}</Text>
          <Text style={styles.hint}>{UI.hintFooter(lang)}</Text>
          <DeveloperCredit lang={lang} />
        </ScrollView>

        <CompassPanel
          visible={compassOpen}
          onClose={() => setCompassOpen(false)}
          target={compassTarget}
          lang={lang}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f4e8d8',
  },
  splashSafe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sun: {
    fontSize: 40,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3d2914',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 10,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8b4513',
    backgroundColor: 'transparent',
  },
  langOn: {
    backgroundColor: '#8b4513',
  },
  langTxt: {
    color: '#3d2914',
    fontWeight: '700',
    fontSize: 13,
  },
  langTxtOn: {
    color: '#fff8e7',
  },
  focusHint: {
    fontSize: 12,
    color: '#6d4c2b',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  seettuwaBtn: {
    alignSelf: 'stretch',
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff8e7',
    borderWidth: 2,
    borderColor: '#8b4513',
  },
  seettuwaBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5c3d1e',
    textAlign: 'center',
  },
  backHeroBtn: {
    alignSelf: 'stretch',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  backHeroBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8b4513',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  seettuwaSheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#5c3d1e',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  pastHiddenHint: {
    fontSize: 13,
    color: '#6d4c2b',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  greeting: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#5c3d1e',
    textAlign: 'center',
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: '#7a5c3e',
    textAlign: 'center',
    lineHeight: 18,
  },
});
