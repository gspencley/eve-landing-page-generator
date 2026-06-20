import { EnrichmentSignalRow } from '../firms/types/firm-profile.types';

export const SAMPLE_ENRICHMENT_SIGNALS: EnrichmentSignalRow[] = [
  {
    firm_name: 'Cellino Law',
    tech_stack: 'Clio, Google Workspace, Calendly',
    competitor_mentioned: 'EvenUp',
    recent_news: 'Opened second office in Buffalo',
    job_postings: 'Expanding: 3 new attorney positions',
    website_monthly_visits: '3653',
    linkedin_followers: '48708',
    nps_from_call_notes: '9',
    last_funding_or_growth_signal: 'Launched mass tort practice',
  },
  {
    firm_name: 'Sample Firm',
    tech_stack: 'Litify, Zoom, Microsoft 365',
    competitor_mentioned: 'Supio',
    recent_news: 'Managing partner quoted in ABA Journal on AI in law',
    job_postings: 'Hiring intake coordinator',
    website_monthly_visits: '12000',
    linkedin_followers: '4500',
    nps_from_call_notes: '8',
    last_funding_or_growth_signal: 'Increased headcount 20%+ YoY',
  },
];
