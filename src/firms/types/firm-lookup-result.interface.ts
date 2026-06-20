import { FirmProfile } from './firm-profile.interface';

export interface FirmLookupResult {
  profile: FirmProfile;
  matchedName: string;
  matchConfidence: 'exact' | 'fuzzy';
}
