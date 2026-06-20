export interface ProspectFirmRow {
    firm_name: string;
    industry: string;
    practice_area: string;
    firm_size: string;
    intake_method: string;
    pain_points: string;
    case_management_system: string;
    lead_status: string;
}
export interface EnrichmentSignalRow {
    firm_name: string;
    tech_stack: string;
    competitor_mentioned: string;
    recent_news: string;
    job_postings: string;
    website_monthly_visits: string;
    linkedin_followers: string;
    nps_from_call_notes: string;
    last_funding_or_growth_signal: string;
}
export interface InteractionHistoryRow {
    interaction_id: string;
    firm_name: string;
    rep_name: string;
    channel: string;
    subject: string;
    event_type: string;
    event_date: string;
    sequence_step: string;
    template_id: string;
    asset_sent: string;
}
export interface FirmProfile {
    firmName: string;
    industry: string;
    practiceArea: string;
    firmSize: string;
    intakeMethod: string;
    painPoints: string[];
    caseManagementSystem: string;
    leadStatus: string;
    enrichment: EnrichmentSignalRow | null;
    interactions: InteractionHistoryRow[];
    previouslySentAssetIds: string[];
    bouncedInteractionCount: number;
}
export interface FirmLookupResult {
    profile: FirmProfile;
    matchedName: string;
    matchConfidence: 'exact' | 'fuzzy';
}
export declare class FirmNotFoundError extends Error {
    readonly query: string;
    readonly suggestions: string[];
    constructor(query: string, suggestions?: string[]);
}
