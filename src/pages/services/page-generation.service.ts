import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { PageEntity } from '../entities/page.entity';
import { PageEventEntity } from '../entities/page-event.entity';
import { PageEventType } from '../types/page-event-type.enum';
import { FirmLookupService } from '../../firms/services/firm-lookup.service';
import { FirmNotFoundError } from '../../firms/types/firm-profile.types';
import { AssetMatcherService } from '../../assets/services/asset-matcher.service';
import { normalizeFirmName } from '../../data/normalize-firm-name';
import { EnvConfig } from '../../config/env.validation';

@Injectable()
export class PageGenerationService {
  private readonly logger = new Logger(PageGenerationService.name);

  constructor(
    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,
    @InjectRepository(PageEventEntity)
    private readonly eventRepository: Repository<PageEventEntity>,
    private readonly firmLookupService: FirmLookupService,
    private readonly assetMatcherService: AssetMatcherService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async generatePageForFirm(firmQuery: string): Promise<PageEntity> {
    const lookup = this.firmLookupService.findFirm(firmQuery);
    const { profile } = lookup;
    const matchResult = this.assetMatcherService.matchAssets(profile);

    const slug = this.buildSlug(profile.firmName);
    const existing = await this.pageRepository.findOne({ where: { slug } });
    if (existing) {
      return existing;
    }

    const heroCopy = this.buildHeroCopy(profile.firmName, profile.painPoints);
    const metaTitle = `${profile.firmName} + Eve | AI for Plaintiff Firms`;
    const metaDescription = `Personalized resources for ${profile.firmName} on intake, demand drafting, and case evaluation with Eve.`;

    const page = this.pageRepository.create({
      id: nanoid(),
      slug,
      firmName: profile.firmName,
      heroCopy,
      metaTitle,
      metaDescription,
      firmAttributes: {
        industry: profile.industry,
        practiceArea: profile.practiceArea,
        firmSize: profile.firmSize,
        intakeMethod: profile.intakeMethod,
        painPoints: profile.painPoints,
        caseManagementSystem: profile.caseManagementSystem,
        leadStatus: profile.leadStatus,
        enrichment: profile.enrichment,
        matchConfidence: lookup.matchConfidence,
      },
      selectedAssets: matchResult.selectedAssets,
      scoringExplanations: matchResult.explanations,
    });

    const saved = await this.pageRepository.save(page);
    this.logger.log(`Generated landing page for ${profile.firmName} at /p/${slug}`);
    return saved;
  }

  async findBySlug(slug: string): Promise<PageEntity | null> {
    return this.pageRepository.findOne({ where: { slug } });
  }

  async recordPageView(page: PageEntity): Promise<void> {
    await this.recordEvent(page.id, PageEventType.PAGE_VIEW);
  }

  async recordEvent(
    pageId: string,
    eventType: PageEventType,
    assetId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<PageEventEntity> {
    const page = await this.pageRepository.findOne({ where: { id: pageId } });
    if (!page) {
      throw new NotFoundException(`Page ${pageId} not found`);
    }

    const event = this.eventRepository.create({
      id: nanoid(),
      pageId,
      eventType,
      assetId,
      metadata,
    });

    return this.eventRepository.save(event);
  }

  async listPages(): Promise<PageEntity[]> {
    return this.pageRepository.find({ order: { createdAt: 'DESC' } });
  }

  async listEvents(): Promise<PageEventEntity[]> {
    return this.eventRepository.find({
      relations: ['page'],
      order: { createdAt: 'DESC' },
    });
  }

  getPublicUrl(slug: string): string {
    const baseUrl = this.configService.get('PUBLIC_BASE_URL', { infer: true });
    return `${baseUrl}/p/${slug}`;
  }

  buildSlug(firmName: string): string {
    const normalized = normalizeFirmName(firmName).replace(/\s+/g, '-');
    return normalized || 'landing-page';
  }

  translateFirmError(error: unknown): never {
    if (error instanceof FirmNotFoundError) {
      throw new NotFoundException(error.message);
    }
    throw error;
  }

  private buildHeroCopy(firmName: string, painPoints: string[]): string {
    const primaryPain = painPoints[0] ?? 'intake and case workflow efficiency';
    return `${firmName}, Eve helps plaintiff firms tackle ${primaryPain} with AI-powered intake, file review, and demand drafting — without replacing your existing stack.`;
  }

  // TODO: Support regenerating pages when source spreadsheets change without duplicating slugs.
  // TODO: Add optional A/B hero copy variants based on lead status.
}
