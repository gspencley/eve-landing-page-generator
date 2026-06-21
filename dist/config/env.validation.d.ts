import { z } from 'zod';
export declare const envSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodNumber>;
    PUBLIC_BASE_URL: z.ZodDefault<z.ZodString>;
    SLACK_SIGNING_SECRET: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    DATABASE_PATH: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    PUBLIC_BASE_URL: string;
    PORT: number;
    SLACK_SIGNING_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
    DATABASE_PATH: string;
}, {
    PUBLIC_BASE_URL?: string | undefined;
    PORT?: number | undefined;
    SLACK_SIGNING_SECRET?: string | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    DATABASE_PATH?: string | undefined;
}>;
export type EnvConfig = z.infer<typeof envSchema>;
export declare function validateEnv(config: Record<string, unknown>): EnvConfig;
