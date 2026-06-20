import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Factory } from 'rosie';
import { parseCsvFile } from './parse-csv-file.function';

interface TestCsvRow {
  firm_name: string;
  industry: string;
}

const TestCsvRowFactory = new Factory<TestCsvRow>()
  .attr('firm_name', 'Cellino Law')
  .attr('industry', 'Legal Services');

describe('parseCsvFile', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'parse-csv-file-'));
  });

  afterEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should return an empty array when the file does not exist', () => {
    const result = parseCsvFile<TestCsvRow>(join(tempDir, 'missing.csv'));

    expect(result).toEqual([]);
  });

  it('should parse header row and return typed records', () => {
    const row = TestCsvRowFactory.build();
    const filePath = join(tempDir, 'firms.csv');
    writeFileSync(filePath, `firm_name,industry\n${row.firm_name},${row.industry}\n`);

    const result = parseCsvFile<TestCsvRow>(filePath);

    expect(result).toEqual([row]);
  });

  it('should trim field values and skip empty lines', () => {
    const row = TestCsvRowFactory.build({
      firm_name: '  Davis Law Group  ',
      industry: ' Legal Services ',
    });
    const filePath = join(tempDir, 'trimmed.csv');
    writeFileSync(filePath, `firm_name,industry\n${row.firm_name},${row.industry}\n\n`);

    const result = parseCsvFile<TestCsvRow>(filePath);

    expect(result).toEqual([
      {
        firm_name: 'Davis Law Group',
        industry: 'Legal Services',
      },
    ]);
  });

  it('should return an empty array when the file contains only headers', () => {
    const filePath = join(tempDir, 'headers-only.csv');
    writeFileSync(filePath, 'firm_name,industry\n');

    const result = parseCsvFile<TestCsvRow>(filePath);

    expect(result).toEqual([]);
  });
});
