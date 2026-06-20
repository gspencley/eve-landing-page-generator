export class FirmNotFoundError extends Error {
  constructor(
    public readonly query: string,
    public readonly suggestions: string[] = [],
  ) {
    super(
      suggestions.length > 0
        ? `Firm "${query}" not found. Did you mean: ${suggestions.join(', ')}?`
        : `Firm "${query}" not found.`,
    );
    this.name = 'FirmNotFoundError';
  }
}
