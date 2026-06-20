"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmNotFoundError = void 0;
class FirmNotFoundError extends Error {
    constructor(query, suggestions = []) {
        super(suggestions.length > 0
            ? `Firm "${query}" not found. Did you mean: ${suggestions.join(', ')}?`
            : `Firm "${query}" not found.`);
        this.query = query;
        this.suggestions = suggestions;
        this.name = 'FirmNotFoundError';
    }
}
exports.FirmNotFoundError = FirmNotFoundError;
//# sourceMappingURL=firm-profile.types.js.map