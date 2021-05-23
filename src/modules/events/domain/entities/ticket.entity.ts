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
  createdAt: Date;
  updatedAt: Date;
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

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeAmount(amount: TicketAmount): Result<void> {
    this.props.amount = amount;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changePrice(price: TicketAmount): Result<void> {
    this.props.price = price;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeName(name: string): Result<void> {
    this.props.name = name;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeDescription(desc: string): Result<void> {
    this.props.description = desc;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public static new(
    props: Omit<TicketProps, 'createdAt' | 'updatedAt'>,
  ): Result<Ticket> {
    return this.create(
      { ...props, createdAt: new Date(), updatedAt: new Date() },
      new UniqueEntityID(),
    );
  }

  public static create(props: TicketProps, id: UniqueEntityID): Result<Ticket> {
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
