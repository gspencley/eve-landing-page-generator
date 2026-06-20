import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { FirmLookupService } from './services/firm-lookup.service';
import { FirmProfileBuilderService } from './services/firm-profile-builder.service';
import { FirmsController } from './controllers/firms.controller';

@Module({
  imports: [DataModule],
  providers: [FirmProfileBuilderService, FirmLookupService],
  exports: [FirmLookupService],
  controllers: [FirmsController],
})
export class FirmsModule {}
