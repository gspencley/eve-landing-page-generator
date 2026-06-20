import { FirmProfile } from '../../firms/types/firm-profile.interface';
import { AssetMatchResult } from '../types/asset-match-result.interface';
import { ASSET_LIBRARY } from '../asset-library';
import { MAX_SELECTED_ASSETS } from '../types/max-selected-assets.const';
import { scoreAsset } from './score-asset.function';

export function matchAssets(profile: FirmProfile): AssetMatchResult {
  const scored = ASSET_LIBRARY.map((asset) => scoreAsset(asset, profile)).sort(
    (a, b) => b.totalScore - a.totalScore,
  );

  const selectedAssets = scored
    .filter((entry) => entry.totalScore > 0)
    .slice(0, MAX_SELECTED_ASSETS)
    .map((entry) => ASSET_LIBRARY.find((asset) => asset.id === entry.assetId)!)
    .filter(Boolean);

  return {
    selectedAssets,
    explanations: scored.slice(0, 6),
  };
}
