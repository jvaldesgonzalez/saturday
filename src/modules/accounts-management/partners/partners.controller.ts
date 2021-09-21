import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PartnersReadService } from './partners.read-service';

@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readService: PartnersReadService) {}

  @Get('/profile/:id')
  @ApiParam({ name: 'id' })
  async getProfile(@Param('id') id: string) {
    const partner = await this.readService.getProfile(
      id,
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
    if (!partner) throw new NotFoundException('partner not found');
    return partner;
  }
}
