import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { FirmLookupService } from './services/firm-lookup.service';
import { FirmProfileBuilderService } from './services/firm-profile-builder.service';

@Module({
  imports: [DataModule],
  providers: [FirmProfileBuilderService, FirmLookupService],
  exports: [FirmLookupService],
})
export class FirmsModule {}
