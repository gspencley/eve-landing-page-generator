import { Factory } from 'rosie';
import { Interactions } from './interactions';
import { InteractionHistoryRow } from '../types/interaction-history-row.interface';

const InteractionHistoryRowFactory = new Factory<InteractionHistoryRow>()
  .attr('interaction_id', 'INT-0001')
  .attr('firm_name', 'Cellino Law')
  .attr('rep_name', 'Sarah Chen')
  .attr('channel', 'email')
  .attr('subject', 'Following up on Eve')
  .attr('event_type', 'sent')
  .attr('event_date', '2025-03-01')
  .attr('sequence_step', '1')
  .attr('template_id', 'tmpl-cold-intro-01')
  .attr('asset_sent', '');

describe('Interactions', () => {
  describe('getHistoryRows', () => {
    it('should return an empty array when interactions is null', () => {
      const interactions = new Interactions(null);

      expect(interactions.getHistoryRows()).toEqual([]);
    });

    it('should return all interaction rows when interactions are provided', () => {
      const rows = InteractionHistoryRowFactory.buildList(2);
      const interactions = new Interactions(rows);

      expect(interactions.getHistoryRows()).toEqual(rows);
    });
  });

  describe('getPreviouslySentAssetIds', () => {
    it('should return an empty array when interactions is null', () => {
      const interactions = new Interactions(null);

      expect(interactions.getPreviouslySentAssetIds()).toEqual([]);
    });

    it('should return unique asset ids from non-empty asset_sent fields', () => {
      const rows = [
        InteractionHistoryRowFactory.build({ asset_sent: 'EVE-OP-001' }),
        InteractionHistoryRowFactory.build({
          interaction_id: 'INT-0002',
          asset_sent: 'EVE-CS-001',
        }),
        InteractionHistoryRowFactory.build({
          interaction_id: 'INT-0003',
          asset_sent: 'EVE-OP-001',
        }),
      ];
      const interactions = new Interactions(rows);

      expect(interactions.getPreviouslySentAssetIds()).toEqual(['EVE-OP-001', 'EVE-CS-001']);
    });

    it('should ignore blank asset_sent values', () => {
      const rows = [
        InteractionHistoryRowFactory.build({ asset_sent: '' }),
        InteractionHistoryRowFactory.build({
          interaction_id: 'INT-0002',
          asset_sent: '   ',
        }),
        InteractionHistoryRowFactory.build({
          interaction_id: 'INT-0003',
          asset_sent: 'EVE-HB-001',
        }),
      ];
      const interactions = new Interactions(rows);

      expect(interactions.getPreviouslySentAssetIds()).toEqual(['EVE-HB-001']);
    });

    it('should trim whitespace from asset ids', () => {
      const rows = [InteractionHistoryRowFactory.build({ asset_sent: '  EVE-OP-004  ' })];
      const interactions = new Interactions(rows);

      expect(interactions.getPreviouslySentAssetIds()).toEqual(['EVE-OP-004']);
    });
  });

  describe('getBouncedInteractionCount', () => {
    it('should return zero when interactions is null', () => {
      const interactions = new Interactions(null);

      expect(interactions.getBouncedInteractionCount()).toBe(0);
    });

    it('should count interactions with bounced event type case-insensitively', () => {
      const rows = [
        InteractionHistoryRowFactory.build({ event_type: 'bounced' }),
        InteractionHistoryRowFactory.build({
          interaction_id: 'INT-0002',
          event_type: 'BOUNCED',
        }),
        InteractionHistoryRowFactory.build({
          interaction_id: 'INT-0003',
          event_type: 'opened',
        }),
      ];
      const interactions = new Interactions(rows);

      expect(interactions.getBouncedInteractionCount()).toBe(2);
    });

    it('should not count non-bounced interactions', () => {
      const rows = [
        InteractionHistoryRowFactory.build({ event_type: 'sent' }),
        InteractionHistoryRowFactory.build({
          interaction_id: 'INT-0002',
          event_type: 'replied',
        }),
      ];
      const interactions = new Interactions(rows);

      expect(interactions.getBouncedInteractionCount()).toBe(0);
    });
  });
});
