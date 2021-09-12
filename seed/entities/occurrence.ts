import { Fake } from '../common/fake.generic';
import { EventOccurrenceEntity } from '../../src/modules/events/infrastruture/entities/event-occurrence.entity';
import * as _ from 'faker';
import { lift } from '../common/lift-to-entity';
import { types } from 'neo4j-driver';
import { Session } from 'neo4j-driver';

export const fakeOccurrence: Fake<EventOccurrenceEntity> = ({
  eventId,
  tickets,
}: {
  eventId: string;
  tickets: EventOccurrenceEntity['tickets'];
}) => {
  return lift({
    dateTimeInit: types.DateTime.fromStandardDate(_.date.future()),
    dateTimeEnd: types.DateTime.fromStandardDate(_.date.future()),
    eventId,
    tickets,
  });
};

export const saveOccurrence =
  (session: Session) => async (e: EventOccurrenceEntity) => {
    const query = `MATCH (e:Event)
									WHERE e.id = $eventId
									CREATE (occurrence: EventOccurrence)<-[:HAS_OCCURRENCE]-(e)
									SET occurrence += $data
	`;

    const addTicketQuery = `MATCH (o:EventOccurrence)
														WHERE o.id = $occurrenceId
														CREATE (o)-[:HAS_TICKET]->(t:Ticket)
														SET t += $data
														`;
    await session.writeTransaction((tx) => {
      const { eventId, tickets, ...data } = e;
      tx.run(query, { eventId, oId: e.id, data });

      for (const ticket of e.tickets) {
        tx.run(addTicketQuery, {
          occurrenceId: e.id,
          data: ticket,
        });
      }
    });
    console.log(`Created occurrence ${e.eventId}`);
  };
