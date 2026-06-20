"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmLookupService = void 0;
const common_1 = require("@nestjs/common");
const data_service_1 = require("../data/data.service");
const normalize_firm_name_1 = require("../data/normalize-firm-name");
const firm_profile_types_1 = require("./firm-profile.types");
let FirmLookupService = class FirmLookupService {
    constructor(dataService) {
        this.dataService = dataService;
    }
    findFirm(query) {
        const trimmed = query.trim();
        if (!trimmed) {
            throw new firm_profile_types_1.FirmNotFoundError(query);
        }
        const prospects = this.dataService.getProspectFirms();
        const exact = prospects.find((row) => (0, normalize_firm_name_1.normalizeFirmName)(row.firm_name) === (0, normalize_firm_name_1.normalizeFirmName)(trimmed));
        if (exact) {
            return {
                profile: this.buildProfile(exact),
                matchedName: exact.firm_name,
                matchConfidence: 'exact',
            };
        }
        const fuzzyMatches = prospects.filter((row) => (0, normalize_firm_name_1.firmNamesMatch)(trimmed, row.firm_name));
        if (fuzzyMatches.length === 1) {
            return {
                profile: this.buildProfile(fuzzyMatches[0]),
                matchedName: fuzzyMatches[0].firm_name,
                matchConfidence: 'fuzzy',
            };
        }
        if (fuzzyMatches.length > 1) {
            const suggestions = fuzzyMatches.slice(0, 5).map((row) => row.firm_name);
            throw new firm_profile_types_1.FirmNotFoundError(trimmed, suggestions);
        }
        const suggestions = this.suggestSimilar(trimmed, prospects);
        throw new firm_profile_types_1.FirmNotFoundError(trimmed, suggestions);
    }
    listFirmNames() {
        return this.dataService.getProspectFirms().map((row) => row.firm_name);
    }
    buildProfile(row) {
        const enrichment = this.dataService
            .getEnrichmentSignals()
            .find((signal) => (0, normalize_firm_name_1.firmNamesMatch)(row.firm_name, signal.firm_name)) ?? null;
        const interactions = this.dataService
            .getInteractionHistory()
            .filter((interaction) => (0, normalize_firm_name_1.firmNamesMatch)(row.firm_name, interaction.firm_name));
        const previouslySentAssetIds = [
            ...new Set(interactions
                .map((interaction) => interaction.asset_sent?.trim())
                .filter((assetId) => Boolean(assetId))),
        ];
        const bouncedInteractionCount = interactions.filter((interaction) => interaction.event_type.toLowerCase() === 'bounced').length;
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
    suggestSimilar(query, prospects) {
        const normalizedQuery = (0, normalize_firm_name_1.normalizeFirmName)(query);
        const queryTokens = normalizedQuery.split(' ').filter(Boolean);
        return prospects
            .map((row) => {
            const tokens = (0, normalize_firm_name_1.normalizeFirmName)(row.firm_name).split(' ').filter(Boolean);
            const score = queryTokens.filter((token) => tokens.includes(token)).length;
            return { name: row.firm_name, score };
        })
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((entry) => entry.name);
    }
};
exports.FirmLookupService = FirmLookupService;
exports.FirmLookupService = FirmLookupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [data_service_1.DataService])
], FirmLookupService);
//# sourceMappingURL=firm-lookup.service.js.map