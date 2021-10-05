export class MapPlaceData {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  partnerRef?: string;
}

class PartnerDetails {
  id: string;
  avatar: string;
  username: string;
}

class MultimediaDetails {
  type: string;
  url: string;
}

class CategoryDetails {
  name: string;
  id: string;
}

class EventsInPlace {
  publisher: PartnerDetails;
  dateTimeInit: Date;
  dateTimeEnd: Date;
  name: string;
  multimedia: MultimediaDetails[];
  categories: CategoryDetails[];
}

export class PlaceWithEvent {
  place: MapPlaceData;
  events: EventsInPlace[];
  distance: number;
}
