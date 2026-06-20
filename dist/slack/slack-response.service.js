"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SlackResponseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackResponseService = void 0;
const common_1 = require("@nestjs/common");
let SlackResponseService = SlackResponseService_1 = class SlackResponseService {
    constructor() {
        this.logger = new common_1.Logger(SlackResponseService_1.name);
    }
    buildImmediateAck(message) {
        return {
            response_type: 'ephemeral',
            text: message,
        };
    }
    buildSuccessMessage(firmName, url) {
        return {
            response_type: 'in_channel',
            text: `Landing page ready for *${firmName}*: ${url}`,
        };
    }
    buildErrorMessage(message) {
        return {
            response_type: 'ephemeral',
            text: message,
        };
    }
    async postToResponseUrl(responseUrl, payload) {
        try {
            const response = await fetch(responseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                this.logger.warn(`Slack response_url POST failed: ${response.status}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to post follow-up to Slack response_url', error);
        }
    }
};
exports.SlackResponseService = SlackResponseService;
exports.SlackResponseService = SlackResponseService = SlackResponseService_1 = __decorate([
    (0, common_1.Injectable)()
], SlackResponseService);
//# sourceMappingURL=slack-response.service.js.map