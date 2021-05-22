import { Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { AttentionTagCollection } from '../value-objects/attention-tag-collection.value';
import { AttentionTag } from './attention-tag.entity';
import { EventName } from '../value-objects/event-name.value';
import { EventPlace } from '../value-objects/event-place.value';
import { UnknownFieldCollection } from '../value-objects/unknown-fields-collection.value';
import { CategoryRefCollection } from './categoryRef.entity';
import {
  EventOccurrence,
  EventOccurrenceCollection,
} from './event-ocurrency.entity';
import { PublisherRef } from './publisherRef.entity';
import { WatchedList } from 'src/shared/core/WatchedList';

type CollaboratorsCollection = PublisherRef[];
type MultimediaCollection = Multimedia[];

type EventProps = {
  publisher: PublisherRef;
  name: EventName;
  description: UnknownFieldCollection;
  categories: CategoryRefCollection;
  place: EventPlace;
  collaborators?: CollaboratorsCollection;
  multimedia: MultimediaCollection;
  attentionTags?: AttentionTagCollection;
  occurrences: EventOccurrenceCollection;
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

  public get occurrences(): EventOccurrenceCollection {
    return this.props.occurrences;
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

  public get attentionTags(): AttentionTagCollection {
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

  addOccurrence(occurrence: EventOccurrence): Result<void> {
    this.props.occurrences.add(occurrence);
    return Ok();
  }

  deleteOccurrence(occurrenceId: UniqueEntityID): Result<void> {
    const occurr = this.props.occurrences
      .getItems()
      .find((occ) => occ._id.toString() === occurrenceId.toString());
    if (occurr) this.props.occurrences.remove(occurr);
    return Ok();
  }

  findOccurrenceById(id: string): EventOccurrence | undefined {
    return this.props.occurrences
      .getItems()
      .find((occurr) => occurr._id.toString() === id);
  }

  addTag(tag: AttentionTag): Result<void> {
    this.props.attentionTags.add(tag);
    return Ok();
  }

  removeTag(tag: AttentionTag): Result<void> {
    this.props.attentionTags.remove(tag);
    return Ok();
  }

  findTagById(tagId: string): AttentionTag | undefined {
    return this.props.attentionTags
      .getItems()
      .find((item) => item._id.toString() === tagId);
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
        : new AttentionTagCollection([]),
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
