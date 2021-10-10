import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

type PaymentProps = {
  ticketId: UniqueEntityID;
  couponId?: UniqueEntityID;
  quantity: number; // less than 16
  createdAt: Date;
  updatedAt: Date;
};

type NewPaymentProps = Omit<PaymentProps, 'createdAt' | 'updatedAt'>;

export class Payment extends DomainEntity<PaymentProps> {
  get ticketId(): string {
    return this.props.ticketId.toString();
  }

  get couponId(): string | undefined {
    return this.props.couponId?.toString();
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static new(props: NewPaymentProps): Result<Payment> {
    return Payment.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(),
    );
  }

  private static create(
    props: PaymentProps,
    id: UniqueEntityID,
  ): Result<Payment> {
    return Ok(new Payment(props, id));
  }
}
