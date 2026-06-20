import { Factory } from 'rosie';
import { normalizeProspectRow } from './normalize-prospect-row.function';
import { ProspectFirmRow } from '../../firms/types/prospect-firm-row.interface';

const ProspectFirmRowFactory = new Factory<ProspectFirmRow>()
  .attr('firm_name', 'Cellino Law')
  .attr('industry', 'Legal Services')
  .attr('practice_area', 'Personal Injury')
  .attr('firm_size', 'Mid-Market')
  .attr('intake_method', 'Phone + Web Form')
  .attr('pain_points', 'Intake overflow')
  .attr('case_management_system', 'Clio')
  .attr('lead_status', 'Engaged');

describe('normalizeProspectRow', () => {
  it('should trim whitespace from the firm name', () => {
    const row = ProspectFirmRowFactory.build({ firm_name: '  Davis Law Group  ' });

    const result = normalizeProspectRow(row);

    expect(result.firm_name).toBe('Davis Law Group');
  });

  it('should return an empty firm name when the firm name contains only whitespace', () => {
    const row = ProspectFirmRowFactory.build({ firm_name: '   ' });

    const result = normalizeProspectRow(row);

    expect(result.firm_name).toBe('');
  });

  it('should preserve non-name field values from the input row', () => {
    const row = ProspectFirmRowFactory.build({
      firm_name: 'Hershey Law',
      practice_area: 'Employment Law',
      firm_size: 'Small',
      intake_method: 'Referrals',
      pain_points: 'Case evaluation speed',
      case_management_system: 'Custom CMS',
      lead_status: 'Nurture',
    });

    const result = normalizeProspectRow(row);

    expect(result).toEqual(row);
  });
});
