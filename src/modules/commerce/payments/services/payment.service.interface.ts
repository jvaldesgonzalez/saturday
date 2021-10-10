export class PaymentPayload {
  total: string;
  discount: string;
  item: {
    name: string;
    description: string;
    quantity: number;
  };
  merchant_op_id: string;
  invoice_id: string;
}

export interface IPaymentService {
  generatePaymentLink(payload: PaymentPayload): Promise<{ link: string }>;
  completePayment(transaction_uuid: string): Promise<void>;
  cancelPayment(transaction_uuid: string): Promise<void>;
}
