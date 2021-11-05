import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
import { CreatePaymentErrors } from './application/use-cases/create-payment/create-payment.errors';
import { CreatePayment } from './application/use-cases/create-payment/create-payment.usecase';
import { CreatePaymentBody } from './presentation/create-payment';

@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private createPaymentUC: CreatePayment) {}

  @Post('')
  async createPayment(
    @Body() data: CreatePaymentBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const result = await this.createPaymentUC.execute({
      ...data,
      issuerId: payload.id,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CreatePaymentErrors.TicketNotFound:
          throw new ConflictException(error.errorValue().message);
        case CreatePaymentErrors.NotAvailableAmount:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
