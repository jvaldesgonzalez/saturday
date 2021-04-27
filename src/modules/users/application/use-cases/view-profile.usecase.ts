import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { User } from '../../domain/entities/user.entity';
import { UserErrors } from '../../domain/errors/user.errors';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { ViewProfileDto } from '../dtos/view-profile.dto';

type Response = User;

export type ViewProfileUseCaseResponse = Either<
  UserErrors.UserDoesntExists | AppError.UnexpectedError,
  Result<Response>
>;

@Injectable()
export class ViewProfileUseCase
  implements IUseCase<ViewProfileDto, ViewProfileUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUserRepository') private _userRepository: IUserRepository,
  ) {
    this._logger = new Logger('ViewProfileUseCase');
  }
  public async execute(
    request: ViewProfileDto,
  ): Promise<ViewProfileUseCaseResponse> {
    try {
      const user = await this._userRepository.findById(request.userId);
      if (!user) return left(new UserErrors.UserDoesntExists(request.userId));

      return right(Result.ok<Response>(user));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
