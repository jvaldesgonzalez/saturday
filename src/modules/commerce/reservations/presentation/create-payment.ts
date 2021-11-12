import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreateReservationBody {
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
}
