import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { User } from '../../domain/entities/user.entity';
import { UserErrors } from '../../domain/errors/user.errors';
import { FirebasePushId } from '../../domain/value-objects';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { UpdateFirebasePushIdDto } from '../dtos/update-firebase-push-id.dto';

export type UpdateFirebasePushIdUseCaseResponse = Either<
  AppError.UnexpectedError | UserErrors.UserDoesntExists | Result<any>,
  Result<void>
>;

@Injectable()
export class UpdateFirebasePushIdUseCase
  implements
    IUseCase<UpdateFirebasePushIdDto, UpdateFirebasePushIdUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory')
    private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
  ) {
    this._logger = new Logger('ChangeUsernameUseCase');
  }
  async execute(
    request: UpdateFirebasePushIdDto,
  ): Promise<UpdateFirebasePushIdUseCaseResponse> {
    try {
      const pushIdOrError = FirebasePushId.create(request.firebasePushId);
      if (pushIdOrError.isFailure)
        return left(Result.fail<void>(pushIdOrError.error.toString()));

      const pushId = pushIdOrError.getValue();
      try {
        const unitOfWork = this._unitOfWorkFact.build();
        await unitOfWork.start();
        const userRepo = unitOfWork.getRepository(this._repositoryFact);

        return await unitOfWork.commit(() =>
          this.work(pushId, request.userId, userRepo),
        );
      } catch (error) {
        return left(new AppError.UnexpectedError());
      }
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  async work(
    pushId: FirebasePushId,
    userId: string,
    userRepo: IUserRepository,
  ): Promise<UpdateFirebasePushIdUseCaseResponse> {
    const user = await userRepo.findById(userId);
    this._logger.log({ user });
    if (!user)
      return left(new UserErrors.UserDoesntExists(new UniqueEntityID(userId)));
    user.updateFirebasePushId(pushId);
    await userRepo.save(user);
    return right(Result.ok<void>());
  }
}
