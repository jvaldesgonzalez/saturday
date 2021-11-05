import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  IPaymentService,
  PaymentPayload,
} from '../../application/interfaces/payment-service.interface';
import { enzonaConfig } from './config/enzona.config';

@Injectable()
export class EnzonaPaymentService implements IPaymentService {
  constructor(private httpService: HttpService) {
    httpService.axiosRef.interceptors.response.use();
  }

  async generatePaymentLink(
    payload: PaymentPayload,
  ): Promise<{ redirectUrl: string; transactionUUID: string }> {
    try {
      console.log(payload);
      const res: any = await this.httpService
        .request({
          url: `${enzonaConfig.baseUrl}/payment/v1.0.0/payments`,
          headers: {
            Authorization: `Bearer 20c11f09-ab26-367e-b6da-d18daa052d40`,
          },
          method: 'POST',
          data: {
            description: 'Compra del ticket',
            currency: 'CUP',
            amount: {
              total: payload.total.toFixed(2),
              details: {
                shipping: '0.00',
                tax: '0.00',
                discount: '0.00',
                tip: '0.00',
              },
            },
            items: [
              {
                name: 'Ticket',
                description: 'descripcion',
                quantity: payload.quantity,
                price: payload.ticketPrice.toFixed(2),
                tax: '0.00',
              },
            ],
            merchant_op_id: 123456789123,
            invoice_number: 1212,
            return_url: 'https://localhost/return',
            cancel_url: 'http://localhost/cancel',
            terminal_id: 12121,
            buyer_identity_code: '',
          },
        })
        .toPromise();
      const { data } = res;
      console.log(data);
      return {
        redirectUrl: data.links.find((l) => l.method == 'REDIRECT').href,
        transactionUUID: data.transaction_uuid,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  completePayment(transaction_uuid: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  cancelPayment(transaction_uuid: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
