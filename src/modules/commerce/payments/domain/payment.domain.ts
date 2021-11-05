import { Fail, Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { PaymentGateway } from './value-objects/payment-gateway.value';
import { PaymentStatus } from './value-objects/payment-status';

type PaymentProps = {
  ticketId: UniqueEntityID;
  couponId?: UniqueEntityID;
  amountOfTickets: number; // less than 16
  gateway: PaymentGateway;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;
  status: PaymentStatus;
  issuerId: UniqueEntityID;
  transactionUUID?: string;
};

type NewPaymentProps = Omit<
  PaymentProps,
  'createdAt' | 'updatedAt' | 'executedAt' | 'status'
>;

export class Payment extends DomainEntity<PaymentProps> {
  get ticketId(): string {
    return this.props.ticketId.toString();
  }

  get transactionUUID(): string | undefined {
    return this.props.transactionUUID;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get executedAt(): Date {
    return this.props.executedAt;
  }

  get gateway(): PaymentGateway {
    return this.props.gateway;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  public setTransactionUUID(theTransactionUUID: string): Result<void> {
    this.props.transactionUUID = theTransactionUUID;
    return Ok();
  }

  public static new(props: NewPaymentProps): Result<Payment> {
    return Payment.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: PaymentStatus.Pending,
      },
      new UniqueEntityID(),
    );
  }

  public accept(): Result<void> {
    if (this.props.status == PaymentStatus.Pending) {
      this.props.status = PaymentStatus.Successful;
      this.props.updatedAt = new Date();
      this.props.executedAt = new Date();
      return Ok();
    }
    return Fail(`Can't complete a payment in ${this.props.status} status`);
  }

  public cancel(): Result<void> {
    if (this.props.status == PaymentStatus.Pending) {
      this.props.status = PaymentStatus.Canceled;
      this.props.updatedAt = new Date();
      return Ok();
    }
    return Fail(`Can't cancel a payment in ${this.props.status} status`);
  }

  public expire(): Result<void> {
    if (this.props.status == PaymentStatus.Pending) {
      this.props.status = PaymentStatus.Expired;
      this.props.updatedAt = new Date();
      return Ok();
    }
    return Fail(`Can't expire a payment in ${this.props.status} status`);
  }

  public static create(
    props: PaymentProps,
    id: UniqueEntityID,
  ): Result<Payment> {
    return Ok(new Payment(props, id));
  }
}
