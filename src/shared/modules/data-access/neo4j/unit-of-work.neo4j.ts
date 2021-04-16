import { Inject, Injectable } from '@nestjs/common';
import { Driver, Session, Transaction } from 'neo4j-driver';
import {
  IRepository,
  IRepositoryFactory,
} from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWork } from 'src/shared/core/interfaces/IUnitOfWork';
import { OrmName } from '../enums/orm-names.enum';

@Injectable()
export class Neo4jUnitOfWork implements IUnitOfWork {
  private readonly dbDriver: Driver;
  private session: Session;
  private transaction: Transaction;

  constructor(@Inject('NEO4J_DRIVER') dbDriver: Driver) {
    this.dbDriver = dbDriver;
    this.session = dbDriver.session();
  }

  public getOrmName(): string {
    return OrmName.NEO4J_DRIVER;
  }

  public getRepository<E, T extends IRepository<E>>(
    F: IRepositoryFactory<E, T>,
  ): T {
    switch (true) {
      case F.getOrmName() !== this.getOrmName():
        throw new Error(
          `ORM type ${this.getOrmName()} is not compatible with ${F.getOrmName()}`,
        );
      case !this.transaction:
        throw new Error('Transaction must be started');
      case !this.transaction.isOpen():
        throw new Error('Transaction must be open');
      default:
        return F.build(this.transaction);
    }
  }

  public start(): void {
    this.transaction = this.session.beginTransaction();
  }

  async commit<T>(work: () => Promise<T> | T): Promise<T> {
    try {
      const result = await work();
      await this.transaction.commit();
      return result;
    } catch (error) {
      await this.transaction.rollback();
    } finally {
      await this.session.close();
    }
  }
}
