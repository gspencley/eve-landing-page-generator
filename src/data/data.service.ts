import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { normalizeFirmName } from './normalize-firm-name';
import { parseCsvFile } from './functions/parse-csv-file.function';
import { parseXlsxFile } from './functions/parse-xlsx-file.function';
import { ProspectFirmRow } from '../firms/types/firm-profile.types';
import { EnrichmentSignalRow, InteractionHistoryRow } from '../firms/types/firm-profile.types';

const DATA_DIR = join(process.cwd(), 'data');

@Injectable()
export class DataService implements OnModuleInit {
  private readonly logger = new Logger(DataService.name);

  private prospectFirms: ProspectFirmRow[] = [];
  private enrichmentSignals: EnrichmentSignalRow[] = [];
  private interactionHistory: InteractionHistoryRow[] = [];

  onModuleInit(): void {
    this.loadAll();
  }

  reload(): void {
    this.loadAll();
  }

  getProspectFirms(): ProspectFirmRow[] {
    return this.prospectFirms;
  }

  getEnrichmentSignals(): EnrichmentSignalRow[] {
    return this.enrichmentSignals;
  }

  getInteractionHistory(): InteractionHistoryRow[] {
    return this.interactionHistory;
  }

  private loadAll(): void {
    this.prospectFirms = this.loadProspectFirms();
    this.enrichmentSignals = this.loadEnrichmentSignals();
    this.interactionHistory = this.loadInteractionHistory();

    this.logger.log(
      `Loaded ${this.prospectFirms.length} firms, ${this.enrichmentSignals.length} enrichment rows, ${this.interactionHistory.length} interactions`,
    );
  }

  private loadProspectFirms(): ProspectFirmRow[] {
    const fromXlsx = parseXlsxFile<ProspectFirmRow>(join(DATA_DIR, 'prospect_firms.xlsx'));

    if (fromXlsx.length > 0) {
      return this.mergeSampleProspects(fromXlsx.map((row) => this.normalizeProspectRow(row)));
    }

    const enrichmentRows = parseCsvFile<EnrichmentSignalRow>(
      join(DATA_DIR, 'enrichment_signals.csv'),
    );

    if (enrichmentRows.length > 0) {
      this.logger.warn(
        'prospect_firms.xlsx not found or empty — deriving prospect rows from enrichment_signals.csv',
      );
      return this.mergeSampleProspects(
        enrichmentRows.map((row) => this.inferProspectFromEnrichment(row)),
      );
    }

    this.logger.warn('No prospect source files found — using built-in sample prospect data');
    return SAMPLE_PROSPECT_FIRMS;
  }

  private mergeSampleProspects(firms: ProspectFirmRow[]): ProspectFirmRow[] {
    const existing = new Set(firms.map((firm) => normalizeFirmName(firm.firm_name)));
    const extras = SAMPLE_PROSPECT_FIRMS.filter(
      (firm) => !existing.has(normalizeFirmName(firm.firm_name)),
    );
    return [...firms, ...extras];
  }

  private inferProspectFromEnrichment(row: EnrichmentSignalRow): ProspectFirmRow {
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

  private loadEnrichmentSignals(): EnrichmentSignalRow[] {
    const fromCsv = parseCsvFile<EnrichmentSignalRow>(join(DATA_DIR, 'enrichment_signals.csv'));

    if (fromCsv.length > 0) {
      return fromCsv;
    }

    this.logger.warn(
      'enrichment_signals.csv not found or empty — using built-in sample enrichment data',
    );
    return SAMPLE_ENRICHMENT_SIGNALS;
  }

  private loadInteractionHistory(): InteractionHistoryRow[] {
    const fromCsv = parseCsvFile<InteractionHistoryRow>(join(DATA_DIR, 'interaction_history.csv'));

    if (fromCsv.length > 0) {
      return fromCsv;
    }

    this.logger.warn(
      'interaction_history.csv not found or empty — using built-in sample interaction data',
    );
    return SAMPLE_INTERACTION_HISTORY;
  }

  private normalizeProspectRow(row: ProspectFirmRow): ProspectFirmRow {
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
}

const SAMPLE_PROSPECT_FIRMS: ProspectFirmRow[] = [
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

const SAMPLE_ENRICHMENT_SIGNALS: EnrichmentSignalRow[] = [
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

const SAMPLE_INTERACTION_HISTORY: InteractionHistoryRow[] = [
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
