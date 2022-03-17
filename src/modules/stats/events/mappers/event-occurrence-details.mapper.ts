import { Gender } from 'src/modules/accounts-management/users/domain/value-objects/gender.value';
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
    charts: {
      id: string;
      reservations: [{ gender: Gender; age: number }];
    }[],
  ): EventWithOccurrenceDetailsReadEntity {
    const buildEntry = (
      ageRange: [number, number],
      chartLike: [{ gender: Gender; age: number }],
    ) => {
      const inRange = chartLike.filter(
        (i) => i.age >= ageRange[0] && i.age < ageRange[1],
      );
      return {
        range: ageRange,
        values: [
          inRange.filter((i) => i.gender === Gender.Female).length,
          inRange.filter((i) => i.gender === Gender.Male).length,
          inRange.filter((i) => i.gender === Gender.PreferNotSay).length,
        ],
      };
    };

    return {
      ...e,
      imageUrl: TextUtils.escapeAndParse(e.imageUrl)[0].url,
      occurrences: e.occurrences
        .map((o) => {
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
              new ChartsBuilder()
                .makePieBar()
                .withName('Sexo y edad')
                .withCategories(['Mujeres', 'Hombres', 'Non-Binary'])
                .addEntries([
                  buildEntry(
                    [18, 20],
                    charts.find((i) => i.id === o.id).reservations,
                  ),
                  buildEntry(
                    [20, 25],
                    charts.find((i) => i.id === o.id).reservations,
                  ),
                  buildEntry(
                    [25, 30],
                    charts.find((i) => i.id === o.id).reservations,
                  ),
                  buildEntry(
                    [30, 40],
                    charts.find((i) => i.id === o.id).reservations,
                  ),
                  buildEntry(
                    [40, 60],
                    charts.find((i) => i.id === o.id).reservations,
                  ),
                ])
                .build(),
            ],
          };
          delete withTickets.tickets;
          return withTickets;
        })
        .sort((o1, o2) => (o1.dateTimeInit > o2.dateTimeInit ? 1 : -1)),
    };
  }
}
