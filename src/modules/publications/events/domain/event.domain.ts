import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { Multimedia, MultimediaType } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { EventCategory } from './value-objects/event-categories.value';
import { EventCollaborators } from './value-objects/event-collaborators.value';
import { EventDescription } from './value-objects/event-description.value';
import { EventPlace } from './value-objects/event-place.value';

type EventProps = {
  publisher: UniqueEntityID;
  name: string;
  description: EventDescription;
  category: EventCategory;
  place: EventPlace;
  collaborators?: EventCollaborators;
  multimedia: { url: string; type: MultimediaType }[];
  createdAt: Date;
  updatedAt: Date;
  dateTimeInit: Date;
  dateTimeEnd: Date;
  newOccurrences: EventOccurrence[];
};

export class Event extends DomainEntity<EventProps> {
  public get publisher(): UniqueEntityID {
    return this.props.publisher;
  }

  public get newOccurrences(): EventOccurrence[] {
    return this.props.newOccurrences;
  }

  addOccurrence(theOccurrence: EventOccurrence): Result<void> {
    this.newOccurrences.push(theOccurrence);
    this.props.dateTimeInit =
      theOccurrence.dateTimeInit < this.props.dateTimeInit
        ? theOccurrence.dateTimeInit
        : this.dateTimeInit;
    this.props.dateTimeEnd =
      theOccurrence.dateTimeEnd > this.props.dateTimeEnd
        ? theOccurrence.dateTimeEnd
        : this.dateTimeEnd;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public get place(): EventPlace {
    return this.props.place;
  }

  public get description(): EventDescription {
    return this.props.description;
  }

  public get collaborators(): EventCollaborators {
    return this.props.collaborators;
  }

  public get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get dateTimeInit(): Date {
    return this.props.dateTimeInit;
  }

  get dateTimeEnd(): Date {
    return this.props.dateTimeEnd;
  }

  get multimedia() {
    return this.props.multimedia;
  }

  get category(): EventCategory {
    return this.props.category;
  }

  changeName(name: string): Result<void> {
    this.props.name = name;
    return Ok();
  }

  changeCollaborators(collaborators: EventCollaborators): Result<void> {
    this.props.collaborators = collaborators;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeMultimedia(multimedia: Multimedia[]): Result<void> {
    this.props.multimedia = multimedia;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeDescription(desc: EventDescription): Result<void> {
    this.props.description = desc;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeCategory(cat: EventCategory): Result<void> {
    this.props.category = cat;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changePlace(place: EventPlace): Result<void> {
    this.props.place = place;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public static new(
    props: Omit<
      EventProps,
      'createdAt' | 'updatedAt' | 'dateTimeInit' | 'dateTimeEnd'
    >,
  ): Result<Event> {
    return this.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
        dateTimeInit: props.newOccurrences.reduce((o1, o2) =>
          o1.dateTimeInit < o2.dateTimeInit ? o1 : o2,
        ).dateTimeInit,
        dateTimeEnd: props.newOccurrences.reduce((o1, o2) =>
          o1.dateTimeEnd > o2.dateTimeEnd ? o1 : o2,
        ).dateTimeEnd,
      },
      new UniqueEntityID(),
    );
  }

  public static create(props: EventProps, id: UniqueEntityID): Result<Event> {
    const defaultValues: EventProps = {
      ...props,
      collaborators: props.collaborators ? props.collaborators : [],
    };
    return Ok(new Event(defaultValues, id));
  }
}
