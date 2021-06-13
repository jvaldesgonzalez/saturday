import { PublisherRef } from 'src/modules/stories/domain/entities/publisherRef.entity';
import { Join } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Collection } from '../../domain/entities/collection.entity';
import {
  EventRef,
  EventRefCollection,
} from '../../domain/entities/eventRef.entity';
import { CollectionEntity } from '../entities/collection.entity';

export class CollectionMapper {
  public static PersistentToDomain(p: CollectionEntity): Collection {
    const publisherOrError = PublisherRef.create(p.publisher);
    const eventsOrError = Join(p.events.map((id) => EventRef.create(id)));

    return Collection.create(
      {
        publisher: publisherOrError.getValue(),
        events: new EventRefCollection(eventsOrError.getValue()),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        name: p.name,
        description: p.description,
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }

  public static DomainToPersistence(d: Collection): CollectionEntity {
    return {
      publisher: d.publisher._id.toString(),
      events: d.events.getItems().map((evId) => evId._id.toString()),
      name: d.name,
      description: d.description,
      id: d._id.toString(),
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    };
  }
}
