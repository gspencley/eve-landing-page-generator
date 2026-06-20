"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetMatcherService = void 0;
const common_1 = require("@nestjs/common");
const asset_library_1 = require("./asset-library");
const PREVIOUSLY_SENT_PENALTY = 25;
const BOUNCED_FIRM_PENALTY = 8;
const MAX_SELECTED_ASSETS = 3;
let AssetMatcherService = class AssetMatcherService {
    matchAssets(profile) {
        const scored = asset_library_1.ASSET_LIBRARY.map((asset) => this.scoreAsset(asset, profile)).sort((a, b) => b.totalScore - a.totalScore);
        const selectedAssets = scored
            .filter((entry) => entry.totalScore > 0)
            .slice(0, MAX_SELECTED_ASSETS)
            .map((entry) => asset_library_1.ASSET_LIBRARY.find((asset) => asset.id === entry.assetId))
            .filter(Boolean);
        return {
            selectedAssets,
            explanations: scored.slice(0, 6),
        };
    }
    scoreAsset(asset, profile) {
        let totalScore = asset.baseWeight;
        const reasons = [`Base relevance weight: ${asset.baseWeight}`];
        const penalties = [];
        totalScore += this.matchList(asset.targetIndustries, [profile.industry], 'industry', reasons, 4);
        totalScore += this.matchList(asset.targetPracticeAreas, [profile.practiceArea], 'practice area', reasons, 6);
        totalScore += this.matchList(asset.targetFirmSizes, [profile.firmSize], 'firm size', reasons, 3);
        totalScore += this.matchList(asset.targetIntakeMethods, [profile.intakeMethod], 'intake method', reasons, 4);
        totalScore += this.matchList(asset.targetCaseManagementSystems, [profile.caseManagementSystem], 'case management system', reasons, 5);
        totalScore += this.matchList(asset.targetLeadStatuses, [profile.leadStatus], 'lead status', reasons, 3);
        for (const painPoint of profile.painPoints) {
            totalScore += this.matchKeywords(asset.targetPainPoints, painPoint, 'pain point', reasons, 5);
        }
        if (profile.enrichment) {
            const enrichmentBlob = Object.values(profile.enrichment).join(' ').toLowerCase();
            totalScore += this.matchKeywords(asset.targetEnrichmentSignals, enrichmentBlob, 'enrichment signal', reasons, 4);
            if (profile.enrichment.competitor_mentioned &&
                asset.tags.some((tag) => tag.includes('competitor'))) {
                totalScore += 6;
                reasons.push(`Competitor signal (${profile.enrichment.competitor_mentioned}) aligns with competitive asset`);
            }
        }
        if (profile.previouslySentAssetIds.includes(asset.id)) {
            totalScore -= PREVIOUSLY_SENT_PENALTY;
            penalties.push(`Previously sent in outreach (-${PREVIOUSLY_SENT_PENALTY}); fresh asset preferred`);
        }
        if (profile.bouncedInteractionCount >= 2) {
            totalScore -= BOUNCED_FIRM_PENALTY;
            penalties.push(`Firm has ${profile.bouncedInteractionCount} bounced interactions (-${BOUNCED_FIRM_PENALTY}); softer top-of-funnel asset bias`);
        }
        return {
            assetId: asset.id,
            assetTitle: asset.title,
            totalScore: Math.max(totalScore, 0),
            reasons,
            penalties,
        };
    }
    matchList(targets, values, label, reasons, points) {
        const normalizedTargets = targets.map((value) => value.toLowerCase());
        for (const value of values) {
            const normalized = value.toLowerCase();
            if (normalizedTargets.some((target) => normalized.includes(target) || target.includes(normalized))) {
                reasons.push(`Matched ${label}: ${value} (+${points})`);
                return points;
            }
        }
        return 0;
    }
    matchKeywords(targets, haystack, label, reasons, points) {
        const normalizedHaystack = haystack.toLowerCase();
        for (const target of targets) {
            if (normalizedHaystack.includes(target.toLowerCase())) {
                reasons.push(`Matched ${label} keyword "${target}" (+${points})`);
                return points;
            }
        }
        return 0;
    }
};
exports.AssetMatcherService = AssetMatcherService;
exports.AssetMatcherService = AssetMatcherService = __decorate([
    (0, common_1.Injectable)()
], AssetMatcherService);
//# sourceMappingURL=asset-matcher.service.js.map