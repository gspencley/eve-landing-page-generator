import { PageEventType } from './page-event-type.enum';

export interface RecordEventDto {
  pageId: string;
  eventType: PageEventType;
  assetId?: string;
  metadata?: Record<string, unknown>;
}
