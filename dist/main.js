"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const hbs_1 = __importDefault(require("hbs"));
const app_module_1 = require("./app.module");
const env_validation_1 = require("./config/env.validation");
async function bootstrap() {
    const env = (0, env_validation_1.validateEnv)(process.env);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useBodyParser('urlencoded', {
        extended: true,
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    });
    const viewsPath = (0, path_1.join)(__dirname, 'views');
    app.setBaseViewsDir(viewsPath);
    app.setViewEngine('hbs');
    hbs_1.default.registerPartials((0, path_1.join)(viewsPath, 'layouts'));
    app.set('view options', { layout: 'layouts/main' });
    await app.listen(env.PORT);
    console.log(`Eve landing page generator running on ${env.PUBLIC_BASE_URL}`);
}
bootstrap();
//# sourceMappingURL=main.js.map