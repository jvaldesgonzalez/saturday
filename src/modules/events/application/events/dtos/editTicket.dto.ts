import { TicketRaw } from './create-event.dto';

export type EditTicketDto = {
  publisher: string;
  occurrenceId: string;
  ticketId: string;
  ticket: Partial<TicketRaw>;
  expandToAll: boolean;
};
