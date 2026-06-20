import { DataService } from '../data/data.service';
import { FirmLookupResult } from './firm-profile.types';
export declare class FirmLookupService {
    private readonly dataService;
    constructor(dataService: DataService);
    findFirm(query: string): FirmLookupResult;
    listFirmNames(): string[];
    private buildProfile;
    private suggestSimilar;
}
