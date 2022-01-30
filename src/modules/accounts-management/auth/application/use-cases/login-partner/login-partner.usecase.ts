import { Inject, Injectable } from '@nestjs/common';
import { IPartnerRepository } from 'src/modules/accounts-management/partners/application/interfaces/partner.repository.interface';
import { PartnerProviders } from 'src/modules/accounts-management/partners/providers/providers.enum';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { JWTUtils } from '../../../jwt-utils';
import { LoginPayload } from '../../../login-payload.type';
import { LoginPartnerDto } from '../../dtos/login-partner.dto';
import { CheckUserStatusErrors } from '../check-user-status/check-user-status.errors';
import { LoginPartnerErrors } from './login-partner.errors';

type Response = Either<
  CheckUserStatusErrors.UserNotFoundInDatabase | AppError.UnexpectedError,
  Result<LoginPayload>
>;

@Injectable()
export class LoginPartner implements IUseCase<LoginPartnerDto, Response> {
  constructor(
    @Inject(PartnerProviders.IPartnerRepository)
    private repo: IPartnerRepository,
  ) {}
  async execute(request: LoginPartnerDto): Promise<Response> {
    const partnerOrNone = await this.repo.findByUsernameOrEmail(
      request.usernameOrEmail,
    );
    if (!partnerOrNone || !partnerOrNone.paswordMatchWith(request.password))
      return left(
        new CheckUserStatusErrors.UserNotFoundInDatabase(
          new UniqueEntityID(request.usernameOrEmail),
        ),
      );
    console.log(partnerOrNone);
    if (!partnerOrNone.isVerified)
      return left(new LoginPartnerErrors.PartnerIsNotVerified());
    return right(
      Ok({
        accessToken: JWTUtils.sign({
          id: partnerOrNone._id.toString(),
          email: partnerOrNone.email,
          username: partnerOrNone.username,
          role: EnumRoles.Partner,
        }),
        refreshToken: partnerOrNone.refreshToken,
      }),
    );
  }
}
