import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Result } from 'src/shared/core/Result';
import { Either, left, right } from 'src/shared/core/Either';
import { User } from '../../domain/entities/user.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IUnitOfWorkFactory,
  IUnitOfWork,
} from 'src/shared/core/interfaces/IUnitOfWork';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { AppError } from 'src/shared/core/errors/AppError';
import { UserErrors } from '../../domain/errors/user.errors';
import { Username } from '../../domain/value-objects/username.value';
import { UserFullname } from '../../domain/value-objects/user-fullname.value';
import { UserEmail } from '../../domain/value-objects/user-email.value';
import { UserPassword } from '../../domain/value-objects/user-password.value';
import { UserProfileImg } from '../../domain/value-objects/user-profile-img.value';
import { FirebasePushId } from '../../domain/value-objects/user-firebase-push-id.value';
import { Version } from 'src/shared/domain/version.value-object';
import {
  AuthProvider,
  UserProvider,
} from '../../domain/value-objects/user-auth-provider.value';
import { EnumRoles } from 'src/shared/domain/roles.enum';

export type CreateUserUseCaseResponse = Either<
  AppError.UnexpectedError | UserErrors.EmailExistsError | Result<unknown>,
  Result<User>
>;

@Injectable()
export class CreateUserUseCase
  implements IUseCase<CreateUserDto, CreateUserUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory')
    private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
  ) {
    this._logger = new Logger('CreateUserUseCase');
  }

  async execute(request: CreateUserDto): Promise<CreateUserUseCaseResponse> {
    this._logger.log('Executing...');
    const usernameOrError: Result<Username> = Username.create({
      value: request.username,
    });
    const fullnameOrError: Result<UserFullname> = UserFullname.create({
      value: request.fullname,
    });
    const profileImageUrlOrError: Result<UserProfileImg> = UserProfileImg.create(
      {
        value: request.profileImageUrl,
      },
    );
    const emailOrError: Result<UserEmail> = UserEmail.create({
      value: request.email,
    });
    const firebasePushIdOrError: Result<FirebasePushId> = FirebasePushId.create(
      { value: request.firebasePushId },
    );
    const appVersionOrError: Result<Version> = Version.create({
      value: request.appVersion,
    });
    const passwordOrError: Result<UserPassword> = await UserPassword.createFromPlain(
      {
        value: request.password,
        isHashed: false,
      },
    );
    const providerOrError: Result<UserProvider> = UserProvider.create({
      value: AuthProvider.Local,
    });
    const role = EnumRoles.Partner;

    const combineResult = Result.combine([
      usernameOrError,
      fullnameOrError,
      profileImageUrlOrError,
      emailOrError,
      firebasePushIdOrError,
      appVersionOrError,
      passwordOrError,
      providerOrError,
    ]);
    if (combineResult.isFailure)
      return left(Result.fail<void>(combineResult.error));

    const userOrErr: Result<User> = User.new({
      username: usernameOrError.getValue(),
      fullname: fullnameOrError.getValue(),
      profileImageUrl: profileImageUrlOrError.getValue(),
      email: emailOrError.getValue(),
      firebasePushId: firebasePushIdOrError.getValue(),
      appVersion: appVersionOrError.getValue(),
      password: passwordOrError.getValue(),
      provider: providerOrError.getValue(),
      role,
    });
    if (userOrErr.isFailure)
      return left(Result.fail<User>(userOrErr.error.toString()));

    try {
      const unitOfWork: IUnitOfWork = this._unitOfWorkFact.build();
      await unitOfWork.start();
      const userRepo: IUserRepository = unitOfWork.getRepository(
        this._repositoryFact,
      );
      return await unitOfWork.commit(() =>
        this.work(userOrErr.getValue(), userRepo),
      );
    } catch (err) {
      console.log(err);
      return left(new AppError.UnexpectedError());
    }
  }

  async work(
    user: User,
    userRepo: IUserRepository,
  ): Promise<CreateUserUseCaseResponse> {
    const emailExist: boolean = await userRepo.existByEmail(user.email);
    if (emailExist) return left(new UserErrors.EmailExistsError(user.email));
    await userRepo.save(user);
    return right(Result.ok(user));
  }
}
