import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { UserErrors } from '../../domain/errors/user.errors';
import { UserEmail, UserPassword } from '../../domain/value-objects';
import { JWTToken, RefreshToken } from '../../domain/value-objects/token.value';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { LoginUserDto } from '../dtos/login-user.dto';

type LoginResponseDto = {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
};

type Response = Either<
  | UserErrors.WrongPassword
  | UserErrors.UserWithEmailOrUsernameDoesNotExist
  | AppError.UnexpectedError
  | Result<unknown>,
  Result<LoginResponseDto>
>;

export class LoginUserUseCase
  implements IUseCase<LoginUserDto, Promise<Response>> {
  private _logger: Logger;
  constructor(
    @Inject('IUserRepository') private _userRepository: IUserRepository,
  ) {
    this._logger = new Logger('LoginUserUseCase');
  }
  async execute(request: LoginUserDto): Promise<Response> {
    try {
      const emailOrError = UserEmail.create(request.email);
      const passwordOrError = UserPassword.create({ value: request.password });
      const combinedResult = Result.combine([emailOrError, passwordOrError]);
      if (combinedResult.isFailure)
        return left(Result.fail<void>(combinedResult.error));

      const email = emailOrError.getValue();
      const password = passwordOrError.getValue();

      const user = await this._userRepository.findOneByEmail(email);
      const userFound = !!user;

      if (!userFound) {
        return left(new UserErrors.UserWithEmailOrUsernameDoesNotExist(email));
      }

      const passwordValid = await user.password.comparePassword(password.value);
      if (!passwordValid) {
        return left(new UserErrors.WrongPassword());
      }

      const accessToken = user.getUserToken();
      const refreshToken = user.getRefreshToken();

      return right(
        Result.ok<LoginResponseDto>({
          accessToken,
          refreshToken,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
