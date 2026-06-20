import { Factory } from 'rosie';
import { SAMPLE_PROSPECT_FIRMS } from '../sample-prospect-firms.const';
import { mergeSampleProspects } from './merge-sample-prospects.function';
import { ProspectFirmRow } from '../../firms/types/prospect-firm-row.interface';

const ProspectFirmRowFactory = new Factory<ProspectFirmRow>()
  .attr('firm_name', 'Unique Prospect Firm')
  .attr('industry', 'Legal Services')
  .attr('practice_area', 'Personal Injury')
  .attr('firm_size', 'Mid-Market')
  .attr('intake_method', 'Phone + Web Form')
  .attr('pain_points', 'Intake overflow')
  .attr('case_management_system', 'Litify')
  .attr('lead_status', 'Warm');

describe('mergeSampleProspects', () => {
  it('should return sample prospect firms when given an empty list', () => {
    const result = mergeSampleProspects([]);

    expect(result).toEqual(SAMPLE_PROSPECT_FIRMS);
  });

  it('should append sample firms that are not already present', () => {
    const existing = ProspectFirmRowFactory.build();

    const result = mergeSampleProspects([existing]);

    expect(result.slice(0, 1)).toEqual([existing]);
    expect(result).toHaveLength(SAMPLE_PROSPECT_FIRMS.length + 1);
    expect(result).toEqual(expect.arrayContaining(SAMPLE_PROSPECT_FIRMS));
  });

  it('should not append sample firms whose names match existing firms after normalization', () => {
    const existing = ProspectFirmRowFactory.build({ firm_name: 'cellino law' });

    const result = mergeSampleProspects([existing]);

    expect(result[0]).toEqual(existing);
    expect(result).toHaveLength(SAMPLE_PROSPECT_FIRMS.length);
  });

  it('should preserve existing firms before appended sample firms', () => {
    const first = ProspectFirmRowFactory.build({ firm_name: 'Alpha Firm' });
    const second = ProspectFirmRowFactory.build({ firm_name: 'Beta Firm' });

    const result = mergeSampleProspects([first, second]);

    expect(result[0]).toEqual(first);
    expect(result[1]).toEqual(second);
  });
});
