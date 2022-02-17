import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { ChartsBuilder } from 'src/shared/modules/stats/charts/charts.buider';
import {
  EventOccurrenceDetailsFromDBReadEntity,
  EventOccurrenceDetailsReadEntity,
} from '../entities/event-occurrence-details.entity';

export namespace EventOccurrenceDetailsMapper {
  export function toDto(
    e: EventOccurrenceDetailsFromDBReadEntity,
  ): EventOccurrenceDetailsReadEntity {
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
      charts: [chart],
      dateTimeInit: parseDate(e.dateTimeInit),
    };
  }
}
