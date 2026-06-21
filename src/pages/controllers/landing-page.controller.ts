import { Controller, Get, NotFoundException, Param, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { PageGenerationService } from '../services/page-generation.service';
import { LandingPageViewService } from '../services/landing-page-view.service';

@Controller()
export class LandingPageController {
  constructor(
    private readonly pageGenerationService: PageGenerationService,
    private readonly viewService: LandingPageViewService,
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
          return this.viewService.createViewModelForLandingPage(generated, req.path);
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

    return this.viewService.createViewModelForLandingPage(page, req.path);
  }
}
