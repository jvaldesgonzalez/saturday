import { DateTime } from 'neo4j-driver-core';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { EventDetails } from '../../presentation/event-details';

export namespace EventDetailsReadMapper {
  export function toResponse(r): EventDetails {
    delete r.createdAt;
    return {
      ...r,
      info: TextUtils.escapeAndParse(r.info),
      multimedia: TextUtils.escapeAndParse(r.multimedia),
      dateTimeInit: parseDate(r.dateTimeInit),
      attentionTags:
        process.env.PROMO === 'true'
          ? [
              {
                color: '#1FCF85',
                description: 'Descuento del 10% para todos los eventos',
                title: 'Descuento 10%',
              },
              ...r.attentionTags,
            ]
          : r.attentionTags,
      dateTimeEnd: parseDate(r.dateTimeEnd),
      occurrences: r.occurrences
        .map(
          (o: {
            dateTimeInit: DateTime<number>;
            dateTimeEnd: DateTime<number>;
            tickets: { price: number; name: string }[];
          }) => {
            if (!o.dateTimeEnd) return [];
            return {
              ...o,
              tickets: o.tickets
                .sort((t1, t2) => t1.price - t2.price)
                .map((t) => {
                  if (process.env.PROMO !== 'true') return t;
                  return {
                    ...t,
                    name: t.name + ' (-10%)',
                    price: parseFloat((t.price - t.price / 10).toFixed(2)),
                  };
                }),
              dateTimeInit: parseDate(o.dateTimeInit),
              dateTimeEnd: parseDate(o.dateTimeEnd),
            };
          },
        )
        .flat(),
    };
  }
}
