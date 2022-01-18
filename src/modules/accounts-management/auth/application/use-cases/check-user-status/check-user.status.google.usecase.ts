import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/accounts-management/users/application/interfaces/user.repository.interface';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { UserProviders } from 'src/modules/accounts-management/users/providers/providers.enum';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { IGoogleProvider } from '../../../providers/google/google.provider';
import { AuthProviders } from '../../../providers/providers.enum';
import { CheckUserStatusByGoogleDto } from '../../dtos/check-user-status.dto';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import { CheckUserStatusErrors } from './check-user-status.errors';

type Response = Either<
  | AppError.UnexpectedError
  | CheckUserStatusErrors.UserNotFoundInProvider
  | CheckUserStatusErrors.UserNotFoundInDatabase,
  Result<Partial<RegisterUserDto>>
>;

@Injectable()
export class CheckUserStatusGoogle
  implements IUseCase<CheckUserStatusByGoogleDto, Response>
{
  constructor(
    @Inject(AuthProviders.IGoogleProvider)
    private gProvider: IGoogleProvider,
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {}
  async execute(request: CheckUserStatusByGoogleDto): Promise<Response> {
    const validInProvider = await this.gProvider.checkValidAuthToken(
      request.authToken,
    );
    const providerId = validInProvider
      ? new UniqueEntityID(validInProvider)
      : null;

    if (!validInProvider)
      return left(
        new CheckUserStatusErrors.UserNotFoundInProvider(
          providerId,
          AuthProvider.Google,
        ),
      );
    console.log({ providerId });

    const userOrNone = await this.repo.findByAuthProviderId(providerId);
    if (userOrNone) return right(Ok({}));

    const userInfo = await this.gProvider.getProfileInfo(request.authToken);
    return right(Ok(userInfo));
  }
}
