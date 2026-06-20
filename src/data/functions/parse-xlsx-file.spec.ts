import { existsSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Factory } from 'rosie';
import * as XLSX from 'xlsx';
import { parseXlsxFile } from './parse-xlsx-file.function';

interface TestXlsxRow {
  firm_name: string;
  industry: string;
  lead_status: string;
}

const TestXlsxRowFactory = new Factory<TestXlsxRow>()
  .attr('firm_name', 'Cellino Law')
  .attr('industry', 'Legal Services')
  .attr('lead_status', 'Engaged');

function writeWorkbook(filePath: string, sheets: Record<string, TestXlsxRow[]>): void {
  const workbook = XLSX.utils.book_new();

  for (const [sheetName, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), sheetName);
  }

  XLSX.writeFile(workbook, filePath);
}

describe('parseXlsxFile', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'parse-xlsx-file-'));
  });

  afterEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should return an empty array when the file does not exist', () => {
    const result = parseXlsxFile<TestXlsxRow>(join(tempDir, 'missing.xlsx'));

    expect(result).toEqual([]);
  });

  it('should parse the first worksheet when no sheet name is provided', () => {
    const row = TestXlsxRowFactory.build();
    const filePath = join(tempDir, 'firms.xlsx');
    writeWorkbook(filePath, {
      Firms: [row],
      Other: [TestXlsxRowFactory.build({ firm_name: 'Other Firm' })],
    });

    const result = parseXlsxFile<TestXlsxRow>(filePath);

    expect(result).toEqual([row]);
  });

  it('should parse the named worksheet when a sheet name is provided', () => {
    const primaryRow = TestXlsxRowFactory.build();
    const secondaryRow = TestXlsxRowFactory.build({
      firm_name: 'Davis Law Group',
      lead_status: 'Warm',
    });
    const filePath = join(tempDir, 'multi-sheet.xlsx');
    writeWorkbook(filePath, {
      Prospects: [primaryRow],
      Archive: [secondaryRow],
    });

    const result = parseXlsxFile<TestXlsxRow>(filePath, 'Archive');

    expect(result).toEqual([secondaryRow]);
  });

  it('should return an empty array when the named worksheet does not exist', () => {
    const row = TestXlsxRowFactory.build();
    const filePath = join(tempDir, 'single-sheet.xlsx');
    writeWorkbook(filePath, { Firms: [row] });

    const result = parseXlsxFile<TestXlsxRow>(filePath, 'MissingSheet');

    expect(result).toEqual([]);
  });

  it('should default empty cells to empty strings', () => {
    const row = TestXlsxRowFactory.build();
    const filePath = join(tempDir, 'sparse.xlsx');
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['firm_name', 'industry', 'lead_status'],
      [row.firm_name, row.industry, null],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Firms');
    XLSX.writeFile(workbook, filePath);

    const result = parseXlsxFile<TestXlsxRow>(filePath);

    expect(result).toEqual([
      {
        firm_name: row.firm_name,
        industry: row.industry,
        lead_status: '',
      },
    ]);
  });
});
