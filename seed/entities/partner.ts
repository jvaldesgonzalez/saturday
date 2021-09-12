import { CommonUser } from '../common/common-user';
import { Fake } from '../common/fake.generic';
import { lift } from '../common/lift-to-entity';
import { HostEntity } from '../../src/modules/hosts/infrastructure/entities/host.entity';
import * as _ from 'faker';
import { Session } from 'neo4j-driver';

export const fakePartner: Fake<HostEntity & CommonUser> = ({
  locationId,
}: {
  locationId: string;
}) => {
  let ret = lift({
    username: _.internet.userName(),
    email: _.internet.email(),
    firebasePushId: _.datatype.uuid(),
    appVersion: 1,
    password: _.internet.password(),
    isActive: true,
    avatar: _.internet.avatar(),
    //business data
    businessName: _.name.title(),
    phoneNumber: _.phone.phoneNumber(),
    aditionalBusinessData: JSON.stringify([
      {
        header: 'Description',
        body: _.lorem.paragraph(),
        inline: false,
      },
    ]),
    place: {
      name: _.name.title(),
      address: _.address.streetAddress(),
      longitude: _.address.longitude(),
      latitude: _.address.latitude(),
      locationId,
    },
  });
  if (Math.random() <= 0.8) delete ret.place;
  return ret;
};

export const savePartner =
  (session: Session) => async (e: HostEntity & CommonUser) => {
    const query = `CREATE (p:Partner)
								SET p += $data`;

    const addPlaceQuery = `MATCH (pa:Partner)
													MATCH (l:Location)
													WHERE pa.id = $paId AND l.id = $lId
													CREATE (pa)-[:HAS_PLACE]->(p:Place)-[:IN_LOCATION]->(l)
													SET p += $data`;
    await session.writeTransaction((tx) => {
      const { place, ...data } = e;
      tx.run(query, { data });

      if (e.place) {
        const { locationId, ...pData } = e.place;
        tx.run(addPlaceQuery, {
          paId: e.id,
          lId: locationId,
          data: pData,
        });
      }
    });
    console.log(`Created partner ${e.username}`);
  };
