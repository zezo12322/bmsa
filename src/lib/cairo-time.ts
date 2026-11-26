/**
 * Admins enter dates in Egypt time (Africa/Cairo, which observes DST), while the
 * database stores UTC timestamps. These helpers convert between the two.
 */
export const BMSA_TIME_ZONE = 'Africa/Cairo';

function zoneOffsetMs(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BMSA_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - date.getTime();
}

/** `2027-03-01T18:00` (Cairo wall time, from <input type="datetime-local">) → ISO UTC string. */
export function cairoLocalToIso(local: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local.trim());
  if (!match) return null;
  const [, y, mo, d, h, mi] = match.map(Number);
  const naive = Date.UTC(y, mo - 1, d, h, mi);
  // Two passes settle the offset correctly around DST changes.
  let ts = naive - zoneOffsetMs(new Date(naive));
  ts = naive - zoneOffsetMs(new Date(ts));
  return new Date(ts).toISOString();
}

/** ISO UTC string → `2027-03-01T18:00` in Cairo wall time, for <input type="datetime-local">. */
export function isoToCairoLocal(iso: string | null | undefined) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() + zoneOffsetMs(date)).toISOString().slice(0, 16);
}
