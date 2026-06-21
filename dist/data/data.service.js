"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const parse_csv_file_function_1 = require("./functions/parse-csv-file.function");
const parse_xlsx_file_function_1 = require("./functions/parse-xlsx-file.function");
const sample_prospect_firms_const_1 = require("./sample-prospect-firms.const");
const merge_sample_prospects_function_1 = require("./functions/merge-sample-prospects.function");
const infer_prospect_from_enrichment_function_1 = require("./functions/infer-prospect-from-enrichment.function");
const normalize_prospect_row_function_1 = require("./functions/normalize-prospect-row.function");
const sample_enrichment_signals_const_1 = require("./sample-enrichment-signals.const");
const sample_interaction_history_const_1 = require("./sample-interaction-history.const");
const do_firm_names_match_function_1 = require("./functions/do-firm-names-match.function");
const DATA_DIR = (0, path_1.join)(process.cwd(), 'data');
let DataService = DataService_1 = class DataService {
    constructor() {
        this.logger = new common_1.Logger(DataService_1.name);
        this.prospectFirms = [];
        this.enrichmentSignals = [];
        this.interactionHistory = [];
    }
    onModuleInit() {
        this.loadAll();
    }
    getProspectFirms() {
        return this.prospectFirms;
    }
    getEnrichmentSignals() {
        return this.enrichmentSignals;
    }
    getInteractionHistory() {
        return this.interactionHistory;
    }
    findEnrichmentsByFirmName(firmName) {
        return (this.getEnrichmentSignals().find((signal) => (0, do_firm_names_match_function_1.doFirmNamesMatch)(firmName, signal.firm_name)) ??
            null);
    }
    findInteractionsByFirmName(firmName) {
        return this.getInteractionHistory().filter((interaction) => (0, do_firm_names_match_function_1.doFirmNamesMatch)(firmName, interaction.firm_name));
    }
    loadAll() {
        this.prospectFirms = this.loadProspectFirms();
        this.enrichmentSignals = this.loadEnrichmentSignals();
        this.interactionHistory = this.loadInteractionHistory();
        this.logger.log(`Loaded ${this.prospectFirms.length} firms, ${this.enrichmentSignals.length} enrichment rows, ${this.interactionHistory.length} interactions`);
    }
    loadProspectFirms() {
        const fromXlsx = (0, parse_xlsx_file_function_1.parseXlsxFile)((0, path_1.join)(DATA_DIR, 'prospect_firms.xlsx'));
        if (fromXlsx.length > 0) {
            return (0, merge_sample_prospects_function_1.mergeSampleProspects)(fromXlsx.map((row) => (0, normalize_prospect_row_function_1.normalizeProspectRow)(row)));
        }
        const enrichmentRows = (0, parse_csv_file_function_1.parseCsvFile)((0, path_1.join)(DATA_DIR, 'enrichment_signals.csv'));
        if (enrichmentRows.length > 0) {
            this.logger.warn('prospect_firms.xlsx not found or empty — deriving prospect rows from enrichment_signals.csv');
            return (0, merge_sample_prospects_function_1.mergeSampleProspects)(enrichmentRows.map((row) => (0, infer_prospect_from_enrichment_function_1.inferProspectFromEnrichment)(row)));
        }
        this.logger.warn('No prospect source files found — using built-in sample prospect data');
        return sample_prospect_firms_const_1.SAMPLE_PROSPECT_FIRMS;
    }
    loadEnrichmentSignals() {
        const fromCsv = (0, parse_csv_file_function_1.parseCsvFile)((0, path_1.join)(DATA_DIR, 'enrichment_signals.csv'));
        if (fromCsv.length > 0) {
            return fromCsv;
        }
        this.logger.warn('enrichment_signals.csv not found or empty — using built-in sample enrichment data');
        return sample_enrichment_signals_const_1.SAMPLE_ENRICHMENT_SIGNALS;
    }
    loadInteractionHistory() {
        const fromCsv = (0, parse_csv_file_function_1.parseCsvFile)((0, path_1.join)(DATA_DIR, 'interaction_history.csv'));
        if (fromCsv.length > 0) {
            return fromCsv;
        }
        this.logger.warn('interaction_history.csv not found or empty — using built-in sample interaction data');
        return sample_interaction_history_const_1.SAMPLE_INTERACTION_HISTORY;
    }
};
exports.DataService = DataService;
exports.DataService = DataService = DataService_1 = __decorate([
    (0, common_1.Injectable)()
], DataService);
//# sourceMappingURL=data.service.js.map