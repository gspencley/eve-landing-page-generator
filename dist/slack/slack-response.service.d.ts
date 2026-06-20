export interface SlackImmediateResponse {
    response_type: 'ephemeral' | 'in_channel';
    text: string;
}
export declare class SlackResponseService {
    private readonly logger;
    buildImmediateAck(message: string): SlackImmediateResponse;
    buildSuccessMessage(firmName: string, url: string): SlackImmediateResponse;
    buildErrorMessage(message: string): SlackImmediateResponse;
    postToResponseUrl(responseUrl: string, payload: SlackImmediateResponse): Promise<void>;
}
