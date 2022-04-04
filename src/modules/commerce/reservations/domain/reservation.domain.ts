import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import generatePassword from 'omgopass';

type PaymentProps = {
  ticketId: UniqueEntityID;
  ticketName: string;
  ticketPrice: number;
  ticketDescription: string;
  couponId?: UniqueEntityID;
  amountOfTickets: number; // less than 16
  createdAt: Date;
  updatedAt: Date;
  issuerId: UniqueEntityID;
  securityPhrase: string;
  isValidated: boolean;
};

type NewPaymentProps = Omit<
  PaymentProps,
  | 'createdAt'
  | 'updatedAt'
  | 'executedAt'
  | 'status'
  | 'securityPhrase'
  | 'isValidated'
>;

export class Reservation extends DomainEntity<PaymentProps> {
  get ticketId(): string {
    return this.props.ticketId.toString();
  }
  get ticketName(): string {
    return this.props.ticketName;
  }
  get ticketPrice(): number {
    return this.props.ticketPrice;
  }
  get ticketDescription(): string {
    return this.props.ticketDescription;
  }

  get issuerId(): string {
    return this.props.issuerId.toString();
  }

  get hasCoupon(): boolean {
    return !!this.props.couponId;
  }

  get couponId(): string | undefined {
    return this.props.couponId?.toString();
  }

  get amountOfTickets(): number {
    return this.props.amountOfTickets;
  }

  get securityPhrase(): string {
    return this.props.securityPhrase;
  }

  get isValidated(): boolean {
    return this.props.isValidated;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  validate(): Result<void> {
    this.props.isValidated = true;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public static generateSecurityPhrase(): string {
    return generatePassword({
      syllablesCount: 5,
      minSyllableLength: 3,
      maxSyllableLength: 6,
      hasNumbers: false,
      titlecased: true,
      separators: '-_+=',
    });
  }

  public static new(props: NewPaymentProps): Result<Reservation> {
    return Reservation.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
        securityPhrase: Reservation.generateSecurityPhrase(),
        isValidated: false,
      },
      new UniqueEntityID(),
    );
  }

  public static create(
    props: PaymentProps,
    id: UniqueEntityID,
  ): Result<Reservation> {
    return Ok(new Reservation(props, id));
  }
}
