import {
  InjectPersistenceManager,
  PersistenceManager,
  Transactional,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import {
  IRepository,
  IRepositoryFactory,
} from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWork } from 'src/shared/core/interfaces/IUnitOfWork';
import { OrmName } from '../enums/orm-names.enum';

@Injectable()
export class Neo4jUnitOfWork implements IUnitOfWork {
  private started: boolean;
  constructor(
    @InjectPersistenceManager() readonly persistenceManager: PersistenceManager,
  ) {
    this.started = false;
  }

  public getOrmName(): string {
    return OrmName.NEO4J_DRIVINE;
  }

  public getRepository<E, T extends IRepository<E>>(
    F: IRepositoryFactory<E, T>,
  ): T {
    switch (true) {
      case F.getOrmName() !== this.getOrmName():
        throw new Error(
          `ORM type ${this.getOrmName()} is not compatible with ${F.getOrmName()}`,
        );
      case !this.started:
        throw new Error('Transaction must be started');
      default:
        return F.build(this.persistenceManager);
    }
  }

  public start(): void {
    this.started = true;
  }

  @Transactional()
  async commit<T>(work: () => Promise<T> | T): Promise<T> {
    return await work();
  }
}
