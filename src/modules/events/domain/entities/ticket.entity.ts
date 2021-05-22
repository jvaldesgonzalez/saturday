import { Guard } from 'src/shared/core/Guard';
import { Ok, Result } from 'src/shared/core/Result';
import { WatchedList } from 'src/shared/core/WatchedList';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { TicketAmount } from '../value-objects/ticket-amount.value';
import { TicketPrice } from '../value-objects/ticket-price.value';

type TicketProps = {
  price: TicketPrice;
  name: string;
  amount: TicketAmount;
  description: string;
};

export class Ticket extends DomainEntity<TicketProps> {
  get price(): TicketPrice {
    return this.props.price;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get amount(): TicketAmount {
    return this.props.amount;
  }

  changeAmount(amount: TicketAmount): Result<void> {
    this.props.amount = amount;
    return Ok();
  }

  changePrice(price: TicketAmount): Result<void> {
    this.props.price = price;
    return Ok();
  }

  changeName(name: string): Result<void> {
    this.props.name = name;
    return Ok();
  }

  changeDescription(desc: string): Result<void> {
    this.props.description = desc;
    return Ok();
  }

  public static new(props: TicketProps): Result<Ticket> {
    return this.create(props, new UniqueEntityID());
  }

  public static create(
    props: TicketProps,
    id?: UniqueEntityID,
  ): Result<Ticket> {
    const againstNil = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentPath: 'name' },
      { argument: props.description, argumentPath: 'description' },
    ]);
    if (againstNil.succeeded) return Ok(new Ticket(props, id));
  }
}

export class TicketCollection extends WatchedList<Ticket> {
  compareItems(a: Ticket, b: Ticket): boolean {
    return a.equals(b);
  }
}
