import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserLocalController } from './controllers/createUserLocal/create-user-local.controller';
import { CreateUserLocalRequest } from './controllers/createUserLocal/request';
import { CreateUserLocalResponse } from './controllers/createUserLocal/response';
// import { LoginUserUseCase } from '../application/use-cases/login-user.usecase';

@ApiTags('users')
@ApiBearerAuth()
@Controller('auth')
@Controller()
export class UsersController {
  constructor(private ctr: CreateUserLocalController) {}
  @Post('/auth/local')
  async createLocal(
    @Body() data: CreateUserLocalRequest,
  ): Promise<CreateUserLocalResponse> {
    return this.ctr.execute(data);
  }
}
