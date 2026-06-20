import { Controller, Get, NotFoundException, Param, Render, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PageGenerationService } from './page-generation.service';
import { EnvConfig } from '../config/env.validation';

@Controller()
export class LandingPageController {
  constructor(
    private readonly pageGenerationService: PageGenerationService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  @Get('health')
  health() {
    return { ok: true };
  }

  @Get('p/:slug')
  @Render('landing-page')
  async renderLandingPage(@Param('slug') slug: string, @Req() req: Request) {
    const page = await this.pageGenerationService.findBySlug(slug);

    if (!page) {
      if (slug === 'sample-firm') {
        try {
          const generated = await this.pageGenerationService.generatePageForFirm('Sample Firm');
          await this.pageGenerationService.recordPageView(generated);
          return this.toViewModel(generated, req);
        } catch {
          throw new NotFoundException(
            'Sample page not available. Run /generate-page Sample Firm via Slack or ensure sample data is loaded.',
          );
        }
      }

      throw new NotFoundException(
        `Landing page "${slug}" not found. Generate one with /generate-page <Firm Name> in Slack.`,
      );
    }

    await this.pageGenerationService.recordPageView(page);
    return this.toViewModel(page, req);
  }

  private toViewModel(
    page: Awaited<ReturnType<PageGenerationService['findBySlug']>>,
    req: Request,
  ) {
    const baseUrl = this.configService.get('PUBLIC_BASE_URL', { infer: true });

    return {
      title: page!.metaTitle,
      metaDescription: page!.metaDescription,
      pageId: page!.id,
      firmName: page!.firmName,
      heroCopy: page!.heroCopy,
      firmAttributes: page!.firmAttributes,
      assets: page!.selectedAssets.map((asset) => ({
        id: asset.id,
        title: asset.title,
        description: asset.description,
        ctaLabel: asset.ctaLabel,
        url: asset.url,
        type: asset.type,
      })),
      scoringExplanations: page!.scoringExplanations,
      publicBaseUrl: baseUrl,
      currentPath: req.path,
    };
  }
}
