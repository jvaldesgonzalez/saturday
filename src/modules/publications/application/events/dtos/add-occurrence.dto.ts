import { OccurrenceRaw } from './create-event.dto';

export type AddOccurrenceDto = OccurrenceRaw & { eventId: string };
