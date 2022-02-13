import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { ChartsBuilder } from 'src/shared/modules/stats/charts/charts.buider';
import { TextUtils } from 'src/shared/utils/text.utils';
import {
  EventDetailsFromDBReadEntity,
  EventDetailsReadEntity,
} from '../entities/event-details.entity';

export namespace EventDetailsMapper {
  export function toDto(
    e: EventDetailsFromDBReadEntity,
  ): EventDetailsReadEntity {
    const formatPrice = (baseAndTop: [number, number]): string => {
      const [base, top] = baseAndTop;
      if (base === top) return base.toString();
      return `${base} - ${top}`;
    };

    //TODO add real data
    const chart = new ChartsBuilder()
      .makePieBar()
      .withName('Sexo y edad')
      .withCategories(['Mujeres', 'Hombres', 'Non-Binary'])
      .addEntries([
        {
          range: [18, 20],
          values: [10, 50, 30],
        },
        {
          range: [20, 25],
          values: [200, 400, 36],
        },
        {
          range: [25, 30],
          values: [150, 160, 200],
        },
        {
          range: [30, 40],
          values: [300, 160, 3.0],
        },
        {
          range: [40, 60],
          values: [40, 20, 0],
        },
      ])
      .build();

    return {
      ...e,
      reachability: chart,
      usersInterested: chart,
      timesShared: chart,
      event: {
        ...e.event,
        multimedia: TextUtils.escapeAndParse(e.event.multimedia) as any,
        description: TextUtils.escapeAndParse(e.event.description) as any,
        occurrencesDate: e.event.occurrencesDate
          .map(parseDate)
          .sort((d1, d2) => d1.getTime() - d2.getTime()),
      },
      tickets: {
        ...e.tickets,
        price: formatPrice(e.tickets.price),
      },
    };
  }
}
