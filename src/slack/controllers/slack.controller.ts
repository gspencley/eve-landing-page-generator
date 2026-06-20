import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { SlackSignatureVerificationService } from '../services/slack-signature-verification.service';
import { SlackResponseBuilderService } from '../services/slack-response-builder.service';
import { RawBodyRequest } from '../../types/raw-body-request.interface';
import { SlackSlashCommandPayload } from '../types/slack-slash-command-payload.interface';

@Controller('slack')
export class SlackController {
  constructor(
    private readonly slackSignatureService: SlackSignatureVerificationService,
    private readonly slackResponseService: SlackResponseBuilderService,
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
      void this.slackResponseService.generateAndRespond(firmQuery, responseUrl);
      return this.slackResponseService.buildImmediateAck(
        `Generating a personalized landing page for *${firmQuery}*…`,
      );
    }

    return this.slackResponseService.generateSync(firmQuery);
  }

  // TODO: Handle Slack retries idempotently using trigger_id / dedupe keys.
  // TODO: Add slash command help text when text is "help".
}
