import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SlackSignatureService } from '../services/slack-signature.service';
import { SlackResponseService } from '../services/slack-response.service';
import { PageGenerationService } from '../../pages/services/page-generation.service';
import { FirmNotFoundError } from '../../firms/types/firm-not-found.error';

interface SlackSlashCommandPayload {
  command?: string;
  text?: string;
  response_url?: string;
  user_name?: string;
}

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

@Controller('slack')
export class SlackController {
  constructor(
    private readonly slackSignatureService: SlackSignatureService,
    private readonly slackResponseService: SlackResponseService,
    private readonly pageGenerationService: PageGenerationService,
  ) {}

  @Post('commands')
  @HttpCode(200)
  async handleSlashCommand(
    @Req() req: RawBodyRequest,
    @Body() body: SlackSlashCommandPayload,
    @Headers('x-slack-request-timestamp') timestamp: string,
    @Headers('x-slack-signature') signature: string,
  ) {
    const rawBody =
      req.rawBody ?? Buffer.from(new URLSearchParams(body as Record<string, string>).toString());

    this.slackSignatureService.verify(rawBody, timestamp, signature);

    const firmQuery = (body.text ?? '').trim();
    if (!firmQuery) {
      throw new BadRequestException(
        'Usage: /generate-page <Firm Name> — e.g. `/generate-page Cellino Law`',
      );
    }

    const responseUrl = body.response_url;

    if (responseUrl) {
      void this.generateAndRespond(firmQuery, responseUrl);
      return this.slackResponseService.buildImmediateAck(
        `Generating a personalized landing page for *${firmQuery}*…`,
      );
    }

    return this.generateSync(firmQuery);
  }

  private async generateAndRespond(firmQuery: string, responseUrl: string): Promise<void> {
    try {
      const page = await this.pageGenerationService.generatePageForFirm(firmQuery);
      const url = this.pageGenerationService.getPublicUrl(page.slug);
      await this.slackResponseService.postToResponseUrl(
        responseUrl,
        this.slackResponseService.buildSuccessMessage(page.firmName, url),
      );
    } catch (error) {
      const message =
        error instanceof FirmNotFoundError
          ? error.message
          : `Failed to generate page for "${firmQuery}". Please try again.`;

      await this.slackResponseService.postToResponseUrl(
        responseUrl,
        this.slackResponseService.buildErrorMessage(message),
      );
    }
  }

  private async generateSync(firmQuery: string) {
    try {
      const page = await this.pageGenerationService.generatePageForFirm(firmQuery);
      const url = this.pageGenerationService.getPublicUrl(page.slug);
      return this.slackResponseService.buildSuccessMessage(page.firmName, url);
    } catch (error) {
      if (error instanceof FirmNotFoundError) {
        return this.slackResponseService.buildErrorMessage(error.message);
      }
      throw error;
    }
  }

  // TODO: Handle Slack retries idempotently using trigger_id / dedupe keys.
  // TODO: Add slash command help text when text is "help".
}
