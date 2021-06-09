import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Version } from 'src/shared/domain/version.value-object';
import { User } from '../../domain/entities/user.entity';
import { UserErrors } from '../../domain/errors/user.errors';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { UpdateAppVersionDto } from '../dtos/update-app-version.dto';

export type UpdateAppVersionUseCaseResponse = Either<
  AppError.UnexpectedError | UserErrors.UserDoesntExists | Result<any>,
  Result<void>
>;

@Injectable()
export class UpdateAppVersionUseCase
  implements IUseCase<UpdateAppVersionDto, UpdateAppVersionUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory')
    private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
  ) {
    this._logger = new Logger('UpdateAppVersion');
  }
  async execute(
    request: UpdateAppVersionDto,
  ): Promise<UpdateAppVersionUseCaseResponse> {
    try {
      const versionOrError = Version.create(request.appVersion);
      if (versionOrError.isFailure)
        return left(Result.fail<void>(versionOrError.error.toString()));

      const version = versionOrError.getValue();
      try {
        const unitOfWork = this._unitOfWorkFact.build();
        await unitOfWork.start();
        const userRepo = unitOfWork.getRepository(this._repositoryFact);

        return await unitOfWork.commit(() =>
          this.work(version, request.userId, userRepo),
        );
      } catch (error) {
        return left(new AppError.UnexpectedError());
      }
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  async work(
    version: Version,
    userId: string,
    userRepo: IUserRepository,
  ): Promise<UpdateAppVersionUseCaseResponse> {
    const user = await userRepo.findById(userId);
    this._logger.log({ user });
    if (!user)
      return left(new UserErrors.UserDoesntExists(new UniqueEntityID(userId)));
    user.updateVersion(version);
    await userRepo.save(user);
    return right(Result.ok<void>());
  }
}
