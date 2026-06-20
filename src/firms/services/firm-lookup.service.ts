import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { normalizeFirmName } from '../../data/functions/normalize-firm-name.function';
import { FirmNotFoundError } from '../types/firm-not-found.error';
import { doFirmNamesMatch } from '../../data/functions/do-firm-names-match.function';
import { FirmLookupResult } from '../types/firm-lookup-result.interface';
import { FirmProfileBuilderService } from './firm-profile-builder.service';
import { suggestSimilar } from '../functions/suggest-similar.function';

@Injectable()
export class FirmLookupService {
  constructor(
    private readonly dataService: DataService,
    private readonly firmProfileBuilderService: FirmProfileBuilderService,
  ) {}

  findFirm(query: string): FirmLookupResult {
    const trimmed = query.trim();
    if (!trimmed) {
      throw new FirmNotFoundError(query);
    }

    const prospects = this.dataService.getProspectFirms();
    const exact = prospects.find(
      (row) => normalizeFirmName(row.firm_name) === normalizeFirmName(trimmed),
    );

    if (exact) {
      return {
        profile: this.firmProfileBuilderService.buildProfile(exact),
        matchedName: exact.firm_name,
        matchConfidence: 'exact',
      };
    }

    const fuzzyMatches = prospects.filter((row) => doFirmNamesMatch(trimmed, row.firm_name));

    if (fuzzyMatches.length === 1) {
      return {
        profile: this.firmProfileBuilderService.buildProfile(fuzzyMatches[0]),
        matchedName: fuzzyMatches[0].firm_name,
        matchConfidence: 'fuzzy',
      };
    }

    if (fuzzyMatches.length > 1) {
      const suggestions = fuzzyMatches.slice(0, 5).map((row) => row.firm_name);
      throw new FirmNotFoundError(trimmed, suggestions);
    }

    throw new FirmNotFoundError(trimmed, suggestSimilar(trimmed, prospects));
  }

  listFirmNames(): string[] {
    return this.dataService.getProspectFirms().map((row) => row.firm_name);
  }
}
