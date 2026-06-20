import { Module } from '@nestjs/common';
import { SlackController } from './controllers/slack.controller';
import { SlackSignatureVerificationService } from './services/slack-signature-verification.service';
import { SlackResponseBuilderService } from './services/slack-response-builder.service';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [PagesModule],
  controllers: [SlackController],
  providers: [SlackSignatureVerificationService, SlackResponseBuilderService],
})
export class SlackModule {}
