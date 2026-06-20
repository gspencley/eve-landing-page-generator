export function matchList(
  targets: string[],
  values: string[],
  label: string,
  reasons: string[],
  points: number,
): number {
  const normalizedTargets = targets.map((value) => value.toLowerCase());
  for (const value of values) {
    const normalized = value.toLowerCase();
    if (
      normalizedTargets.some((target) => normalized.includes(target) || target.includes(normalized))
    ) {
      reasons.push(`Matched ${label}: ${value} (+${points})`);
      return points;
    }
  }
  return 0;
}
