import { GetRecentEventsByHostController } from './getRecentHostEvents/get-recent-host-events.controller';
import { GetTicketsByHostController } from './getTicketsByHost/get-tickets-by-host.controller';

const eventsControllers = [
  GetRecentEventsByHostController,
  GetTicketsByHostController,
];

export default eventsControllers;
