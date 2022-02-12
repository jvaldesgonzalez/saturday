import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

type OccurrenceTicketProps = {
  price: number;
  name: string;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type NewTicketProps = Omit<OccurrenceTicketProps, 'createdAt' | 'updatedAt'>;

export class OccurrenceTicket extends DomainEntity<OccurrenceTicketProps> {
  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get description(): string {
    return this.props.description;
  }

  public get name(): string {
    return this.props.name;
  }

  public get price(): number {
    return this.props.price;
  }

  public changePrice(theNewPrice: number): Result<void> {
    this.props.price = theNewPrice;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public changeDescription(theNewDescription: string): Result<void> {
    this.props.description = theNewDescription;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public changeName(theNewName: string): Result<void> {
    this.props.name = theNewName;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public changeAmount(theNewAmount: number): Result<void> {
    this.props.amount = theNewAmount;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public stopSelling(): Result<void> {
    this.props.amount = 0;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public static new(props: NewTicketProps): Result<OccurrenceTicket> {
    return this.create(
      { ...props, createdAt: new Date(), updatedAt: new Date() },
      new UniqueEntityID(),
    );
  }

  public static create(
    props: OccurrenceTicketProps,
    id: UniqueEntityID,
  ): Result<OccurrenceTicket> {
    return Ok(new OccurrenceTicket(props, id));
  }
}
