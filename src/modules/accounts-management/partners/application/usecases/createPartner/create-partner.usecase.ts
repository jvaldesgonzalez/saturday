import { Inject, Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { Partner } from '../../../domain/partner.domain';
import { PartnerProviders } from '../../../providers/providers.enum';
import { CreatePartnerDto } from '../../dtos/create-partner.dto';
import { IPartnerRepository } from '../../interfaces/partner.repository.interface';
import { CreatePartnerErrors } from './create-partner.errors';

type Response = Either<
  AppError.UnexpectedError | CreatePartnerErrors.EmailExistsError,
  Result<Partner>
>;

@Injectable()
export class CreatePartner implements IUseCase<CreatePartnerDto, Response> {
  private logger: Logger;

  constructor(
    @Inject(PartnerProviders.IPartnerRepository)
    private repo: IPartnerRepository,
  ) {
    this.logger = new Logger('CreateUserUseCase');
  }

  async execute(request: CreatePartnerDto): Promise<Response> {
    this.logger.log('Excecuting');

    try {
      const emailExists = await this.repo.emailIsTaken(request.email);
      if (emailExists) return left(new CreatePartnerErrors.EmailExistsError());

      const partnerOrError = Partner.new({
        ...request,
        password: { value: request.password, isHashed: false },
      });

      if (partnerOrError.isFailure)
        return left(Fail(partnerOrError.error.toString()));

      const partner = partnerOrError.getValue();
      partner.hashPassword();
      console.log(partner);

      await this.repo.save(partner);
      this.logger.log(`Partner ${partner.username} created`);
      return right(Ok(partner));
    } catch (error) {
      this.logger.error(error);
      return left(new AppError.UnexpectedError());
    }
  }
}
