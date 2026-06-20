import { PageGenerationService } from './page-generation.service';
import { PageEventType } from './page-event.types';
interface RecordEventDto {
    pageId: string;
    eventType: PageEventType;
    assetId?: string;
    metadata?: Record<string, unknown>;
}
export declare class AnalyticsController {
    private readonly pageGenerationService;
    constructor(pageGenerationService: PageGenerationService);
    recordEvent(body: RecordEventDto): Promise<{
        ok: boolean;
        eventId: string;
    }>;
    listPages(): Promise<{
        count: number;
        pages: {
            id: string;
            slug: string;
            firmName: string;
            url: string;
            createdAt: Date;
            assetCount: number;
        }[];
    }>;
    listEvents(): Promise<{
        count: number;
        events: {
            id: string;
            pageId: string;
            firmName: string | undefined;
            eventType: PageEventType;
            assetId: string | undefined;
            metadata: Record<string, unknown> | undefined;
            createdAt: Date;
        }[];
    }>;
}
export {};
