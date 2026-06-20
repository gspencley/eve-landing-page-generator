import { AssetType } from './asset-type.enum';
import { AssetTag } from './asset-tag.enum';

export interface MarketingAsset {
  id: string;
  title: string;
  type: AssetType;
  description: string;
  ctaLabel: string;
  url: string;
  tags: AssetTag[];
  targetIndustries: string[];
  targetPracticeAreas: string[];
  targetFirmSizes: string[];
  targetIntakeMethods: string[];
  targetPainPoints: string[];
  targetCaseManagementSystems: string[];
  targetLeadStatuses: string[];
  targetEnrichmentSignals: string[];
  baseWeight: number;
}
