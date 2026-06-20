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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PageGenerationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageGenerationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("typeorm");
const nanoid_1 = require("nanoid");
const page_entity_1 = require("./page.entity");
const page_event_entity_1 = require("./page-event.entity");
const page_event_types_1 = require("./page-event.types");
const firm_lookup_service_1 = require("../firms/firm-lookup.service");
const firm_profile_types_1 = require("../firms/firm-profile.types");
const asset_matcher_service_1 = require("../assets/asset-matcher.service");
const normalize_firm_name_1 = require("../data/normalize-firm-name");
let PageGenerationService = PageGenerationService_1 = class PageGenerationService {
    constructor(pageRepository, eventRepository, firmLookupService, assetMatcherService, configService) {
        this.pageRepository = pageRepository;
        this.eventRepository = eventRepository;
        this.firmLookupService = firmLookupService;
        this.assetMatcherService = assetMatcherService;
        this.configService = configService;
        this.logger = new common_1.Logger(PageGenerationService_1.name);
    }
    async generatePageForFirm(firmQuery) {
        const lookup = this.firmLookupService.findFirm(firmQuery);
        const { profile } = lookup;
        const matchResult = this.assetMatcherService.matchAssets(profile);
        const slug = this.buildSlug(profile.firmName);
        const existing = await this.pageRepository.findOne({ where: { slug } });
        if (existing) {
            return existing;
        }
        const heroCopy = this.buildHeroCopy(profile.firmName, profile.painPoints);
        const metaTitle = `${profile.firmName} + Eve | AI for Plaintiff Firms`;
        const metaDescription = `Personalized resources for ${profile.firmName} on intake, demand drafting, and case evaluation with Eve.`;
        const page = this.pageRepository.create({
            id: (0, nanoid_1.nanoid)(),
            slug,
            firmName: profile.firmName,
            heroCopy,
            metaTitle,
            metaDescription,
            firmAttributes: {
                industry: profile.industry,
                practiceArea: profile.practiceArea,
                firmSize: profile.firmSize,
                intakeMethod: profile.intakeMethod,
                painPoints: profile.painPoints,
                caseManagementSystem: profile.caseManagementSystem,
                leadStatus: profile.leadStatus,
                enrichment: profile.enrichment,
                matchConfidence: lookup.matchConfidence,
            },
            selectedAssets: matchResult.selectedAssets,
            scoringExplanations: matchResult.explanations,
        });
        const saved = await this.pageRepository.save(page);
        this.logger.log(`Generated landing page for ${profile.firmName} at /p/${slug}`);
        return saved;
    }
    async findBySlug(slug) {
        return this.pageRepository.findOne({ where: { slug } });
    }
    async recordPageView(page) {
        await this.recordEvent(page.id, page_event_types_1.PageEventType.PAGE_VIEW);
    }
    async recordEvent(pageId, eventType, assetId, metadata) {
        const page = await this.pageRepository.findOne({ where: { id: pageId } });
        if (!page) {
            throw new common_1.NotFoundException(`Page ${pageId} not found`);
        }
        const event = this.eventRepository.create({
            id: (0, nanoid_1.nanoid)(),
            pageId,
            eventType,
            assetId,
            metadata,
        });
        return this.eventRepository.save(event);
    }
    async listPages() {
        return this.pageRepository.find({ order: { createdAt: 'DESC' } });
    }
    async listEvents() {
        return this.eventRepository.find({
            relations: ['page'],
            order: { createdAt: 'DESC' },
        });
    }
    getPublicUrl(slug) {
        const baseUrl = this.configService.get('PUBLIC_BASE_URL', { infer: true });
        return `${baseUrl}/p/${slug}`;
    }
    buildSlug(firmName) {
        const normalized = (0, normalize_firm_name_1.normalizeFirmName)(firmName).replace(/\s+/g, '-');
        return normalized || 'landing-page';
    }
    translateFirmError(error) {
        if (error instanceof firm_profile_types_1.FirmNotFoundError) {
            throw new common_1.NotFoundException(error.message);
        }
        throw error;
    }
    buildHeroCopy(firmName, painPoints) {
        const primaryPain = painPoints[0] ?? 'intake and case workflow efficiency';
        return `${firmName}, Eve helps plaintiff firms tackle ${primaryPain} with AI-powered intake, file review, and demand drafting — without replacing your existing stack.`;
    }
};
exports.PageGenerationService = PageGenerationService;
exports.PageGenerationService = PageGenerationService = PageGenerationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_entity_1.PageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(page_event_entity_1.PageEventEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        firm_lookup_service_1.FirmLookupService,
        asset_matcher_service_1.AssetMatcherService,
        config_1.ConfigService])
], PageGenerationService);
//# sourceMappingURL=page-generation.service.js.map