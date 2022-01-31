import { Inject, Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { PartnerProviders } from '../../../providers/providers.enum';
import { UpdatePartnerDto } from '../../dtos/update-partner.dto';
import { IPartnerRepository } from '../../interfaces/partner.repository.interface';
import { UpdatePartnerErrors } from './update-partner.errors';

type Response = Either<
  | AppError.UnexpectedError
  | AppError.ValidationError
  | UpdatePartnerErrors.PartnerNotFound
  | UpdatePartnerErrors.EmailExistsError
  | UpdatePartnerErrors.UsernameExistsError,
  Result<void>
>;

@Injectable()
export class UpdatePartner
  implements IUseCase<UpdatePartnerDto, Response>, IWithChanges
{
  public changes: Changes;
  private logger: Logger;

  constructor(
    @Inject(PartnerProviders.IPartnerRepository)
    private repo: IPartnerRepository,
  ) {
    this.logger = new Logger('UpdatePartnerUsecase');
  }
  async execute(request: UpdatePartnerDto): Promise<Response> {
    this.logger.log('Excecuting...');
    this.changes = new Changes();

    const userId = new UniqueEntityID(request.id);
    const partnerOrNone = await this.repo.findById(userId);

    if (!partnerOrNone)
      return left(new UpdatePartnerErrors.PartnerNotFound(userId));

    if (request.email && request.email != partnerOrNone.email) {
      const emailIsTaken = await this.repo.emailIsTaken(request.email);
      if (emailIsTaken)
        return left(new UpdatePartnerErrors.EmailExistsError(request.email));
      this.changes.addChange(partnerOrNone.changeEmail(request.email));
    }
    if (request.username && request.username != partnerOrNone.username) {
      const usernameIsTaken = await this.repo.usernameIsTaken(request.username);
      if (usernameIsTaken)
        return left(
          new UpdatePartnerErrors.UsernameExistsError(request.username),
        );
      this.changes.addChange(partnerOrNone.changeUsername(request.username));
    }
    if (request.businessName) {
      this.changes.addChange(
        partnerOrNone.changeBusinessName(request.businessName),
      );
    }
    if (request.aditionalBusinessData) {
      this.changes.addChange(
        partnerOrNone.changeBusinessData(request.aditionalBusinessData),
      );
    }
    if (request.place) {
      this.changes.addChange(partnerOrNone.changePlace(request.place));
    }
    if (request.phoneNumber) {
      this.changes.addChange(
        partnerOrNone.changePhoneNumber(request.phoneNumber),
      );
    }
    if (request.avatar) {
      this.changes.addChange(partnerOrNone.changeAvatar(request.avatar));
    }
    const combinedResult = this.changes.getChangeResult();
    if (combinedResult.isFailure)
      return left(new AppError.ValidationError(combinedResult.error as string));
    await this.repo.save(partnerOrNone);
    return right(Ok());
  }
}
