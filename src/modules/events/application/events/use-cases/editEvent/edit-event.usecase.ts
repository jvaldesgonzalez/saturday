import { Inject, Injectable, Logger } from '@nestjs/common';
import { CategoryRef } from 'src/modules/events/domain/entities/categoryRef.entity';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { PublisherRef } from 'src/modules/events/domain/entities/publisherRef.entity';
import { EventName } from 'src/modules/events/domain/value-objects/event-name.value';
import { EventPlace } from 'src/modules/events/domain/value-objects/event-place.value';
import { UnknownField } from 'src/modules/events/domain/value-objects/unknown-field.value';
import { IEventRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Join, Ok, Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { EditEventDto } from '../../dtos/edit-event';
import { EditEventErrors } from './edit-event.errors';

type EditEventUseCaseResponse = Either<
  AppError.UnexpectedError | EditEventErrors.EventDoestnExists | Result<any>,
  Result<void>
>;

@Injectable()
export class EditEventUseCase
  implements IUseCase<EditEventDto, EditEventUseCaseResponse>, IWithChanges {
  public changes: Changes;
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory') private _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRespositoryFactory')
    private _repositoryFact: IRepositoryFactory<Event, IEventRepository>,
  ) {
    this._logger = new Logger('EditEventUseCase');
    this.changes = new Changes();
  }

  async execute(request: EditEventDto): Promise<EditEventUseCaseResponse> {
    try {
      const uow = this._unitOfWorkFact.build();
      await uow.start();
      const eventRepo = uow.getRepository(this._repositoryFact);
      return uow.commit(() => this.work(request, eventRepo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: EditEventDto,
    eventRepo: IEventRepository,
  ): Promise<EditEventUseCaseResponse> {
    const event = await eventRepo.findById(request.eventId);
    if (!event)
      return left(new EditEventErrors.EventDoestnExists(request.eventId));

    if (request.name) {
      const nameOrError = EventName.create(request.name);
      if (nameOrError.isFailure)
        return left(Fail(nameOrError.error.toString()));
      this.changes.addChange(event.changeName(nameOrError.getValue()));
    }

    if (request.description) {
      const descOrError = Join(
        request.description.map((uf) => UnknownField.create(uf)),
      );
      if (descOrError.isFailure)
        return left(Fail(descOrError.error.toString()));
      this.changes.addChange(event.changeDescription(descOrError.getValue()));
    }

    if (request.categories) {
      const catsOrError = Join(
        request.categories.map((ct) => CategoryRef.create(ct)),
      );
      if (catsOrError.isFailure)
        return left(Fail(catsOrError.error.toString()));
      this.changes.addChange(event.changeCategories(catsOrError.getValue()));
    }

    if (request.place) {
      const placeOrError = EventPlace.create({
        ...request.place,
        hostRef: request.place.hostRef
          ? new UniqueEntityID(request.place.hostRef)
          : null,
      });
      if (placeOrError.isFailure)
        return left(Fail(placeOrError.error.toString()));
      this.changes.addChange(event.changePlace(placeOrError.getValue()));
    }

    if (request.collaborators) {
      const collaboratorsOrError = Join(
        request.collaborators.map((c) => PublisherRef.create(c)),
      );
      if (collaboratorsOrError.isFailure)
        return left(Fail(collaboratorsOrError.error.toString()));
      this.changes.addChange(
        event.changeCollaborators(collaboratorsOrError.getValue()),
      );
    }

    if (request.multimedia) {
      const multimediaOrError = Join(
        request.multimedia.map((m) => Multimedia.create(m)),
      );
      if (multimediaOrError.isFailure)
        return left(Fail(multimediaOrError.error.toString()));
      this.changes.addChange(
        event.changeMultimedia(multimediaOrError.getValue()),
      );
    }

    if (this.changes.getChangeResult().isSuccess) {
      await eventRepo.save(event);
      return right(Ok());
    }
  }
}
