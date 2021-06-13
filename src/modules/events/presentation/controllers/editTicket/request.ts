import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Min } from 'class-validator';

class Ticket {
  @ApiProperty()
  @Min(1)
  price: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  description: string;
}
class PartialTicket extends PartialType(Ticket) {}

export class EditTicketRequest {
  publisher: string;
  occurrenceId: string;
  ticketId: string;
  ticket: PartialTicket;
  @ApiProperty()
  expandToAll = false;
}

export class EditTicketBody extends PartialType(Ticket) {}
