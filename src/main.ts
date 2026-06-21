import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import hbs from 'hbs';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.validation';

async function bootstrap() {
  const env = validateEnv(process.env);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useBodyParser('urlencoded', {
    extended: true,
    verify: (req: { rawBody?: Buffer }, _res: unknown, buf: Buffer) => {
      req.rawBody = buf;
    },
  });

  const viewsPath = join(__dirname, 'views');
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  hbs.registerPartials(join(viewsPath, 'layouts'));
  app.set('view options', { layout: 'layouts/main' });
  app.useStaticAssets(join(__dirname, 'public'));

  await app.listen(env.PORT);
  console.log(`Eve landing page generator running on ${env.PUBLIC_BASE_URL}`);
}

bootstrap();
