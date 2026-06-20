export interface SlackImmediateResponse {
  response_type: 'ephemeral' | 'in_channel';
  text: string;
}
