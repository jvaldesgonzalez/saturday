import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
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
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/business/register')
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
}
