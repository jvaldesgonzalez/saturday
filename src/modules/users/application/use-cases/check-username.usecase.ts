import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { UserErrors } from '../../domain/errors/user.errors';
import { Username } from '../../domain/value-objects';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { CheckUsernameDto } from '../dtos/check-username.dto';

export type CheckUsernameUseCaseResponse = Either<
  UserErrors.UsernameExistsError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@Injectable()
export class CheckUsernameUseCase
  implements IUseCase<CheckUsernameDto, CheckUsernameUseCaseResponse> {
  private _logger: Logger;
  constructor(@Inject('IUserRepository') private _userRepo: IUserRepository) {
    this._logger = new Logger('CheckUsernameUseCase');
  }
  async execute(
    request: CheckUsernameDto,
  ): Promise<CheckUsernameUseCaseResponse> {
    const usernameOrError = Username.create(request.username);
    if (usernameOrError.isFailure)
      return left(Result.fail<void>(usernameOrError.error.toString()));

    const username = usernameOrError.getValue();
    const usernameExists = await this._userRepo.existByUsername(username);
    if (usernameExists)
      return left(new UserErrors.UsernameExistsError(username));

    return right(Result.ok<void>());
  }
}
