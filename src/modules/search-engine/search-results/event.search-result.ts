export class EventItem {
  publisher: {
    avatar: string;
    id: string;
    username: string;
  };
  name: string;
  multimedia: { type: string; url: string }[];
  place: { name: string; address: string };
  dateTimeInit: Date;
  dateTimeEnd: Date;
  id: string;
  basePrice: number;
}
