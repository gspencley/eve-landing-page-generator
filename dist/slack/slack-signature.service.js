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
exports.SlackSignatureService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let SlackSignatureService = class SlackSignatureService {
    constructor(configService) {
        this.configService = configService;
    }
    verify(rawBody, timestamp, signature) {
        const signingSecret = this.configService.get('SLACK_SIGNING_SECRET', { infer: true });
        if (!signingSecret) {
            if (this.configService.get('NODE_ENV', { infer: true }) === 'development') {
                return;
            }
            throw new common_1.UnauthorizedException('Slack signing secret is not configured');
        }
        if (!timestamp || !signature) {
            throw new common_1.UnauthorizedException('Missing Slack signature headers');
        }
        const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
        if (Number(timestamp) < fiveMinutesAgo) {
            throw new common_1.UnauthorizedException('Slack request timestamp is too old');
        }
        const basestring = `v0:${timestamp}:${rawBody.toString('utf8')}`;
        const digest = `v0=${(0, crypto_1.createHmac)('sha256', signingSecret).update(basestring).digest('hex')}`;
        const expected = Buffer.from(digest, 'utf8');
        const received = Buffer.from(signature, 'utf8');
        if (expected.length !== received.length || !(0, crypto_1.timingSafeEqual)(expected, received)) {
            throw new common_1.UnauthorizedException('Invalid Slack request signature');
        }
    }
};
exports.SlackSignatureService = SlackSignatureService;
exports.SlackSignatureService = SlackSignatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SlackSignatureService);
//# sourceMappingURL=slack-signature.service.js.map