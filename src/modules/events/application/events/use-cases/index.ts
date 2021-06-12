import { AddOccurrenceUseCase } from './addOccurrence/add-occurrence.usecase';
import { AddTagUseCase } from './addTag/add-tag.usecase';
import { AddTicketUseCase } from './addTicket/add-ticket.usecase';
import { CreateEventUseCase } from './createEvent/create-event.usecase';
import { DeleteOccurrenceUseCase } from './deleteOccurrence/delete-occurrence.usecase';
import { EditEventUseCase } from './editEvent/edit-event.usecase';
import { EditTicketUseCase } from './editTicket/edit-ticket.usecase';
import { RemoveTicketUseCase } from './removeTicket/remove-ticket.usecase';

const eventsUseCases = [
  AddOccurrenceUseCase,
  AddTagUseCase,
  AddTicketUseCase,
  CreateEventUseCase,
  DeleteOccurrenceUseCase,
  EditEventUseCase,
  EditTicketUseCase,
  RemoveTicketUseCase,
];

export default eventsUseCases;
