import { TicketRaw } from './create-event.dto';

export type EditTicketDto = {
  occurrenceId: string;
  ticketId: string;
  ticket: Partial<TicketRaw>;
  expandToAll: boolean;
};
