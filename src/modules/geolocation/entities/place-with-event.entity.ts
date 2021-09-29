export class MapPlaceData {
  latitude: number;
  longitude: number;
  name: string;
  partnerRef?: string;
}

class PartnerDetails {
  id: string;
  avatar: string;
  username: string;
}

export class EventsInPlace {
  publisher: PartnerDetails;
}

export class PlaceWithEvent {
  place: MapPlaceData;
  events: any;
  distance: number; //in km
}
