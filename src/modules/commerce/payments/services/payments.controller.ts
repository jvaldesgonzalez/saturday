import { Controller, Post } from '@nestjs/common';
import { EnzonaPaymentService } from './enzona/enzona.service';

@Controller('payments')
export class PaymentController {
  constructor(private enzonaService: EnzonaPaymentService) {}

  @Post('')
  async test() {
    return this.enzonaService.generatePaymentLink();
  }
}
