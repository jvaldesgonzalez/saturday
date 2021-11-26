import {
  Body,
  ConflictException,
  Controller,
  ImATeapotException,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePartnerErrors } from '../partners/application/usecases/createPartner/create-partner.errors';
import { CreateUserErrors } from '../users/application/use-cases/create-user/create-user.errors';
import { AuthProvider } from '../users/domain/value-objects/auth-provider.value';
import { CheckUserStatusErrors } from './application/use-cases/check-user-status/check-user-status.errors';
import { CheckUserStatusFacebook } from './application/use-cases/check-user-status/check-user-status.facebook.usecase';
import { LoginPartner } from './application/use-cases/login-partner/login-partner.usecase';
import { LoginUser } from './application/use-cases/login/login.usecase';
import { RefreshTokenErrors } from './application/use-cases/refresh-token/refresh-token.errors';
import { RefreshToken } from './application/use-cases/refresh-token/refresh-token.usecase';
import { RegisterPartner } from './application/use-cases/register-partner/register-partner.usecase';
import { RegisterUser } from './application/use-cases/register-user/register-user.usecase';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { CheckUserStatusFbRequest } from './presentation/check-user-status';
import { LoginPartnerRequest } from './presentation/login-partner';
import { LoginUserRequest } from './presentation/login-user';
import { RefreshTokenBody } from './presentation/refresh-token.';
import { RegisterPartnerRequest } from './presentation/register-partner';
import { RegisterUserRequest } from './presentation/register-user';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private checkUserStatusFbUC: CheckUserStatusFacebook,
    private registerUserUC: RegisterUser,
    private loginUserUC: LoginUser,
    private refreshUC: RefreshToken,
    private registerPartnerUC: RegisterPartner,
    private loginPartnerUC: LoginPartner,
  ) {}

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Post('/local/register')
  async registerPartner(@Body() data: RegisterPartnerRequest) {
    const { ...rest } = data;
    const result = await this.registerPartnerUC.execute({
      ...rest,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CreatePartnerErrors.EmailExistsError:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }

  @SkipAuth()
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

  @SkipAuth()
  @Post('local/login')
  async loginPartner(@Body() data: LoginPartnerRequest) {
    const result = await this.loginPartnerUC.execute(data);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CheckUserStatusErrors.UserNotFoundInDatabase:
          throw new UnauthorizedException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
  @SkipAuth()
  @Post('issue-token')
  async issueNewToken(@Body() data: RefreshTokenBody) {
    const result = await this.refreshUC.execute(data);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case RefreshTokenErrors.UserNotFoundInDatabase:
          throw new ImATeapotException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
