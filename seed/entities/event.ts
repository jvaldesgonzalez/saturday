import { Fake } from '../common/fake.generic';
import { EventEntity } from '../../src/modules/events/infrastruture/entities/event.entity';
import * as _ from 'faker';
import { lift } from '../common/lift-to-entity';
import { Session } from 'neo4j-driver';

export const fakeEvent: Fake<EventEntity> = ({
  publisher,
  categories = [],
  collaborators = [],
  attentionTags = [],
  hashtags = [],
  locationId,
}: {
  publisher: string;
  place?: EventEntity['place'];
  categories: string[];
  collaborators: string[];
  attentionTags: string[];
  hashtags: string[];
  locationId?: string;
}) => {
  return lift({
    publisher,
    name: _.name.title(),
    description: JSON.stringify([
      {
        header: 'Description',
        body: `${_.lorem.paragraph()}

				${hashtags.map((h) => `#${h}`).join('  ')}`,
        inline: false,
      },
    ]),
    categories,
    place: {
      name: _.name.title(),
      address: _.address.streetAddress(),
      longitude: _.address.longitude(),
      latitude: _.address.latitude(),
      locationId,
    },
    collaborators,
    multimedia: JSON.stringify([{ type: 'image', url: _.image.image() }]),
    attentionTags,
  });
};

export const saveEvent = (session: Session) => async (e: EventEntity) => {
  const query = `MATCH (h:Partner)
								WHERE h.id = $publisher
								MERGE (h)-[:PUBLISH_EVENT]->(event:Event {id:$id})
								SET event+= $data
								`;

  const addColQuery = `MATCH (e:Event),(p:Partner)
											WHERE e.id = $eId
											AND p.id = $pId
											CREATE (e)<-[:COLLABORATOR]-(p)
											`;

  const addTagQuery = `MATCH (e:Event),(t:AttentionTag)
											WHERE e.id = $eId
											AND t.id = $tId
											CREATE (e)-[:HAS_TAG]->(t)
											`;

  const addCatQuery = `MATCH (e:Event),(c:Category)
											WHERE e.id = $eId
											AND c.id = $cId
											CREATE (e)-[:HAS_CATEGORY]->(c)
											`;

  const addPlaceQuery = `MATCH (e:Event),(l:Location)
												WHERE e.id = $eId
												AND l.id = $lId
												CREATE (e)-[:HAS_PLACE]->(p:Place)-[:IN_LOCATION]->(l)
												SET p += $data`;

  const addHashtagsQuery = `MATCH (e:Event),(h:Hashtag)
														WHERE e.id = $eId
														AND h.word = $hWord
														CREATE (e)-[:CONTAIN_HASHTAG]->(h)`;

  const {
    collaborators,
    categories,
    attentionTags,
    place,
    publisher,
    ...data
  } = e;
  await session.writeTransaction((tx) => {
    tx.run(query, { publisher: e.publisher, id: e.id, data });
    for (const collaborator of e.collaborators) {
      tx.run(addColQuery, { eId: e.id, pId: collaborator });
    }
    for (const tag of e.attentionTags) {
      tx.run(addTagQuery, { eId: e.id, tId: tag });
    }
    for (const cat of e.categories) {
      tx.run(addCatQuery, { eId: e.id, cId: cat });
    }
    const re = /(?:\s|^)(?:#(?!(?:\d+|\w+?_|_\w*?)(?:\s|$)))(\w+)(?=\s|$)/gm;
    const hashtags = [];
    const body = JSON.parse(e.description)[0].body as string;
    let m: RegExpExecArray;
    do {
      m = re.exec(body);
      if (m) {
        hashtags.push(m[1]);
      }
    } while (m);
    console.log(hashtags);
    for (const hashtag of hashtags) {
      tx.run(addHashtagsQuery, { eId: e.id, hWord: hashtag });
    }
    if (e.place) {
      const { locationId, hostRef, ...pData } = e.place;
      tx.run(addPlaceQuery, {
        eId: e.id,
        lId: e.place.locationId,
        data: pData,
      });
    }
  });
  console.log(`Created event ${e.name}`);
};
