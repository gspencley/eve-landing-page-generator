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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPageController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const page_generation_service_1 = require("./page-generation.service");
let LandingPageController = class LandingPageController {
    constructor(pageGenerationService, configService) {
        this.pageGenerationService = pageGenerationService;
        this.configService = configService;
    }
    health() {
        return { ok: true };
    }
    async renderLandingPage(slug, req) {
        const page = await this.pageGenerationService.findBySlug(slug);
        if (!page) {
            if (slug === 'sample-firm') {
                try {
                    const generated = await this.pageGenerationService.generatePageForFirm('Sample Firm');
                    await this.pageGenerationService.recordPageView(generated);
                    return this.toViewModel(generated, req);
                }
                catch {
                    throw new common_1.NotFoundException('Sample page not available. Run /generate-page Sample Firm via Slack or ensure sample data is loaded.');
                }
            }
            throw new common_1.NotFoundException(`Landing page "${slug}" not found. Generate one with /generate-page <Firm Name> in Slack.`);
        }
        await this.pageGenerationService.recordPageView(page);
        return this.toViewModel(page, req);
    }
    toViewModel(page, req) {
        const baseUrl = this.configService.get('PUBLIC_BASE_URL', { infer: true });
        return {
            title: page.metaTitle,
            metaDescription: page.metaDescription,
            pageId: page.id,
            firmName: page.firmName,
            heroCopy: page.heroCopy,
            firmAttributes: page.firmAttributes,
            assets: page.selectedAssets.map((asset) => ({
                id: asset.id,
                title: asset.title,
                description: asset.description,
                ctaLabel: asset.ctaLabel,
                url: asset.url,
                type: asset.type,
            })),
            scoringExplanations: page.scoringExplanations,
            publicBaseUrl: baseUrl,
            currentPath: req.path,
        };
    }
};
exports.LandingPageController = LandingPageController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LandingPageController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('p/:slug'),
    (0, common_1.Render)('landing-page'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LandingPageController.prototype, "renderLandingPage", null);
exports.LandingPageController = LandingPageController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [page_generation_service_1.PageGenerationService,
        config_1.ConfigService])
], LandingPageController);
//# sourceMappingURL=landing-page.controller.js.map