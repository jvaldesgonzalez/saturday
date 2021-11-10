import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { EventEntity, EventFromDBEntity } from '../entities/event.entity';

export namespace TopsEventMapper {
  export function toDto(e: EventFromDBEntity): EventEntity {
    return {
      ...e,
      multimedia: JSON.parse(e.multimedia),
      dateTimeInit: parseDate(e.dateTimeInit),
      dateTimeEnd: parseDate(e.dateTimeEnd),
    };
  }
}
