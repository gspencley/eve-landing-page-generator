"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvFile = parseCsvFile;
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
function parseCsvFile(filePath) {
    if (!(0, fs_1.existsSync)(filePath)) {
        return [];
    }
    const content = (0, fs_1.readFileSync)(filePath, 'utf-8');
    return (0, sync_1.parse)(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
}
//# sourceMappingURL=csv.parser.js.map