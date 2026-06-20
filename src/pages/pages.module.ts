import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageEntity } from './page.entity';
import { PageEventEntity } from './page-event.entity';
import { PageGenerationService } from './page-generation.service';
import { LandingPageController } from './landing-page.controller';
import { AnalyticsController } from './analytics.controller';
import { FirmsModule } from '../firms/firms.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [TypeOrmModule.forFeature([PageEntity, PageEventEntity]), FirmsModule, AssetsModule],
  controllers: [LandingPageController, AnalyticsController],
  providers: [PageGenerationService],
  exports: [PageGenerationService],
})
export class PagesModule {}
