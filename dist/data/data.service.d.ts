import { OnModuleInit } from '@nestjs/common';
import { EnrichmentSignalRow, InteractionHistoryRow, ProspectFirmRow } from '../firms/types/firm-profile.types';
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
    private loadEnrichmentSignals;
    private loadInteractionHistory;
}
