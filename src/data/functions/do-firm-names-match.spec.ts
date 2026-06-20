import { Factory } from 'rosie';
import { doFirmNamesMatch } from './do-firm-names-match.function';

interface FirmNameMatchFixture {
  first: string;
  second: string;
}

const FirmNameMatchFixtureFactory = new Factory<FirmNameMatchFixture>()
  .attr('first', 'Cellino Law')
  .attr('second', 'Cellino Law');

describe('doFirmNamesMatch', () => {
  it('should return true when normalized firm names are equal', () => {
    const fixture = FirmNameMatchFixtureFactory.build({
      first: 'Brown & Crouppen',
      second: 'Brown and Crouppen',
    });

    expect(doFirmNamesMatch(fixture.first, fixture.second)).toBe(true);
  });

  it('should return true when one normalized name contains the other and is at least four characters', () => {
    const fixture = FirmNameMatchFixtureFactory.build({
      first: 'Crump Law',
      second: 'Ben Crump Law',
    });

    expect(doFirmNamesMatch(fixture.first, fixture.second)).toBe(true);
  });

  it('should return true when token overlap meets the matching threshold', () => {
    const fixture = FirmNameMatchFixtureFactory.build({
      first: 'Nace Law Grou.',
      second: 'Nace Law Group',
    });

    expect(doFirmNamesMatch(fixture.first, fixture.second)).toBe(true);
  });

  it('should return false when firm names share insufficient token overlap', () => {
    const fixture = FirmNameMatchFixtureFactory.build({
      first: 'Alpha Law',
      second: 'Beta Group',
    });

    expect(doFirmNamesMatch(fixture.first, fixture.second)).toBe(false);
  });

  it('should return false when one firm name normalizes to an empty string', () => {
    const fixture = FirmNameMatchFixtureFactory.build({
      first: '!!!',
      second: 'Cellino Law',
    });

    expect(doFirmNamesMatch(fixture.first, fixture.second)).toBe(false);
  });

  it('should return false when a normalized name is too short for substring matching', () => {
    const fixture = FirmNameMatchFixtureFactory.build({
      first: 'PI',
      second: 'Personal Injury Law Firm',
    });

    expect(doFirmNamesMatch(fixture.first, fixture.second)).toBe(false);
  });
});
