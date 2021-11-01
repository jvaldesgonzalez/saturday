import { Inject, Injectable } from '@nestjs/common';
import { CreateUserErrors } from 'src/modules/accounts-management/users/application/use-cases/create-user/create-user.errors';
import { CreateUser } from 'src/modules/accounts-management/users/application/use-cases/create-user/create-user.usecase';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { JWTUtils } from '../../../jwt-utils';
import { LoginPayload } from '../../../login-payload.type';
import { IFacebookProvider } from '../../../providers/facebook/facebook.provider';
import { AuthProviders } from '../../../providers/providers.enum';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import { CheckUserStatusErrors } from '../check-user-status/check-user-status.errors';

type Response = Either<
  | AppError.UnexpectedError
  | CreateUserErrors.EmailExistsError
  | CheckUserStatusErrors.UserNotFoundInProvider,
  Result<LoginPayload>
>;

@Injectable()
export class RegisterUser implements IUseCase<RegisterUserDto, Response> {
  constructor(
    @Inject(AuthProviders.IFacebookProvider)
    private fbProvider: IFacebookProvider,
    private createUser: CreateUser,
  ) {}

  async execute(request: RegisterUserDto): Promise<Response> {
    const providerId = new UniqueEntityID(request.authProviderId);
    const validInProvider = await this.fbProvider.checkValidAuthToken(
      request.authToken,
      request.authProviderId,
    );

    if (!validInProvider)
      return left(
        new CheckUserStatusErrors.UserNotFoundInProvider(
          providerId,
          AuthProvider.Facebook,
        ),
      );

    const userOrError = await this.createUser.execute({
      ...request,
      refreshToken: JWTUtils.signRefresh(),
      username: request.email.split('@')[0],
    });
    if (userOrError.isLeft()) return left(userOrError.value);
    else if (userOrError.isRight()) {
      const user = userOrError.value.getValue();
      return right(
        Ok({
          accessToken: JWTUtils.sign({
            id: user._id.toString(),
            email: user.email,
            username: user.username,
          }),
          refreshToken: user.refreshToken,
        }),
      );
    }
  }
}
