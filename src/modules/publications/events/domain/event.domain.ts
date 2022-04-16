import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { Multimedia, MultimediaType } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { EventOccurrence } from './event-occurrence.domain';
import { EventCategory } from './value-objects/event-categories.value';
import { EventCollaborators } from './value-objects/event-collaborators.value';
import { EventDescription } from './value-objects/event-description.value';
import { EventPlace } from './value-objects/event-place.value';
import _ from 'lodash';

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
  dateTimeInit?: Date;
  dateTimeEnd?: Date;
  topPrice?: number;
  hashtags: string[];
  basePrice?: number;
  newOccurrences: EventOccurrence[];
};

export class Event extends DomainEntity<EventProps> {
  public get newOccurrences(): EventOccurrence[] {
    return this.props.newOccurrences;
  }

  public get publisher(): UniqueEntityID {
    return this.props.publisher;
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

  get topPrice(): number {
    return this.props.topPrice;
  }

  get basePrice(): number {
    return this.props.basePrice;
  }

  get hashtags(): string[] {
    return this.props.hashtags;
  }

  addOccurrence(theOcc: EventOccurrence): Result<void> {
    this.props.newOccurrences.push(theOcc);

    const orderedPrices = theOcc.newTickets
      .map((t) => t.price)
      .sort((a, b) => a - b);
    const [minPrice, maxPrice] = [
      orderedPrices[0],
      orderedPrices[orderedPrices.length - 1],
    ];

    if (!this.dateTimeInit || !this.dateTimeEnd) {
      this.props.dateTimeInit = theOcc.dateTimeInit;
      this.props.dateTimeEnd = theOcc.dateTimeEnd;
    }

    if (!this.topPrice || !this.basePrice) {
      this.props.basePrice = minPrice;
      this.props.topPrice = maxPrice;
    }

    this.props.dateTimeInit =
      this.props.dateTimeInit < theOcc.dateTimeInit
        ? this.props.dateTimeInit
        : theOcc.dateTimeInit;
    this.props.dateTimeEnd =
      this.props.dateTimeEnd > theOcc.dateTimeEnd
        ? this.props.dateTimeEnd
        : theOcc.dateTimeEnd;

    this.props.basePrice =
      this.props.basePrice < minPrice ? this.props.basePrice : minPrice;
    this.props.topPrice =
      this.props.topPrice > maxPrice ? this.props.topPrice : maxPrice;
    this.props.updatedAt = new Date();
    return Ok();
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

  private static computeHashags(description: EventDescription): string[] {
    return description
      .map((d) => d.body) //focus on prop body
      .map((txt) => txt.match(/(^|\s)#([^\d&%$_-]\S{2,49})\b/g) || []) //match hashtag
      .flat() //flat the list of hashtags-matched list
      .map((withSpaces) => withSpaces.trim()) // remove spaces in the edges
      .filter((item, index, list) => list.indexOf(item) === index) //remove duplicates
      .map((hstg) => hstg.slice(1)); // remove leading sharp(#)
  }

  private static addTicketsInfoToDescription(
    desc: EventDescription,
    occurrences: EventOccurrence[],
  ): EventDescription {
    //select different tickets
    const tickets = _.uniqBy(
      occurrences.flatMap((o) => o.newTickets),
      'name',
    );

    const newDescriptionFieldBody = tickets
      .map((t) => `• ${t.name} (${t.price.toFixed(2)} CUP):\n${t.description}`)
      .join('\n\n');

    return [
      ...desc,
      {
        header: 'Informacion de los tickets',
        inline: true,
        body: newDescriptionFieldBody,
      },
    ];
  }

  public static new(
    props: Omit<
      EventProps,
      'createdAt' | 'updatedAt' | 'hashtags' | 'newOccurrences'
    >,
  ): Result<Event> {
    return this.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
        hashtags: Event.computeHashags(props.description),
        newOccurrences: [],
      },
      new UniqueEntityID(),
    );
  }

  public static create(props: EventProps, id: UniqueEntityID): Result<Event> {
    const defaultValues: EventProps = {
      ...props,
      collaborators: props.collaborators ? props.collaborators : [],
      description: this.addTicketsInfoToDescription(
        props.description,
        props.newOccurrences,
      ),
    };
    return Ok(new Event(defaultValues, id));
  }
}
