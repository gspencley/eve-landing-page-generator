import { ProspectFirmRow } from '../../firms/types/prospect-firm-row.interface';
import { EnrichmentSignalRow } from '../../firms/types/enrichment-signal-row.interface';

export function inferProspectFromEnrichment(row: EnrichmentSignalRow): ProspectFirmRow {
  const techStack = row.tech_stack.toLowerCase();
  let caseManagementSystem = 'Litify';

  if (techStack.includes('clio')) {
    caseManagementSystem = 'Clio';
  } else if (techStack.includes('filevine')) {
    caseManagementSystem = 'Filevine';
  } else if (techStack.includes('custom cms')) {
    caseManagementSystem = 'Custom CMS';
  }

  const visits = Number(row.website_monthly_visits || 0);
  let firmSize = 'Mid-Market';
  if (visits >= 100000) {
    firmSize = 'Enterprise';
  } else if (visits > 0 && visits < 5000) {
    firmSize = 'Small';
  }

  const painPoints: string[] = [];
  const jobPostings = row.job_postings.toLowerCase();

  if (jobPostings.includes('intake')) {
    painPoints.push('Intake overflow');
  }
  if (jobPostings.includes('paralegal') || jobPostings.includes('associate')) {
    painPoints.push('Demand drafting backlog');
  }
  if (row.recent_news.toLowerCase().includes('after-hours') || jobPostings.includes('intake')) {
    painPoints.push('After-hours leads');
  }
  if (painPoints.length === 0) {
    painPoints.push('File review time');
  }

  let practiceArea = 'Personal Injury';
  const news = `${row.recent_news} ${row.last_funding_or_growth_signal}`.toLowerCase();
  if (news.includes('employment')) {
    practiceArea = 'Employment Law';
  } else if (news.includes('workers comp')) {
    practiceArea = 'Workers Comp';
  } else if (news.includes('mass tort')) {
    practiceArea = 'Mass Tort';
  } else if (news.includes('nursing home')) {
    practiceArea = 'Nursing Home';
  }

  let leadStatus = 'Warm';
  const nps = Number(row.nps_from_call_notes);
  if (Number.isFinite(nps) && nps >= 8) {
    leadStatus = 'Engaged';
  } else if (Number.isFinite(nps) && nps <= 3) {
    leadStatus = 'Nurture';
  } else if (row.competitor_mentioned) {
    leadStatus = 'New';
  }

  return {
    firm_name: row.firm_name,
    industry: 'Legal Services',
    practice_area: practiceArea,
    firm_size: firmSize,
    intake_method: jobPostings.includes('intake') ? 'Call center' : 'Phone + Web Form',
    pain_points: painPoints.join('; '),
    case_management_system: caseManagementSystem,
    lead_status: leadStatus,
  };
}
