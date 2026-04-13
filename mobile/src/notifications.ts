import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NakathEvent } from './data/nakath2026';
import { eventDetails, eventTitle } from './i18n/eventCopy';
import type { Lang } from './i18n/lang';
import { UI } from './i18n/ui';
import { getAllReminderInstants } from './utils/time';

const REGISTRY_KEY = 'avurudu2026:notifRegistry';
const MUTED_KEY = 'avurudu2026:mutedEvents';
/** @deprecated cancelled on reschedule */
const LEGACY_MANUAL_KEY = 'avurudu2026:notifMap';

export type { Lang };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function registryKey(eventId: string, atMs: number): string {
  return `${eventId}:${atMs}`;
}

export async function ensureNotificationSetup(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('nakath', {
      name: 'Nakath reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const cur = await Notifications.getPermissionsAsync();
  if (cur.status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

async function loadRegistry(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(REGISTRY_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

async function saveRegistry(m: Record<string, string>) {
  await AsyncStorage.setItem(REGISTRY_KEY, JSON.stringify(m));
}

async function cancelLegacyManual() {
  const raw = await AsyncStorage.getItem(LEGACY_MANUAL_KEY);
  if (!raw) return;
  try {
    const m = JSON.parse(raw) as Record<string, string>;
    for (const id of Object.values(m)) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
  await AsyncStorage.removeItem(LEGACY_MANUAL_KEY);
}

export async function loadMutedIds(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(MUTED_KEY);
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export async function saveMutedIds(ids: Set<string>) {
  await AsyncStorage.setItem(MUTED_KEY, JSON.stringify([...ids]));
}

export async function toggleMutedEvent(eventId: string): Promise<Set<string>> {
  const cur = await loadMutedIds();
  if (cur.has(eventId)) cur.delete(eventId);
  else cur.add(eventId);
  await saveMutedIds(cur);
  return cur;
}

/** OS push body limit — keep long සීට්ටු text; rare overflow still gets … */
const NOTIF_BODY_MAX = 8000;

/**
 * Full title + body from `detailsSi` / `detailsEn` (same source as cards & active nakath).
 * Use for in-app banner; scheduled notifications apply {@link NOTIF_BODY_MAX} separately.
 */
export function nakathDetailCopy(ev: NakathEvent, lang: Lang): { title: string; body: string } {
  const title = eventTitle(ev, lang);
  const detail = eventDetails(ev, lang);
  if (detail?.trim()) {
    return { title, body: detail.trim() };
  }
  return { title, body: UI.notifStarted(lang) };
}

function notifCopyForSchedule(ev: NakathEvent, lang: Lang): { title: string; body: string } {
  const { title, body } = nakathDetailCopy(ev, lang);
  if (body.length > NOTIF_BODY_MAX) {
    return { title, body: `${body.slice(0, NOTIF_BODY_MAX - 1)}…` };
  }
  return { title, body };
}

/**
 * Cancels all nakath schedules we track and re-schedules every future instant
 * (unless the event id is in `muted`).
 */
export async function rescheduleAllNakathNotifications(
  events: NakathEvent[],
  muted: Set<string>,
  lang: Lang,
): Promise<void> {
  await ensureNotificationSetup();
  await cancelLegacyManual();

  let reg = await loadRegistry();
  for (const nid of Object.values(reg)) {
    try {
      await Notifications.cancelScheduledNotificationAsync(nid);
    } catch {
      /* ignore */
    }
  }
  reg = {};

  const perm = await Notifications.getPermissionsAsync();
  if (perm.status !== 'granted') {
    await saveRegistry(reg);
    return;
  }

  for (const ev of events) {
    if (muted.has(ev.id)) continue;
    const instants = getAllReminderInstants(ev);
    const { title, body } = notifCopyForSchedule(ev, lang);
    for (const at of instants) {
      const key = registryKey(ev.id, at.getTime());
      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            data: { eventId: ev.id, kind: 'nakath' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: at,
            channelId: Platform.OS === 'android' ? 'nakath' : undefined,
          },
        });
        reg[key] = id;
      } catch (e) {
        console.warn('schedule nakath failed', key, e);
      }
    }
  }

  await saveRegistry(reg);
}

/** True if this event has at least one future nakath time (whether muted or not). */
export function hasUpcomingInstants(ev: NakathEvent): boolean {
  return getAllReminderInstants(ev).length > 0;
}

export type NakathAlertSubscribeOpts = {
  /** When set, banner uses full `detailsSi`/`detailsEn` from the matching event (matches list & hero). */
  events: NakathEvent[];
  lang: Lang;
};

/** In-app dashboard banner + system notification tap. Prefer full copy from `events` when `eventId` is present. */
export function subscribeNakathDashboardAlerts(
  onAlert: (payload: { title: string; body: string }) => void,
  opts?: NakathAlertSubscribeOpts,
): () => void {
  const parse = (notification: Notifications.Notification) => {
    const data = notification.request.content.data as { kind?: string; eventId?: string } | undefined;
    if (data?.kind !== 'nakath') return;

    if (opts?.events?.length && data.eventId) {
      const ev = opts.events.find((e) => e.id === data.eventId);
      if (ev) {
        onAlert(nakathDetailCopy(ev, opts.lang));
        return;
      }
    }

    const title = notification.request.content.title;
    const body = notification.request.content.body;
    onAlert({
      title: typeof title === 'string' ? title : String(title ?? ''),
      body: typeof body === 'string' ? body : String(body ?? ''),
    });
  };
  const s1 = Notifications.addNotificationReceivedListener((n) => parse(n));
  const s2 = Notifications.addNotificationResponseReceivedListener((r) => parse(r.notification));
  return () => {
    s1.remove();
    s2.remove();
  };
}
