import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { FirmLookupService } from './firm-lookup.service';

@Module({
  imports: [DataModule],
  providers: [FirmLookupService],
  exports: [FirmLookupService],
})
export class FirmsModule {}
