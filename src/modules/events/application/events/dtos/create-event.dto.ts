import { MultimediaType } from 'src/shared/domain/multimedia.value';

type UnknownField = {
  header: string;
  body: string;
  inline: boolean;
};

type PlaceRaw = {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  hostRef: string;
};

export type MultimediaRaw = {
  type: MultimediaType;
  url: string;
};

export type OccurrenceRaw = {
  dateTimeInit: Date;
  dateTimeEnd: Date;
  tickets: TicketRaw[];
};

export type TicketRaw = {
  price: number;
  name: string;
  amount: number;
  description: string;
};

export type CreateEventDto = {
  publisher: string;
  name: string;
  description: UnknownField[];
  categories: string[];
  place?: PlaceRaw;
  collaborators?: string[];
  multimedia: MultimediaRaw[];
  occurrences: OccurrenceRaw[];
};
