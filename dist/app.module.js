"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const env_validation_1 = require("./config/env.validation");
const data_module_1 = require("./data/data.module");
const firms_module_1 = require("./firms/firms.module");
const assets_module_1 = require("./assets/assets.module");
const pages_module_1 = require("./pages/pages.module");
const slack_module_1 = require("./slack/slack.module");
const page_entity_1 = require("./pages/entities/page.entity");
const page_event_entity_1 = require("./pages/entities/page-event.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.example'],
                validate: env_validation_1.validateEnv,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'sqlite',
                    database: configService.get('DATABASE_PATH') ?? './data/app.sqlite',
                    entities: [page_entity_1.PageEntity, page_event_entity_1.PageEventEntity],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                }),
            }),
            data_module_1.DataModule,
            firms_module_1.FirmsModule,
            assets_module_1.AssetsModule,
            pages_module_1.PagesModule,
            slack_module_1.SlackModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map