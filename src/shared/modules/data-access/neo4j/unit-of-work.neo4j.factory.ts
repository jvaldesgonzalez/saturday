import { Inject } from '@nestjs/common';
import { Driver } from 'neo4j-driver';
import {
  IUnitOfWork,
  IUnitOfWorkFactory,
} from 'src/shared/core/interfaces/IUnitOfWork';
import { OrmName } from '../enums/orm-names.enum';
import { Neo4jUnitOfWork } from './unit-of-work.neo4j';

export class Neo4jUnitOfWorkFactory implements IUnitOfWorkFactory {
  constructor(@Inject('NEO4J_DRIVER') private readonly dbDriver: Driver) {}

  getOrmName(): string {
    return OrmName.NEO4J_DRIVER;
  }

  build(): IUnitOfWork {
    return new Neo4jUnitOfWork(this.dbDriver);
  }
}
