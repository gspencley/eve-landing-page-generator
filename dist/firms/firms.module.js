"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmsModule = void 0;
const common_1 = require("@nestjs/common");
const data_module_1 = require("../data/data.module");
const firm_lookup_service_1 = require("./services/firm-lookup.service");
const firm_profile_builder_service_1 = require("./services/firm-profile-builder.service");
const firms_controller_1 = require("./controllers/firms.controller");
let FirmsModule = class FirmsModule {
};
exports.FirmsModule = FirmsModule;
exports.FirmsModule = FirmsModule = __decorate([
    (0, common_1.Module)({
        imports: [data_module_1.DataModule],
        providers: [firm_profile_builder_service_1.FirmProfileBuilderService, firm_lookup_service_1.FirmLookupService],
        exports: [firm_lookup_service_1.FirmLookupService],
        controllers: [firms_controller_1.FirmsController],
    })
], FirmsModule);
//# sourceMappingURL=firms.module.js.map