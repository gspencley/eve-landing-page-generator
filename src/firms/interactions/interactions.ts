import { InteractionHistoryRow } from '../types/interaction-history-row.interface';

export class Interactions {
  constructor(private readonly interactions: InteractionHistoryRow[] | null) {}

  getHistoryRows(): InteractionHistoryRow[] {
    return this.interactions ?? [];
  }

  getPreviouslySentAssetIds(): string[] {
    if (!this.interactions) {
      return [];
    }

    return [
      ...new Set(
        this.interactions
          .map((interaction) => interaction.asset_sent?.trim())
          .filter((assetId): assetId is string => Boolean(assetId)),
      ),
    ];
  }

  getBouncedInteractionCount(): number {
    if (!this.interactions) {
      return 0;
    }

    return this.interactions.filter(
      (interaction) => interaction.event_type.toLowerCase() === 'bounced',
    ).length;
  }
}
