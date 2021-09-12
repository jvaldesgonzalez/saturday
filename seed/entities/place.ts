import { Fake } from '../common/fake.generic';
import { lift } from '../common/lift-to-entity';
import * as _ from 'faker';
import { PersistentEntity } from '../../src/shared/modules/data-access/neo4j/base.entity';

class PlaceEntity extends PersistentEntity {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  hostRef?: string;
}

export const fakePlace: Fake<PlaceEntity> = ({
  hostRef,
}: {
  hostRef: string;
  location: string;
}) => {
  return lift({
    name: _.name.title(),
    address: _.address.direction(),
    latitude: _.address.latitude(),
    longitude: _.address.longitude(),
    hostRef,
  });
};
