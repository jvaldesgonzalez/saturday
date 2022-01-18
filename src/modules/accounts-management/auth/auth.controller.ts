import {
  Body,
  ConflictException,
  Controller,
  Headers,
  ImATeapotException,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CreatePartnerErrors } from '../partners/application/usecases/createPartner/create-partner.errors';
import { CreateUserErrors } from '../users/application/use-cases/create-user/create-user.errors';
import { AuthProvider } from '../users/domain/value-objects/auth-provider.value';
import { CheckUserStatusErrors } from './application/use-cases/check-user-status/check-user-status.errors';
import { CheckUserStatusFacebook } from './application/use-cases/check-user-status/check-user-status.facebook.usecase';
import { CheckUserStatusGoogle } from './application/use-cases/check-user-status/check-user.status.google.usecase';
import { LoginPartner } from './application/use-cases/login-partner/login-partner.usecase';
import { LoginUserFacebook } from './application/use-cases/login/login.facebook.usecase';
import { LoginUserGoogle } from './application/use-cases/login/login.google.usecase';
import { RefreshTokenErrors } from './application/use-cases/refresh-token/refresh-token.errors';
import { RefreshToken } from './application/use-cases/refresh-token/refresh-token.usecase';
import { RegisterPartner } from './application/use-cases/register-partner/register-partner.usecase';
import { RegisterUserFacebook } from './application/use-cases/register-user/register-user.facebook.usecase';
import { RegisterUserGoogle } from './application/use-cases/register-user/register-user.google.usecase';
import { SkipAuth } from './decorators/skip-auth.decorator';
import {
  CheckUserStatusFbRequest,
  CheckUserStatusGRequest,
} from './presentation/check-user-status';
import { LoginPartnerRequest } from './presentation/login-partner';
import {
  LoginUserFbRequest,
  LoginUserGRequest,
} from './presentation/login-user';
import { RefreshTokenBody } from './presentation/refresh-token.';
import { RegisterPartnerRequest } from './presentation/register-partner';
import { RegisterUserRequest } from './presentation/register-user';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private checkUserStatusFbUC: CheckUserStatusFacebook,
    private checkUserStatusGUC: CheckUserStatusGoogle,
    private registerUserFbUC: RegisterUserFacebook,
    private registerUserGUC: RegisterUserGoogle,
    private loginUserFbUC: LoginUserFacebook,
    private loginUserGUC: LoginUserGoogle,
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
  @Post('/google/check-user-status')
  async checkUserStatusG(@Body() data: CheckUserStatusGRequest) {
    const result = await this.checkUserStatusGUC.execute(data);
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
  async registerUserFb(@Body() data: RegisterUserRequest) {
    const { loginParams, ...rest } = data;
    const result = await this.registerUserFbUC.execute({
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
  @Post('/google/register')
  async registerUserG(@Body() data: RegisterUserRequest) {
    const { loginParams, ...rest } = data;
    const result = await this.registerUserGUC.execute({
      ...rest,
      ...loginParams,
      authProvider: AuthProvider.Google,
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
  @ApiHeader({ name: 'fcmToken' })
  @Post('facebook/login')
  async loginUserFb(
    @Body() data: LoginUserFbRequest,
    @Headers('fcmToken') fcmToken: string,
  ) {
    const result = await this.loginUserFbUC.execute({ ...data, fcmToken });
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
  @ApiHeader({ name: 'fcmToken' })
  @Post('google/login')
  async loginUserG(
    @Body() data: LoginUserGRequest,
    @Headers('fcmToken') fcmToken: string,
  ) {
    const result = await this.loginUserGUC.execute({ ...data, fcmToken });
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
