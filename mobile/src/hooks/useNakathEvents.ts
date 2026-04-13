import { useEffect, useState } from 'react';
import { NAKATH_EVENTS, type NakathEvent } from '../data/nakath2026';

const API = process.env.EXPO_PUBLIC_API_URL;

export function useNakathEvents() {
  const [events, setEvents] = useState<NakathEvent[]>(NAKATH_EVENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API.replace(/\/$/, '')}/api/nakath/events`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as NakathEvent[];
        if (!cancelled && Array.isArray(data) && data.length) setEvents(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Fetch failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { events, loading, error, usingApi: Boolean(API) };
}
