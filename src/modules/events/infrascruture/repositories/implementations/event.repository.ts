import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { EventEntity } from '../../entities/event.entity';
import { EventMapper } from '../../mapper/event.mapper';
import { IEventRepository } from '../interfaces/IEventRepository';

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
  @Transactional()
  async save(event: Event): Promise<void> {
    const persistent = EventMapper.DomainToPersistence(event);
    const {
      description,
      categories,
      place,
      collaborators,
      multimedia,
      attentionTags,
      occurrences,
      ...data
    } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
        
        `,
      ),
    );
  }
  async findById(id: string): Promise<Event> {
    const res = await this.persistenceManager.maybeGetOne<EventEntity>(
      QuerySpecification.withStatement(
        `
        MATCH (t:Ticket)<-[:HAS_TICKETS]-(o:EventOccurrence)<-[:HAS_OCCURRENCES]-(n:Event)-[:HAS_CATEGORY]->(c:Category)
        MATCH (p:Place)<-[:HAS_LOCATION]-(n:Event)-[:MAIN_PUBLISHER]->(h:User)
        MATCH (at:AttentionTag)<-[:HAS_TAG]-(n:Event)->[:HAS_COLLABORATOR]->(coll:User)
        WHERE n.id = $id
        RETURN {
          id:n.id,
          publisher:n.publisher,
          name:n.name,
          createdAt:n.createdAt,
          updatedAt:n.updatedAt,
          description:n.description,
          categories:collect(c.id),
          place:p,
          collaborators:collect(coll.id),
          multimedia:n.multimedia,
          attentionTags:collect(at),
          occurrences:collect(o)
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
}
