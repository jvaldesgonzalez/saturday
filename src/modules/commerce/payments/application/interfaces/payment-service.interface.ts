export class PaymentPayload {
  total: number;
  ticketPrice: number;
  discount: number;
  name: string;
  description: string;
  quantity: number;
}

export interface IPaymentService {
  generatePaymentLink(
    payload: PaymentPayload,
  ): Promise<{ redirectUrl: string; transactionUUID: string }>;
  completePayment(transaction_uuid: string): Promise<void>;
  cancelPayment(transaction_uuid: string): Promise<void>;
}
