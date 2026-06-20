import { Factory } from 'rosie';
import { matchKeywords } from './match-keywords.function';

interface MatchKeywordsFixture {
  targets: string[];
  haystack: string;
  label: string;
  points: number;
}

const MatchKeywordsFixtureFactory = new Factory<MatchKeywordsFixture>()
  .attr('targets', ['intake overflow'])
  .attr('haystack', 'Struggling with intake overflow during peak hours')
  .attr('label', 'pain point')
  .attr('points', 5);

describe('matchKeywords', () => {
  it('should return points when the haystack contains a target keyword', () => {
    const fixture = MatchKeywordsFixtureFactory.build();
    const reasons: string[] = [];

    const result = matchKeywords(
      fixture.targets,
      fixture.haystack,
      fixture.label,
      reasons,
      fixture.points,
    );

    expect(result).toBe(fixture.points);
  });

  it('should return zero when no target keyword appears in the haystack', () => {
    const fixture = MatchKeywordsFixtureFactory.build({
      targets: ['mass tort'],
      haystack: 'Routine personal injury caseload',
    });
    const reasons: string[] = [];

    const result = matchKeywords(
      fixture.targets,
      fixture.haystack,
      fixture.label,
      reasons,
      fixture.points,
    );

    expect(result).toBe(0);
    expect(reasons).toEqual([]);
  });

  it('should append a reason when a keyword matches', () => {
    const fixture = MatchKeywordsFixtureFactory.build();
    const reasons: string[] = [];

    matchKeywords(fixture.targets, fixture.haystack, fixture.label, reasons, fixture.points);

    expect(reasons).toEqual(['Matched pain point keyword "intake overflow" (+5)']);
  });

  it('should match keywords case-insensitively', () => {
    const fixture = MatchKeywordsFixtureFactory.build({
      targets: ['Demand Drafting'],
      haystack: 'Backlog in demand drafting workflow',
    });
    const reasons: string[] = [];

    const result = matchKeywords(
      fixture.targets,
      fixture.haystack,
      fixture.label,
      reasons,
      fixture.points,
    );

    expect(result).toBe(fixture.points);
  });

  it('should return points for the first matching keyword only', () => {
    const reasons: string[] = [];

    const result = matchKeywords(
      ['intake', 'overflow'],
      'intake overflow during peak season',
      'pain point',
      reasons,
      5,
    );

    expect(result).toBe(5);
    expect(reasons).toHaveLength(1);
  });
});
