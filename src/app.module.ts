import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config/env.validation';
import { DataModule } from './data/data.module';
import { FirmsModule } from './firms/firms.module';
import { PagesModule } from './pages/pages.module';
import { SlackModule } from './slack/slack.module';
import { PageEntity } from './pages/entities/page.entity';
import { PageEventEntity } from './pages/entities/page-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH') ?? './data/app.sqlite',
        entities: [PageEntity, PageEventEntity],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    DataModule,
    FirmsModule,
    PagesModule,
    SlackModule,
  ],
})
export class AppModule {}
