/* eslint-disable @next/next/no-img-element */

/** "🇩🇪" → "de". Returns null for anything that isn't a two-letter flag emoji (e.g. 🌍). */
export function flagCode(emoji: string) {
  const letters = [...emoji.trim()].map((char) => (char.codePointAt(0) ?? 0) - 0x1f1e6);
  if (letters.length !== 2 || letters.some((n) => n < 0 || n > 25)) return null;
  return String.fromCharCode(97 + letters[0], 97 + letters[1]);
}

/**
 * Windows doesn't draw flag emoji (it shows the letters "DE"), so country flags are
 * rendered as images built from the stored emoji. Other emoji are shown as-is.
 */
export default function Flag({ emoji }: { emoji: string }) {
  const code = flagCode(emoji);
  if (!code) return <>{emoji}</>;
  return <img className="flag-img" src={`https://flagcdn.com/${code}.svg`} alt="" loading="lazy" />;
}
