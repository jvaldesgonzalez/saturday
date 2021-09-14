import { Inject, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { User } from '../../../domain/user.domain';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { UserProviders } from '../../../providers/providers.enum';
import { CreateUserErrors } from './create-user.errors';

type Response = Either<
  AppError.UnexpectedError | CreateUserErrors.EmailExistsError,
  Result<User>
>;

export class CreateUser implements IUseCase<CreateUserDto, Response> {
  private logger: Logger;

  constructor(
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {
    this.logger = new Logger('CreateUserUseCase');
  }

  async execute(request: CreateUserDto): Promise<Response> {
    this.logger.log('Excecuting');

    try {
      const emailExists = await this.repo.emailIsTaken(request.email);
      if (emailExists) return left(new CreateUserErrors.EmailExistsError());

      const categoryPreferences = request.categoryPreferences.map(
        (c) => new UniqueEntityID(c),
      );
      const locationId = new UniqueEntityID(request.locationId);
      const authProviderId = new UniqueEntityID(request.authProviderId);

      const userOrError = User.new({
        ...request,
        categoryPreferences,
        isActive: true,
        locationId,
        authProviderId,
      });

      if (userOrError.isFailure)
        return left(Fail(userOrError.error.toString()));

      const user = userOrError.getValue();
      await this.repo.save(user);
      this.logger.log('User created');
      return right(Ok(user));
    } catch (error) {
      this.logger.error(error);
      return left(new AppError.UnexpectedError());
    }
  }
}
