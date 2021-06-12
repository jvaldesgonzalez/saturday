import { CreateEventController } from './createEvent/create-event.controller';
import { EditEventController } from './editEvent/edit-event.controller';
import { GetEventDetailsController } from './getEventDetails/get-event-details.controller';
import { GetHostPublicationsController } from './getHostPublications/get-host-publications.controller';
import { GetRecentEventsByHostController } from './getRecentHostEvents/get-recent-host-events.controller';
import { GetTicketsByHostController } from './getTicketsByHost/get-tickets-by-host.controller';
import { GetTicketsByOccurrenceController } from './getTicketsByOccurrence/get-tickets-by-occurrence.controller';

const eventsControllers = [
  GetRecentEventsByHostController,
  GetTicketsByHostController,
  GetTicketsByOccurrenceController,
  GetHostPublicationsController,
  GetEventDetailsController,
  CreateEventController,
  EditEventController,
];

export default eventsControllers;
