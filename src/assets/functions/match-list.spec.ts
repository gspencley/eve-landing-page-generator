import { Factory } from 'rosie';
import { matchList } from './match-list.function';

interface MatchListFixture {
  targets: string[];
  values: string[];
  label: string;
  points: number;
}

const MatchListFixtureFactory = new Factory<MatchListFixture>()
  .attr('targets', ['Personal Injury'])
  .attr('values', ['Personal Injury'])
  .attr('label', 'practice area')
  .attr('points', 6);

describe('matchList', () => {
  it('should return points when a value matches a target case-insensitively', () => {
    const fixture = MatchListFixtureFactory.build({
      targets: ['Mid-Market'],
      values: ['mid-market'],
    });
    const reasons: string[] = [];

    const result = matchList(
      fixture.targets,
      fixture.values,
      fixture.label,
      reasons,
      fixture.points,
    );

    expect(result).toBe(fixture.points);
  });

  it('should return points when a value partially matches a target', () => {
    const fixture = MatchListFixtureFactory.build({
      targets: ['Litify'],
      values: ['Litify, Zoom, Microsoft 365'],
      label: 'case management system',
      points: 5,
    });
    const reasons: string[] = [];

    const result = matchList(
      fixture.targets,
      fixture.values,
      fixture.label,
      reasons,
      fixture.points,
    );

    expect(result).toBe(5);
  });

  it('should return zero when no values match any target', () => {
    const fixture = MatchListFixtureFactory.build({
      targets: ['Clio'],
      values: ['Filevine'],
    });
    const reasons: string[] = [];

    const result = matchList(
      fixture.targets,
      fixture.values,
      fixture.label,
      reasons,
      fixture.points,
    );

    expect(result).toBe(0);
    expect(reasons).toEqual([]);
  });

  it('should append a reason when a match is found', () => {
    const fixture = MatchListFixtureFactory.build();
    const reasons: string[] = [];

    matchList(fixture.targets, fixture.values, fixture.label, reasons, fixture.points);

    expect(reasons).toEqual(['Matched practice area: Personal Injury (+6)']);
  });

  it('should return points for the first matching value only', () => {
    const reasons: string[] = [];

    const result = matchList(
      ['Legal Services'],
      ['Legal Services', 'Personal Injury'],
      'industry',
      reasons,
      4,
    );

    expect(result).toBe(4);
    expect(reasons).toHaveLength(1);
  });
});
