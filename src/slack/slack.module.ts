import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackSignatureService } from './slack-signature.service';
import { SlackResponseService } from './slack-response.service';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [PagesModule],
  controllers: [SlackController],
  providers: [SlackSignatureService, SlackResponseService],
})
export class SlackModule {}
