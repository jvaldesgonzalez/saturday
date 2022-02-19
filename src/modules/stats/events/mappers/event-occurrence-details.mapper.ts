import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { ChartsBuilder } from '../../charts/charts.builder';
import {
  EventWithOccurrenceDetailsFromDB,
  EventWithOccurrenceDetailsReadEntity,
} from '../entities/event-occurrence-details.entity';

export namespace EventOccurrenceDetailsMapper {
  export function toDto(
    e: EventWithOccurrenceDetailsFromDB,
  ): EventWithOccurrenceDetailsReadEntity {
    const pie = new ChartsBuilder()
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
      imageUrl: TextUtils.escapeAndParse(e.imageUrl)[0].url,
      occurrences: e.occurrences.map((o) => {
        const withTickets = {
          ...o,
          dateTimeInit: parseDate(o.dateTimeInit),
          charts: [
            new ChartsBuilder()
              .makeList()
              .withName('Tickets')
              .addEntries([
                {
                  expectation: o.tickets.reduce<number>(
                    (sum, tkt) => (sum += tkt.total),
                    0,
                  ),
                  value: o.tickets.reduce<number>(
                    (sum, tkt) => (sum += tkt.sold),
                    0,
                  ),
                  name: 'Total',
                  trailing: '',
                },
                ...o.tickets.map((tk) => {
                  return {
                    expectation: tk.total,
                    value: tk.sold,
                    name: tk.name,
                    trailing: `${tk.sold}/${tk.total} = ${
                      Number(tk.price) * tk.sold
                    }`,
                  };
                }),
              ])
              .build(),
            pie,
          ],
        };
        delete withTickets.tickets;
        return withTickets;
      }),
    };
  }
}
