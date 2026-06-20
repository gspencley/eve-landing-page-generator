import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { PageGenerationService } from '../services/page-generation.service';
import { PageEventType } from '../types/page-event-type.enum';

interface RecordEventDto {
  pageId: string;
  eventType: PageEventType;
  assetId?: string;
  metadata?: Record<string, unknown>;
}

@Controller()
export class AnalyticsController {
  constructor(private readonly pageGenerationService: PageGenerationService) {}

  @Post('events')
  async recordEvent(@Body() body: RecordEventDto) {
    if (!body.pageId || !body.eventType) {
      throw new BadRequestException('pageId and eventType are required');
    }

    if (!Object.values(PageEventType).includes(body.eventType)) {
      throw new BadRequestException(`Invalid eventType: ${body.eventType}`);
    }

    try {
      const event = await this.pageGenerationService.recordEvent(
        body.pageId,
        body.eventType,
        body.assetId,
        body.metadata,
      );

      return { ok: true, eventId: event.id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get('admin/pages')
  async listPages() {
    const pages = await this.pageGenerationService.listPages();
    return {
      count: pages.length,
      pages: pages.map((page) => ({
        id: page.id,
        slug: page.slug,
        firmName: page.firmName,
        url: this.pageGenerationService.getPublicUrl(page.slug),
        createdAt: page.createdAt,
        assetCount: page.selectedAssets.length,
      })),
    };
  }

  @Get('admin/events')
  async listEvents() {
    const events = await this.pageGenerationService.listEvents();
    return {
      count: events.length,
      events: events.map((event) => ({
        id: event.id,
        pageId: event.pageId,
        firmName: event.page?.firmName,
        eventType: event.eventType,
        assetId: event.assetId,
        metadata: event.metadata,
        createdAt: event.createdAt,
      })),
    };
  }
}
