import { Injectable, Logger } from '@nestjs/common';
import { FirmNotFoundError } from '../../firms/types/firm-not-found.error';
import { PageGenerationService } from '../../pages/services/page-generation.service';
import { SlackImmediateResponse } from '../types/slack-immediate-response.interface';
import * as util from 'node:util';

@Injectable()
export class SlackResponseBuilderService {
  private readonly logger = new Logger(SlackResponseBuilderService.name);

  constructor(private readonly pageGenerationService: PageGenerationService) {}

  buildImmediateAck(message: string): SlackImmediateResponse {
    return {
      response_type: 'ephemeral',
      text: message,
    };
  }

  buildSuccessMessage(firmName: string, url: string): SlackImmediateResponse {
    return {
      response_type: 'in_channel',
      text: `Landing page ready for *${firmName}*: ${url}`,
    };
  }

  buildErrorMessage(message: string): SlackImmediateResponse {
    return {
      response_type: 'ephemeral',
      text: message,
    };
  }

  async generateAndRespond(firmQuery: string, responseUrl: string): Promise<void> {
    try {
      const page = await this.pageGenerationService.generatePageForFirm(firmQuery);
      const url = this.pageGenerationService.getPublicUrl(page.slug);
      await this.postToResponseUrl(responseUrl, this.buildSuccessMessage(page.firmName, url));
    } catch (error) {
      const message =
        error instanceof FirmNotFoundError
          ? error.message
          : `Failed to generate page for "${firmQuery}". Please try again.`;

      await this.postToResponseUrl(responseUrl, this.buildErrorMessage(message));
    }
  }

  async generateSync(firmQuery: string) {
    try {
      const page = await this.pageGenerationService.generatePageForFirm(firmQuery);
      util.inspect(page);

      const url = this.pageGenerationService.getPublicUrl(page.slug);
      console.log('url', url);

      return this.buildSuccessMessage(page.firmName, url);
    } catch (error) {
      if (error instanceof FirmNotFoundError) {
        return this.buildErrorMessage(error.message);
      }
      throw error;
    }
  }

  async postToResponseUrl(responseUrl: string, payload: SlackImmediateResponse): Promise<void> {
    try {
      const response = await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.warn(`Slack response_url POST failed: ${response.status}`);
      }
    } catch (error) {
      this.logger.error('Failed to post follow-up to Slack response_url', error);
    }
  }
}
