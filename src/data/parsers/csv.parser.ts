import { parse } from 'csv-parse/sync';
import { readFileSync, existsSync } from 'fs';

export function parseCsvFile<T = Record<string, string>>(filePath: string): T[] {
  if (!existsSync(filePath)) {
    return [];
  }

  const content = readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as T[];
}
