import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/accounts-management/users/application/interfaces/user.repository.interface';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { UserProviders } from 'src/modules/accounts-management/users/providers/providers.enum';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { IAppleProvider } from '../../../providers/apple/apple.provider';
import { AuthProviders } from '../../../providers/providers.enum';
import { CheckUserStatusByAppleDto } from '../../dtos/check-user-status.dto';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import { CheckUserStatusErrors } from './check-user-status.errors';

type Response = Either<
  | AppError.UnexpectedError
  | CheckUserStatusErrors.UserNotFoundInProvider
  | CheckUserStatusErrors.UserNotFoundInDatabase,
  Result<Partial<RegisterUserDto>>
>;

@Injectable()
export class CheckUserStatusApple
  implements IUseCase<CheckUserStatusByAppleDto, Response>
{
  constructor(
    @Inject(AuthProviders.IAppleProvider)
    private aplProvider: IAppleProvider,
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {}
  async execute(request: CheckUserStatusByAppleDto): Promise<Response> {
    const validInProvider = await this.aplProvider.checkValidAuthToken(
      request.authToken,
    );
    const userEmail = validInProvider ? validInProvider : null;
    console.log({ userEmail });

    if (!validInProvider)
      return left(
        new CheckUserStatusErrors.UserNotFoundInProvider(
          new UniqueEntityID(userEmail),
          AuthProvider.Google,
        ),
      );

    const userOrNone = await this.repo.findByEmail(userEmail);
    if (userOrNone) return right(Ok({}));

    const userInfo = await this.aplProvider.getProfileInfo(request.authToken);
    return right(Ok(userInfo));
  }
}