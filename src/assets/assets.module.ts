import { Module } from '@nestjs/common';
import { AssetMatcherService } from './services/asset-matcher.service';

@Module({
  providers: [AssetMatcherService],
  exports: [AssetMatcherService],
})
export class AssetsModule {}
