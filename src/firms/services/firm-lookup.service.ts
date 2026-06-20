import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { firmNamesMatch, normalizeFirmName } from '../../data/normalize-firm-name';
import {
  FirmLookupResult,
  FirmNotFoundError,
  FirmProfile,
  ProspectFirmRow,
} from '../types/firm-profile.types';

@Injectable()
export class FirmLookupService {
  constructor(private readonly dataService: DataService) {}

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
        profile: this.buildProfile(exact),
        matchedName: exact.firm_name,
        matchConfidence: 'exact',
      };
    }

    const fuzzyMatches = prospects.filter((row) => firmNamesMatch(trimmed, row.firm_name));

    if (fuzzyMatches.length === 1) {
      return {
        profile: this.buildProfile(fuzzyMatches[0]),
        matchedName: fuzzyMatches[0].firm_name,
        matchConfidence: 'fuzzy',
      };
    }

    if (fuzzyMatches.length > 1) {
      const suggestions = fuzzyMatches.slice(0, 5).map((row) => row.firm_name);
      throw new FirmNotFoundError(trimmed, suggestions);
    }

    const suggestions = this.suggestSimilar(trimmed, prospects);
    throw new FirmNotFoundError(trimmed, suggestions);
  }

  listFirmNames(): string[] {
    return this.dataService.getProspectFirms().map((row) => row.firm_name);
  }

  private buildProfile(row: ProspectFirmRow): FirmProfile {
    const enrichment =
      this.dataService
        .getEnrichmentSignals()
        .find((signal) => firmNamesMatch(row.firm_name, signal.firm_name)) ?? null;

    const interactions = this.dataService
      .getInteractionHistory()
      .filter((interaction) => firmNamesMatch(row.firm_name, interaction.firm_name));

    const previouslySentAssetIds = [
      ...new Set(
        interactions
          .map((interaction) => interaction.asset_sent?.trim())
          .filter((assetId): assetId is string => Boolean(assetId)),
      ),
    ];

    const bouncedInteractionCount = interactions.filter(
      (interaction) => interaction.event_type.toLowerCase() === 'bounced',
    ).length;

    return {
      firmName: row.firm_name,
      industry: row.industry,
      practiceArea: row.practice_area,
      firmSize: row.firm_size,
      intakeMethod: row.intake_method,
      painPoints: row.pain_points
        .split(/[;,]/)
        .map((point) => point.trim())
        .filter(Boolean),
      caseManagementSystem: row.case_management_system,
      leadStatus: row.lead_status,
      enrichment,
      interactions,
      previouslySentAssetIds,
      bouncedInteractionCount,
    };
  }

  private suggestSimilar(query: string, prospects: ProspectFirmRow[]): string[] {
    const normalizedQuery = normalizeFirmName(query);
    const queryTokens = normalizedQuery.split(' ').filter(Boolean);

    return prospects
      .map((row) => {
        const tokens = normalizeFirmName(row.firm_name).split(' ').filter(Boolean);
        const score = queryTokens.filter((token) => tokens.includes(token)).length;
        return { name: row.firm_name, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.name);
  }
}
