import { InteractionHistoryRow } from '../firms/types/firm-profile.types';

export const SAMPLE_INTERACTION_HISTORY: InteractionHistoryRow[] = [
  {
    interaction_id: 'INT-SAMPLE-001',
    firm_name: 'Sample Firm',
    rep_name: 'Sarah Chen',
    channel: 'email',
    subject: 'Ideas for Sample Firm intake process',
    event_type: 'opened',
    event_date: '2025-03-01',
    sequence_step: '1',
    template_id: 'tmpl-pain-point-01',
    asset_sent: 'EVE-OP-001',
  },
];
