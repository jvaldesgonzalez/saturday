import { Inject, Injectable, Logger } from '@nestjs/common';
import { BusinessName } from 'src/modules/hosts/domain/value-objects/business-name.value';
import { DescriptionField } from 'src/modules/hosts/domain/value-objects/description-fields.value';
import { HostPhone } from 'src/modules/hosts/domain/value-objects/host-phone.value';
import { HostPlace } from 'src/modules/hosts/domain/value-objects/host-place.value';
import { IHostRepository } from 'src/modules/hosts/infrastructure/interfaces/host.repository.interface';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Join, Ok, Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { UpdateBusinessDetailsDto } from '../../dtos/update-business-details.dto';
import { UpdateBusinessDetailsErrors } from './update-business-details.error';

export type UpdateBusinessDetailsUseCaseResponse = Either<
  | AppError.UnexpectedError
  | UpdateBusinessDetailsErrors.HostDoesntExists
  | Result<any>,
  Result<void>
>;

@Injectable()
export class UpdateBusinessDetailsUseCase
  implements
    IUseCase<UpdateBusinessDetailsDto, UpdateBusinessDetailsUseCaseResponse>,
    IWithChanges {
  public changes: Changes;
  private _logger: Logger;
  constructor(
    @Inject('IHostRepository') private _hostRepository: IHostRepository,
  ) {
    this._logger = new Logger('UpdateBusinessDetailsUseCase');
    this.changes = new Changes();
  }

  async execute(
    request: UpdateBusinessDetailsDto,
  ): Promise<UpdateBusinessDetailsUseCaseResponse> {
    this._logger.log('Excecuting...');
    try {
      const host = await this._hostRepository.findById(request.userId);
      console.log(host);
      if (!host)
        return left(
          new UpdateBusinessDetailsErrors.HostDoesntExists(request.userId),
        );

      if (request.businessName) {
        const bnameOrError = BusinessName.create(request.businessName);
        if (bnameOrError.isFailure)
          return left(Fail(bnameOrError.error.toString()));
        this.changes.addChange(
          host.changeBusinessName(bnameOrError.getValue()),
        );
      }

      if (request.aditionalBusinessData) {
        const aditionalDataOrError = Join(
          request.aditionalBusinessData.map((data) =>
            DescriptionField.create(data),
          ),
        );
        if (aditionalDataOrError.isFailure)
          return left(Fail(aditionalDataOrError.error.toString()));
        this.changes.addChange(
          host.changeBusinessData(aditionalDataOrError.getValue()),
        );
      }

      if (request.place) {
        const placeOrError = HostPlace.create(request.place);
        if (placeOrError.isFailure)
          return left(Fail(placeOrError.error.toString()));
        this.changes.addChange(host.changePlace(placeOrError.getValue()));
      }

      if (request.phoneNumber) {
        const phoneOrError = HostPhone.create(request.phoneNumber);
        if (phoneOrError.isFailure)
          return left(Fail(phoneOrError.error.toString()));
        this.changes.addChange(host.changePhoneNumber(phoneOrError.getValue()));
      }

      const changesResult = this.changes.getChangeResult();
      if (changesResult.isSuccess) {
        await this._hostRepository.save(host);
        return right(Ok());
      } else {
        return left(Fail(changesResult.error.toString()));
      }
    } catch (error) {
      this._logger.log(error);
      return left(new AppError.UnexpectedError());
    }
  }
}
