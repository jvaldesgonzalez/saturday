import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import {
  EventListItemFromDBReadEntity,
  EventListItemReadEntity,
} from '../entities/event-list-item.entity';

export namespace EventListItemMapper {
  export function toDto(
    e: EventListItemFromDBReadEntity,
  ): EventListItemReadEntity {
    const event = {
      ...e,
      dateTimeInit: parseDate(e.dateTimeInit),
      imageUrl: TextUtils.escapeAndParse(e.multimedia)[0].url,
    };
    delete event.multimedia;
    delete event.createdAt;
    return event;
  }
}
