import { TicketRaw } from './create-event.dto';

export type AddTicketDto = TicketRaw & {
  eventId: string;
  occurrenceId: string;
};
