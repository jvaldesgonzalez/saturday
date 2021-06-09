import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { RegisterBusinessController } from './controllers/registerBusiness/register-business.controller';
import { RegisterBusinessBody } from './controllers/registerBusiness/request';
import { RegisterBusinessResponse } from './controllers/registerBusiness/response';

@ApiTags('hosts')
@ApiBearerAuth()
@Controller('hosts')
export class HostsRouter {
  constructor(private registerBusinessCtx: RegisterBusinessController) {}

  @UseGuards(JwtAuthGuard)
  @Post('/register-business')
  async registerBusiness(
    @CurrentUser() user: JWTClaims,
    @Body() data: RegisterBusinessBody,
  ): Promise<RegisterBusinessResponse> {
    return this.registerBusinessCtx.execute({ userId: user.id, ...data });
  }
}
