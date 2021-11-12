import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import generatePassword from 'omgopass';

type PaymentProps = {
  ticketId: UniqueEntityID;
  couponId?: UniqueEntityID;
  amountOfTickets: number; // less than 16
  createdAt: Date;
  updatedAt: Date;
  issuerId: UniqueEntityID;
  securityPhrase: string;
};

type NewPaymentProps = Omit<
  PaymentProps,
  'createdAt' | 'updatedAt' | 'executedAt' | 'status' | 'securityPhrase'
>;

export class Reservation extends DomainEntity<PaymentProps> {
  get ticketId(): string {
    return this.props.ticketId.toString();
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
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
