import { Injectable } from '@nestjs/common';
import { CreatePartnerErrors } from 'src/modules/accounts-management/partners/application/usecases/createPartner/create-partner.errors';
import { CreatePartner } from 'src/modules/accounts-management/partners/application/usecases/createPartner/create-partner.usecase';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { JWTUtils } from '../../../jwt-utils';
import { LoginPayload } from '../../../login-payload.type';
import { RegisterPartnerDto } from '../../dtos/register-partner.dto';

type Response = Either<
  AppError.UnexpectedError | CreatePartnerErrors.EmailExistsError,
  Result<LoginPayload>
>;

@Injectable()
export class RegisterPartner implements IUseCase<RegisterPartnerDto, Response> {
  constructor(private createPartner: CreatePartner) {}

  async execute(request: RegisterPartnerDto): Promise<Response> {
    const partnerOrError = await this.createPartner.execute({
      ...request,
      refreshToken: JWTUtils.signRefresh(),
      username: request.email.split('@')[0],
    });
    if (partnerOrError.isLeft()) return left(partnerOrError.value);
    else if (partnerOrError.isRight()) {
      const partner = partnerOrError.value.getValue();
      return right(
        Ok({
          accessToken: JWTUtils.sign({
            id: partner._id.toString(),
            email: partner.email,
            username: partner.username,
          }),
          refreshToken: partner.refreshToken,
        }),
      );
    }
  }
}
