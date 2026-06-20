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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const page_generation_service_1 = require("./page-generation.service");
const page_event_types_1 = require("./page-event.types");
let AnalyticsController = class AnalyticsController {
    constructor(pageGenerationService) {
        this.pageGenerationService = pageGenerationService;
    }
    async recordEvent(body) {
        if (!body.pageId || !body.eventType) {
            throw new common_1.BadRequestException('pageId and eventType are required');
        }
        if (!Object.values(page_event_types_1.PageEventType).includes(body.eventType)) {
            throw new common_1.BadRequestException(`Invalid eventType: ${body.eventType}`);
        }
        try {
            const event = await this.pageGenerationService.recordEvent(body.pageId, body.eventType, body.assetId, body.metadata);
            return { ok: true, eventId: event.id };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw error;
        }
    }
    async listPages() {
        const pages = await this.pageGenerationService.listPages();
        return {
            count: pages.length,
            pages: pages.map((page) => ({
                id: page.id,
                slug: page.slug,
                firmName: page.firmName,
                url: this.pageGenerationService.getPublicUrl(page.slug),
                createdAt: page.createdAt,
                assetCount: page.selectedAssets.length,
            })),
        };
    }
    async listEvents() {
        const events = await this.pageGenerationService.listEvents();
        return {
            count: events.length,
            events: events.map((event) => ({
                id: event.id,
                pageId: event.pageId,
                firmName: event.page?.firmName,
                eventType: event.eventType,
                assetId: event.assetId,
                metadata: event.metadata,
                createdAt: event.createdAt,
            })),
        };
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)('events'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "recordEvent", null);
__decorate([
    (0, common_1.Get)('admin/pages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "listPages", null);
__decorate([
    (0, common_1.Get)('admin/events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "listEvents", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [page_generation_service_1.PageGenerationService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map