"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackModule = void 0;
const common_1 = require("@nestjs/common");
const slack_controller_1 = require("./controllers/slack.controller");
const slack_signature_verification_service_1 = require("./services/slack-signature-verification.service");
const slack_response_builder_service_1 = require("./services/slack-response-builder.service");
const pages_module_1 = require("../pages/pages.module");
let SlackModule = class SlackModule {
};
exports.SlackModule = SlackModule;
exports.SlackModule = SlackModule = __decorate([
    (0, common_1.Module)({
        imports: [pages_module_1.PagesModule],
        controllers: [slack_controller_1.SlackController],
        providers: [slack_signature_verification_service_1.SlackSignatureVerificationService, slack_response_builder_service_1.SlackResponseBuilderService],
    })
], SlackModule);
//# sourceMappingURL=slack.module.js.map