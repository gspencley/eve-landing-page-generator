import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../config/env.validation';
export declare class SlackSignatureService {
    private readonly configService;
    constructor(configService: ConfigService<EnvConfig, true>);
    verify(rawBody: Buffer, timestamp: string | undefined, signature: string | undefined): void;
}
