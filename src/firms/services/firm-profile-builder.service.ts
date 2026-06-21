import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { FirmProfile } from '../types/firm-profile.interface';
import { ProspectFirmRow } from '../types/prospect-firm-row.interface';
import { Interactions } from '../interactions/interactions';
import { InteractionHistoryRow } from '../types/interaction-history-row.interface';

@Injectable()
export class FirmProfileBuilderService {
  constructor(private readonly dataService: DataService) {}

  buildProfile(row: ProspectFirmRow): FirmProfile {
    return this.createFirmProfile(
      row,
      this.createInteractions(this.dataService.findInteractionsByFirmName(row.firm_name)),
    );
  }

  protected createFirmProfile(row: ProspectFirmRow, interactions: Interactions): FirmProfile {
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
      enrichment: this.dataService.findEnrichmentsByFirmName(row.firm_name),
      interactions: interactions.getHistoryRows(),
      previouslySentAssetIds: interactions.getPreviouslySentAssetIds(),
      bouncedInteractionCount: interactions.getBouncedInteractionCount(),
    };
  }

  protected createInteractions(interactionHistoryRows: InteractionHistoryRow[]): Interactions {
    return new Interactions(interactionHistoryRows);
  }
}
