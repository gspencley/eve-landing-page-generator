import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { EnvConfig } from '../config/env.validation';

@Injectable()
export class SlackSignatureService {
  constructor(private readonly configService: ConfigService<EnvConfig, true>) {}

  verify(rawBody: Buffer, timestamp: string | undefined, signature: string | undefined): void {
    const signingSecret = this.configService.get('SLACK_SIGNING_SECRET', { infer: true });

    if (!signingSecret) {
      if (this.configService.get('NODE_ENV', { infer: true }) === 'development') {
        return;
      }
      throw new UnauthorizedException('Slack signing secret is not configured');
    }

    if (!timestamp || !signature) {
      throw new UnauthorizedException('Missing Slack signature headers');
    }

    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (Number(timestamp) < fiveMinutesAgo) {
      throw new UnauthorizedException('Slack request timestamp is too old');
    }

    const basestring = `v0:${timestamp}:${rawBody.toString('utf8')}`;
    const digest = `v0=${createHmac('sha256', signingSecret).update(basestring).digest('hex')}`;

    const expected = Buffer.from(digest, 'utf8');
    const received = Buffer.from(signature, 'utf8');

    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      throw new UnauthorizedException('Invalid Slack request signature');
    }
  }
}
