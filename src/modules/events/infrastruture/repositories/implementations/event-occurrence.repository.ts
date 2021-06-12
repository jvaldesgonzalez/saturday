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
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { GetTicketsByOccurrenceResponse } from 'src/modules/events/presentation/controllers/getTicketsByOccurrence/response';
import { ChartsBuilder } from 'src/shared/modules/stats/charts/charts.buider';
import { IIdentifier } from 'src/shared/domain/Identifier';
import { EventOccurrenceMapper } from '../../mapper/event-occurrence.mapper';
import { Ticket } from 'src/modules/events/domain/entities/ticket.entity';

export class EventOccurrenceRepository
  extends BaseRepository<EventOccurrence, EventOccurrenceEntity>
  implements IEventOccurrenceRepository {
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'EventOccurrence',
      EventOccurrenceMapper.DomainToPersistence,
      'EventOccurrenceRepository',
      persistenceManager,
    );
  }

  async findById(id: string | IIdentifier): Promise<EventOccurrence> {
    const res = await this.persistenceManager.maybeGetOne<EventOccurrenceEntity>(
      QuerySpecification.withStatement(
        `
        MATCH (e:Event)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
        WHERE id=$id
        RETURN {
          id:o.id,
          createdAt:o.createdAt,
          updatedAt:o.updatedAt,
          dateTimeInit:o.dateTimeInit,
          dateTimeEnd:o.dateTimeEnd,
          eventId:e.id,
          tickets:collect(t)
        }
        `,
      )
        .bind({ id: id })
        .transform(EventOccurrenceEntity),
    );
    return res ? EventOccurrenceMapper.PersistentToDomain(res) : null;
  }

  @Transactional()
  async save(occurrence: EventOccurrence, expandToAll = false): Promise<void> {
    this._logger.log('Saving occurrence...');
    const persistent: EventOccurrenceEntity = EventOccurrenceMapper.DomainToPersistence(
      occurrence,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tickets, eventId, ...data } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (e:Event)
        WHERE e.id = $eventId
        MERGE (occurrence: EventOccurrence {id:"${data.id}"})<-[:HAS_OCCURRENCE]-(e)
        SET occurrence += $data
        `,
      ).bind({
        data,
        eventId,
      }),
    );
    for (const ticket of occurrence.tickets.getNewItems()) {
      await this.saveTicket(ticket, occurrence._id.toString());
    }
  }

  @Transactional()
  async drop(occurrence: EventOccurrence): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (o:Occurrence)-[:HAS_TICKET]-(t:Ticket)
        WHERE o.id = $occurrenceId
        DETACH DELETE o, t
        `,
      ).bind({
        occurrenceId: occurrence._id.toString(),
      }),
    );
  }

  private async saveTicket(
    ticket: Ticket,
    occurrenceId: string,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (o:EventOccurrence)
        WHERE o.id = $occurrenceId
        MERGE (o)-[:HAS_TICKET]->(t:Ticket {id:"${ticket._id.toString()}"})
        SET t += $data
        `,
      ).bind({
        data: {
          price: ticket.price.value,
          name: ticket.name,
          amount: ticket.amount.value,
          description: ticket.description,
        },
        occurrenceId,
      }),
    );
  }

  async eventExists(id: string | IIdentifier): Promise<boolean> {
    const res = await this.persistenceManager.maybeGetOne(
      QuerySpecification.withStatement(
        `
        MATCH (n:Event)
        WHERE n.id = $id
        return n
        `,
      ).bind({ id: id }),
    );
    return !!res;
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
