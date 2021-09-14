import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/accounts-management/users/application/interfaces/user.repository.interface';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { UserProviders } from 'src/modules/accounts-management/users/providers/providers.enum';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { IFacebookProvider } from '../../../providers/facebook/facebook.provider';
import { AuthProviders } from '../../../providers/providers.enum';
import { CheckUserStatusByFacebookDto } from '../../dtos/check-user-status.dto';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import { CheckUserStatusErrors } from './check-user-status.errors';

type Response = Either<
  | AppError.UnexpectedError
  | CheckUserStatusErrors.UserNotFoundInProvider
  | CheckUserStatusErrors.UserNotFoundInDatabase,
  Result<Partial<RegisterUserDto>>
>;

@Injectable()
export class CheckUserStatusFacebook
  implements IUseCase<CheckUserStatusByFacebookDto, Response>
{
  constructor(
    @Inject(AuthProviders.IFacebookProvider)
    private fbProvider: IFacebookProvider,
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {}
  async execute(request: CheckUserStatusByFacebookDto): Promise<Response> {
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

    const userOrNone = await this.repo.findByAuthProviderId(providerId);
    if (userOrNone) return right(Ok({}));

    const userInfo = await this.fbProvider.getProfileInfo(
      request.authToken,
      request.authProviderId,
    );
    return right(Ok(userInfo));
  }
}
