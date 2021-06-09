import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import {
  IUnitOfWorkFactory,
  IUnitOfWork,
} from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { Version } from 'src/shared/domain/version.value-object';
import { User } from '../../domain/entities/user.entity';
import { UserErrors } from '../../domain/errors/user.errors';
import {
  FirebasePushId,
  UserEmail,
  Username,
  UserProfileImg,
  UserProvider,
} from '../../domain/value-objects';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { CreateUserWithProviderDto } from '../dtos/create-user-withprovider.dto';

export type CreateUserWithProviderUseCaseResponse = Either<
  AppError.UnexpectedError | UserErrors.EmailExistsError | Result<any>,
  Result<User>
>;

@Injectable()
export class CreateUserWithProviderUseCase
  implements
    IUseCase<CreateUserWithProviderDto, CreateUserWithProviderUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory')
    private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
  ) {
    this._logger = new Logger('CreateUserWithProviderUseCase');
  }

  async execute(
    request: CreateUserWithProviderDto,
  ): Promise<CreateUserWithProviderUseCaseResponse> {
    this._logger.log('Executing...');

    const usernameOrError = Username.create(request.username);
    const profileImageUrlOrError = UserProfileImg.create(
      request.profileImageUrl,
    );
    const emailOrError = UserEmail.create(request.email);
    const firebasePushIdOrError = FirebasePushId.create(request.firebasePushId);
    const appVersionOrError = Version.create(request.appVersion);
    const providerOrError = UserProvider.create(request.provider);
    const role = request.role;

    const combineResult = Result.combine([
      usernameOrError,
      profileImageUrlOrError,
      emailOrError,
      firebasePushIdOrError,
      appVersionOrError,
      providerOrError,
    ]);
    if (combineResult.isFailure)
      return left(Result.fail<void>(combineResult.error));

    const userOrErr = User.new({
      username: usernameOrError.getValue(),
      profileImageUrl: profileImageUrlOrError.getValue(),
      email: emailOrError.getValue(),
      firebasePushId: firebasePushIdOrError.getValue(),
      appVersion: appVersionOrError.getValue(),
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
  ): Promise<CreateUserWithProviderUseCaseResponse> {
    const emailExist: boolean = await userRepo.existByEmail(user.email);
    if (emailExist) return left(new UserErrors.EmailExistsError(user.email));
    await userRepo.save(user);
    return right(Result.ok(user));
  }
}
