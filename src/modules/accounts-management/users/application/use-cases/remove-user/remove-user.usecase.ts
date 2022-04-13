import { Inject, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { User } from '../../../domain/user.domain';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { UserProviders } from '../../../providers/providers.enum';
import { RemoveUserDto } from '../../dtos/remove-user.dto';

type Response = Either<AppError.UnexpectedError, Result<User>>;

export class RemoveUser implements IUseCase<RemoveUserDto, Response> {
  private logger: Logger;

  constructor(
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {
    this.logger = new Logger('RemoveUserUseCase');
  }

  async execute(request: RemoveUserDto): Promise<Response> {
    this.logger.log('Excecuting');

    try {
      await this.repo.dropById(request.userId);
      this.logger.log('User deleted');
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
