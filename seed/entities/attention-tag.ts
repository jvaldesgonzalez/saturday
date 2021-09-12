import { Fake } from '../common/fake.generic';
import { lift } from '../common/lift-to-entity';
import * as _ from 'faker';
import { AttentionTagEntity } from '../../src/modules/attention-tag/infrastructure/entities/attention-tag.entity';
import { Session } from 'neo4j-driver';

export const fakeAttTag: Fake<AttentionTagEntity> = ({
  title,
}: {
  title: string;
}) => {
  return lift({
    title,
    color: _.internet.color(),
    description: _.lorem.sentence(),
  });
};

export const saveAttTag =
  (session: Session) => async (e: AttentionTagEntity) => {
    try {
      const query = `MERGE (t:AttentionTag {id:$id})
									SET t += $data
									RETURN t`;

      const writeResult = await session.writeTransaction((tx) =>
        tx.run(query, { data: e, id: e.id }),
      );
      writeResult.records.forEach((record) => {
        const tagNode = record.get('t');
        console.log(`Created tag ${tagNode.properties.title}`);
      });
    } catch (error) {
      console.error('Error ', error);
    }
  };
