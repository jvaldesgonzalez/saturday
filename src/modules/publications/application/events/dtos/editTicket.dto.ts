import { TicketRaw } from './create-event.dto';

export type EditTicketDto = {
  eventId: string;
  occurrenceId: string;
  ticketId: string;
  ticket: Partial<TicketRaw>;
};
