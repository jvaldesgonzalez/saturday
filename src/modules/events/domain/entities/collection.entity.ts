import { Guard } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { EventRef, EventRefCollection } from './eventRef.entity';
import { PublisherRef } from './publisherRef.entity';

type CollectionProps = {
  publisher: PublisherRef;
  events: EventRefCollection;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type NewCollectionProps = Omit<CollectionProps, 'createdAt' | 'updatedAt'>;

export class Collection extends AggregateDomainEntity<CollectionProps> {
  public get publisher(): PublisherRef {
    return this.props.publisher;
  }

  public get events(): EventRefCollection {
    return this.props.events;
  }

  public get description(): string {
    return this.props.description;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get name(): string {
    return this.props.name;
  }

  addEvent(event: EventRef): Result<void> {
    this.props.events.add(event);
    this.props.updatedAt = new Date();
    return Ok();
  }

  deleteEvent(event: EventRef): Result<void> {
    this.props.events.remove(event);
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeDescription(description: string): Result<void> {
    this.props.description = description;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeName(name: string): Result<void> {
    this.props.name = name;
    this.props.updatedAt = new Date();
    return Ok();
  }

  markDeleted(): Result<void> {
    return Ok();
  }

  public static new(props: NewCollectionProps): Result<Collection> {
    return Collection.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(),
    );
  }

  public static create(
    props: CollectionProps,
    id: UniqueEntityID,
  ): Result<Collection> {
    const againstNil = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentPath: 'name' },
      { argument: props.description, argumentPath: 'description' },
    ]);

    //against empty
    //TODO: Make declarative guard
    if (props.events.getItems().length === 0)
      return Fail('Cant create empty collection');

    return againstNil.succeeded
      ? Ok(new Collection(props, id))
      : Fail(againstNil.message);
  }
}
