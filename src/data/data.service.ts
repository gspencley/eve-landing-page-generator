import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { parseCsvFile } from './functions/parse-csv-file.function';
import { parseXlsxFile } from './functions/parse-xlsx-file.function';
import { SAMPLE_PROSPECT_FIRMS } from './sample-prospect-firms.const';
import { mergeSampleProspects } from './functions/merge-sample-prospects.function';
import { inferProspectFromEnrichment } from './functions/infer-prospect-from-enrichment.function';
import { normalizeProspectRow } from './functions/normalize-prospect-row.function';
import { SAMPLE_ENRICHMENT_SIGNALS } from './sample-enrichment-signals.const';
import { SAMPLE_INTERACTION_HISTORY } from './sample-interaction-history.const';
import { ProspectFirmRow } from '../firms/types/prospect-firm-row.interface';
import { EnrichmentSignalRow } from '../firms/types/enrichment-signal-row.interface';
import { InteractionHistoryRow } from '../firms/types/interaction-history-row.interface';

const DATA_DIR = join(process.cwd(), 'data');

@Injectable()
export class DataService implements OnModuleInit {
  private readonly logger = new Logger(DataService.name);

  private prospectFirms: ProspectFirmRow[] = [];
  private enrichmentSignals: EnrichmentSignalRow[] = [];
  private interactionHistory: InteractionHistoryRow[] = [];

  onModuleInit(): void {
    this.loadAll();
  }

  reload(): void {
    this.loadAll();
  }

  getProspectFirms(): ProspectFirmRow[] {
    return this.prospectFirms;
  }

  getEnrichmentSignals(): EnrichmentSignalRow[] {
    return this.enrichmentSignals;
  }

  getInteractionHistory(): InteractionHistoryRow[] {
    return this.interactionHistory;
  }

  private loadAll(): void {
    this.prospectFirms = this.loadProspectFirms();
    this.enrichmentSignals = this.loadEnrichmentSignals();
    this.interactionHistory = this.loadInteractionHistory();

    this.logger.log(
      `Loaded ${this.prospectFirms.length} firms, ${this.enrichmentSignals.length} enrichment rows, ${this.interactionHistory.length} interactions`,
    );
  }

  private loadProspectFirms(): ProspectFirmRow[] {
    const fromXlsx = parseXlsxFile<ProspectFirmRow>(join(DATA_DIR, 'prospect_firms.xlsx'));

    if (fromXlsx.length > 0) {
      return mergeSampleProspects(fromXlsx.map((row) => normalizeProspectRow(row)));
    }

    const enrichmentRows = parseCsvFile<EnrichmentSignalRow>(
      join(DATA_DIR, 'enrichment_signals.csv'),
    );

    if (enrichmentRows.length > 0) {
      this.logger.warn(
        'prospect_firms.xlsx not found or empty — deriving prospect rows from enrichment_signals.csv',
      );
      return mergeSampleProspects(enrichmentRows.map((row) => inferProspectFromEnrichment(row)));
    }

    this.logger.warn('No prospect source files found — using built-in sample prospect data');
    return SAMPLE_PROSPECT_FIRMS;
  }

  private loadEnrichmentSignals(): EnrichmentSignalRow[] {
    const fromCsv = parseCsvFile<EnrichmentSignalRow>(join(DATA_DIR, 'enrichment_signals.csv'));

    if (fromCsv.length > 0) {
      return fromCsv;
    }

    this.logger.warn(
      'enrichment_signals.csv not found or empty — using built-in sample enrichment data',
    );
    return SAMPLE_ENRICHMENT_SIGNALS;
  }

  private loadInteractionHistory(): InteractionHistoryRow[] {
    const fromCsv = parseCsvFile<InteractionHistoryRow>(join(DATA_DIR, 'interaction_history.csv'));

    if (fromCsv.length > 0) {
      return fromCsv;
    }

    this.logger.warn(
      'interaction_history.csv not found or empty — using built-in sample interaction data',
    );
    return SAMPLE_INTERACTION_HISTORY;
  }
}
