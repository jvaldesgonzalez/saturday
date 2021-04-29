import { Guard } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { WatchedList } from 'src/shared/core/WatchedList';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Ticket, TicketCollection } from './ticket.entity';

type EventOccurrenceProps = {
  dateTimeInit: Date;
  dateTimeEnd: Date;
  tickets: TicketCollection;
};

export class EventOccurrence extends DomainEntity<EventOccurrenceProps> {
  get dateTimeInit(): Date {
    return this.props.dateTimeInit;
  }

  get dateTimeEnd(): Date {
    return this.props.dateTimeEnd;
  }

  get tickets(): TicketCollection {
    return this.props.tickets;
  }

  addTicket(ticket: Ticket): Result<void> {
    this.props.tickets.add(ticket);
    return Ok();
  }

  removeTicket(ticket: Ticket): Result<void> {
    this.props.tickets.remove(ticket);
    return Ok();
  }

  editTicket(ticket: Ticket): Result<void> {
    if (!this.props.tickets.exists(ticket))
      return Fail(`Ticket ${ticket._id} doesn't exists in this occurrence`);
    this.props.tickets.remove(ticket);
    this.props.tickets.add(ticket);
    return Ok();
  }

  public static new(props: EventOccurrenceProps): Result<EventOccurrence> {
    return this.create(props, new UniqueEntityID());
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

export class EventOccurrenceCollection extends WatchedList<EventOccurrence> {
  compareItems(a: EventOccurrence, b: EventOccurrence): boolean {
    return a.equals(b);
  }
}
