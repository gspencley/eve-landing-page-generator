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
exports.SlackController = void 0;
const common_1 = require("@nestjs/common");
const slack_signature_service_1 = require("./slack-signature.service");
const slack_response_service_1 = require("./slack-response.service");
const page_generation_service_1 = require("../pages/page-generation.service");
const firm_profile_types_1 = require("../firms/firm-profile.types");
let SlackController = class SlackController {
    constructor(slackSignatureService, slackResponseService, pageGenerationService) {
        this.slackSignatureService = slackSignatureService;
        this.slackResponseService = slackResponseService;
        this.pageGenerationService = pageGenerationService;
    }
    async handleSlashCommand(req, body, timestamp, signature) {
        const rawBody = req.rawBody ?? Buffer.from(new URLSearchParams(body).toString());
        this.slackSignatureService.verify(rawBody, timestamp, signature);
        const firmQuery = (body.text ?? '').trim();
        if (!firmQuery) {
            throw new common_1.BadRequestException('Usage: /generate-page <Firm Name> — e.g. `/generate-page Cellino Law`');
        }
        const responseUrl = body.response_url;
        if (responseUrl) {
            void this.generateAndRespond(firmQuery, responseUrl);
            return this.slackResponseService.buildImmediateAck(`Generating a personalized landing page for *${firmQuery}*…`);
        }
        return this.generateSync(firmQuery);
    }
    async generateAndRespond(firmQuery, responseUrl) {
        try {
            const page = await this.pageGenerationService.generatePageForFirm(firmQuery);
            const url = this.pageGenerationService.getPublicUrl(page.slug);
            await this.slackResponseService.postToResponseUrl(responseUrl, this.slackResponseService.buildSuccessMessage(page.firmName, url));
        }
        catch (error) {
            const message = error instanceof firm_profile_types_1.FirmNotFoundError
                ? error.message
                : `Failed to generate page for "${firmQuery}". Please try again.`;
            await this.slackResponseService.postToResponseUrl(responseUrl, this.slackResponseService.buildErrorMessage(message));
        }
    }
    async generateSync(firmQuery) {
        try {
            const page = await this.pageGenerationService.generatePageForFirm(firmQuery);
            const url = this.pageGenerationService.getPublicUrl(page.slug);
            return this.slackResponseService.buildSuccessMessage(page.firmName, url);
        }
        catch (error) {
            if (error instanceof firm_profile_types_1.FirmNotFoundError) {
                return this.slackResponseService.buildErrorMessage(error.message);
            }
            throw error;
        }
    }
};
exports.SlackController = SlackController;
__decorate([
    (0, common_1.Post)('commands'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-slack-request-timestamp')),
    __param(3, (0, common_1.Headers)('x-slack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], SlackController.prototype, "handleSlashCommand", null);
exports.SlackController = SlackController = __decorate([
    (0, common_1.Controller)('slack'),
    __metadata("design:paramtypes", [slack_signature_service_1.SlackSignatureService,
        slack_response_service_1.SlackResponseService,
        page_generation_service_1.PageGenerationService])
], SlackController);
//# sourceMappingURL=slack.controller.js.map