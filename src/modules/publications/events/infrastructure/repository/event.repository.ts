import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { IEventRepository } from '../../application/interfaces/event.repository';
import { EventOccurrence } from '../../domain/event-occurrence.domain';
import { Event } from '../../domain/event.domain';
import { EventEntity } from '../entities/event.entity';
import { EventOccurrenceMapper } from '../mappers/event-occurrence.mapper';
import { EventMapper } from '../mappers/events.mapper';

export class EventRepository
  extends BaseRepository<Event, EventEntity>
  implements IEventRepository
{
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'Event',
      EventMapper.toPersistence,
      'EventRepository',
      persistenceManager,
    );
  }

  @Transactional()
  async save(theEvent: Event): Promise<void> {
    this._logger.log('saving...');
    const persistent = EventMapper.toPersistence(theEvent);
    this._logger.log(persistent);
    const {
      newOccurrences,
      hashtags,
      category,
      place,
      collaborators,
      publisher,
      id,
      ...data
    } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (p:Partner)
        WHERE p.id = $publisher
				MATCH (c:Category)
				WHERE c.id = $cId
        MERGE (p)-[:PUBLISH_EVENT]->(event:Event {id:$eId})-[:HAS_CATEGORY]->(c)
        SET event+= $data
				SET event:Publication
        `,
      ).bind({
        data,
        publisher: publisher,
        eId: id,
        cId: category,
      }),
    );
    theEvent.newOccurrences.forEach(this.addOccurrence.bind(this));
    this.addHashtags(theEvent);
    this.addPlace(theEvent);
  }

  async findById(theEventId: UniqueEntityID): Promise<Event> {
    throw new Error('Not implemented.');
  }

  @Transactional()
  private async addOccurrence(theOccurrence: EventOccurrence) {
    const { eventId, newTickets, ...data } =
      EventOccurrenceMapper.toPersistence(theOccurrence);

    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        ` MATCH (e:Event)
				WHERE e.id = $eId
				CREATE (e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)
				SET o += $data
			`,
      ).bind({ eId: eventId, data }),
    );
    for (const ticket of newTickets) {
      await this.persistenceManager.execute(
        QuerySpecification.withStatement(
          `
						MATCH (o:EventOccurrence)
						WHERE o.id = $oId
						CREATE (o)-[:HAS_TICKET]->(t:Ticket)
						SET t+= $data
				`,
        ).bind({ oId: data.id, data: ticket }),
      );
    }
  }

  @Transactional()
  private async addHashtags(theEvent: Event) {
    for (const hashtag of theEvent.hashtags) {
      await this.persistenceManager.execute(
        QuerySpecification.withStatement(
          `MATCH (e:Event) WHERE e.id = $eId
					MERGE (e)-[:CONTAIN_HASHTAG]->(h:Hashtag {word:$word})
					SET h+= $data
				`,
        ).bind({
          word: hashtag,
          eId: theEvent._id.toString(),
          data: { word: hashtag },
        }),
      );
    }
  }

  // FIXME support multiple locations (fix line 129)
  @Transactional()
  private async addPlace(theEvent: Event) {
    const { place, id } = EventMapper.toPersistence(theEvent);
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
					MATCH (e:Event) WHERE e.id = $eId
					OPTIONAL MATCH (p:Place {name:$data.name, latitude:$data.latitude, longitude:$data.longitude, address:$data.address})
					CALL apoc.do.when(p IS NULL,
						'MATCH (l:Location)
						CREATE (e)-[:HAS_PLACE]->(np:Place)-[:IN_LOCATION]->(l)
						SET np += data',
						'CREATE (e)-[:HAS_PLACE]->(p)',
						{e:e,p:p,data:$data}
					) YIELD value RETURN value
			`,
      ).bind({ eId: id, data: place }),
    );
  }
}
