import { MarketingAsset } from './marketing-asset.interface';
import { AssetScoreBreakdown } from './asset-score-breakdown.interface';

export interface AssetMatchResult {
  selectedAssets: MarketingAsset[];
  explanations: AssetScoreBreakdown[];
}
