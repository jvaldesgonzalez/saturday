import { Gender } from 'src/modules/accounts-management/users/domain/value-objects/gender.value';
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
    charts: {
      likes: [{ gender: Gender; age: number }];
      shared: [{ gender: Gender; age: number }];
    },
  ): EventDetailsReadEntity {
    const formatPrice = (baseAndTop: [number, number]): string => {
      const [base, top] = baseAndTop;
      if (base === top) return base.toString();
      return `${base} - ${top}`;
    };

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
      reachability: null,
      usersInterested: new ChartsBuilder()
        .makePieBar()
        .withName('Sexo y edad')
        .withCategories(['Mujeres', 'Hombres', 'Non-Binary'])
        .addEntries([
          buildEntry([18, 20], charts.likes),
          buildEntry([20, 25], charts.likes),
          buildEntry([25, 30], charts.likes),
          buildEntry([30, 40], charts.likes),
          buildEntry([40, 60], charts.likes),
        ])
        .build(),
      timesShared: new ChartsBuilder()
        .makePieBar()
        .withName('Sexo y edad')
        .withCategories(['Mujeres', 'Hombres', 'Non-Binary'])
        .addEntries([
          buildEntry([18, 20], charts.shared),
          buildEntry([20, 25], charts.shared),
          buildEntry([25, 30], charts.shared),
          buildEntry([30, 40], charts.shared),
          buildEntry([40, 60], charts.shared),
        ])
        .build(),
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
