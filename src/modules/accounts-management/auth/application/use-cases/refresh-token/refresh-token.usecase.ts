import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from 'src/modules/accounts-management/users/application/interfaces/user.repository.interface';
import { UserProviders } from 'src/modules/accounts-management/users/providers/providers.enum';
import { Either, left, right } from 'src/shared/core/Either';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { JWTUtils } from '../../../jwt-utils';
import { LoginPayload } from '../../../login-payload.type';
import { RefreshTokenDto } from '../../dtos/refresh-token.dto';
import { RefreshTokenErrors } from './refresh-token.errors';

type Response = Either<
  RefreshTokenErrors.UserNotFoundInDatabase,
  Result<LoginPayload>
>;

@Injectable()
export class RefreshToken implements IUseCase<RefreshTokenDto, Response> {
  private logger: Logger;
  constructor(
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {
    this.logger = new Logger('RefreshTokenUseCase');
  }

  async execute(request: RefreshTokenDto): Promise<Response> {
    this.logger.log('Executing...');
    const payloadOrNone = await this.repo.getPayloadByRefreshToken(
      request.refreshToken,
    );
    if (!payloadOrNone)
      return left(
        new RefreshTokenErrors.UserNotFoundInDatabase(request.refreshToken),
      );
    return right(
      Ok({
        accessToken: JWTUtils.sign(payloadOrNone),
        refreshToken: request.refreshToken,
      }),
    );
  }
}
