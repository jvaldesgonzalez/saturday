import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import {
  EventFromDBReadEntity,
  EventReadEntity,
} from '../entities/event.entity';

export namespace TopsEventMapper {
  export function toDto(e: EventFromDBReadEntity): EventReadEntity {
    return {
      ...e,
      multimedia: TextUtils.escapeAndParse(
        e.multimedia,
      ) as EventReadEntity['multimedia'],
      dateTimeInit: parseDate(e.dateTimeInit),
      dateTimeEnd: parseDate(e.dateTimeEnd),
      info: TextUtils.escapeAndParse(e.info) as EventReadEntity['info'],
    };
  }
}
