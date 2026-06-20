/**
 * Normalizes firm names for tolerant lookup:
 * - lowercase
 * - "&" becomes "and"
 * - punctuation and extra whitespace removed
 */
export function normalizeFirmName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
