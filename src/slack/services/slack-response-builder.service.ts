import { Injectable, Logger } from '@nestjs/common';

export interface SlackImmediateResponse {
  response_type: 'ephemeral' | 'in_channel';
  text: string;
}

@Injectable()
export class SlackResponseBuilderService {
  private readonly logger = new Logger(SlackResponseBuilderService.name);

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
