import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { GetStatsResumeByHost } from './controllers/getResumeByHost/get-resume-by-host.controller';
import { GetResumeByHostResponse } from './controllers/getResumeByHost/response';

@ApiTags('stats')
@ApiBearerAuth()
@Controller('stats')
export class StatsRouter {
  constructor(private getResumeByHostCtx: GetStatsResumeByHost) {}
  @UseGuards(JwtAuthGuard)
  @Get('me/resume')
  @ApiOkResponse({ type: GetResumeByHostResponse })
  async getMyResume(@CurrentUser() user: JWTClaims) {
    return this.getResumeByHostCtx.execute({ hostId: user.id });
  }
}
