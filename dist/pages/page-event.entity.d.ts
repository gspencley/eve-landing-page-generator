import { PageEntity } from './page.entity';
import { PageEventType } from './page-event.types';
export declare class PageEventEntity {
    id: string;
    pageId: string;
    page?: PageEntity;
    eventType: PageEventType;
    assetId?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
