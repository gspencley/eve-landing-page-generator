import { Module } from '@nestjs/common';
import { DataService } from './services/data.service';

@Module({
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
