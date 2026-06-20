import { Factory } from 'rosie';
import { AssetTag } from '../types/asset-tag.enum';
import { AssetType } from '../types/asset-type.enum';
import { MarketingAsset } from '../types/marketing-asset.interface';
import { FirmProfile } from '../../firms/types/firm-profile.interface';
import { EnrichmentSignalRow } from '../../firms/types/enrichment-signal-row.interface';
import { PREVIOUSLY_SENT_PENALTY } from '../types/previously-sent-penalty.const';
import { BOUNCED_FIRM_PENALTY } from '../types/bounced-firm-penalty.const';
import { scoreAsset } from './score-asset.function';

const MarketingAssetFactory = new Factory<MarketingAsset>()
  .attr('id', 'EVE-TEST-001')
  .attr('title', 'Test Asset')
  .attr('type', AssetType.ONE_PAGER)
  .attr('description', 'Test asset description')
  .attr('ctaLabel', 'Download')
  .attr('url', 'https://example.eve.legal/assets/test')
  .attr('tags', [AssetTag.INTAKE])
  .attr('targetIndustries', ['Legal Services'])
  .attr('targetPracticeAreas', ['Personal Injury'])
  .attr('targetFirmSizes', ['Mid-Market'])
  .attr('targetIntakeMethods', ['Phone + Web Form'])
  .attr('targetPainPoints', ['intake overflow'])
  .attr('targetCaseManagementSystems', ['Litify'])
  .attr('targetLeadStatuses', ['Engaged'])
  .attr('targetEnrichmentSignals', ['growth'])
  .attr('baseWeight', 10);

const EnrichmentSignalRowFactory = new Factory<EnrichmentSignalRow>()
  .attr('firm_name', 'Cellino Law')
  .attr('tech_stack', 'Litify, Zoom, Microsoft 365')
  .attr('competitor_mentioned', '')
  .attr('recent_news', 'Opened second office')
  .attr('job_postings', 'No current openings')
  .attr('website_monthly_visits', '10000')
  .attr('linkedin_followers', '1000')
  .attr('nps_from_call_notes', '5')
  .attr('last_funding_or_growth_signal', 'growth signal');

const FirmProfileFactory = new Factory<FirmProfile>()
  .attr('firmName', 'Cellino Law')
  .attr('industry', 'Legal Services')
  .attr('practiceArea', 'Personal Injury')
  .attr('firmSize', 'Mid-Market')
  .attr('intakeMethod', 'Phone + Web Form')
  .attr('painPoints', ['intake overflow'])
  .attr('caseManagementSystem', 'Litify')
  .attr('leadStatus', 'Engaged')
  .attr('enrichment', null)
  .attr('interactions', [])
  .attr('previouslySentAssetIds', [])
  .attr('bouncedInteractionCount', 0);

