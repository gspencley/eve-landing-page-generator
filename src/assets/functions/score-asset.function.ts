import { MarketingAsset } from '../types/marketing-asset.interface';
import { FirmProfile } from '../../firms/types/firm-profile.interface';
import { AssetScoreBreakdown } from '../types/asset-score-breakdown.interface';
import { matchList } from './match-list.function';
import { matchKeywords } from './match-keywords.function';
import { PREVIOUSLY_SENT_PENALTY } from '../types/previously-sent-penalty.const';
import { BOUNCED_FIRM_PENALTY } from '../types/bounced-firm-penalty.const';

export function scoreAsset(asset: MarketingAsset, profile: FirmProfile): AssetScoreBreakdown {
  let totalScore = asset.baseWeight;
  const reasons: string[] = [`Base relevance weight: ${asset.baseWeight}`];
  const penalties: string[] = [];

  totalScore += matchList(asset.targetIndustries, [profile.industry], 'industry', reasons, 4);
  totalScore += matchList(
    asset.targetPracticeAreas,
    [profile.practiceArea],
    'practice area',
    reasons,
    6,
  );
  totalScore += matchList(asset.targetFirmSizes, [profile.firmSize], 'firm size', reasons, 3);
  totalScore += matchList(
    asset.targetIntakeMethods,
    [profile.intakeMethod],
    'intake method',
    reasons,
    4,
  );
  totalScore += matchList(
    asset.targetCaseManagementSystems,
    [profile.caseManagementSystem],
    'case management system',
    reasons,
    5,
  );
  totalScore += matchList(
    asset.targetLeadStatuses,
    [profile.leadStatus],
    'lead status',
    reasons,
    3,
  );

  for (const painPoint of profile.painPoints) {
    totalScore += matchKeywords(asset.targetPainPoints, painPoint, 'pain point', reasons, 5);
  }

  if (profile.enrichment) {
    const enrichmentBlob = Object.values(profile.enrichment).join(' ').toLowerCase();
    totalScore += matchKeywords(
      asset.targetEnrichmentSignals,
      enrichmentBlob,
      'enrichment signal',
      reasons,
      4,
    );

    if (
      profile.enrichment.competitor_mentioned &&
      asset.tags.some((tag) => tag.includes('competitor'))
    ) {
      totalScore += 6;
      reasons.push(
        `Competitor signal (${profile.enrichment.competitor_mentioned}) aligns with competitive asset`,
      );
    }
  }

  if (profile.previouslySentAssetIds.includes(asset.id)) {
    totalScore -= PREVIOUSLY_SENT_PENALTY;
    penalties.push(
      `Previously sent in outreach (-${PREVIOUSLY_SENT_PENALTY}); fresh asset preferred`,
    );
  }

  if (profile.bouncedInteractionCount >= 2) {
    totalScore -= BOUNCED_FIRM_PENALTY;
    penalties.push(
      `Firm has ${profile.bouncedInteractionCount} bounced interactions (-${BOUNCED_FIRM_PENALTY}); softer top-of-funnel asset bias`,
    );
  }

  return {
    assetId: asset.id,
    assetTitle: asset.title,
    totalScore: Math.max(totalScore, 0),
    reasons,
    penalties,
  };
}
