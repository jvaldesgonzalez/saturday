import { Point } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class LocationEntity extends PersistentEntity {
  name: string;
  parentLocation?: string;
  active: boolean;
  enclosingPolygon: Point[];
  imageUrl: string;
}
