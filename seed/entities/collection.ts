import { Fake } from '../common/fake.generic';
import { CollectionEntity } from '../../src/modules/events/infrastruture/entities/collection.entity';
import { lift } from '../common/lift-to-entity';
import * as _ from 'faker';
import { Session } from 'neo4j-driver';

export const fakeCollection: Fake<CollectionEntity> = ({
  events,
  publisher,
}: {
  publisher: string;
  events: string[];
}) => {
  return lift({
    publisher,
    events,
    name: _.name.title(),
    description: _.lorem.paragraph(),
  });
};

export const saveCollection =
  (session: Session) => async (e: CollectionEntity) => {
    try {
      const colQuery = `MATCH (h:Partner)
												WHERE h.id = $publisher
												MERGE (h)-[:PUBLISH_COLLECTION]->(col:Collection {id:"${e.id}"})
												SET col+= $data
        `;

      const addEventQuery = `MATCH (e:Event)
														MATCH (col:Collection)
														WHERE col.id = $colId AND e.id = $eveId
														CREATE (e)-[:IN_COLLECTION]->(col)
        `;
      await session.writeTransaction((tx) => {
        tx.run(colQuery, {
          publisher: e.publisher,
          data: { name: e.name, description: e.description },
        });
        for (const eventId of e.events) {
          console.log(eventId);
          tx.run(addEventQuery, {
            colId: e.id,
            eveId: eventId,
          });
        }
      });
      console.log(`Created collection ${e.name}`);
    } catch (error) {
      console.error(error);
    }
  };
