import { normalizeFirmName } from './normalize-firm-name.function';

/**
 * Returns true when two firm names match after normalization,
 * or when one normalized name contains the other (handles abbreviations).
 */
export function doFirmNamesMatch(a: string, b: string): boolean {
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
