export interface FormattedBytes {
  value: string;
  unit: string;
  display: string;
}

/** Format bytes to a human readable number with a unit. */
export function formatBytes(bytes: number): FormattedBytes {
  const units = 'KMGTPE';
  const factor = 1024;

  if (bytes < factor) {
    const value = bytes.toFixed(2).replace(/\.0+$/, '');
    const unit = 'B';

    return {
      value,
      unit,
      display: `${value} ${unit}`,
    };
  }

  let div = factor;
  let exp = 0;

  while (bytes / div >= factor) {
    div *= factor;
    exp++;
  }

  const value = (bytes / div).toFixed(2).replace(/\.0+$/, '');
  const unit = `${units[exp]}iB`;

  return {
    value,
    unit,
    display: [value, unit].join(' '),
  };
}

export interface AbbreviatedNumber {
  value: string;
  unit: string | undefined;
  display: string;
}

/** Abbreviate a large number.
 *
 * Non abbreviated numbers will have the unit as an empty string.
 */
export function abbreviateNum(n: number): AbbreviatedNumber {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixNum = 0;

  while (n >= 1000) {
    n /= 1000;
    suffixNum++;
  }

  const value = n.toFixed(2).replace(/\.0+$/, '');
  const unit = suffixes[suffixNum];

  return {
    value,
    unit,
    display: [value, unit].join(' '),
  };
}

/** Format the server uptime string (adds spaces after the letters). */
export function formatUptime(uptime: string): string {
  const parts = uptime.match(/\d+\D+/g);
  return parts ? parts.join(' ') : '';
}

/** Get the time difference in milliseconds from 2 ISO 8601 date-time strings. */
export function msTimeDiff(d1: string, d2: string): number {
  return new Date(d1).getTime() - new Date(d2).getTime();
}

/** Add query parameters to a URL object (Preserves the existing query params). */
export function addQueryParams(url: URL, params: Record<string, string>): URL {
  const newParams = new URLSearchParams([
    ...Array.from(url.searchParams.entries()),
    ...Object.entries(params),
  ]).toString();

  return new URL(`${url.origin}${url.pathname}?${newParams}`);
}
