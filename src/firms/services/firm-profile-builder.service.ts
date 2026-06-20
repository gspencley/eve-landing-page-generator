import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { doFirmNamesMatch } from '../../data/functions/do-firm-names-match.function';
import { FirmProfile } from '../types/firm-profile.interface';
import { ProspectFirmRow } from '../types/prospect-firm-row.interface';

@Injectable()
export class FirmProfileBuilderService {
  constructor(private readonly dataService: DataService) {}

  buildProfile(row: ProspectFirmRow): FirmProfile {
    const enrichment =
      this.dataService
        .getEnrichmentSignals()
        .find((signal) => doFirmNamesMatch(row.firm_name, signal.firm_name)) ?? null;

    const interactions = this.dataService
      .getInteractionHistory()
      .filter((interaction) => doFirmNamesMatch(row.firm_name, interaction.firm_name));

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
}
