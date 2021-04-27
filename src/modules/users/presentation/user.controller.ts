import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserLocalController } from './controllers/createUserLocal/create-user-local.controller';
import { CreateUserLocalRequest } from './controllers/createUserLocal/request';
import { CreateUserLocalResponse } from './controllers/createUserLocal/response';
import { LoginUserController } from './controllers/loginUser/login-user.controller';
import { LoginUserRequest } from './controllers/loginUser/request';
import { LoginUserResponse } from './controllers/loginUser/response';
import { RefreshTokenController } from './controllers/refreshToken/refresh-token.controller';
import { RefreshTokenRequest } from './controllers/refreshToken/request';
import { RefreshTokenResponse } from './controllers/refreshToken/response';
// import { LoginUserUseCase } from '../application/use-cases/login-user.usecase';

@ApiTags('users')
@ApiBearerAuth()
@Controller('auth')
@Controller()
export class UsersController {
  constructor(
    private createUserCtx: CreateUserLocalController,
    private loginUserCtx: LoginUserController,
    private refreshTokenCtx: RefreshTokenController,
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

  @Post('/tokens/refresh')
  async refreshToken(
    @Body() data: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    return this.refreshTokenCtx.execute(data);
  }
}
