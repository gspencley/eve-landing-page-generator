import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageEntity } from './entities/page.entity';
import { PageEventEntity } from './entities/page-event.entity';
import { PageGenerationService } from './services/page-generation.service';
import { LandingPageController } from './controllers/landing-page.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { FirmsModule } from '../firms/firms.module';
import { AssetsModule } from '../assets/assets.module';
import { LandingPageViewService } from './services/landing-page-view.service';

@Module({
  imports: [TypeOrmModule.forFeature([PageEntity, PageEventEntity]), FirmsModule, AssetsModule],
  controllers: [LandingPageController, AnalyticsController],
  providers: [PageGenerationService, LandingPageViewService],
  exports: [PageGenerationService],
})
export class PagesModule {}