describe('scoreAsset', () => {
  it('should include base weight in total score and reasons', () => {
    const asset = MarketingAssetFactory.build({
      targetIndustries: [],
      targetPracticeAreas: [],
      targetFirmSizes: [],
      targetIntakeMethods: [],
      targetCaseManagementSystems: [],
      targetLeadStatuses: [],
      targetPainPoints: [],
      targetEnrichmentSignals: [],
      baseWeight: 10,
    });
    const profile = FirmProfileFactory.build({ painPoints: [] });

    const result = scoreAsset(asset, profile);

    expect(result.totalScore).toBe(10);
    expect(result.reasons).toContain('Base relevance weight: 10');
  });

  it('should add list match points for matching firm attributes', () => {
    const asset = MarketingAssetFactory.build({
      targetEnrichmentSignals: [],
      targetPainPoints: [],
    });
    const profile = FirmProfileFactory.build({ painPoints: [], enrichment: null });

    const result = scoreAsset(asset, profile);

    expect(result.totalScore).toBeGreaterThan(asset.baseWeight);
    expect(result.reasons).toEqual(
      expect.arrayContaining([
        'Matched industry: Legal Services (+4)',
        'Matched practice area: Personal Injury (+6)',
        'Matched case management system: Litify (+5)',
      ]),
    );
  });

  it('should add keyword match points for matching pain points', () => {
    const asset = MarketingAssetFactory.build({
      targetIndustries: [],
      targetPracticeAreas: [],
      targetFirmSizes: [],
      targetIntakeMethods: [],
      targetCaseManagementSystems: [],
      targetLeadStatuses: [],
      targetEnrichmentSignals: [],
    });
    const profile = FirmProfileFactory.build({
      painPoints: ['intake overflow'],
      enrichment: null,
    });

    const result = scoreAsset(asset, profile);

    expect(result.reasons).toContain('Matched pain point keyword "intake overflow" (+5)');
  });

  it('should apply previously sent penalty when asset was already sent', () => {
    const asset = MarketingAssetFactory.build({
      id: 'EVE-TEST-001',
      targetIndustries: [],
      targetPracticeAreas: [],
      targetFirmSizes: [],
      targetIntakeMethods: [],
      targetCaseManagementSystems: [],
      targetLeadStatuses: [],
      targetPainPoints: [],
      targetEnrichmentSignals: [],
      baseWeight: 10,
    });
    const profile = FirmProfileFactory.build({
      painPoints: [],
      enrichment: null,
      previouslySentAssetIds: ['EVE-TEST-001'],
    });

    const result = scoreAsset(asset, profile);

    expect(result.totalScore).toBe(0);
    expect(result.penalties).toContain(
      `Previously sent in outreach (-${PREVIOUSLY_SENT_PENALTY}); fresh asset preferred`,
    );
  });

  it('should apply bounced interaction penalty when firm has at least two bounces', () => {
    const asset = MarketingAssetFactory.build({
      targetIndustries: [],
      targetPracticeAreas: [],
      targetFirmSizes: [],
      targetIntakeMethods: [],
      targetCaseManagementSystems: [],
      targetLeadStatuses: [],
      targetPainPoints: [],
      targetEnrichmentSignals: [],
      baseWeight: 10,
    });
    const profile = FirmProfileFactory.build({
      painPoints: [],
      enrichment: null,
      bouncedInteractionCount: 2,
    });

    const result = scoreAsset(asset, profile);

    expect(result.totalScore).toBe(10 - BOUNCED_FIRM_PENALTY);
    expect(result.penalties).toContain(
      `Firm has 2 bounced interactions (-${BOUNCED_FIRM_PENALTY}); softer top-of-funnel asset bias`,
    );
  });

  it('should not reduce total score below zero', () => {
    const asset = MarketingAssetFactory.build({
      id: 'EVE-TEST-001',
      targetIndustries: [],
      targetPracticeAreas: [],
      targetFirmSizes: [],
      targetIntakeMethods: [],
      targetCaseManagementSystems: [],
      targetLeadStatuses: [],
      targetPainPoints: [],
      targetEnrichmentSignals: [],
      baseWeight: 5,
    });
    const profile = FirmProfileFactory.build({
      painPoints: [],
      enrichment: null,
      previouslySentAssetIds: ['EVE-TEST-001'],
      bouncedInteractionCount: 3,
    });

    const result = scoreAsset(asset, profile);

    expect(result.totalScore).toBe(0);
  });

  it('should add competitor bonus when enrichment mentions a competitor and asset targets displacement', () => {
    const asset = MarketingAssetFactory.build({
      tags: [AssetTag.COMPETITOR_DISPLACEMENT],
      targetIndustries: [],
      targetPracticeAreas: [],
      targetFirmSizes: [],
      targetIntakeMethods: [],
      targetCaseManagementSystems: [],
      targetLeadStatuses: [],
      targetPainPoints: [],
      targetEnrichmentSignals: [],
      baseWeight: 10,
    });
    const profile = FirmProfileFactory.build({
      painPoints: [],
      enrichment: EnrichmentSignalRowFactory.build({ competitor_mentioned: 'Supio' }),
    });

    const result = scoreAsset(asset, profile);

    expect(result.reasons).toContain('Competitor signal (Supio) aligns with competitive asset');
    expect(result.totalScore).toBeGreaterThanOrEqual(16);
  });
});
