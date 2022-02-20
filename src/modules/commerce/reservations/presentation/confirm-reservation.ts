import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ConfirmReservationBody {
  @ApiProperty()
  securityPhrase: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  occurrenceId: string;
}
