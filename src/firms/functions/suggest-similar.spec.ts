import { Factory } from 'rosie';
import { ProspectFirmRow } from '../types/prospect-firm-row.interface';
import { suggestSimilar } from './suggest-similar.function';

const ProspectFirmRowFactory = new Factory<ProspectFirmRow>()
  .attr('firm_name', 'Cellino Law')
  .attr('industry', 'Legal Services')
  .attr('practice_area', 'Personal Injury')
  .attr('firm_size', 'Mid-Market')
  .attr('intake_method', 'Phone + Web Form')
  .attr('pain_points', 'Intake overflow')
  .attr('case_management_system', 'Clio')
  .attr('lead_status', 'Engaged');

describe('suggestSimilar', () => {
  it('should return an empty array when no prospects share tokens with the query', () => {
    const prospects = [
      ProspectFirmRowFactory.build({ firm_name: 'Cellino Law' }),
      ProspectFirmRowFactory.build({ firm_name: 'Davis Law Group' }),
    ];

    const result = suggestSimilar('ZZZZZZ', prospects);

    expect(result).toEqual([]);
  });

  it('should return an empty array when the prospect list is empty', () => {
    const result = suggestSimilar('Cellino Law', []);

    expect(result).toEqual([]);
  });

  it('should return firm names that share tokens with the query', () => {
    const prospects = [
      ProspectFirmRowFactory.build({ firm_name: 'Davis Law Group' }),
      ProspectFirmRowFactory.build({ firm_name: 'Cellino Law' }),
      ProspectFirmRowFactory.build({ firm_name: 'Unrelated Firm' }),
    ];

    const result = suggestSimilar('Davis Law', prospects);

    expect(result).toEqual(['Davis Law Group', 'Cellino Law']);
  });

  it('should sort suggestions by token overlap score descending', () => {
    const prospects = [
      ProspectFirmRowFactory.build({ firm_name: 'Cellino Law' }),
      ProspectFirmRowFactory.build({ firm_name: 'Law Offices of James Scott Farrin' }),
      ProspectFirmRowFactory.build({ firm_name: 'Davis Law Group' }),
    ];

    const result = suggestSimilar('farrin law', prospects);

    expect(result).toEqual(['Law Offices of James Scott Farrin', 'Cellino Law', 'Davis Law Group']);
  });

  it('should return at most five suggestions', () => {
    const prospects = ProspectFirmRowFactory.buildList(6, { firm_name: 'Example Law Firm' });

    const result = suggestSimilar('law', prospects);

    expect(result).toHaveLength(5);
  });

  it('should match query tokens case-insensitively', () => {
    const prospects = [ProspectFirmRowFactory.build({ firm_name: 'Cellino Law' })];

    const result = suggestSimilar('CELLINO', prospects);

    expect(result).toEqual(['Cellino Law']);
  });
});
