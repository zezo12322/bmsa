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

/** Standing committees first, then support divisions (same order as the DB check constraint). */
const UNIT_ORDER = ['scome', 'scope', 'scoph', 'scora', 'score', 'scorp', 'cbsd', 'psd', 'pnsd', 'fsd', 'rsd'];
const unitRank = (slug: string) => {
  const i = UNIT_ORDER.indexOf(slug);
  return i < 0 ? UNIT_ORDER.length : i;
};

/** Adds `committees` (every unit of the activity's group, in UNIT_ORDER) to each row. */
export function withGroupCommittees(list: Activity[]): Activity[] {
  const byKey = new Map<string, string[]>();
  for (const activity of list) {
    const key = activityGroupKey(activity);
    const units = byKey.get(key) ?? [];
    if (!units.includes(activity.committee)) units.push(activity.committee);
    byKey.set(key, units);
  }
  for (const units of byKey.values()) units.sort((a, b) => unitRank(a) - unitRank(b));
  return list.map((activity) => ({ ...activity, committees: byKey.get(activityGroupKey(activity)) }));
}

/**
 * One row per activity, for lists that span all committees. The group keeps the position
 * of its first row, but the row shown is the one owned by the first unit in UNIT_ORDER,
 * so the card's colour and link match the first committee in its tag.
 */
export function uniqueActivities(list: Activity[]): Activity[] {
  const primary = new Map<string, Activity>();
  for (const activity of list) {
    const key = activityGroupKey(activity);
    const current = primary.get(key);
    if (!current || unitRank(activity.committee) < unitRank(current.committee)) primary.set(key, activity);
  }
  const seen = new Set<string>();
  return list.flatMap((activity) => {
    const key = activityGroupKey(activity);
    if (seen.has(key)) return [];
    seen.add(key);
    return [primary.get(key)!];
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
