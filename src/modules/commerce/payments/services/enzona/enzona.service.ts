import { IPaymentService, PaymentPayload } from '../payment.service.interface';

export class EnzonaPaymentService implements IPaymentService {
  constructor() {}

  generatePaymentLink(payload: PaymentPayload): Promise<{ link: string }> {
    throw new Error('Method not implemented.');
  }
  completePayment(transaction_uuid: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cancelPayment(transaction_uuid: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
