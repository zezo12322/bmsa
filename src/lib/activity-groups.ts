import type { Activity, Locale } from './types';
import { text } from './types';

/**
 * An activity run by several committees is stored as one row per committee,
 * with slugs that differ only by a trailing `-<committee>`
 * (e.g. `amr-awareness-2026-scoph`, `amr-awareness-2026-score`).
 * Rows with the same key are the same activity.
 */
export function activityGroupKey(activity: Pick<Activity, 'slug' | 'committee'>) {
  const suffix = `-${activity.committee}`;
  return activity.slug.endsWith(suffix) ? activity.slug.slice(0, -suffix.length) : activity.slug;
}

/** Adds `committees` (every unit of the activity's group, in list order) to each row. */
export function withGroupCommittees(list: Activity[]): Activity[] {
  const byKey = new Map<string, string[]>();
  for (const activity of list) {
    const key = activityGroupKey(activity);
    const units = byKey.get(key) ?? [];
    if (!units.includes(activity.committee)) units.push(activity.committee);
    byKey.set(key, units);
  }
  return list.map((activity) => ({ ...activity, committees: byKey.get(activityGroupKey(activity)) }));
}

/** One row per activity (the first row of each group wins), for lists that span all committees. */
export function uniqueActivities(list: Activity[]): Activity[] {
  const seen = new Set<string>();
  return list.filter((activity) => {
    const key = activityGroupKey(activity);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Card tag. For shared activities the committee part lists every unit: "SCOPH × SCORE - Awareness Campaign". */
export function activityTag(activity: Activity, locale: Locale) {
  const tag = text(activity.tag, locale);
  const units = activity.committees ?? [activity.committee];
  if (units.length < 2) return tag;
  const dash = tag.indexOf(' - ');
  return units.map((unit) => unit.toUpperCase()).join(' × ') + (dash >= 0 ? tag.slice(dash) : '');
}
