import { EventOccurrence } from 'src/modules/events/domain/entities/event-ocurrency.entity';
import { GetTicketsByHostResponse } from 'src/modules/events/presentation/controllers/getTicketsByHost/response';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { EventOccurrenceEntity } from '../../entities/event-occurrence.entity';
import { IEventOccurrenceRepository } from '../interfaces/IEventOccurrenceRepository';
import * as faker from 'faker';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import {
  InjectPersistenceManager,
  PersistenceManager,
} from '@liberation-data/drivine';
import { GetTicketsByOccurrenceResponse } from 'src/modules/events/presentation/controllers/getTicketsByOccurrence/response';
import { ChartsBuilder } from 'src/shared/modules/stats/charts/charts.buider';

export class EventOccurrenceRepository
  extends BaseRepository<EventOccurrence, EventOccurrenceEntity>
  implements IEventOccurrenceRepository {
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'EventOccurrence',
      (_a: EventOccurrence) => {
        return {};
      },
      'EventOccurrenceRepository',
      persistenceManager,
    );
  }
  async getTicketsByHost(
    hostId: string,
    from: number,
    len: number,
  ): Promise<PaginatedFindResult<GetTicketsByHostResponse>> {
    const arr: GetTicketsByHostResponse[] = Array(len);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        price: `${faker.datatype.number(300)} CUP`,
        sold: faker.datatype.number(200),
        total: 200 + faker.datatype.number(500),
        occurrence: {
          name: faker.name.title(),
          id: faker.datatype.uuid(),
          place: faker.address.streetName(),
          imageUrl: faker.image.nightlife(),
        },
      };
    }

    return {
      items: arr,
      total: 100,
      current: from,
      pageSize: len,
    };
  }

  async getTicketsByOccurrence(
    _ocurrenceId: string,
  ): Promise<GetTicketsByOccurrenceResponse> {
    const arr: GetTicketsByOccurrenceResponse['occurrences'] = Array(
      faker.datatype.number({ min: 1, max: 4 }),
    );

    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        id: faker.datatype.uuid(),
        tickets: Array(3).fill({
          name: faker.name.title(),
          price: `${faker.datatype.number(300)} CUP`,
          sold: faker.datatype.number(200),
          total: 200 + faker.datatype.number(500),
        }),
        dateTime: faker.date.future(1),
        stats: new ChartsBuilder()
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
          .build(),
      };
    }
    return { occurrences: arr };
  }
}
