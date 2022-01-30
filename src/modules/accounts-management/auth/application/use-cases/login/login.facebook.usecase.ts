import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/accounts-management/users/application/interfaces/user.repository.interface';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { UserProviders } from 'src/modules/accounts-management/users/providers/providers.enum';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { JWTUtils } from '../../../jwt-utils';
import { LoginPayload } from '../../../login-payload.type';
import { IFacebookProvider } from '../../../providers/facebook/facebook.provider';
import { AuthProviders } from '../../../providers/providers.enum';
import { LoginUserFacebookDto } from '../../dtos/check-user-status.dto';
import { CheckUserStatusErrors } from '../check-user-status/check-user-status.errors';

type Response = Either<
  | CheckUserStatusErrors.UserNotFoundInProvider
  | CheckUserStatusErrors.UserNotFoundInDatabase
  | AppError.UnexpectedError,
  Result<LoginPayload>
>;

@Injectable()
export class LoginUserFacebook
  implements IUseCase<LoginUserFacebookDto, Response>
{
  constructor(
    @Inject(AuthProviders.IFacebookProvider)
    private fbProvider: IFacebookProvider,
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {}
  async execute(request: LoginUserFacebookDto): Promise<Response> {
    const validInProvider = await this.fbProvider.checkValidAuthToken(
      request.authToken,
      request.authProviderId,
    );

    const userEmail = validInProvider ? validInProvider : null;

    if (!validInProvider)
      return left(
        new CheckUserStatusErrors.UserNotFoundInProvider(
          new UniqueEntityID(userEmail),
          AuthProvider.Facebook,
        ),
      );

    const userOrNone = await this.repo.findByEmail(userEmail);
    if (!userOrNone)
      return left(
        new CheckUserStatusErrors.UserNotFoundInDatabase(
          new UniqueEntityID(userEmail),
        ),
      );
    userOrNone.changeFirebasePushId(request.fcmToken);
    await this.repo.save(userOrNone);
    return right(
      Ok({
        accessToken: JWTUtils.sign({
          id: userOrNone._id.toString(),
          email: userOrNone.email,
          username: userOrNone.username,
          role: EnumRoles.Client,
        }),
        refreshToken: userOrNone.refreshToken,
      }),
    );
  }
}
