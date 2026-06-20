import { AssetMatchResult } from './asset.types';
import { FirmProfile } from '../firms/firm-profile.types';
export declare class AssetMatcherService {
    matchAssets(profile: FirmProfile): AssetMatchResult;
    private scoreAsset;
    private matchList;
    private matchKeywords;
}
