import { Injectable } from '@nestjs/common';
import { PageGenerationService } from './page-generation.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LandingPageViewService {
  constructor(private readonly configService: ConfigService) {}

  createViewModelForLandingPage(
    page: Awaited<ReturnType<PageGenerationService['findBySlug']>>,
    path: string,
  ) {
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
      publicBaseUrl: this.configService.get('PUBLIC_BASE_URL', { infer: true }),
      currentPath: path,
    };
  }
}
