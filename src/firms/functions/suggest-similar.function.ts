import { ProspectFirmRow } from '../types/prospect-firm-row.interface';
import { normalizeFirmName } from '../../data/functions/normalize-firm-name.function';

export function suggestSimilar(query: string, prospects: ProspectFirmRow[]): string[] {
  const normalizedQuery = normalizeFirmName(query);
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  return prospects
    .map((row) => {
      const tokens = normalizeFirmName(row.firm_name).split(' ').filter(Boolean);
      const score = queryTokens.filter((token) => tokens.includes(token)).length;
      return { name: row.firm_name, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.name);
}
