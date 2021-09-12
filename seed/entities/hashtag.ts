import { Fake } from '../common/fake.generic';
import { HashtagEntity } from '../../src/modules/hashtags/infrastructure/entities/hastag.entity';
import { lift } from '../common/lift-to-entity';
import * as _ from 'faker';
import { Session } from 'neo4j-driver';

export const fakeHashtag: Fake<HashtagEntity> = () => {
  return lift({
    word: _.lorem.word(),
  });
};

export const saveHashtag = (session: Session) => async (e: HashtagEntity) => {
  const query = `CREATE (h:Hashtag)
								SET h += $data`;

  await session.writeTransaction((tx) => {
    tx.run(query, { data: e });
  });
  console.log(`Created hashtag ${e.word}`);
};
