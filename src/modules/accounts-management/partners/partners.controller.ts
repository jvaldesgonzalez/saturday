import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JWTClaim } from '../auth/login-payload.type';
import { PartnersReadService } from './partners.read-service';

@ApiBearerAuth()
@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readService: PartnersReadService) {}

  @Get('/:id/profile')
  @ApiParam({ name: 'id' })
  async getProfile(@Param('id') id: string, @CurrentUser() payload: JWTClaim) {
    const partner = await this.readService.getProfile(id, payload.id);
    if (!partner) throw new NotFoundException('partner not found');
    return partner;
  }
}
