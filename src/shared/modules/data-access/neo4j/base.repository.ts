import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { OrmName } from '../enums/orm-names.enum';
import { Logger } from '@nestjs/common';
import { PersistentEntity } from './base.entity';
import { IEntity } from 'src/shared/core/interfaces/IEntity';
import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';

export abstract class BaseRepository<
  E extends IEntity,
  P extends PersistentEntity
> implements IRepository<E> {
  protected readonly _logger: Logger;
  protected readonly entityName: string;
  constructor(
    entityName: string,
    protected readonly _domainToPersistentFunc: (
      domainEntity: E,
    ) => Partial<P> | Promise<Partial<P>>,
    context: string,
    @InjectPersistenceManager() readonly persistenceManager: PersistenceManager,
  ) {
    this._logger = new Logger(context);
    this.entityName = entityName;
  }

  @Transactional()
  async save(entity: E): Promise<void> {
    this._logger.log(`Save entity with id: {${entity._id}}`);
    await this.persistenceManager.execute(
      QuerySpecification.withStatement<void>(
        `MERGE (n:${
          this.entityName
        } {id:"${entity._id.toString()}"}) SET n += $data`,
      ).bind({ data: await this._domainToPersistentFunc(entity) }),
    );
  }

  @Transactional()
  async drop(entity: E): Promise<void> {
    this._logger.log(`Drop entity with id: {${entity._id}}`);
    await this.persistenceManager.execute(
      QuerySpecification.withStatement<void>(
        `
        MATCH (n:${this.entityName})
        WHERE n.id = $id
        DETACH DELETE n`,
      ).bind({ id: (await this._domainToPersistentFunc(entity)).id }),
    );
  }

  getOrmName(): string {
    return OrmName.NEO4J_DRIVINE;
  }
}
