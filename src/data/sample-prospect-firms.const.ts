import { ProspectFirmRow } from '../firms/types/prospect-firm-row.interface';

export const SAMPLE_PROSPECT_FIRMS: ProspectFirmRow[] = [
  {
    firm_name: 'Cellino Law',
    industry: 'Legal Services',
    practice_area: 'Personal Injury',
    firm_size: 'Mid-Market',
    intake_method: 'Phone + Web Form',
    pain_points: 'Intake overflow; after-hours leads',
    case_management_system: 'Clio',
    lead_status: 'Engaged',
  },
  {
    firm_name: 'Davis Law Group',
    industry: 'Legal Services',
    practice_area: 'Personal Injury',
    firm_size: 'Enterprise',
    intake_method: 'Call center',
    pain_points: 'Demand drafting backlog; file review time',
    case_management_system: 'Custom CMS',
    lead_status: 'Warm',
  },
  {
    firm_name: 'Hershey Law',
    industry: 'Legal Services',
    practice_area: 'Employment Law',
    firm_size: 'Small',
    intake_method: 'Referrals',
    pain_points: 'Case evaluation speed; inconsistent follow-up',
    case_management_system: 'Custom CMS',
    lead_status: 'Nurture',
  },
  {
    firm_name: 'Sample Firm',
    industry: 'Legal Services',
    practice_area: 'Personal Injury',
    firm_size: 'Mid-Market',
    intake_method: 'Web chat',
    pain_points: 'After-hours intake; demand drafting',
    case_management_system: 'Litify',
    lead_status: 'New',
  },
];
