"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const page_entity_1 = require("./entities/page.entity");
const page_event_entity_1 = require("./entities/page-event.entity");
const page_generation_service_1 = require("./services/page-generation.service");
const landing_page_controller_1 = require("./controllers/landing-page.controller");
const analytics_controller_1 = require("./controllers/analytics.controller");
const firms_module_1 = require("../firms/firms.module");
const assets_module_1 = require("../assets/assets.module");
let PagesModule = class PagesModule {
};
exports.PagesModule = PagesModule;
exports.PagesModule = PagesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([page_entity_1.PageEntity, page_event_entity_1.PageEventEntity]), firms_module_1.FirmsModule, assets_module_1.AssetsModule],
        controllers: [landing_page_controller_1.LandingPageController, analytics_controller_1.AnalyticsController],
        providers: [page_generation_service_1.PageGenerationService],
        exports: [page_generation_service_1.PageGenerationService],
    })
], PagesModule);
//# sourceMappingURL=pages.module.js.map