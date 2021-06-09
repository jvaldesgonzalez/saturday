import { Inject, Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { User } from '../../domain/entities/user.entity';
import { UserErrors } from '../../domain/errors/user.errors';
import { UserEmail, UserProfileImg } from '../../domain/value-objects';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

export type UpdateProfileUseCaseResponse = Either<
  AppError.UnexpectedError | UserErrors.UserDoesntExists | Result<any>,
  Result<void>
>;

@Injectable()
export class UpdateProfileUseCase
  implements
    IUseCase<UpdateProfileDto, UpdateProfileUseCaseResponse>,
    IWithChanges {
  public changes: Changes;
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory')
    private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
  ) {
    this._logger = new Logger('UpdateProfileUseCase');
    this.changes = new Changes();
  }
  public async execute(
    request: UpdateProfileDto,
  ): Promise<UpdateProfileUseCaseResponse> {
    try {
      const uow = this._unitOfWorkFact.build();
      await uow.start();
      const userRepo = uow.getRepository(this._repositoryFact);
      return uow.commit(() => this.work(request, userRepo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: UpdateProfileDto,
    userRepo: IUserRepository,
  ): Promise<UpdateProfileUseCaseResponse> {
    try {
      const user = await userRepo.findById(request.userId);
      if (!user) return left(new UserErrors.UserDoesntExists(request.userId));

      if (request.email) {
        const emailOrError = UserEmail.create(request.email);
        if (emailOrError.isFailure)
          return left(Result.fail<unknown>(emailOrError.error.toString()));
        this.changes.addChange(user.changeEmail(emailOrError.getValue()));
      }

      if (request.profileImageUrl) {
        const profileImageUrlOrError = UserProfileImg.create(
          request.profileImageUrl,
        );
        if (profileImageUrlOrError.isFailure)
          return left(
            Result.fail<unknown>(profileImageUrlOrError.error.toString()),
          );
        this.changes.addChange(
          user.changeProfileImage(profileImageUrlOrError.getValue()),
        );
      }

      if (this.changes.getChangeResult().isSuccess) {
        await userRepo.save(user);
        return right(Result.ok<void>());
      }
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
