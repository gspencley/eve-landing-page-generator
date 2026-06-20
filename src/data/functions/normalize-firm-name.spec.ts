import { Factory } from 'rosie';
import { normalizeFirmName } from './normalize-firm-name.function';

interface FirmNameNormalizationFixture {
  input: string;
  expected: string;
}

const FirmNameNormalizationFixtureFactory = new Factory<FirmNameNormalizationFixture>()
  .attr('input', 'Cellino Law')
  .attr('expected', 'cellino law');

describe('normalizeFirmName', () => {
  it('should lowercase the firm name', () => {
    const fixture = FirmNameNormalizationFixtureFactory.build({
      input: 'Davis Law Group',
      expected: 'davis law group',
    });

    expect(normalizeFirmName(fixture.input)).toBe(fixture.expected);
  });

  it('should replace ampersands with the word and', () => {
    const fixture = FirmNameNormalizationFixtureFactory.build({
      input: 'Brown & Crouppen',
      expected: 'brown and crouppen',
    });

    expect(normalizeFirmName(fixture.input)).toBe(fixture.expected);
  });

  it('should remove punctuation from the firm name', () => {
    const fixture = FirmNameNormalizationFixtureFactory.build({
      input: 'Nace Law Grou.',
      expected: 'nace law grou',
    });

    expect(normalizeFirmName(fixture.input)).toBe(fixture.expected);
  });

  it('should collapse extra whitespace and trim the firm name', () => {
    const fixture = FirmNameNormalizationFixtureFactory.build({
      input: '  Law   Offices   of   James   Scott   Farrin  ',
      expected: 'law offices of james scott farrin',
    });

    expect(normalizeFirmName(fixture.input)).toBe(fixture.expected);
  });

  it('should apply all normalization rules together', () => {
    const fixture = FirmNameNormalizationFixtureFactory.build({
      input: '  Smith, Clinesmith & Associates, P.C.  ',
      expected: 'smith clinesmith and associates p c',
    });

    expect(normalizeFirmName(fixture.input)).toBe(fixture.expected);
  });
});
