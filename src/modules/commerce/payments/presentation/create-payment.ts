import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { PaymentGateway } from '../domain/value-objects/payment-gateway.value';

export class CreatePaymentBody {
  @ApiProperty()
  @IsUUID(4)
  ticketId: string;

  @ApiPropertyOptional()
  @IsUUID(4)
  @IsOptional()
  couponId?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(16)
  amountOfTickets: number;

  @ApiProperty({ enum: PaymentGateway })
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;
}
