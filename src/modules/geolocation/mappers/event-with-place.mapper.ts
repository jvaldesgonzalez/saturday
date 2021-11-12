import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import {
  EventWithPlaceEntity,
  EventWithPlaceFromDBEntity,
} from '../entities/place-with-event.entity';

export namespace EventWithPlaceMapper {
  export function toDto(e: EventWithPlaceFromDBEntity): EventWithPlaceEntity {
    console.log(e);
    const preReturn = {
      ...e,
      multimedia: JSON.parse(e.multimedia),
      dateTimeInit: parseDate(e.dateTimeInit),
      dateTimeEnd: parseDate(e.dateTimeEnd),
      place: {
        ...e.place,
        partnerRef: e.place.partnerRef,
      },
    };
    if (preReturn.place.partnerRef === null) delete preReturn.place.partnerRef;
    return preReturn;
  }
}
