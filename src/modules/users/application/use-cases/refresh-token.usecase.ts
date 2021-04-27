import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { UserErrors } from '../../domain/errors/user.errors';
import { JWTToken } from '../../domain/value-objects/token.value';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import * as jwt from 'jsonwebtoken';

type Response = {
  accessToken: JWTToken;
};

export type RefreshTokenUseCaseResponse = Either<
  | AppError.UnexpectedError
  | UserErrors.UserDoesntExists
  | UserErrors.InvalidSignature
  | Result<any>,
  Result<Response>
>;

@Injectable()
export class RefreshTokenUseCase
  implements IUseCase<RefreshTokenDto, RefreshTokenUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUserRepository') private _userRepository: IUserRepository,
  ) {
    this._logger = new Logger('RefereshTokenUseCase');
  }

  async execute(
    request: RefreshTokenDto,
  ): Promise<RefreshTokenUseCaseResponse> {
    let decoded: any;
    try {
      decoded = jwt.verify(request.refreshToken, 'test-secret-refresh');
    } catch (error) {
      return left(new UserErrors.InvalidSignature());
    }
    this._logger.log({ decoded });
    const user = await this._userRepository.findById(decoded.id);
    if (!user) return left(new UserErrors.UserDoesntExists(decoded.id));
    return right(
      Result.ok<Response>({ accessToken: user.getUserToken() }),
    );
  }
}
