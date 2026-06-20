import { Controller, Get } from '@nestjs/common';
import { FirmLookupService } from '../services/firm-lookup.service';

@Controller('firms')
export class FirmsController {
  constructor(private readonly firmLookupService: FirmLookupService) {}

  @Get()
  async getAll(): Promise<string[]> {
    return this.firmLookupService.listFirmNames();
  }
}
