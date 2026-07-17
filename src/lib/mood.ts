import { Timestamp } from 'firebase/firestore';

interface RawMoodEntry {
  mood: number;
  timestamp: Timestamp;
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

// Averages same-day mood entries into a single point per day, so multiple journal check-ins
// in one day don't clutter the trend chart or unfairly dominate the forecast heuristic —
// while the raw entries in Firestore stay untouched.
export const aggregateMoodByDay = <T extends RawMoodEntry>(entries: T[]): { date: Date; mood: number }[] => {
  const byDay = new Map<string, { date: Date; total: number; count: number }>();

  for (const entry of entries) {
    const date = entry.timestamp.toDate();
    const key = dayKey(date);
    const bucket = byDay.get(key);
    if (bucket) {
      bucket.total += entry.mood;
      bucket.count += 1;
    } else {
      byDay.set(key, { date, total: entry.mood, count: 1 });
    }
  }

  return Array.from(byDay.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ date, total, count }) => ({ date, mood: total / count }));
};
