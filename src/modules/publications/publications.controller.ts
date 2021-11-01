import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { PublicationsReadService } from './publications.read-service';

@ApiBearerAuth()
@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private readService: PublicationsReadService) {}

  @Get('home')
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async getHome(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getHome(limit, skip, payload.id);
  }
}
