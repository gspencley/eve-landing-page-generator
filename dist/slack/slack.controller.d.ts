import { Request } from 'express';
import { SlackSignatureService } from './slack-signature.service';
import { SlackResponseService } from './slack-response.service';
import { PageGenerationService } from '../pages/page-generation.service';
interface SlackSlashCommandPayload {
    command?: string;
    text?: string;
    response_url?: string;
    user_name?: string;
}
interface RawBodyRequest extends Request {
    rawBody?: Buffer;
}
export declare class SlackController {
    private readonly slackSignatureService;
    private readonly slackResponseService;
    private readonly pageGenerationService;
    constructor(slackSignatureService: SlackSignatureService, slackResponseService: SlackResponseService, pageGenerationService: PageGenerationService);
    handleSlashCommand(req: RawBodyRequest, body: SlackSlashCommandPayload, timestamp: string, signature: string): Promise<import("./slack-response.service").SlackImmediateResponse>;
    private generateAndRespond;
    private generateSync;
}
export {};
