import { CreateEventDto } from './create-event.dto';

export type EditEventDto = Partial<
  Omit<CreateEventDto, 'publisher' | 'occurrences'>
> & { eventId: string };
