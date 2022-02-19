import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ConfirmReservationBody {
  @ApiProperty()
  @IsString()
  securityPhrase: string;
  @ApiProperty()
  @IsUUID(4)
  eventId: string;
  @ApiProperty()
  @IsUUID(4)
  occurrenceId: string;
}
