import { Controller, Get, NotFoundException, Param, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { PageGenerationService } from '../services/page-generation.service';
import { LandingPageViewService } from '../services/landing-page-view.service';
import * as util from 'node:util';

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
    console.log('renderLandingPage');

    const page = await this.pageGenerationService.findBySlug(slug);

    util.inspect(page);

    if (!page) {
      if (slug === 'sample-firm') {
        console.log('TEST');
        try {
          const generated = await this.pageGenerationService.generatePageForFirm('Sample Firm');
          await this.pageGenerationService.recordPageView(generated);
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

    await this.pageGenerationService.recordPageView(page);
    return this.viewService.createViewModelForLandingPage(page, req.path);
  }
}
