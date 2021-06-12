import { Guard } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { EventRef } from './eventRef.entity';
import { Ticket, TicketCollection } from './ticket.entity';

type EventOccurrenceProps = {
  eventId: EventRef;
  dateTimeInit: Date;
  dateTimeEnd: Date;
  tickets: TicketCollection;
  createdAt: Date;
  updatedAt: Date;
};

export class EventOccurrence extends AggregateDomainEntity<EventOccurrenceProps> {
  get eventId(): EventRef {
    return this.props.eventId;
  }

  get dateTimeInit(): Date {
    return this.props.dateTimeInit;
  }

  get dateTimeEnd(): Date {
    return this.props.dateTimeEnd;
  }

  get tickets(): TicketCollection {
    return this.props.tickets;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  addTicket(ticket: Ticket): Result<void> {
    this.props.tickets.add(ticket);
    this.props.updatedAt = new Date();
    return Ok();
  }

  removeTicket(ticket: Ticket): Result<void> {
    this.props.tickets.remove(ticket);
    this.props.updatedAt = new Date();
    return Ok();
  }

  findTicketById(id: string): Ticket | undefined {
    return this.props.tickets
      .getItems()
      .find((item) => item._id.toString() === id);
  }

  editTicket(ticket: Ticket): Result<void> {
    if (!this.props.tickets.exists(ticket)) return Ok();
    this.props.tickets.remove(ticket);
    this.props.tickets.add(ticket);
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
    const againstNil = Guard.againstNullOrUndefinedBulk([
      { argument: props.dateTimeInit, argumentPath: 'date-time-init' },
      { argument: props.dateTimeEnd, argumentPath: 'date-time-end' },
    ]);
    if (againstNil.succeeded) return Ok(new EventOccurrence(props, id));
    return Fail(againstNil.message);
  }
}
