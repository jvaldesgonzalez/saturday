import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/accounts-management/users/application/interfaces/user.repository.interface';
import { CreateUserErrors } from 'src/modules/accounts-management/users/application/use-cases/create-user/create-user.errors';
import { CreateUser } from 'src/modules/accounts-management/users/application/use-cases/create-user/create-user.usecase';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { UserProviders } from 'src/modules/accounts-management/users/providers/providers.enum';
import { Either, left } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
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
      refreshToken: 'sfsdkfj:',
      username: 'fsldkfjJk:w',
    });
  }
}
