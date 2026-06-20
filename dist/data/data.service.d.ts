import { OnModuleInit } from '@nestjs/common';
import { ProspectFirmRow } from '../firms/types/firm-profile.types';
import { EnrichmentSignalRow, InteractionHistoryRow } from '../firms/types/firm-profile.types';
export declare class DataService implements OnModuleInit {
    private readonly logger;
    private prospectFirms;
    private enrichmentSignals;
    private interactionHistory;
    onModuleInit(): void;
    reload(): void;
    getProspectFirms(): ProspectFirmRow[];
    getEnrichmentSignals(): EnrichmentSignalRow[];
    getInteractionHistory(): InteractionHistoryRow[];
    private loadAll;
    private loadProspectFirms;
    private mergeSampleProspects;
    private inferProspectFromEnrichment;
    private loadEnrichmentSignals;
    private loadInteractionHistory;
    private normalizeProspectRow;
}
