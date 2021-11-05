import { PaymentGateway } from '../../domain/value-objects/payment-gateway.value';

export type CreatePaymentDto = {
  ticketId: string;
  couponId?: string;
  amountOfTickets: number;
  gateway: PaymentGateway;
  issuerId: string;
};
