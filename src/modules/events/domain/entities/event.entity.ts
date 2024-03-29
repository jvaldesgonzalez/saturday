import { Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { AttentionTagRefCollection } from '../value-objects/attention-tag-collection.value';
import { AttentionTagRef } from './attention-tag.entity';
import { EventName } from '../value-objects/event-name.value';
import { EventPlace } from '../value-objects/event-place.value';
import { UnknownFieldCollection } from '../value-objects/unknown-fields-collection.value';
import { CategoryRefCollection } from './categoryRef.entity';
import { PublisherRef } from './publisherRef.entity';
import { WatchedList } from 'src/shared/core/WatchedList';

type CollaboratorsCollection = PublisherRef[];
type MultimediaCollection = Multimedia[];

type EventProps = {
  publisher: PublisherRef;
  name: EventName;
  description: UnknownFieldCollection;
  categories: CategoryRefCollection;
  place?: EventPlace;
  collaborators?: CollaboratorsCollection;
  multimedia: MultimediaCollection;
  attentionTags?: AttentionTagRefCollection;
  createdAt: Date;
  updatedAt: Date;
};

export class Event extends AggregateDomainEntity<EventProps> {
  public readonly __brand: void;

  public get publisher(): PublisherRef {
    return this.props.publisher;
  }

  public get place(): EventPlace {
    return this.props.place;
  }

  public get description(): UnknownFieldCollection {
    return this.props.description;
  }

  public get collaborators(): CollaboratorsCollection {
    return this.props.collaborators;
  }

  public get name(): EventName {
    return this.props.name;
  }

  public get attentionTags(): AttentionTagRefCollection {
    return this.props.attentionTags;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get multimedia(): MultimediaCollection {
    return this.props.multimedia;
  }

  get categories(): CategoryRefCollection {
    return this.props.categories;
  }

  changeName(name: EventName): Result<void> {
    this.props.name = name;
    return Ok();
  }

  changeCollaborators(collaborators: CollaboratorsCollection): Result<void> {
    this.props.collaborators = collaborators;
    return Ok();
  }

  changeMultimedia(multimedia: MultimediaCollection): Result<void> {
    this.props.multimedia = multimedia;
    return Ok();
  }

  changeDescription(desc: UnknownFieldCollection): Result<void> {
    this.props.description = desc;
    return Ok();
  }

  changeCategories(cats: CategoryRefCollection): Result<void> {
    this.props.categories = cats;
    return Ok();
  }

  changePlace(place: EventPlace): Result<void> {
    this.props.place = place;
    return Ok();
  }

  addTag(tag: AttentionTagRef): Result<void> {
    this.props.attentionTags.add(tag);
    return Ok();
  }

  removeTag(tag: AttentionTagRef): Result<void> {
    this.props.attentionTags.remove(tag);
    return Ok();
  }

  public static new(
    props: Omit<EventProps, 'createdAt' | 'updatedAt'>,
  ): Result<Event> {
    return this.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(),
    );
  }

  public static create(props: EventProps, id: UniqueEntityID): Result<Event> {
    const defaultValues: EventProps = {
      ...props,
      attentionTags: props.attentionTags
        ? props.attentionTags
        : new AttentionTagRefCollection([]),
      description: props.description ? props.description : [],
      collaborators: props.collaborators ? props.collaborators : [],
    };
    return Ok(new Event(defaultValues, id));
  }
}

export class EventCollection extends WatchedList<Event> {
  compareItems(a: Event, b: Event): boolean {
    return a.equals(b);
  }
}
