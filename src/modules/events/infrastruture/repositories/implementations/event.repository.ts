/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { GetRecentHostEventsResponse } from 'src/modules/events/presentation/controllers/getRecentHostEvents/response';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { EventEntity } from '../../entities/event.entity';
import { EventMapper } from '../../mapper/event.mapper';
import { IEventRepository } from '../interfaces/IEventRepository';
import * as faker from 'faker';
import { PaginatedGetHostPublicationsResponse } from 'src/modules/events/presentation/controllers/getHostPublications/get-host-publications.controller';
import { GetHostPublicationsResponse } from 'src/modules/events/presentation/controllers/getHostPublications/response';
import { Collection } from 'src/modules/events/domain/entities/collection.entity';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CollectionMapper } from '../../mapper/collection.mapper';
import { EventRef } from 'src/modules/events/domain/entities/eventRef.entity';
import { CollectionEntity } from '../../entities/collection.entity';

export class EventRepository
  extends BaseRepository<Event, EventEntity>
  implements IEventRepository {
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'Event',
      EventMapper.DomainToPersistence,
      'EventRepository',
      persistenceManager,
    );
  }

  //collections
  async findCollectionById(id: string | UniqueEntityID): Promise<Collection> {
    const res = await this.persistenceManager.maybeGetOne<CollectionEntity>(
      QuerySpecification.withStatement(
        `
        MATCH (p:User)-[:PUBLISH_COLLECTION]->(col:EventCollection)<-[:IN_COLLECTION]-(e:Event)
        WHERE col.id = $id
        RETURN {
          id:col.id,
          publisher:p.id,
          name:col.name,
          createdAt:col.createdAt,
          updatedAt:col.updatedAt,
          description:col.description,
					events:collect(e.id)
        }
        `,
      )
        .bind({ id: id })
        .transform(CollectionEntity),
    );
    return res ? CollectionMapper.PersistentToDomain(res) : null;
  }

  @Transactional()
  async saveCollection(collection: Collection): Promise<void> {
    const persistent = CollectionMapper.DomainToPersistence(collection);
    const { publisher, events, ...data } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (h:User)
        WHERE h.id = $publisher
        MERGE (h)-[:PUBLISH_COLLECTION]->(col:EventCollection {id:"${persistent.id}"})
        SET col+= $data
        `,
      ).bind({
        data,
        publisher: persistent.publisher,
      }),
    );
    for (const [i, newEvent] of collection.events.getNewItems().entries()) {
      await this.addEventToCollection(newEvent, collection);
    }
    for (const removedEvent of collection.events.getRemovedItems()) {
      await this.removeEventFromCollection(removedEvent, collection);
    }
  }

  private async removeEventFromCollection(
    event: EventRef,
    collection: Collection,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
        MATCH (e:Event)-[edge:IN_COLLECTION]->(col:EventCollection )
        WHERE col.id = $colId AND e.id = $eveId
        DELETE edge
        `,
      ).bind({
        colId: collection._id.toString(),
        eveId: event._id.toString(),
      }),
    );
  }

  private async addEventToCollection(
    event: EventRef,
    collection: Collection,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
        MATCH (e:Event)
        MATCH (col:EventCollection)
        WHERE col.id = $colId AND e.id = $eveId
        CREATE (e)-[:IN_COLLECTION]->(col)
        `,
      ).bind({
        colId: collection._id.toString(),
        eveId: event._id.toString(),
      }),
    );
  }

  async dropCollection(collection: Collection): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (c:EventCollection)
        WHERE c.id = $id
        DETACH DELETE c
        `,
      ).bind({
        id: collection._id.toString(),
      }),
    );
  }

  @Transactional()
  async save(event: Event): Promise<void> {
    this._logger.log('saving...');
    const persistent = EventMapper.DomainToPersistence(event);
    this._logger.log(JSON.stringify(persistent));
    const {
      description,
      categories,
      place,
      collaborators,
      multimedia,
      attentionTags,
      publisher,
      ...data
    } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (h:User)
        WHERE h.id = $publisher
        MERGE (h)-[:PUBLISH_EVENT]->(event:Event {id:"${data.id}"})
        SET event+= $data
        `,
      ).bind({
        data: { description, multimedia, ...data },
        publisher: publisher,
        id: data.id,
      }),
    );
  }

  async findById(id: string): Promise<Event> {
    // return null;
    const res = await this.persistenceManager.maybeGetOne<EventEntity>(
      QuerySpecification.withStatement(
        `
        MATCH (h:User)-[:PUBLISH_EVENT]->(n:Event)
        WHERE n.id = $id
        RETURN {
          id:n.id,
          publisher:h.id,
          name:n.name,
          createdAt:n.createdAt,
          updatedAt:n.updatedAt,
          description:n.description,
          categories:[],
          collaborators:[],
          multimedia:n.multimedia,
          attentionTags:[]
        }
        `,
      )
        .bind({ id: id })
        .transform(EventEntity),
    );
    return res ? EventMapper.PersistentToDomain(res) : null;
  }

  async exists(id: string): Promise<boolean> {
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

  async getRecentsByHost(
    _hostId: string,
  ): Promise<GetRecentHostEventsResponse[]> {
    const arr: GetRecentHostEventsResponse[] = Array(faker.datatype.number(5));
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        id: faker.datatype.uuid(),
        name: faker.name.title(),
        category: faker.name.jobType(),
        dateTimeInit: faker.date.recent(),
        place: faker.address.streetName(),
        imageUrl: faker.image.nightlife(),
        stats: {
          reached: faker.datatype.number(),
          interested: faker.datatype.number(),
          sharedTimes: faker.datatype.number(),
        },
      };
    }
    return arr;
  }

  async getPaginatedPublications(
    hostId: string,
    from: number,
    size: number,
  ): Promise<PaginatedGetHostPublicationsResponse> {
    const arr: GetHostPublicationsResponse[] = Array(size);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        id: faker.datatype.uuid(),
        name: faker.name.title(),
        category: faker.name.jobType(),
        dateTimeInit: faker.date.recent(),
        place: faker.address.streetName(),
        imageUrl: faker.image.nightlife(),
        stats: {
          reached: faker.datatype.number(),
          interested: faker.datatype.number(),
          sharedTimes: faker.datatype.number(),
        },
      };
    }
    return {
      items: arr,
      total: 100,
      current: from,
      pageSize: size,
    };
  }
}
