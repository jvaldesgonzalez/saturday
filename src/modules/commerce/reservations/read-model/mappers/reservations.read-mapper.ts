import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { ReservationReadResponse } from '../../presentation/reservation-read';
import { ReservationReadFromDBEntity } from '../entities/reservations.read-entity';

export namespace ReservationReadMapper {
  export function toResponse(
    db: ReservationReadFromDBEntity,
  ): ReservationReadResponse {
    const preReturn: ReservationReadResponse = {
      ...db,
      event: {
        ...db.event,
        dateTimeEnd: parseDate(db.event.dateTimeEnd),
        dateTimeInit: parseDate(db.event.dateTimeInit),
        multimedia: TextUtils.escapeAndParse(db.event.multimedia)[0],
      },
      couponApplied: db.couponApplied ? db.couponApplied.code : null,
      toPayStr: db.toPay.toFixed(2) + ' CUP',
    };
    if (!preReturn.couponApplied) delete preReturn.couponApplied;
    return preReturn;
  }
}
