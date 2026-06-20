import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PageEntity } from './page.entity';
import { PageEventEntity } from './page-event.entity';
import { PageEventType } from './page-event.types';
import { FirmLookupService } from '../firms/firm-lookup.service';
import { AssetMatcherService } from '../assets/asset-matcher.service';
import { EnvConfig } from '../config/env.validation';
export declare class PageGenerationService {
    private readonly pageRepository;
    private readonly eventRepository;
    private readonly firmLookupService;
    private readonly assetMatcherService;
    private readonly configService;
    private readonly logger;
    constructor(pageRepository: Repository<PageEntity>, eventRepository: Repository<PageEventEntity>, firmLookupService: FirmLookupService, assetMatcherService: AssetMatcherService, configService: ConfigService<EnvConfig, true>);
    generatePageForFirm(firmQuery: string): Promise<PageEntity>;
    findBySlug(slug: string): Promise<PageEntity | null>;
    recordPageView(page: PageEntity): Promise<void>;
    recordEvent(pageId: string, eventType: PageEventType, assetId?: string, metadata?: Record<string, unknown>): Promise<PageEventEntity>;
    listPages(): Promise<PageEntity[]>;
    listEvents(): Promise<PageEventEntity[]>;
    getPublicUrl(slug: string): string;
    buildSlug(firmName: string): string;
    translateFirmError(error: unknown): never;
    private buildHeroCopy;
}
