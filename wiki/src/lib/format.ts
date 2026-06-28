// Voice fingerprint (BRAND §8): name the real object, state counts/dates precisely
// (relative date + exact on hover). All numeric metadata uses tabular figures.

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** A relative phrase like "3 days ago". Returns null if the date is unparseable. */
export function relativeDate(iso: string | null): string | null {
  if (!iso) return null
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return null
  const deltaSec = (then - Date.now()) / 1000
  for (const [unit, secs] of RELATIVE_UNITS) {
    if (Math.abs(deltaSec) >= secs) {
      return rtf.format(Math.round(deltaSec / secs), unit)
    }
  }
  return rtf.format(Math.round(deltaSec), 'second')
}

/** Full date for the `title` tooltip (exact on hover). */
export function exactDate(iso: string | null): string | undefined {
  if (!iso) return undefined
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return undefined
  return new Date(ms).toLocaleString('en', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}

/** Relative date from a unix-seconds timestamp (fetched_at). */
export function relativeFromUnix(seconds: number): string | null {
  return relativeDate(new Date(seconds * 1000).toISOString())
}

export function exactFromUnix(seconds: number): string | undefined {
  return exactDate(new Date(seconds * 1000).toISOString())
}

const compact = new Intl.NumberFormat('en', { notation: 'compact' })
const plain = new Intl.NumberFormat('en')

/** "12.3K" style for dense rows; null views render nothing upstream. */
export function compactCount(n: number | null): string | null {
  if (n == null) return null
  return compact.format(n)
}

export function exactCount(n: number | null): string | undefined {
  if (n == null) return undefined
  return plain.format(n)
}
