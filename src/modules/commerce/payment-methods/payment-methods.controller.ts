import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SkipAuth } from 'src/modules/accounts-management/auth/decorators/skip-auth.decorator';
import { PaymentMethodsReadService } from './payment-methods.read-service';
import { PaymentMethodsReadEntity } from './read-model/entities/payment-methods.read-entity';

@ApiBearerAuth()
@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readService: PaymentMethodsReadService) {}

  @Get()
  @SkipAuth()
  @ApiOkResponse({ type: [PaymentMethodsReadEntity] })
  @ApiQuery({ name: 'ticketId', type: String })
  async getMethodsForTicket(
    @Query('ticketId', ParseUUIDPipe) theTicketId: string,
  ) {
    return await this.readService.getPaymentMethods(theTicketId);
  }
}
