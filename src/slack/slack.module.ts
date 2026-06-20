import { Module } from '@nestjs/common';
import { SlackController } from './controllers/slack.controller';
import { SlackSignatureService } from './services/slack-signature.service';
import { SlackResponseService } from './services/slack-response.service';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [PagesModule],
  controllers: [SlackController],
  providers: [SlackSignatureService, SlackResponseService],
})
export class SlackModule {}
