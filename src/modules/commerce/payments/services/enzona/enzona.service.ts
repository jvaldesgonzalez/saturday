import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IPaymentService } from '../payment.service.interface';
import { enzonaConfig } from './config/enzona.config';
import { EnzonaPaymentPayload } from './enzona.payload';

@Injectable()
export class EnzonaPaymentService implements IPaymentService {
  constructor(private httpService: HttpService) {
    httpService.axiosRef.interceptors.response.use();
  }

  async generatePaymentLink(
    payload?: EnzonaPaymentPayload,
  ): Promise<{ link: string }> {
    try {
      const res: any = await this.httpService
        .request({
          url: `${enzonaConfig.baseUrl}/payment/v1.0.0/payments`,
          headers: {
            Authorization: `Bearer 20c11f09-ab26-367e-b6da-d18daa052d40`,
          },
          method: 'POST',
          data: {
            desctiption: 'blabla',
            currency: 'CUP',
            amount: {
              total: '10.00',
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
                description: 'Un tickecito man',
                quantity: 1,
                price: '10.00',
                tax: '0.00',
              },
            ],
            merchant_op_id: 123456789123,
            invoice_number: 1212,
            return_url: 'http://localhost/dimequetodobien',
            cancel_url: 'http://localhost/dimequetodomal',
            terminal_id: 12121,
            buyer_identity_code: '',
          },
        })
        .toPromise();
      const { data } = res;
      console.log(data);
      return { link: data.links.find((l) => l.method == 'REDIRECT') };
    } catch (error) {
      console.log(error.message);
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
