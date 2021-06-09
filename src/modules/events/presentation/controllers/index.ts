import { GetRecentEventsByHostController } from './getRecentHostEvents/get-recent-host-events.controller';
import { GetTicketsByHostController } from './getTicketsByHost/get-tickets-by-host.controller';
import { GetTicketsByOccurrenceController } from './getTicketsByOccurrence/get-tickets-by-occurrence.controller';

const eventsControllers = [
  GetRecentEventsByHostController,
  GetTicketsByHostController,
  GetTicketsByOccurrenceController,
];

export default eventsControllers;
