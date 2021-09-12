import { CommonUser } from '../common/common-user';
import { Fake } from '../common/fake.generic';
import { lift } from '../common/lift-to-entity';
import { UserEntity } from '../../src/modules/consumers/infrastructure/entities/user.entity';
import * as _ from 'faker';
import { types, Session } from 'neo4j-driver';

export const fakeUser: Fake<UserEntity & CommonUser> = ({
  categoryPreferences,
  locationId,
}: {
  categoryPreferences: string[];
  locationId: string;
}) => {
  return lift({
    username: _.internet.userName(),
    email: _.internet.email(),
    firebasePushId: _.datatype.uuid(),
    appVersion: 1,
    password: 'with-provider',
    isActive: _.datatype.boolean(),
    avatar: _.internet.avatar(),
    //user-specific data
    fullname: _.name.firstName(),
    birthdate: types.DateTime.fromStandardDate(_.date.past(20)),
    gender: _.helpers.randomize(['male', 'female']),
    categoryPreferences,
    locationId,
    authProvider: _.helpers.randomize(['facebook', 'google']),
    authProviderUid: _.datatype.uuid(),
  });
};

export const saveUser =
  (session: Session) => async (e: UserEntity & CommonUser) => {
    const query = `CREATE (u:User)
								SET u += $data`;

    const addLocationQuery = `MATCH (u:User), (l:Location)
														WHERE u.id = $uId
														AND l.id = $lId
														CREATE (u)-[:IN_LOCATION]->(l)`;

    const addCatQuery = `MATCH (u:User), (c:Category)
												WHERE u.id = $uId
												AND c.id = $cId
												CREATE (u)-[:PREFER_CATEGORY]->(c)`;

    await session.writeTransaction((tx) => {
      const { categoryPreferences, locationId, ...data } = e;
      tx.run(query, { data });
      for (const cat of categoryPreferences)
        tx.run(addCatQuery, { cId: cat, uId: e.id });
      tx.run(addLocationQuery, { uId: e.id, lId: locationId });
    });
    console.log(`Created user ${e.username}`);
  };
