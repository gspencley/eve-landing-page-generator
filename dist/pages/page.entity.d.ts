import { PageEventEntity } from './page-event.entity';
import { AssetScoreBreakdown } from '../assets/asset.types';
import { MarketingAsset } from '../assets/asset.types';
export declare class PageEntity {
    id: string;
    slug: string;
    firmName: string;
    heroCopy: string;
    metaTitle: string;
    metaDescription: string;
    firmAttributes: Record<string, unknown>;
    selectedAssets: MarketingAsset[];
    scoringExplanations: AssetScoreBreakdown[];
    createdAt: Date;
    events?: PageEventEntity[];
}
