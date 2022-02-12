import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { OccurrenceTicket } from './occurrence-ticket.domain';

type EventOccurrenceProps = {
  dateTimeInit: Date;
  dateTimeEnd: Date;
  newTickets: OccurrenceTicket[];
  createdAt: Date;
  updatedAt: Date;
  eventId: UniqueEntityID;
};

export class EventOccurrence extends DomainEntity<EventOccurrenceProps> {
  public get dateTimeInit(): Date {
    return this.props.dateTimeInit;
  }

  public get eventId(): UniqueEntityID {
    return this.props.eventId;
  }

  public get dateTimeEnd(): Date {
    return this.props.dateTimeEnd;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get newTickets(): OccurrenceTicket[] {
    return this.props.newTickets;
  }

  public changeDateInit(theNewDate: Date): Result<void> {
    this.props.dateTimeInit = theNewDate;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public changeDateEnd(theNewDate: Date): Result<void> {
    this.props.dateTimeEnd = theNewDate;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public static new(
    props: Omit<EventOccurrenceProps, 'createdAt' | 'updatedAt'>,
  ): Result<EventOccurrence> {
    return this.create(
      { ...props, createdAt: new Date(), updatedAt: new Date() },
      new UniqueEntityID(),
    );
  }

  public static create(
    props: EventOccurrenceProps,
    id: UniqueEntityID,
  ): Result<EventOccurrence> {
    return Ok(new EventOccurrence(props, id));
  }
}
