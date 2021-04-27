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
import { Username } from '../../domain/value-objects';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { ChangeUsernameDto } from '../dtos/change-username.dto';

export type ChangeUsernameUseCaseResponse = Either<
  | AppError.UnexpectedError
  | UserErrors.UserDoesntExists
  | UserErrors.UsernameExistsError
  | Result<unknown>,
  Result<void>
>;

@Injectable()
export class ChangeUsernameUseCase
  implements IUseCase<ChangeUsernameDto, ChangeUsernameUseCaseResponse> {
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
    request: ChangeUsernameDto,
  ): Promise<ChangeUsernameUseCaseResponse> {
    try {
      const usernameOrError = Username.create(request.username);
      if (usernameOrError.isFailure)
        return left(Result.fail<void>(usernameOrError.error.toString()));

      const username = usernameOrError.getValue();
      try {
        const unitOfWork = this._unitOfWorkFact.build();
        await unitOfWork.start();
        const userRepo = unitOfWork.getRepository(this._repositoryFact);

        return await unitOfWork.commit(() =>
          this.work(username, request.userId, userRepo),
        );
      } catch (error) {}
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  async work(
    username: Username,
    userId: string,
    userRepo: IUserRepository,
  ): Promise<ChangeUsernameUseCaseResponse> {
    const usernameExists = await userRepo.existByUsername(username);
    if (usernameExists)
      return left(new UserErrors.UsernameExistsError(username));
    const user = await userRepo.findById(userId);
    if (!user)
      return left(new UserErrors.UserDoesntExists(new UniqueEntityID(userId)));
    user.changeUsername(username);
    await userRepo.save(user);
    return right(Result.ok<void>());
  }
}
