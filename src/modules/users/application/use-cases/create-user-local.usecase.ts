import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { CreateUserDto } from '../dtos/create-user-local.dto';
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

export type CreateUserLocalUseCaseResponse = Either<
  AppError.UnexpectedError | UserErrors.EmailExistsError | Result<unknown>,
  Result<User>
>;

@Injectable()
export class CreateUserLocalUseCase
  implements IUseCase<CreateUserDto, CreateUserLocalUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory')
    private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
  ) {
    this._logger = new Logger('CreateUserLocalUseCase');
  }

  async execute(
    request: CreateUserDto,
  ): Promise<CreateUserLocalUseCaseResponse> {
    this._logger.log('Executing...');
    const usernameOrError = Username.create(request.username);
    const fullnameOrError = UserFullname.create(request.fullname);
    const profileImageUrlOrError = UserProfileImg.create(
      request.profileImageUrl,
    );
    const emailOrError = UserEmail.create(request.email);
    const firebasePushIdOrError = FirebasePushId.create(request.firebasePushId);
    const appVersionOrError = Version.create(request.appVersion);
    const passwordOrError = UserPassword.create({
      value: request.password,
    });
    const providerOrError = UserProvider.create(AuthProvider.Local);
    const role = request.role;

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
  ): Promise<CreateUserLocalUseCaseResponse> {
    const emailExist: boolean = await userRepo.existByEmail(user.email);
    if (emailExist) return left(new UserErrors.EmailExistsError(user.email));
    await userRepo.save(user);
    return right(Result.ok(user));
  }
}
