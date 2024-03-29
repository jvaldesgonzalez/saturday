import { Inject, Injectable, Logger } from '@nestjs/common';
import { Host } from 'src/modules/hosts/domain/entities/host.entity';
import { UserRef } from 'src/modules/hosts/domain/entities/userRef.entity';
import { BusinessName } from 'src/modules/hosts/domain/value-objects/business-name.value';
import { DescriptionField } from 'src/modules/hosts/domain/value-objects/description-fields.value';
import { HostPhone } from 'src/modules/hosts/domain/value-objects/host-phone.value';
import { HostPlace } from 'src/modules/hosts/domain/value-objects/host-place.value';
import { HostProfileImg } from 'src/modules/hosts/domain/value-objects/host-profile-img.value';
import { IHostRepository } from 'src/modules/hosts/infrastructure/interfaces/host.repository.interface';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Join, Ok, Result } from 'src/shared/core/Result';
import { RegisterBusinessDto } from '../../dtos/register-business.dto';
import { RegisterBusinessErrors } from './register-business.error';

export type RegisterBusinessUseCaseResponse = Either<
  | AppError.UnexpectedError
  | RegisterBusinessErrors.UserDoesntExists
  | Result<any>,
  Result<void>
>;

@Injectable()
export class RegisterBusinessUseCase
  implements IUseCase<RegisterBusinessDto, RegisterBusinessUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IHostRepository') private _hostRepository: IHostRepository,
  ) {
    this._logger = new Logger('RegisterBusinessUseCase');
  }

  async execute(
    request: RegisterBusinessDto,
  ): Promise<RegisterBusinessUseCaseResponse> {
    this._logger.log('Executing...');

    const userData = await this._hostRepository.getUserIdAndTimestamp(
      request.userId,
    );
    if (!userData)
      return left(new RegisterBusinessErrors.UserDoesntExists(request.userId));

    const userRefOrError = UserRef.create(request.userId);
    const businessNameOrError = BusinessName.create(request.businessName);
    const hostPhoneOrError = HostPhone.create(request.phoneNumber);
    const aditionalDataOrError = Join(
      (request.aditionalBusinessData || []).map((data) =>
        DescriptionField.create(data),
      ),
    );
    const placeOrError = request.place
      ? HostPlace.create(request.place)
      : Ok(undefined);

    const imageOrError = request.profileImage
      ? HostProfileImg.create(request.profileImage)
      : Ok(undefined);

    const combined = Result.combine([
      businessNameOrError,
      hostPhoneOrError,
      userRefOrError,
      aditionalDataOrError,
      placeOrError,
      imageOrError,
    ]);

    if (combined.isFailure) return left(Fail(combined.error));

    const host = Host.create({
      userRef: userRefOrError.getValue(),
      phoneNumber: hostPhoneOrError.getValue(),
      businessName: businessNameOrError.getValue(),
      aditionalBusinessData: aditionalDataOrError.getValue(),
      place: placeOrError.getValue(),
      profileImage: imageOrError.getValue(),
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });

    if (host.isFailure) return left(host);

    await this._hostRepository.save(host.getValue());
    return right(Ok());
  }
}
