export function matchKeywords(
  targets: string[],
  haystack: string,
  label: string,
  reasons: string[],
  points: number,
): number {
  const normalizedHaystack = haystack.toLowerCase();
  for (const target of targets) {
    if (normalizedHaystack.includes(target.toLowerCase())) {
      reasons.push(`Matched ${label} keyword "${target}" (+${points})`);
      return points;
    }
  }
  return 0;
}
