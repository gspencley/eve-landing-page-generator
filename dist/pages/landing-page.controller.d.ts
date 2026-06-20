import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PageGenerationService } from './page-generation.service';
import { EnvConfig } from '../config/env.validation';
export declare class LandingPageController {
    private readonly pageGenerationService;
    private readonly configService;
    constructor(pageGenerationService: PageGenerationService, configService: ConfigService<EnvConfig, true>);
    health(): {
        ok: boolean;
    };
    renderLandingPage(slug: string, req: Request): Promise<{
        title: string;
        metaDescription: string;
        pageId: string;
        firmName: string;
        heroCopy: string;
        firmAttributes: Record<string, unknown>;
        assets: {
            id: string;
            title: string;
            description: string;
            ctaLabel: string;
            url: string;
            type: import("../assets/asset.types").AssetType;
        }[];
        scoringExplanations: import("../assets/asset.types").AssetScoreBreakdown[];
        publicBaseUrl: string;
        currentPath: string;
    }>;
    private toViewModel;
}
