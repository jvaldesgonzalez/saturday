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
    const arr: GetTicketsByOccurrenceResponse['tickets'] = Array(
      faker.datatype.number({ min: 1, max: 4 }),
    );

    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        name: faker.name.title(),
        price: `${faker.datatype.number(300)} CUP`,
        sold: faker.datatype.number(200),
        total: 200 + faker.datatype.number(500),
      };
    }
    return { tickets: arr };
  }
}
