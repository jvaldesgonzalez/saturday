import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';
import * as _ from 'faker';
import { types } from 'neo4j-driver';

export function lift<T>(a: T): T & PersistentEntity {
  return {
    createdAt: types.DateTime.fromStandardDate(_.date.past()),
    updatedAt: types.DateTime.fromStandardDate(_.date.recent()),
    id: _.datatype.uuid(),
    ...a,
  };
}
