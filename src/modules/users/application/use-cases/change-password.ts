import { Inject, Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { User } from '../../domain/entities/user.entity';
import { UserErrors } from '../../domain/errors/user.errors';
import { UserPassword } from '../../domain/value-objects';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { ChangePasswordDto } from '../dtos/change-password.dto';

export type ChangePasswordUseCaseResponse = Either<
  | UserErrors.UserDoesntExists
  | UserErrors.WrongPassword
  | AppError.UnexpectedError
  | Result<unknown>,
  Result<void>
>;

@Injectable()
export class ChangePasswordUseCase
  implements IUseCase<ChangePasswordDto, ChangePasswordUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory')
    private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
  ) {
    this._logger = new Logger('ChangePasswordUseCase');
  }
  async execute(
    request: ChangePasswordDto,
  ): Promise<ChangePasswordUseCaseResponse> {
    try {
      const uow = this._unitOfWorkFact.build();
      await uow.start();
      const userRepo = uow.getRepository(this._repositoryFact);
      return await uow.commit(() => this.work(request, userRepo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    req: ChangePasswordDto,
    userRepo: IUserRepository,
  ): Promise<ChangePasswordUseCaseResponse> {
    const passwordOrError = UserPassword.create({ value: req.newPassword });
    if (passwordOrError.isFailure)
      return left(Result.fail<void>(passwordOrError.error.toString()));

    const user = await userRepo.findById(req.userId);
    if (!user) return left(new UserErrors.UserDoesntExists(req.userId));
    const isMatch = user.password.comparePassword(req.oldPassword);
    if (!isMatch) return left(new UserErrors.WrongPassword());

    user.changePassword(passwordOrError.getValue());
    await userRepo.save(user);
    return right(Result.ok());
  }
}
