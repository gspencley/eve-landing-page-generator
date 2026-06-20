import { EnrichmentSignalRow } from './enrichment-signal-row.interface';
import { InteractionHistoryRow } from './interaction-history-row.interface';

export interface FirmProfile {
  firmName: string;
  industry: string;
  practiceArea: string;
  firmSize: string;
  intakeMethod: string;
  painPoints: string[];
  caseManagementSystem: string;
  leadStatus: string;
  enrichment: EnrichmentSignalRow | null;
  interactions: InteractionHistoryRow[];
  previouslySentAssetIds: string[];
  bouncedInteractionCount: number;
}
