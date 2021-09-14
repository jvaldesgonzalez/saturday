import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserErrors } from '../users/application/use-cases/create-user/create-user.errors';
import { AuthProvider } from '../users/domain/value-objects/auth-provider.value';
import { CheckUserStatusErrors } from './application/use-cases/check-user-status/check-user-status.errors';
import { CheckUserStatusFacebook } from './application/use-cases/check-user-status/check-user-status.facebook.usecase';
import { LoginUser } from './application/use-cases/login/login.usecase';
import { RegisterUser } from './application/use-cases/register-user/register-user.usecase';
import { CheckUserStatusFbRequest } from './presentation/check-user-status';
import { LoginUserRequest } from './presentation/login-user';
import { RegisterUserRequest } from './presentation/register-user';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private checkUserStatusFbUC: CheckUserStatusFacebook,
    private registerUserUC: RegisterUser,
    private loginUserUC: LoginUser,
  ) {}

  @Post('/facebook/check-user-status')
  async checkUserStatusFb(@Body() data: CheckUserStatusFbRequest) {
    const result = await this.checkUserStatusFbUC.execute(data);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CheckUserStatusErrors.UserNotFoundInProvider:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }

  @Post('/facebook/register')
  async registerUser(@Body() data: RegisterUserRequest) {
    const { loginParams, ...rest } = data;
    const result = await this.registerUserUC.execute({
      ...rest,
      ...loginParams,
      authProvider: AuthProvider.Facebook,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CreateUserErrors.EmailExistsError:
          throw new ConflictException(error.errorValue().message);
        case CheckUserStatusErrors.UserNotFoundInProvider:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }

  @Post('facebook/login')
  async loginUser(@Body() data: LoginUserRequest) {
    const result = await this.loginUserUC.execute(data);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CheckUserStatusErrors.UserNotFoundInProvider:
          throw new ConflictException(error.errorValue().message);
        case CheckUserStatusErrors.UserNotFoundInDatabase:
          throw new UnauthorizedException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
