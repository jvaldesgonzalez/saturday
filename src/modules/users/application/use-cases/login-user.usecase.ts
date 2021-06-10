import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
import { UserErrors } from '../../domain/errors/user.errors';
import { UserEmail, Username, UserPassword } from '../../domain/value-objects';
import { JWTToken, RefreshToken } from '../../domain/value-objects/token.value';
import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
import { LoginUserDto } from '../dtos/login-user.dto';

export type LoginResponseDto = {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
};

type Response = Either<
  | UserErrors.WrongPassword
  | UserErrors.UserWithEmailOrUsernameDoesNotExist
  | AppError.UnexpectedError
  | Result<any>,
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
      const emailOrError = UserEmail.create(request.emailOrUsername);
      const usernameOrError = Username.create(request.emailOrUsername);
      const emailOrUsernameOrError = Result.combineOr([
        emailOrError,
        usernameOrError,
      ]);

      const passwordOrError = UserPassword.create({ value: request.password });
      const combinedResult = Result.combine([
        emailOrUsernameOrError,
        passwordOrError,
      ]);
      if (combinedResult.isFailure) {
        this._logger.log(combinedResult.error);
        return left(Result.fail<void>(combinedResult.error));
      }
      const emailOrUsername = emailOrUsernameOrError.getValue();
      const password = passwordOrError.getValue();

      const user = await this._userRepository.findOneByEmailOrUsername(
        emailOrUsername,
      );
      const userFound = !!user;

      if (!userFound) {
        return left(
          new UserErrors.UserWithEmailOrUsernameDoesNotExist(emailOrUsername),
        );
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
      console.log(error);
      return left(new AppError.UnexpectedError());
    }
  }
}
