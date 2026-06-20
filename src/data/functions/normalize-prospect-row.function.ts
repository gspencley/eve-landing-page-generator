import { ProspectFirmRow } from '../../firms/types/prospect-firm-row.interface';

export function normalizeProspectRow(row: ProspectFirmRow): ProspectFirmRow {
  return {
    ...row,
    firm_name: String(row.firm_name ?? '').trim(),
    industry: String(row.industry ?? 'Legal Services'),
    practice_area: String(row.practice_area ?? ''),
    firm_size: String(row.firm_size ?? ''),
    intake_method: String(row.intake_method ?? ''),
    pain_points: String(row.pain_points ?? ''),
    case_management_system: String(row.case_management_system ?? ''),
    lead_status: String(row.lead_status ?? ''),
  };
}
