import { Factory } from 'rosie';
import { FirmProfile } from '../../firms/types/firm-profile.interface';
import { EnrichmentSignalRow } from '../../firms/types/enrichment-signal-row.interface';
import { MAX_SELECTED_ASSETS } from '../types/max-selected-assets.const';
import { matchAssets } from './match-assets.function';

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
  .attr('painPoints', ['intake overflow', 'demand drafting'])
  .attr('caseManagementSystem', 'Litify')
  .attr('leadStatus', 'Engaged')
  .attr('enrichment', () => EnrichmentSignalRowFactory.build())
  .attr('interactions', [])
  .attr('previouslySentAssetIds', [])
  .attr('bouncedInteractionCount', 0);

describe('matchAssets', () => {
  it('should return at most the configured number of selected assets', () => {
    const profile = FirmProfileFactory.build();

    const result = matchAssets(profile);

    expect(result.selectedAssets.length).toBeLessThanOrEqual(MAX_SELECTED_ASSETS);
  });

  it('should return score explanations for the top six assets', () => {
    const profile = FirmProfileFactory.build();

    const result = matchAssets(profile);

    expect(result.explanations.length).toBeLessThanOrEqual(6);
    expect(result.explanations[0].totalScore).toBeGreaterThanOrEqual(
      result.explanations[result.explanations.length - 1].totalScore,
    );
  });

  it('should select assets with the highest scores for the firm profile', () => {
    const profile = FirmProfileFactory.build({
      caseManagementSystem: 'Litify',
      painPoints: ['litify', 'integration'],
    });

    const result = matchAssets(profile);

    expect(result.selectedAssets.map((asset) => asset.id)).toContain('EVE-DV-004');
    expect(result.selectedAssets[0].id).toBe(result.explanations[0].assetId);
  });

  it('should exclude assets whose total score is zero from selection', () => {
    const profile = FirmProfileFactory.build();
    const result = matchAssets(profile);
    const scoresById = new Map(
      result.explanations.map((entry) => [entry.assetId, entry.totalScore]),
    );

    for (const asset of result.selectedAssets) {
      expect(scoresById.get(asset.id)).toBeGreaterThan(0);
    }
  });

  it('should map selected asset ids back to library assets', () => {
    const profile = FirmProfileFactory.build();

    const result = matchAssets(profile);

    for (const asset of result.selectedAssets) {
      expect(asset.id).toBeTruthy();
      expect(asset.title).toBeTruthy();
      expect(asset.url).toMatch(/^https:\/\//);
    }
  });
});
