import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { OrmName } from '../enums/orm-names.enum';
import { Logger } from '@nestjs/common';
import { PersistentEntity } from './base.entity';
import { IEntity } from 'src/shared/core/interfaces/IEntity';
import { Transaction } from 'neo4j-driver';

export abstract class BaseRepository<
  E extends IEntity,
  P extends PersistentEntity
> implements IRepository<E> {
  protected readonly _logger: Logger;
  protected readonly transaction: Transaction;
  protected readonly entityName: string;
  constructor(
    transaction: Transaction,
    entityName: string,
    private readonly _domainToPersistentFunc: (domainEntity: E) => Partial<P>,
    context: string,
  ) {
    this._logger = new Logger(context);
    this.entityName = entityName;
    this.transaction = transaction;
  }

  async save(entity: E): Promise<void> {
    this._logger.log(`Save entity with id: {${entity._id}}`);
    await this.transaction.run(`MERGE (n:${this.entityName}) SET n += $user`, {
      user: this._domainToPersistentFunc(entity),
    });
  }

  async drop(entity: E): Promise<void> {
    this._logger.log(`Drop entity with id: {${entity._id}}`);
    await this.transaction.run(`
    MATCH (n:${this.entityName})
    WHERE n.id = "${this._domainToPersistentFunc(entity).id}"
    DETACH DELETE n`);
  }

  getOrmName(): string {
    return OrmName.NEO4J_DRIVER;
  }
}
