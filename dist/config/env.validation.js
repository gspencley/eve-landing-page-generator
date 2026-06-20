"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3000),
    PUBLIC_BASE_URL: zod_1.z.string().url().default('http://localhost:3000'),
    SLACK_SIGNING_SECRET: zod_1.z.string().optional().default(''),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_PATH: zod_1.z.string().default('./data/app.sqlite'),
});
function validateEnv(config) {
    const parsed = exports.envSchema.safeParse(config);
    if (!parsed.success) {
        throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
    }
    return parsed.data;
}
//# sourceMappingURL=env.validation.js.map