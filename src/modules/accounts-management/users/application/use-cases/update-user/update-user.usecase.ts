import { Inject, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { UserProviders } from '../../../providers/providers.enum';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { UpdateUserErrors } from './update-user.errors';

type Response = Either<
  | AppError.UnexpectedError
  | AppError.ValidationError
  | UpdateUserErrors.UserNotFound,
  Result<void>
>;

export class UpdateUser
  implements IUseCase<UpdateUserDto, Response>, IWithChanges
{
  public changes: Changes;
  private logger: Logger;

  constructor(
    @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
  ) {
    this.changes = new Changes();
    this.logger = new Logger('UpdateUserUseCase');
  }
  async execute(request: UpdateUserDto): Promise<Response> {
    this.logger.log('Excecuting...');

    const userId = new UniqueEntityID(request.id);
    const userOrNone = await this.repo.findById(userId);
    console.log(userOrNone);

    if (!userOrNone) return left(new UpdateUserErrors.UserNotFound(userId));

    if (request.fullname) {
      this.changes.addChange(userOrNone.changeFullname(request.fullname));
    }
    if (request.birthday) {
      this.changes.addChange(userOrNone.changeBirthday(request.birthday));
    }
    if (request.description) {
      this.changes.addChange(userOrNone.changeDescription(request.description));
    }
    if (request.gender) {
      this.changes.addChange(userOrNone.changeGender(request.gender));
    }
    if (request.privacyStatus) {
      this.changes.addChange(userOrNone.changePrivacy(request.privacyStatus));
    }
    if (request.locationId) {
      this.changes.addChange(
        userOrNone.changeLocation(new UniqueEntityID(request.locationId)),
      );
    }
    if (request.categoryPreferences) {
      this.changes.addChange(
        userOrNone.changeCategories(
          request.categoryPreferences.map((i) => new UniqueEntityID(i)),
        ),
      );
    }
    if (request.avatar) {
      this.changes.addChange(userOrNone.changeAvatar(request.avatar));
    }
    const combinedResult = this.changes.getChangeResult();
    if (combinedResult.isFailure)
      return left(new AppError.ValidationError(combinedResult.error as string));
    await this.repo.save(userOrNone);
    return right(Ok());
  }
}
