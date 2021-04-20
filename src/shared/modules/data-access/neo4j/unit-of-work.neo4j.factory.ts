import {
  InjectPersistenceManager,
  PersistenceManager,
} from '@liberation-data/drivine';
import {
  IUnitOfWork,
  IUnitOfWorkFactory,
} from 'src/shared/core/interfaces/IUnitOfWork';
import { OrmName } from '../enums/orm-names.enum';
import { Neo4jUnitOfWork } from './unit-of-work.neo4j';

export class Neo4jUnitOfWorkFactory implements IUnitOfWorkFactory {
  constructor(
    @InjectPersistenceManager() readonly persistenceManager: PersistenceManager,
  ) {}

  getOrmName(): string {
    return OrmName.NEO4J_DRIVER;
  }

  build(): IUnitOfWork {
    return new Neo4jUnitOfWork(this.persistenceManager);
  }
}
