import { OnModuleInit } from '@nestjs/common';
import { ProspectFirmRow } from '../firms/types/prospect-firm-row.interface';
import { EnrichmentSignalRow } from '../firms/types/enrichment-signal-row.interface';
import { InteractionHistoryRow } from '../firms/types/interaction-history-row.interface';
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
