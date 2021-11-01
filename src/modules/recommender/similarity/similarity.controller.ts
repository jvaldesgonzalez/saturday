import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
import { SimilarityReadService } from './similarity.read-service';

@ApiBearerAuth()
@ApiTags('similarity')
@Controller('similarity')
export class SimilarityController {
  constructor(private readService: SimilarityReadService) {}

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Get('/accounts/me')
  async getSimilarAccounts(
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('take', ParseIntPipe) limit = 8,
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getSimilarAccounts(payload.id, skip, limit);
  }

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Get('/events/:eventId')
  async getSimilarEvents(
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('take', ParseIntPipe) limit = 8,
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getSimilarEvents(
      eventId,
      skip,
      limit,
      payload.id,
    );
  }
}
