import { readFileSync, existsSync } from 'fs';
import * as XLSX from 'xlsx';

export function parseXlsxFile<T = Record<string, unknown>>(
  filePath: string,
  sheetName?: string,
): T[] {
  if (!existsSync(filePath)) {
    return [];
  }

  const workbook = XLSX.read(readFileSync(filePath), { type: 'buffer' });
  const sheet = sheetName ? workbook.Sheets[sheetName] : workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json<T>(sheet, { defval: '' });
}
