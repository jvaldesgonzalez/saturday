import { HttpService } from '@nestjs/axios';
import { IPaymentService, PaymentPayload } from '../payment.service.interface';
import { EnzonaPaymentPayload } from './enzona.payload';

export class EnzonaPaymentService implements IPaymentService {
  constructor(private httpService: HttpService) {}

  generatePaymentLink(
    payload: EnzonaPaymentPayload,
  ): Promise<{ link: string }> {
    throw new Error('Method not implemented');
  }
  completePayment(transaction_uuid: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cancelPayment(transaction_uuid: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
