import { ProspectFirmRow } from '../../firms/types/firm-profile.types';
import { normalizeFirmName } from './normalize-firm-name.function';
import { SAMPLE_PROSPECT_FIRMS } from '../sample-prospect-firms.const';

export function mergeSampleProspects(firms: ProspectFirmRow[]): ProspectFirmRow[] {
  const existing = new Set(firms.map((firm) => normalizeFirmName(firm.firm_name)));
  const extras = SAMPLE_PROSPECT_FIRMS.filter(
    (firm) => !existing.has(normalizeFirmName(firm.firm_name)),
  );
  return [...firms, ...extras];
}
