import { Put, UseGuards } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { JWTClaims } from '../domain/value-objects/token.value';
import { ChangeUsernameController } from './controllers/changeUsername/change-username.controller';
import { ChangeUsernameBody } from './controllers/changeUsername/request';
import { ChangeUsernameResponse } from './controllers/changeUsername/response';
import { CHeckUsernameController } from './controllers/checkUsername/check-username.controller';
import { CheckUsernameRequest } from './controllers/checkUsername/request';
import { CheckUsernameResponse } from './controllers/checkUsername/response';
import { CreateUserLocalController } from './controllers/createUserLocal/create-user-local.controller';
import { CreateUserLocalRequest } from './controllers/createUserLocal/request';
import { CreateUserLocalResponse } from './controllers/createUserLocal/response';
import { LoginUserController } from './controllers/loginUser/login-user.controller';
import { LoginUserRequest } from './controllers/loginUser/request';
import { LoginUserResponse } from './controllers/loginUser/response';
import { RefreshTokenController } from './controllers/refreshToken/refresh-token.controller';
import { RefreshTokenRequest } from './controllers/refreshToken/request';
import { RefreshTokenResponse } from './controllers/refreshToken/response';

@ApiTags('users')
@ApiBearerAuth()
@Controller('auth')
@Controller()
export class UsersController {
  constructor(
    private createUserCtx: CreateUserLocalController,
    private loginUserCtx: LoginUserController,
    private refreshTokenCtx: RefreshTokenController,
    private checkUsernameCtx: CHeckUsernameController,
    private changeUsernameCtx: ChangeUsernameController,
  ) {}
  @Post('/local')
  async createLocal(
    @Body() data: CreateUserLocalRequest,
  ): Promise<CreateUserLocalResponse> {
    return this.createUserCtx.execute(data);
  }

  @Post('/local/login')
  async loginLocal(@Body() data: LoginUserRequest): Promise<LoginUserResponse> {
    return this.loginUserCtx.execute(data);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() data: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    return this.refreshTokenCtx.execute(data);
  }

  @Post('/username/check')
  async checkUsername(
    @Body() data: CheckUsernameRequest,
  ): Promise<CheckUsernameResponse> {
    return this.checkUsernameCtx.execute(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/username')
  async changeUsername(
    @CurrentUser() user: JWTClaims,
    @Body() data: ChangeUsernameBody,
  ): Promise<ChangeUsernameResponse> {
    return this.changeUsernameCtx.execute({ userId: user.id, ...data });
  }
}
