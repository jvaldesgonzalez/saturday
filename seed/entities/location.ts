import { Fake } from '../common/fake.generic';
import { LocationEntity } from '../../src/modules/locations/infrastructure/entities/location.entity';
import * as _ from 'faker';
import { lift } from '../common/lift-to-entity';
import { Session } from 'neo4j-driver';
export const fakeLocation: Fake<LocationEntity> = () => {
  return lift({
    name: _.address.cityName(),
    active: true,
    enclosingPolygon: [],
  });
};

export const saveLocation = (session: Session) => async (e: LocationEntity) => {
  const query = `CREATE (l:Location)
								SET l += $data`;

  await session.writeTransaction((tx) => {
    tx.run(query, { data: e });
  });

  console.log(`Created location ${e.name}`);
};
