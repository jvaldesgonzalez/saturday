import { AddEventToCollectionController } from './addEventToCollection/add-event-to-collection.controller';
import { AddOccurrenceController } from './addOccurrence/add-occurrence.controller';
import { AddTicketController } from './addTicket/add-ticket.controller';
import { CreateCollectionController } from './createCollection/create-collection.controller';
import { CreateEventController } from './createEvent/create-event.controller';
import { DeleteCollectionController } from './deleteCollection/delete-collection.controller';
import { DeleteOccurrenceController } from './deleteOccurrence/delete-occurrence.controller';
import { DeleteTicketController } from './deleteTicket/delete-ticket.controller';
import { EditEventController } from './editEvent/edit-event.controller';
import { EditTicketController } from './editTicket/edit-ticket.controller';
import { GetEventDetailsController } from './getEventDetails/get-event-details.controller';
import { GetHostPublicationsController } from './getHostPublications/get-host-publications.controller';
import { GetRecentEventsByHostController } from './getRecentHostEvents/get-recent-host-events.controller';
import { GetTicketsByHostController } from './getTicketsByHost/get-tickets-by-host.controller';
import { GetTicketsByOccurrenceController } from './getTicketsByOccurrence/get-tickets-by-occurrence.controller';
import { RemoveEventFromCollectionController } from './removeEventFromCollection/remove-event-from-collection.controller';
import { UpdateCollectionController } from './updateCollection/update-collection.controller';

const eventsControllers = [
  GetRecentEventsByHostController,
  GetTicketsByHostController,
  GetTicketsByOccurrenceController,
  GetHostPublicationsController,
  GetEventDetailsController,
  CreateEventController,
  EditEventController,
  AddOccurrenceController,
  DeleteOccurrenceController,
  AddTicketController,
  DeleteTicketController,
  EditTicketController,
  CreateCollectionController,
  DeleteCollectionController,
  AddEventToCollectionController,
  RemoveEventFromCollectionController,
  UpdateCollectionController,
];

export default eventsControllers;
