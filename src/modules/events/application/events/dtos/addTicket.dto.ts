import { TicketRaw } from './create-event.dto';

export type AddTicketDto = TicketRaw & {
  publisher: string;
  occurrenceId: string;
  expandToAll: boolean;
};
