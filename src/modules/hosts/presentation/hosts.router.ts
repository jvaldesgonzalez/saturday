import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { GetResumeByHostResponse } from 'src/shared/modules/stats/types/responses/get-host-stats-resume';
import { GetHostStatsResponse } from 'src/shared/modules/stats/types/responses/get-host-stats.response';
import { GetHostStatsController } from './controllers/getHostStats/get-host-stats.controller';
import { GetHostStatsResumeController } from './controllers/getHostStatsResume/get-host-stats-resume.controller';
import { GetHostProfileController } from './controllers/getProfile/get-profile.controller';
import { GetHostProfileResponse } from './controllers/getProfile/response';
import { RegisterBusinessController } from './controllers/registerBusiness/register-business.controller';
import { RegisterBusinessBody } from './controllers/registerBusiness/request';
import { RegisterBusinessResponse } from './controllers/registerBusiness/response';
import { UpdateBusinessDetailsBody } from './controllers/updateBusinessDetails/request';
import { UpdateBusinessDetailsResponse } from './controllers/updateBusinessDetails/response';
import { UpdateBusinessDetailsController } from './controllers/updateBusinessDetails/update-business-details.controller';

@ApiTags('hosts')
@ApiBearerAuth()
@Controller('hosts')
export class HostsRouter {
  constructor(
    private registerBusinessCtx: RegisterBusinessController,
    private updateBusinessCtx: UpdateBusinessDetailsController,
    private getHostProfileCtx: GetHostProfileController,
    private getHostStatsResumeCtx: GetHostStatsResumeController,
    private getHostStatsCtx: GetHostStatsController,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/business/')
  // @ApiOperation({ deprecated: true })
  @ApiOkResponse({ type: RegisterBusinessResponse })
  async registerBusiness(
    @CurrentUser() user: JWTClaims,
    @Body() data: RegisterBusinessBody,
  ): Promise<RegisterBusinessResponse> {
    return this.registerBusinessCtx.execute({ userId: user.id, ...data });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/business')
  @ApiOkResponse({ type: UpdateBusinessDetailsResponse })
  async updateBusiness(
    @CurrentUser() user: JWTClaims,
    @Body() data: UpdateBusinessDetailsBody,
  ): Promise<UpdateBusinessDetailsResponse> {
    return this.updateBusinessCtx.execute({ userId: user.id, ...data });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiOkResponse({ type: GetHostProfileResponse })
  async getProfile(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetHostProfileResponse> {
    return this.getHostProfileCtx.execute({ hostId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stats/preview')
  @ApiOkResponse({ type: GetResumeByHostResponse })
  async getMyResume(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetResumeByHostResponse> {
    return this.getHostStatsResumeCtx.execute({ hostId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stats')
  @ApiQuery({ name: 'fromDate', type: Date })
  @ApiQuery({ name: 'toDate', type: Date })
  @ApiOkResponse({ type: GetHostStatsResponse })
  async getHostStats(
    @CurrentUser() user: JWTClaims,
    @Query('fromDate') fromDate: Date,
    @Query('toDate') toDate: Date,
  ): Promise<GetHostStatsResponse> {
    return this.getHostStatsCtx.execute({ hostId: user.id, fromDate, toDate });
  }
}
