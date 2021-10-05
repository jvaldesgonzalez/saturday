export class EventItem {
  publisher: {
    avatar: string;
    id: string;
    name: string;
  };
  name: string;
  multimedia: { type: string; url: string }[];
  place: { name: string; address: string };
  dateTimeInit: Date;
  dateTimeEnd: Date;
}
