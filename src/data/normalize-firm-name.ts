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

/**
 * Returns true when two firm names match after normalization,
 * or when one normalized name contains the other (handles abbreviations).
 */
export function firmNamesMatch(a: string, b: string): boolean {
  const normA = normalizeFirmName(a);
  const normB = normalizeFirmName(b);

  if (normA === normB) {
    return true;
  }

  if (normA.length >= 4 && normB.includes(normA)) {
    return true;
  }

  if (normB.length >= 4 && normA.includes(normB)) {
    return true;
  }

  const tokensA = normA.split(' ').filter(Boolean);
  const tokensB = normB.split(' ').filter(Boolean);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return false;
  }

  const overlap = tokensA.filter((token) => tokensB.includes(token)).length;
  const minLen = Math.min(tokensA.length, tokensB.length);

  return overlap >= Math.max(2, Math.ceil(minLen * 0.6));
}
