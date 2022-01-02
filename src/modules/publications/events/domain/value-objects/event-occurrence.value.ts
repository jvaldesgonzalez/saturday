class EventOccurrence {
  dateTimeInit: Date;
  dateTimeEnd: Date;
  tickets: OccurrenceTicket[];
  createdAt: Date;
  updatedAt: Date;
}
class OccurrenceTicket {
  price: number;
  name: string;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
