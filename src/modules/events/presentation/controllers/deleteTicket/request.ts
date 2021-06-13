export class DeleteTicketRequest {
  publisher: string;
  occurrenceId: string;
  ticketId: string;
  expandToAll = false;
}
