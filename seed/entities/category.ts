import { Fake } from '../common/fake.generic';
import { lift } from '../common/lift-to-entity';
import { CategoryEntity } from '../../src/modules/categories/infrastructure/entities/category.entity';
import * as _ from 'faker';
import { Session } from 'neo4j-driver';

export const fakeCategory: Fake<CategoryEntity> = ({
  parentCategory,
}: {
  parentCategory?: string;
  name: string;
}) => {
  return lift({
    name: _.hacker.adjective(),
    active: _.datatype.boolean(),
    parentCategory,
    description: _.lorem.sentence(),
  });
};

export const saveCategory = (session: Session) => async (e: CategoryEntity) => {
  try {
    const query = `MERGE (c:Category {id:$id})
								SET c += $data
								RETURN c`;
    const result = await session.writeTransaction((tx) =>
      tx.run(query, { data: e, id: e.id }),
    );

    result.records.forEach((record) => {
      const node = record.get('c');
      console.log(`Created Category ${node.properties.name}`);
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};
