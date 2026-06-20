export enum AssetType {
  CASE_STUDY = 'case_study',
  ONE_PAGER = 'one_pager',
  WEBINAR = 'webinar',
  ROI_CALCULATOR = 'roi_calculator',
  DEMO_VIDEO = 'demo_video',
  WHITEPAPER = 'whitepaper',
}

export enum AssetTag {
  INTAKE = 'intake',
  DEMAND_DRAFTING = 'demand_drafting',
  FILE_REVIEW = 'file_review',
  AFTER_HOURS = 'after_hours',
  CASE_EVALUATION = 'case_evaluation',
  MASS_TORT = 'mass_tort',
  WORKERS_COMP = 'workers_comp',
  NURSING_HOME = 'nursing_home',
  MED_MAL = 'med_mal',
  TRUCKING = 'trucking',
  LITIFY = 'litify',
  CLIO = 'clio',
  FILEVINE = 'filevine',
  GROWTH = 'growth',
  COMPETITOR_DISPLACEMENT = 'competitor_displacement',
}

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

export interface AssetScoreBreakdown {
  assetId: string;
  assetTitle: string;
  totalScore: number;
  reasons: string[];
  penalties: string[];
}

export interface AssetMatchResult {
  selectedAssets: MarketingAsset[];
  explanations: AssetScoreBreakdown[];
}
